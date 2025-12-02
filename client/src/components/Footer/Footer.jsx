import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        © {currentYear} Fabrice HAGUMA. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
