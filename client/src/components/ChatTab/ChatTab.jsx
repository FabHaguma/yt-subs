import { MessageSquare } from 'lucide-react';
import styles from './ChatTab.module.css';

function ChatTab({ query, setQuery, response, loading, onSubmit }) {
  return (
    <div className={styles.chatBox}>
      <form onSubmit={onSubmit} className={styles.chatInput}>
        <input
          type="text"
          className={styles.input}
          placeholder="Ask a question about the video..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? '...' : <MessageSquare size={20} />}
        </button>
      </form>
      {response && (
        <div className={styles.chatResponse}>
          <strong>Answer:</strong>
          <p className={styles.responseText}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default ChatTab;
