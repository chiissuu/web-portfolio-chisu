import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoConverterContent } from "../../lib/content-types";
import { DEFAULT_MP3_BITRATE } from "../../lib/videoConverter/constants";
import {
  ConversionInProgressError,
  cancelActiveConversion,
  getFFmpeg,
  runConversion,
} from "../../lib/videoConverter/ffmpegClient";
import type { Mp3Bitrate, OutputFormat, SelectedFileInfo, Stage } from "../../lib/videoConverter/types";
import {
  getFileExtension,
  readVideoMetadata,
  shouldWarnAboutLowMemory,
  validateDuration,
  validateSelectedFile,
} from "../../lib/videoConverter/utils";
import ConversionProgress from "./ConversionProgress";
import ConversionResult from "./ConversionResult";
import DropZone from "./DropZone";
import FileSummary from "./FileSummary";
import OutputSettings from "./OutputSettings";
import styles from "./video-converter.module.css";

interface VideoConverterProps {
  copy: VideoConverterContent;
}

interface Note {
  kind: "error" | "warning";
  text: string;
}

const BUSY_STAGES: readonly Stage[] = ["loading-engine", "converting"];

export default function VideoConverter({ copy }: VideoConverterProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [selectedFile, setSelectedFile] = useState<SelectedFileInfo | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("mp3");
  const [mp3Bitrate, setMp3Bitrate] = useState<Mp3Bitrate>(DEFAULT_MP3_BITRATE);
  const [progressRatio, setProgressRatio] = useState<number | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string | null>(null);
  const [showMemoryWarning, setShowMemoryWarning] = useState(false);

  // Set right before `cancelActiveConversion()` so the `catch` block in
  // `handleStartConversion` (below) can tell a user-initiated cancel apart
  // from a real failure — `ffmpeg.terminate()` rejects the pending exec the
  // same way an actual error would.
  const wasCancelledRef = useRef(false);

  useEffect(() => {
    // Revokes the *previous* URL whenever `resultUrl` changes to a new one,
    // and the current one on unmount — this is the only place a result URL
    // is created, so it's also the only place that needs to revoke it.
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleFileSelected = useCallback(
    async (file: File) => {
      setNote(null);
      setResultUrl(null);
      setResultFileName(null);
      setProgressRatio(null);
      setSelectedFile(null);
      setStage("idle");

      const basicCheck = validateSelectedFile(file);
      if (!basicCheck.ok && basicCheck.errorKey) {
        setNote({ kind: "error", text: copy.errors[basicCheck.errorKey] });
        return;
      }

      const extension = getFileExtension(file.name);
      const { duration } = await readVideoMetadata(file);

      if (duration === null) {
        // Browser couldn't decode metadata at all — the duration cap can't
        // be checked, but the file may still be convertible, so this is a
        // warning, not a rejection.
        setNote({ kind: "warning", text: copy.errors.metadataUnreadable });
      } else {
        const durationCheck = validateDuration(duration);
        if (!durationCheck.ok && durationCheck.errorKey) {
          setNote({ kind: "error", text: copy.errors[durationCheck.errorKey] });
          return;
        }
      }

      setSelectedFile({ file, name: file.name, size: file.size, duration, extension, mimeType: file.type });
      setShowMemoryWarning(shouldWarnAboutLowMemory(file.size));
      setStage("file-ready");
    },
    [copy.errors]
  );

  const handleStartConversion = useCallback(async () => {
    if (!selectedFile || BUSY_STAGES.includes(stage)) return;

    setNote(null);
    setProgressRatio(null);
    wasCancelledRef.current = false;
    setStage("loading-engine");

    // Local, not state: tells the `catch` block below which phase failed,
    // without depending on the (possibly stale, closure-captured) `stage`
    // state variable.
    let phase: "loading-engine" | "converting" = "loading-engine";

    try {
      const ffmpeg = await getFFmpeg();
      phase = "converting";
      setStage("converting");

      const outcome = await runConversion(ffmpeg, {
        file: selectedFile.file,
        inputExtension: selectedFile.extension,
        target: outputFormat,
        mp3Bitrate,
        onProgress: setProgressRatio,
      });

      setResultUrl(URL.createObjectURL(outcome.blob));
      setResultFileName(outcome.fileName);
      setStage("done");
    } catch (error) {
      if (wasCancelledRef.current) {
        wasCancelledRef.current = false;
        setStage("file-ready");
        setNote({ kind: "warning", text: copy.status.cancelled });
        return;
      }

      setStage("file-ready");
      if (error instanceof ConversionInProgressError) {
        setNote({ kind: "error", text: copy.errors.alreadyConverting });
      } else if (phase === "loading-engine") {
        setNote({ kind: "error", text: copy.errors.engineLoadFailed });
      } else {
        setNote({ kind: "error", text: copy.errors.conversionFailed });
      }
    }
  }, [selectedFile, stage, outputFormat, mp3Bitrate, copy]);

  const handleCancel = useCallback(() => {
    wasCancelledRef.current = true;
    cancelActiveConversion();
  }, []);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setStage("idle");
    setNote(null);
    setProgressRatio(null);
    setResultUrl(null);
    setResultFileName(null);
    setShowMemoryWarning(false);
  }, []);

  const isBusy = BUSY_STAGES.includes(stage);

  return (
    <div className={styles.root}>
      <div className={styles.notices}>
        <p className={`glass-panel ${styles.notice}`}>{copy.privacyNotice}</p>
        <p className={`glass-panel ${styles.notice}`}>{copy.responsibleUseNotice}</p>
        {showMemoryWarning && (
          <p className={`glass-panel ${styles.notice}`} role="status" aria-live="polite">
            <span className={styles.noticeMark}>{copy.labels.warning}</span>
            {copy.memoryWarning}
          </p>
        )}
      </div>

      {note && (
        <p className={`glass-panel ${styles.notice}`} role="status" aria-live="assertive">
          <span className={styles.noticeMark}>
            {note.kind === "error" ? copy.labels.error : copy.labels.warning}
          </span>
          {note.text}
        </p>
      )}

      {!selectedFile && <DropZone copy={copy.dropzone} onFileSelected={handleFileSelected} />}

      {selectedFile && (
        <>
          <FileSummary copy={copy.fileInfo} file={selectedFile} />

          <OutputSettings
            copy={copy.output}
            format={outputFormat}
            bitrate={mp3Bitrate}
            disabled={isBusy}
            onFormatChange={setOutputFormat}
            onBitrateChange={setMp3Bitrate}
          />

          {stage === "file-ready" && (
            <div className={styles.actionsRow}>
              <button type="button" className="rd-btn rd-btn-primary" onClick={handleStartConversion}>
                {copy.actions.convert}
              </button>
              <button type="button" className="rd-btn rd-btn-ghost" onClick={handleReset}>
                {copy.actions.reset}
              </button>
            </div>
          )}

          {isBusy && (
            <ConversionProgress
              actionsCopy={copy.actions}
              statusText={stage === "loading-engine" ? copy.status.loadingEngine : copy.status.converting}
              progressRatio={stage === "converting" ? progressRatio : null}
              onCancel={handleCancel}
            />
          )}

          {stage === "done" && resultUrl && resultFileName && (
            <ConversionResult
              actionsCopy={copy.actions}
              statusCopy={copy.status}
              downloadUrl={resultUrl}
              downloadFileName={resultFileName}
              onReset={handleReset}
            />
          )}
        </>
      )}
    </div>
  );
}
