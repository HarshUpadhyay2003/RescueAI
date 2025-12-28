🚨 RESCUEAI
Multimodal Disaster Response Intelligence System

RescueAI is a real-time multimodal disaster response intelligence platform built using Google Gemini 3 Pro in Google AI Studio.
It transforms incident images and optional map/context screenshots into structured, actionable emergency guidance for both first responders and civilians.

🖼️ APPLICATION PREVIEW
<div align="center"> <img src="assets/images/app-preview.png" alt="RescueAI Application Preview" width="1200" /> </div>

📌 Replace assets/images/app-preview.png with your actual screenshot file.

✨ KEY FEATURES
🧠 Multimodal AI Scene Understanding

Analyzes incident images to detect flooding depth, fire spread, smoke patterns, trapped vehicles, structural damage, and human presence.

Powered by Gemini 3 Pro’s vision + reasoning capabilities.

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

Step-by-step response plan

Immediate 60-second action directive

🧭 Map-Aware Reasoning (Optional)

When a map/context image is provided:

Identifies safe zones

Detects blocked routes

Recommends the best rescue approach

👥 Dual-Mode Guidance

Responder Mode: Tactical instructions for emergency teams

Citizen Mode: Simple safety guidance for civilians

🌍 Full Multilingual Support

Entire UI and AI-generated content switch dynamically to the selected language

Designed for local community deployment

⚠️ Ambiguity Handling

Generates alternative scenarios with probabilities under uncertain visual conditions

🏗️ TECH STACK

Frontend: React + TypeScript

UI: Tailwind CSS

AI: Google Gemini 3 Pro (Multimodal)

Platform: Google AI Studio (Vibe Coding)

Output Control: Schema-validated JSON

Localization: Custom lightweight i18n system

🚀 RUN & DEPLOY WITH AI STUDIO

This repository contains everything required to run RescueAI locally and deploy it via Google AI Studio.

🔗 View Live App in AI Studio

👉 https://ai.studio/apps/drive/1o-rfeBWA_19gkOFmQQiJ-U9enE4jzPQm

▶️ RUN LOCALLY
Prerequisites

Node.js (v18+ recommended)

Gemini API Key

1️⃣ Install Dependencies
npm install

2️⃣ Set Gemini API Key

Create a .env.local file in the project root:

GEMINI_API_KEY=your_gemini_api_key_here


⚠️ Never commit .env.local to GitHub.

3️⃣ Start Development Server
npm run dev

4️⃣ Open in Browser
http://localhost:5173

🧪 HOW TO USE

Upload an incident image (required)

Upload a map/context image (optional)

Select preferred language

Click Analyze Disaster

Review structured emergency intelligence and immediate actions

📁 PROJECT STRUCTURE
assets/
└── images/
    └── app-preview.png

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
├── services/
│   └── geminiService.ts
├── types.ts
├── App.tsx
└── main.tsx

⚠️ DISCLAIMER

RescueAI is an assistive AI system.
Always follow official emergency response protocols and human command structures.
Do not rely solely on AI for life-critical decisions.

🏆 HACKATHON CONTEXT

Built for Google DeepMind’s “Vibe Code with Gemini 3 Pro” Hackathon, demonstrating:

Advanced multimodal reasoning

Structured AI outputs

Real-world emergency response use cases

End-to-end AI product thinking

📜 LICENSE

MIT License

🙌 ACKNOWLEDGEMENTS

Google DeepMind & Gemini Team

Google AI Studio

Kaggle Hackathon Platform
