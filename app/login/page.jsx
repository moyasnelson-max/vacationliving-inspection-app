/* MARRIOTT LUXURY LOGIN -------------------------- */

.lux-container {
  position: fixed;
  inset: 0;
  background: url("/background.webp") center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lux-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(6px);
}

.lux-card {
  position: relative;
  z-index: 10;
  width: 94%;
  max-width: 420px;
  padding: 48px 40px;
  border-radius: 22px;
  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.25);
  box-shadow: 0 18px 60px rgba(0,0,0,0.25);
  animation: fadeInUp 0.8s ease;
}

/* LOGO */
.lux-logo {
  width: 130px;
  display: block;
  margin: 0 auto 28px;
  filter: drop-shadow(0 5px 8px rgba(0,0,0,0.25));
}

/* TITLES */
.lux-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
}

.lux-subtitle {
  text-align: center;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 32px;
}

/* FORM */
.lux-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* INPUTS */
.lux-input-wrapper {
  position: relative;
}

.lux-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.20);
  backdrop-filter: blur(6px);
  color: white;
  font-size: 16px;
}

.lux-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.lux-showpass {
  position: absolute;
  right: 16px;
  top: 13px;
  font-size: 18px;
  cursor: pointer;
}

/* BUTTON */
.lux-button {
  margin-top: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #C9A875, #9C7C50);
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s;
}

.lux-button:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #d4b38a, #a88a60);
}

/* FORGOT */
.lux-forgot {
  margin-top: 10px;
  color: #f1d8aa;
  text-align: center;
  display: block;
  font-size: 14px;
}

/* ERROR */
.lux-error {
  color: white;
  background: rgba(220,80,80,0.35);
  padding: 10px 14px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
}

/* ANIMATION */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
