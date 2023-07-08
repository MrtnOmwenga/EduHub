import React from 'react';
import { useLocation } from 'react-router-dom';

const DocumentViewer = () => {
  const location = useLocation();
  const { file } = location.state;

  const style = {
    width: '100%',
    height: '100vh',
  };

  return (
    <div>
      {console.log('Ok till here')}
      <iframe title="Module Content" style={style} src={require(`./Files/${file}`)} />
    </div>
  );
};

export default DocumentViewer;
