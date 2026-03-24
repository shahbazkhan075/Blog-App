import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
];

export default function QuillEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;
    const quill = new Quill(containerRef.current, { theme: 'snow', modules: { toolbar: TOOLBAR } });
    quillRef.current = quill;
    quill.on('text-change', () => onChangeRef.current(quill.root.innerHTML));
    return () => { quillRef.current = null; };
  }, []);

  useEffect(() => {
    const q = quillRef.current;
    if (q && value !== q.root.innerHTML) q.root.innerHTML = value || '';
  }, [value]);

  return <div ref={containerRef} className="bg-white dark:bg-slate-900" />;
}
