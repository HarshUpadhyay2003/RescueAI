🚨 RescueAI — Multimodal Disaster Response Intelligence

RescueAI is a real-time multimodal disaster response intelligence system built using Google Gemini 3 Pro in Google AI Studio.
It transforms incident images and optional map/context screenshots into structured, actionable emergency guidance for both first responders and civilians.

The system is designed to assist decision-making during high-risk scenarios such as floods, fires, structural collapses, and urban emergencies.

🖼️ Application Preview
<div align="center">
  <!-- Replace the src below with your application screenshot -->
  <img width="1200" height="475" alt="RescueAI Application Preview" src="YOUR_IMAGE_URL_HERE" />
</div>

✨ Key Features
🧠 Multimodal AI Scene Understanding

Analyzes incident photos to detect hazards such as flood depth, fire spread, trapped vehicles, smoke patterns, structural damage, and human presence.

Uses Gemini 3 Pro’s vision + reasoning for high-stakes inference.

📊 Structured Emergency Intelligence

Generates schema-validated outputs including:

Disaster classification

Urgency level

Severity score (1–10) with rationale

Estimated people at risk

AI-derived visual feature map

Required emergency resources

Equipment checklist

Safety precautions

Step-by-step tactical response plan

Immediate 60-second action directive

🧭 Map-Aware Reasoning (Optional)

When a map/context image is provided:

Identifies safe zones

Detects blocked routes

Recommends the best rescue approach

👥 Dual-Mode Guidance

Responder Mode: Tactical plans for emergency teams

Citizen Mode: Simplified safety instructions for civilians

🌍 Full Multilingual Support

Entire UI and AI-generated content dynamically switch to the selected language

Designed for local community deployment

⚠️ Ambiguity Handling

Generates alternative scenarios with probabilities when visual information is uncertain

🏗️ Tech Stack

Frontend: React + TypeScript

UI: Tailwind CSS

AI: Google Gemini 3 Pro (Multimodal)

Platform: Google AI Studio (Vibe Coding)

Output Control: Schema-validated JSON

Localization: Custom lightweight i18n system

🚀 Run and Deploy Your AI Studio App

This repository contains everything required to run RescueAI locally and deploy it via Google AI Studio.

🔗 View Live App in AI Studio

👉 https://ai.studio/apps/drive/1o-rfeBWA_19gkOFmQQiJ-U9enE4jzPQm

▶️ Run Locally
Prerequisites

Node.js (v18+ recommended)

Gemini API Key

1️⃣ Install Dependencies
npm install

2️⃣ Set Gemini API Key

Create a .env.local file in the project root:

GEMINI_API_KEY=your_gemini_api_key_here


⚠️ Never commit .env.local to version control.

3️⃣ Start Development Server
npm run dev

4️⃣ Open in Browser
http://localhost:5173

🧪 How to Use

Upload an incident image (required)

Upload a map/context image (optional)

Select preferred language

Click Analyze Disaster

Review:

Severity & urgency

Tactical response plans

Required resources

Safety precautions

Immediate 60-second action

📁 Project Structure
src/
├── components/
│   ├── AnalysisResult.tsx
│   ├── LanguageSelector.tsx
├── context/
│   └── LocaleContext.tsx
├── i18n/
│   ├── index.ts
│   ├── locales/
│   │   ├── en.json
│   │   ├── hi.json
│   │   └── es.json
│   └── README.md
├── services/
│   └── geminiService.ts
├── types.ts
├── App.tsx
└── main.tsx

⚠️ Disclaimer

RescueAI is an assistive AI system.
Always follow official emergency response protocols and human command structures.
Do not rely solely on AI for life-critical decisions.

🏆 Hackathon Context

This project was built for Google DeepMind’s “Vibe Code with Gemini 3 Pro” Hackathon, demonstrating:

Advanced multimodal reasoning

Schema-controlled AI outputs

Real-world emergency response application

End-to-end AI product thinking

📜 License

MIT License
Free to use, modify, and build upon.

🙌 Acknowledgements

Google DeepMind & Gemini Team

Google AI Studio

Kaggle Hackathon Platform
