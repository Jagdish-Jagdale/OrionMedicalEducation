import { useEffect } from 'react';

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} | Orion Medical Education` : 'Orion Medical Education';
  }, [title]);

  return null;
};

export default PageTitle;
