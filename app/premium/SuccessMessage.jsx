import styles from './PremiumPage.module.css';

export default function SuccessMessage() {
  return (
    <div className={styles.successBox}>
      <h2 className={styles.successTitle}>✅ Payment complete, ads removed!</h2>
      <p className={styles.successText}>
        Thank you for your purchase. Enjoy an ad-free shopping experience.
      </p>
    </div>
  );
}