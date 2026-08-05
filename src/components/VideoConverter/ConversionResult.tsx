import type { VideoConverterActionsCopy, VideoConverterStatusCopy } from "../../lib/content-types";
import styles from "./video-converter.module.css";

interface ConversionResultProps {
  actionsCopy: VideoConverterActionsCopy;
  statusCopy: VideoConverterStatusCopy;
  downloadUrl: string;
  downloadFileName: string;
  onReset: () => void;
}

export default function ConversionResult({
  actionsCopy,
  statusCopy,
  downloadUrl,
  downloadFileName,
  onReset,
}: ConversionResultProps) {
  return (
    <div className={`glass-panel ${styles.resultPanel}`}>
      <p role="status" aria-live="polite">
        {statusCopy.done}
      </p>
      <div className={styles.actionsRow}>
        <a className="rd-btn rd-btn-primary" href={downloadUrl} download={downloadFileName}>
          {actionsCopy.download}
        </a>
        <button type="button" className="rd-btn rd-btn-ghost" onClick={onReset}>
          {actionsCopy.reset}
        </button>
      </div>
    </div>
  );
}
