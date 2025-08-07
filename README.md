# ProjX – College Project Marketplace

**ProjX** is a full-stack web platform that allows college students to **buy and sell academic projects** securely. The platform is designed to ensure project quality using **AI verification** and **GitHub authentication** for contributor validation.

> 🚧 This project is currently under active development as part of a 4th semester coursework project.

---

## 🌟 Features

- 🛒 **Project Marketplace** – Students can list and browse projects.
- 🔐 **Authentication** – Firebase Auth supports secure login with email and GitHub.
- 🧠 **AI Project Verification** – Uses **Gemini AI (free tier)** to automatically review and verify projects.
- 💳 **Secure Payments** – Integrated **Stripe (test mode)** for safe and mock financial transactions.
- ✅ **GitHub Account Verification** – Buyers can verify sellers through their GitHub repos.
- 🔍 **Filter & Search** – Easily find projects by tech stack, semester, or branch (coming soon).
- 📁 **File Uploads** – Sellers can upload project ZIPs with documentation.

---

## 🛠️ Tech Stack

| Layer        | Tech Stack                         |
|--------------|-------------------------------------|
| **Frontend** | React.js, Tailwind CSS              |
| **Backend**  | Flask (Python), Gemini AI (API)     |
| **Auth**     | Firebase Authentication, GitHub OAuth |
| **Payments** | Stripe (Test Mode)                  |
| **Database** | SQLite (development), PostgreSQL (future) |

---

## 🔗 Live Preview

> Coming Soon...

---
## 📁 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/projx.git
cd projx

# Install frontend dependencies
cd client
npm install
npm start

# Install backend dependencies
cd ../server
pip install -r requirements.txt
python app.py
