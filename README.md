# नफाNuksan – The Indian SME Business Co-pilot 🇮🇳  

> **Democratizing Intelligence for Every Indian Business.**  
> Helping 63M+ Indian SMEs turn data chaos into growth with AI-powered insights.  

---

## 📖 Background  

Small and Medium Enterprises (SMEs) form the **backbone of India’s economy**:  
- Contribute **30% of GDP**.  
- Employ over **110 million people**.  
- Yet, **90% of them run on guesswork**, not data.  

📉 This gap between **ambition and tools** leaves billions of rupees in untapped opportunities.  
We built **नफाNuksan** to bridge this gap.  

---

## ❌ Problem Statement  

- **Data Chaos**: Insights buried in Excel sheets, GST portals, Tally exports, and invoices.  
- **High Costs**: Data analysts cost ₹10–20 lakhs annually — unfeasible for most SMEs.  
- **Missed Opportunities**: Without insights, businesses mismanage inventory, fail to forecast demand, and lose customers.  

👉 Bottom Line: SMEs have **limitless ambition** but **limited tools**.  
---

## 💡 Our Solution  

✨ **नफाNuksan** is an **AI-powered SME Business Co-pilot** built **for India, in India**.  

- **Regional Language Chat** – Ask questions in Hindi, Marathi, Gujarati, Tamil, or English.  
- **Instant Data Structuring** – Upload messy GST reports, sales sheets, and PDFs → AI cleans & analyzes them.  
- **Cultural Intelligence** – Considers Indian festivals, local demand cycles, and APEDA exports.  

We **replace expensive consultants** with an AI partner that’s always available, affordable, and scalable.  

---

## 🌟 Features  

- **🧠 Advanced Agentic Reasoning**  
  - Chooses the right tool for each query (Sales Analyzer, Inventory Forecaster, Market Scout).  
  - Handles multi-step reasoning across tools.  

- **🔄 Graceful Fallback System**  
  - Self-healing pipeline for messy Excel/PDF files.  
  - If APIs fail, cached data ensures uninterrupted results.  

- **📝 Context-Aware Memory**  
  - Learns your business across sessions.  
  - Example: *“Now compare with last year’s Diwali sales.”*  

- **⚡ Hybrid Analysis Engine**  
  - Combines **private data (via RAG)** with **real-time web intel (Serper API)**.  
  - Insights impossible with either source alone.  

- **🛡️ Hallucination-Free Design**  
  - Structured JSON outputs + Indian business jargon fine-tuning.  

---

## 🛠 Tech Stack  

- **Frontend**: React + TypeScript  
- **Backend**: Next.js  
- **AI Core**: Google Gemini 1.5 Flash  
- **Database**: Firebase + Firestore  
- **Hosting**: Google Cloud + Vercel  
- **Authentication**: Firebase  
- **APIs**: Serper API (real-time market intelligence)  

✨ Not just a chatbot — an **AI Agentic System**.  

---

## 🏗 System Architecture  

```mermaid
flowchart TD
    A[User Uploads Data] --> B[Preprocessing Layer]
    B --> C[Context-Aware Memory]
    B --> D[Hybrid Analysis Engine]
    D --> E[Gemini AI Core]
    E --> F[Tool Selection Module]
    F --> G1[Sales Analyzer]
    F --> G2[Inventory Forecaster]
    F --> G3[Market Scout]
    G1 & G2 & G3 --> H[Structured Insights]
    H --> I[User Dashboard / Chat Interface]
````

---

## 📊 Use Cases

* **Profitability Analysis** – Identify most profitable products.
* **Inventory Forecasting** – Predict demand during Diwali, Eid, Holi, etc.
* **Market Comparison** – Track competitor pricing live.
* **Customer Insights** – Analyze reviews for sentiment & feedback.
* **Export Readiness** – Suggest APEDA-backed export opportunities.

---

## ⚡ Installation & Setup

> 🚧 *Note: Replace instructions below once repo is public & codebase is finalized.*

1. Clone the repository

   ```bash
   git clone https://github.com/esss-28/NafaNuksan.git
   cd NafaNuksan
   ```
2. Install dependencies

   ```bash
   npm install
   ```
3. Add environment variables (create `.env` file)

   ```
   FIREBASE_API_KEY=xxxx
   GEMINI_API_KEY=xxxx
   SERPER_API_KEY=xxxx
   ```
4. Run the app locally

   ```bash
   npm run dev
   ```

---

## ▶️ Usage

* Visit `http://localhost:3000`
* Sign up with your SME account (Firebase Auth).
* Upload data (Excel, GST, PDFs).
* Start asking questions in **English or your regional language**.

Example queries:

* *“Show me my most profitable product line in 2024 Q1.”*
* *“Forecast sales for Diwali 2025.”*
* *“Find competitors near me with lower prices.”*

---

## 🔮 Future Scope

* 📱 **Mobile App** for Android/iOS.
* 🤝 **Integration with Tally & Zoho** for auto-sync.
* 🧾 **Automated GST Filing Suggestions**.
* 📊 **Industry Benchmarks** for SMEs to compare with peers.
* 🌐 **Multi-language Expansion** (Bengali, Telugu, Kannada, etc).

---

## 🙏 Acknowledgements

Special thanks to:

* Google Gemini team for providing cutting-edge AI models.
* Indian SME networks for feedback on features.

---

## 💬 Final Note

> SMEs deserve **world-class intelligence without world-class costs**.
> With नफाNuksan, we’re on a mission to empower every Indian business to thrive, not just survive.
