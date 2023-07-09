import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { file } = location.state;
  const [pdfUrl, setPdfUrl] = useState('');
  const fileUrl = 'https://hubeducation-express-server.onrender.com/file'; // '//localhost:8000/file';

  useEffect(() => {
    // Fetch the PDF file from the server
    axios.get(fileUrl, {
      responseType: 'blob',
      params: { fileName: file },
    })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      }).catch(() => {
        navigate('/errorpage');
      });

    return () => {
      // Clean up the URL when component unmounts
      URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  return (
    <div>
      {pdfUrl ? (
        <embed src={pdfUrl} width="100%" height="700px" type="application/pdf" />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default DocumentViewer;
