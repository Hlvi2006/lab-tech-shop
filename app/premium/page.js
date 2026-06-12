'use client';

import { useState, useEffect } from 'react'; 
import styles from './PremiumPage.module.css';
import SuccessMessage from './SuccessMessage';

export default function PremiumPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremium');
    if (premiumStatus === 'true') {
      setIsConfirmed(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form:', formData);
    
    localStorage.setItem('isPremium', 'true');
    
    setIsConfirmed(true);
  };

  return (
    <div className={styles.container}>
      {isConfirmed ? (
        <SuccessMessage />
      ) : (
        <>
          <h2 className={styles.title}>Premium Account</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label className={styles.label}>Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                maxLength="16"
                placeholder="0000 0000 0000 0000"
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.flex1}>
                <label className={styles.label}>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                  maxLength="5"
                  placeholder="MM/YY"
                  className={styles.input}
                />
              </div>
              <div className={styles.flex1}>
                <label className={styles.label}>CVC</label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  required
                  maxLength="4"
                  placeholder="123"
                  className={styles.input}
                />
              </div>
            </div>

            <button type="submit" className={styles.button}>
              Upgrade to Premium
            </button>
          </form>
        </>
      )}
    </div>
  );
}