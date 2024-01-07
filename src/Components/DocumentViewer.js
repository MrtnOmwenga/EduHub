import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DocuStyle from './style/document_viewer.module.css';

const DocumentViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { file } = location.state;
  const { user } = location.state;
  const [pdfUrl, setPdfUrl] = useState('');
  const fileUrl = 'resources/files'; // 'https://hubeducation-express-server.onrender.com/file';

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
    <div className={DocuStyle.DocumentContainer}>
      <div className={DocuStyle.menu}>
        <h3 className={DocuStyle.title}>
          HUB
          {' '}
          <br />
          {' '}
          EDUCATION
        </h3>
        <ul className={DocuStyle.menu_list}>
          <Link
            to="/instructorsdashboard"
            state={{ ...user }}
            className={DocuStyle.link}
          >
            <li className={DocuStyle.menu_item}> DASHBOARD </li>

          </Link>
          <Link
            to="/courses"
            state={{ ...user }}
            className={DocuStyle.link}
          >
            <li className={DocuStyle.menu_item}> COURSES </li>

          </Link>
          {' '}
          <Link
            to="/indevelopment"
            state={{ ...user }}
            className={DocuStyle.link}
          >
            <li className={DocuStyle.menu_item}>QUIZZES</li>
          </Link>
          <Link
            to="/indevelopment"
            state={{ ...user }}
            className={DocuStyle.link}
          >
            <li className={DocuStyle.menu_item}>ACCOUNT</li>
          </Link>
          <Link
            to="/login"
            state={{ ...user }}
            className={DocuStyle.link}
          >
            <li className={DocuStyle.logout}> LOGOUT </li>
          </Link>
        </ul>
      </div>
      {pdfUrl ? (
        <embed src={pdfUrl} width="100%" height="700px" type="application/pdf" className={DocuStyle.Document} />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default DocumentViewer;
