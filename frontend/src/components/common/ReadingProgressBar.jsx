import React, { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
      
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
