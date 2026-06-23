"use client";

import { useEffect, useRef, type FC } from "react";
import { init } from "pell";

type PellEditorProps = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  id?: string;
  label?: string;
  required?: boolean;
  className?: string;
};

const PellEditor: FC<PellEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  id = "pell-editor",
  label,
  required = false,
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Pell editor
    init({
      element: editorRef.current,
      onChange: (html: string) => {
        onChange(html);
      },
      defaultParagraphSeparator: "div",
      styleWithCSS: true,
    });

    // Set initial value
    if (editorRef.current && value) {
      const contentDiv = editorRef.current.querySelector(
        ".pell-content"
      ) as HTMLDivElement;
      if (contentDiv) {
        contentDiv.innerHTML = value;
      }
    }
  }, []);

  return (
    <div className={`pell-editor-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        ref={editorRef}
        id={id}
        className="pell-editor"
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default PellEditor;
