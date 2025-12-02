import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>YT Subs</h1>
      <p className={styles.subtitle}>Download, Summarize, and Search YouTube Subtitles</p>
    </header>
  );
}

export default Header;
