import type { VideoConverterFileInfoCopy } from "../../lib/content-types";
import type { SelectedFileInfo } from "../../lib/videoConverter/types";
import { formatBytes, formatDuration } from "../../lib/videoConverter/utils";
import styles from "./video-converter.module.css";

interface FileSummaryProps {
  copy: VideoConverterFileInfoCopy;
  file: SelectedFileInfo;
}

export default function FileSummary({ copy, file }: FileSummaryProps) {
  const duration = formatDuration(file.duration);

  return (
    <dl className={`glass-panel ${styles.fileInfoGrid}`}>
      <div>
        <dt className={styles.fileInfoTerm}>{copy.name}</dt>
        <dd className={styles.fileInfoValue}>{file.name}</dd>
      </div>
      <div>
        <dt className={styles.fileInfoTerm}>{copy.size}</dt>
        <dd className={styles.fileInfoValue}>{formatBytes(file.size)}</dd>
      </div>
      <div>
        <dt className={styles.fileInfoTerm}>{copy.duration}</dt>
        <dd className={styles.fileInfoValue}>{duration ?? copy.unknownDuration}</dd>
      </div>
      <div>
        <dt className={styles.fileInfoTerm}>{copy.format}</dt>
        <dd className={styles.fileInfoValue}>
          {(file.extension || file.mimeType || "—").toUpperCase()}
        </dd>
      </div>
    </dl>
  );
}
