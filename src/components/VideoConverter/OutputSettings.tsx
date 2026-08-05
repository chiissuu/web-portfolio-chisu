import { useId } from "react";
import type { ChangeEvent } from "react";
import type { VideoConverterOutputCopy } from "../../lib/content-types";
import { MP3_BITRATES } from "../../lib/videoConverter/constants";
import type { Mp3Bitrate, OutputFormat } from "../../lib/videoConverter/types";
import styles from "./video-converter.module.css";

interface OutputSettingsProps {
  copy: VideoConverterOutputCopy;
  format: OutputFormat;
  bitrate: Mp3Bitrate;
  disabled?: boolean;
  onFormatChange: (format: OutputFormat) => void;
  onBitrateChange: (bitrate: Mp3Bitrate) => void;
}

const BITRATE_LABEL_KEYS: Record<Mp3Bitrate, keyof VideoConverterOutputCopy> = {
  128: "bitrate128",
  192: "bitrate192",
  256: "bitrate256",
};

export default function OutputSettings({
  copy,
  format,
  bitrate,
  disabled = false,
  onFormatChange,
  onBitrateChange,
}: OutputSettingsProps) {
  const formatId = useId();
  const bitrateId = useId();

  return (
    <div className={styles.optionsRow}>
      <div className="rd-field">
        <label htmlFor={formatId}>{copy.label}</label>
        <select
          id={formatId}
          value={format}
          disabled={disabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onFormatChange(event.target.value as OutputFormat)
          }
        >
          <option value="mp3">{copy.mp3}</option>
          <option value="mp4">{copy.mp4}</option>
        </select>
      </div>

      {format === "mp3" && (
        <div className="rd-field">
          <label htmlFor={bitrateId}>{copy.bitrateLabel}</label>
          <select
            id={bitrateId}
            value={bitrate}
            disabled={disabled}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onBitrateChange(Number(event.target.value) as Mp3Bitrate)
            }
          >
            {MP3_BITRATES.map((value) => (
              <option key={value} value={value}>
                {copy[BITRATE_LABEL_KEYS[value]]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
