import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from './SummaryTab.module.css';

function SummaryTab({ summary, loading, onGenerate, mode, onModeChange, availableModes = [] }) {
  if (loading) {
    return <div className={styles.loading}>Generating summary with AI...</div>;
  }

  return (
    <div className={styles.summaryBox}>
      <div className={styles.summaryHeader}>
        <div className={styles.summaryTitle}>
          <Sparkles size={18} /> Summary
        </div>
        <div className={styles.controls}>
          {availableModes.length > 0 && (
            <select 
              value={mode || 'standard'} 
              onChange={(e) => onModeChange && onModeChange(e.target.value)}
              className={styles.modeSelect}
              title="Summary style"
            >
              {availableModes.map(m => (
                <option key={m.id} value={m.id} title={m.description}>
                  {m.label}
                </option>
              ))}
            </select>
          )}
          {summary && onGenerate && (
            <button 
              onClick={onGenerate} 
              className={styles.regenerateBtn}
              title="Regenerate with selected mode"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>
      {summary ? (
        <div className={styles.summaryText}>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Click the button above to generate a summary</p>
        </div>
      )}
    </div>
  );
}

export default SummaryTab;
