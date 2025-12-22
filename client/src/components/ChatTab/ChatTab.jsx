import { MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from './ChatTab.module.css';

function ChatTab({ query, setQuery, response, loading, onSubmit, mode, onModeChange, availableModes = [] }) {
  return (
    <div className={styles.chatBox}>
      {availableModes.length > 0 && (
        <div className={styles.modeSelector}>
          <label htmlFor="chat-mode">Mode:</label>
          <select 
            id="chat-mode"
            value={mode || 'direct'} 
            onChange={(e) => onModeChange && onModeChange(e.target.value)}
            className={styles.modeSelect}
          >
            {availableModes.map(m => (
              <option key={m.id} value={m.id} title={m.description}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      )}
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
          <div className={styles.responseText}>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatTab;
