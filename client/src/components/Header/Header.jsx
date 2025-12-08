import styles from './Header.module.css';

function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.title}>YT Subs</h1>
          <p className={styles.subtitle}>Download, Summarize, and Search YouTube Subtitles</p>
        </div>

        <button
          type="button"
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <span className={styles.toggleIcon}>{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </header>
  );
}

export default Header;
