import { Sparkles } from 'lucide-react';
import styles from './SummaryTab.module.css';

function SummaryTab({ summary, loading }) {
  if (loading) {
    return <div className={styles.loading}>Generating summary with Gemini...</div>;
  }

  return (
    <div className={styles.summaryBox}>
      <div className={styles.summaryTitle}>
        <Sparkles size={18} /> Summary
      </div>
      <p className={styles.summaryText}>{summary}</p>
    </div>
  );
}

export default SummaryTab;
