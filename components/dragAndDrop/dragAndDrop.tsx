"use client";
import { useCallback } from "react";
import { useDropzone, type FileRejection, type DropzoneOptions } from "react-dropzone";
import "./dragAndDrop.css";

type DragAndDropProps = {
  id: string;
  label: string;
  labelHidden?: boolean;
  classes?: string;
  onFileAccepted: (file: File) => void;
  onFileRejected?: (errors: string[]) => void;
  accept?: DropzoneOptions["accept"];
  maxSize?: number;
  placeholder?: string;
  disabled?: boolean;
};

const DEFAULT_ACCEPT: DropzoneOptions["accept"] = {
  "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
};
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const DragAndDrop = ({
  id,
  label,
  labelHidden = false,
  classes,
  onFileAccepted,
  onFileRejected,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  placeholder = "Drop a file here, or click to browse",
  disabled = false,
}: DragAndDropProps) => {
  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const messages = rejections.flatMap((r) =>
          r.errors.map((e) => {
            if (e.code === "file-too-large")
              return `File is too large (max ${Math.round(maxSize / 1024 / 1024)} MB)`;
            if (e.code === "file-invalid-type")
              return "File type not accepted";
            return e.message;
          })
        );
        onFileRejected?.(messages);
        return;
      }
      if (accepted[0]) onFileAccepted(accepted[0]);
    },
    [onFileAccepted, onFileRejected, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  const acceptedExts = Object.values(accept)
    .flat()
    .join(", ")
    .toUpperCase();

  return (
    <span
      className={`${classes ?? ""} input-wrapper input--dnd`}
    >
      {!labelHidden && <label htmlFor={`${id}--input`}>{label}</label>}

      <div
        {...getRootProps()}
        id={id}
        role="button"
        aria-label={labelHidden ? label : undefined}
        tabIndex={0}
        className={[
          "drag-and-drop",
          isDragActive && !isDragReject ? "drag-and-drop--active" : "",
          isDragReject ? "drag-and-drop--reject" : "",
          disabled ? "drag-and-drop--disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input id={`${id}--input`} aria-label={labelHidden ? label : ''} {...getInputProps()} />

        <div className="drag-and-drop--overlay" aria-hidden="true">
          <span className="drag-and-drop--overlay-text">
            {isDragReject ? "File not accepted" : "Drop to upload"}
          </span>
        </div>

        <div className="drag-and-drop--content">
          <svg
            className="drag-and-drop--icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="drag-and-drop--label">{placeholder}</span>
          <span className="drag-and-drop--hint">
            {acceptedExts} · max {Math.round(maxSize / 1024 / 1024)} MB
          </span>
        </div>
      </div>
    </span>
  );
};

DragAndDrop.displayName = "DragAndDrop";

export default DragAndDrop;
