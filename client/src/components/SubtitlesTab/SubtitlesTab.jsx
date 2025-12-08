import { useState } from 'react';
import styles from './SubtitlesTab.module.css';

function SubtitlesTab({ subtitles }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSubtitlesText = (subs) => {
    return subs
      .map((sub) => `${sub.start} --> ${sub.end}\n${sub.text}`)
      .join('\n\n');
  };

  const subtitlesText = formatSubtitlesText(subtitles);
  const visibleSubtitles = subtitles.slice(0, 5);

  if (isExpanded) {
    return (
      <>
        <textarea
          className={styles.expandedTextarea}
          value={subtitlesText}
          readOnly
        />
        <button
          className={styles.collapseButton}
          onClick={() => setIsExpanded(false)}
        >
          Collapse
        </button>
      </>
    );
  }

  return (
    <>
      <div className={styles.subtitleContainer}>
        {visibleSubtitles.map((sub, index) => (
          <div key={index} className={styles.subtitleLine}>
            <span className={styles.timestamp}>{sub.start}</span>
            <span className={styles.text}>{sub.text}</span>
          </div>
        ))}
        {subtitles.length > 5 && (
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(true)}
          >
            Expand ({subtitles.length - 5} more lines)
          </button>
        )}
      </div>
    </>
  );
}

export default SubtitlesTab;
