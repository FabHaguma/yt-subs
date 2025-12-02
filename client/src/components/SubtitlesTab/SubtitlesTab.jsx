import { Copy, Download } from 'lucide-react';
import styles from './SubtitlesTab.module.css';

function SubtitlesTab({ subtitles, onCopy, onDownload }) {
  return (
    <>
      <div className={styles.actions}>
        <button className={styles.secondaryButton} onClick={() => onCopy(true)}>
          <Copy size={16} /> Copy w/ Time
        </button>
        <button className={styles.secondaryButton} onClick={() => onCopy(false)}>
          <Copy size={16} /> Copy Text
        </button>
        <button className={styles.secondaryButton} onClick={() => onDownload('txt')}>
          <Download size={16} /> TXT
        </button>
        <button className={styles.secondaryButton} onClick={() => onDownload('json')}>
          <Download size={16} /> JSON
        </button>
      </div>
      <div className={styles.subtitleContainer}>
        {subtitles.map((sub, index) => (
          <div key={index} className={styles.subtitleLine}>
            <span className={styles.timestamp}>{sub.start}</span>
            <span className={styles.text}>{sub.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default SubtitlesTab;
