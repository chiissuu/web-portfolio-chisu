import type { VideoConverterActionsCopy } from "../../lib/content-types";
import styles from "./video-converter.module.css";

interface ConversionProgressProps {
  actionsCopy: VideoConverterActionsCopy;
  statusText: string;
  /** `null` while the engine is still downloading/initializing — renders an
   * indeterminate `<progress>` (no `value` attribute) instead of a stalled
   * 0%, since there's no meaningful percentage for that phase. */
  progressRatio: number | null;
  onCancel: () => void;
}

export default function ConversionProgress({
  actionsCopy,
  statusText,
  progressRatio,
  onCancel,
}: ConversionProgressProps) {
  const percent = progressRatio !== null ? Math.round(progressRatio * 100) : null;

  return (
    <div className={`glass-panel ${styles.progressPanel}`}>
      <div className={styles.progressHeader}>
        <p role="status" aria-live="polite">
          {statusText}
        </p>
        {percent !== null && <span className={styles.progressPercent}>{percent}%</span>}
      </div>

      <progress
        className={styles.progressBar}
        value={percent ?? undefined}
        max={100}
        aria-label={statusText}
      />

      <div className={styles.actionsRow}>
        <button type="button" className="rd-btn rd-btn-ghost" onClick={onCancel}>
          {actionsCopy.cancel}
        </button>
      </div>
    </div>
  );
}
