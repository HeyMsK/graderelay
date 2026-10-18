# 💬 GradeRelay

**Parent Progress Report Generator for Teachers — Pre-K through 12th Grade**

GradeRelay helps teachers write warm, professional progress reports for parents and guardians in about a minute. Select from feedback prompts across general and subject-specific categories, add a personal note, and copy or export a ready-to-send report.

🌐 **Live at [graderelay.com](https://graderelay.com)**

---

## ✨ Features

- **Hundreds of feedback prompts** across 10 general categories and 12 subject-specific areas
- **Student names are not requested** — reports address "your child" throughout
- **Optional fill-in blank** — add `_______________` to handwrite a name after printing
- **Three report types:** Daily · Weekly · Marking Period
- **Marking Period selector** — Marking Period, Quarter, Trimester, Semester, Term, Mid-Year, End of Year, or Custom
- **Student grade level** — optional Pre-K through 12th Grade selector
- **Subject-Specific Prompts** — 12 subject areas with targeted strength and growth language:
  - 🌱 Pre-K & Kindergarten · 📚 ELA · 🔢 Math · 🔬 Science · 🌍 Social Studies
  - 🎨 The Arts · 🏃 Physical Education · 💚 SEL · 🎓 AP · 🌐 ENL · 💡 Special Education · 🔵 General
- **Export options:** Copy Text · Send via Email · Send via Text/SMS · View Formatted Report · Download .doc
- **AI translate and grammar check** — optional tools that send the text you wrote to an AI service for processing
- **Installable** on iPhone and Android as a web app
- **Free to start** — teachers create an account to use the app, with a limited number of free reports

---

## 📂 General Feedback Categories

| Category | Type |
|---|---|
| ✅ Academic Strengths | Positive |
| 📚 Academic Support Needed | Concern |
| 🙋 Participation Strengths | Positive |
| 💬 Participation Support Needed | Concern |
| ⭐ Behavior Strengths | Positive |
| ⚠️ Behavior Concerns | Concern |
| 📅 Attendance | Neutral |
| ✏️ Homework & Assignment Strengths | Positive |
| 📝 Homework & Assignment Concerns | Concern |
| 💡 General Comments | Neutral |

---

## 🔒 Privacy

GradeRelay is designed to avoid collecting student information:

- **Student names are not requested.** The report form asks for teacher, class, and term only.
- **Report text is not saved to our database.** Reports are generated and copied or exported from your browser.
- **Account and plan information is stored.** Teacher accounts and subscription status are kept in our database.
- **AI features send text to Anthropic.** When you use the translate or grammar-check buttons, the text you wrote is sent to Anthropic to be processed. Do not include student names or other identifying details in your text.
- **Payments are handled by Stripe.** GradeRelay does not see or store card numbers.

See the full [Privacy Policy](https://graderelay.com/privacy.html).

> ⚠️ Teachers are responsible for following their school or district's data privacy policies, including how they send generated reports to families.

---

## 🚀 Getting Started

GradeRelay is a single-file web app built with React. There's no build step.

```bash
git clone https://github.com/HeyMsK/graderelay.git
cd graderelay
```

Open `index.html` in a browser, or visit **[graderelay.com](https://graderelay.com)**.

Serverless functions in the `api/` folder handle payments, the Stripe webhook, and AI features. Those need environment variables set in Vercel to run.

---

## 🛠️ Built With

- [React 18](https://reactjs.org/) via CDN
- [Babel Standalone](https://babeljs.io/) — in-browser JSX
- [Supabase](https://supabase.com/) — accounts and database
- [Stripe](https://stripe.com/) — payments
- [Vercel](https://vercel.com/) — hosting and serverless functions
- [Anthropic API](https://www.anthropic.com/) — translate and grammar-check features
- [Google Fonts — Playfair Display & Source Serif 4](https://fonts.google.com/)
- Vanilla CSS · Progressive Web App (PWA)

---

## 📋 Roadmap

- [ ] Multi-language reports (Spanish, Haitian Creole, Chinese)
- [ ] Google Drive save integration
- [ ] School/district multi-teacher version
- [ ] Teacher report history
- [ ] IEP goal tracking for SpEd teachers
- [ ] Parent-facing translation toggle

---

## 📄 License & Copyright

Copyright © 2025 Khali Gap Media LLC. All rights reserved.
See [LICENSE](./LICENSE) for full terms.

---

*GradeRelay is part of the Echo Keepers Media platform — tools for educators, storytellers, and communities.*
*Live at [graderelay.com](https://graderelay.com) · Support: [support@graderelay.com](mailto:support@graderelay.com)*
