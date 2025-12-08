import styles from './ErrorModal.module.css';

function ErrorModal({ isOpen, title = 'Error', tone = 'error', message, onClose }) {
  if (!isOpen) return null;

  const toneClass = tone === 'info' ? styles.info : styles.error;

  return (
    <div
      className={styles.backdrop}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-body"
      onClick={onClose}
    >
      <div className={styles.modal} role="document" onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={`${styles.pill} ${toneClass}`}>{tone === 'info' ? 'Info' : 'Error'}</span>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className={styles.content}>
          <h2 id="dialog-title" className={styles.title}>{title}</h2>
          <p id="dialog-body" className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
