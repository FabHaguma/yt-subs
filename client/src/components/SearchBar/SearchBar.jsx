import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

function SearchBar({ url, setUrl, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className={styles.searchSection}>
      <input
        type="text"
        className={styles.input}
        placeholder="Paste YouTube URL or video ID..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Loading...' : <><Search size={20} /> Get Subtitles</>}
      </button>
    </form>
  );
}

export default SearchBar;
