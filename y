/* ============================================================
   Vacation Living — Submit Issue
   Marriott Premium Beige-Gold UI
   Mobile First – Ultra Clean – Luxury Shadows
   ============================================================ */

/* ---------- Colors & Base ---------- */
:root {
  --bg: #F6F1E8;
  --card: #FFFFFF;
  --gold: #C8A36D;
  --gold-dark: #9C7C4D;
  --text: #1F2328;
  --muted: #6B7280;
  --pill: #EFE8DB;
  --danger: #B91C1C;
  --success: #15803D;

  --shadow-soft: 0 4px 18px rgba(0,0,0,0.06);
  --shadow-card: 0 6px 24px rgba(0,0,0,0.08);
  --radius: 14px;
}

body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  font-family: 'Inter', sans-serif;
  color: var(--text);
}

/* ---------- Page Layout ---------- */
.submit-container {
  padding: 22px;
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--gold-dark);
  letter-spacing: -.3px;
}

/* ---------- Category Selector ---------- */
.category-box {
  background: var(--card);
  padding: 16px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  margin-bottom: 18px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.25s ease;
}

.category-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.1);
}

.category-left {
  font-size: 17px;
  font-weight: 500;
}

/* ---------- Subcategories ---------- */
.subcategory-box {
  background: var(--card);
  padding: 14px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
  margin-bottom: 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: 0.25s ease;
}

.subcategory-box:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

/* ---------- Notes ---------- */
.textarea-notes {
  width: 100%;
  height: 130px;
  padding: 14px;
  border-radius: var(--radius);
  border: 1px solid #ddd;
  font-size: 15px;
  outline: none;
  resize: none;
  background: #FAF8F5;
  margin-top: 6px;
  margin-bottom: 18px;
}

.textarea-notes:focus {
  border-color: var(--gold);
  background: #FFF;
}

/* ---------- Upload Section ---------- */
.upload-box {
  background: var(--card);
  padding: 18px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  border: 2px dashed var(--gold);
  text-align: center;
  margin-bottom: 20px;
  transition: 0.25s;
}

.upload-box:hover {
  background: #FFFDF8;
  border-color: var(--gold-dark);
}

.upload-text {
  color: var(--gold-dark);
  font-size: 16px;
  font-weight: 500;
}

/* ---------- Preview Images ---------- */
.preview-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preview-img {
  width: 90px;
  height: 90px;
  border-radius: var(--radius);
  object-fit: cover;
  box-shadow: var(--shadow-soft);
  border: 2px solid #EEE0C9;
}

/* ---------- Buttons ---------- */
.primary-btn {
  width: 100%;
  background: var(--gold);
  color: #FFF;
  border: none;
  padding: 15px;
  border-radius: var(--radius);
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: 0.25s ease;
  margin-top: 18px;
}

.primary-btn:hover {
  background: var(--gold-dark);
  transform: translateY(-2px);
}

.disabled-btn {
  background: #DDD;
  color: #999;
  cursor: not-allowed;
  transform: none !important;
}

/* ---------- Review Box ---------- */
.review-card {
  background: var(--card);
  padding: 18px;
  border-radius: var(--radius);
  margin-top: 20px;
  box-shadow: var(--shadow-card);
}

.review-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gold-dark);
  margin-bottom: 10px;
}

.review-item {
  font-size: 15px;
  margin-bottom: 6px;
}

/* ---------- Animations ---------- */
.fade-in {
  animation: fadeIn 0.3s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
