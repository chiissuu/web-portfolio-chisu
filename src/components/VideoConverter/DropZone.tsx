import { useId, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { VideoConverterDropzoneCopy } from "../../lib/content-types";
import { FILE_INPUT_ACCEPT } from "../../lib/videoConverter/constants";
import styles from "./video-converter.module.css";

interface DropZoneProps {
  copy: VideoConverterDropzoneCopy;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ copy, onFileSelected, disabled = false }: DropZoneProps) {
  const inputId = useId();
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so selecting the exact same file again still fires `onChange`.
    event.target.value = "";
    if (file) onFileSelected(file);
  };

  return (
    <div
      className={`glass-panel ${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-disabled={disabled || undefined}
    >
      <p className={styles.dropzoneLabel}>
        {isDragActive ? copy.dragActive : copy.label}
      </p>
      <p className={styles.dropzoneHint}>{copy.hint}</p>
      <label className={`rd-btn rd-btn-primary ${styles.fileInputLabel}`} htmlFor={inputId}>
        {copy.button}
        <input
          id={inputId}
          className={styles.hiddenFileInput}
          type="file"
          accept={FILE_INPUT_ACCEPT}
          disabled={disabled}
          onChange={handleInputChange}
        />
      </label>
    </div>
  );
}
