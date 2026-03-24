import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div
      className="transition-all duration-300"
      style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(8px)' }}
    >
      {children}
    </div>
  );
}
