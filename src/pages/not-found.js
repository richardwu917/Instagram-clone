import { useEffect } from 'react';
import Header from '../components/header';

import "./not-found.css";

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not Found - Instagram';
  }, []);

  return (
    <div className=".notFound__container">
      <Header />
      <div className="notFoundMsg__container">
        <p className="notFoundMsg__format">Not Found!</p>
      </div>
    </div>
  );
}