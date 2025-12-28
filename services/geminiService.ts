
/* services/geminiService.ts */

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DisasterReport } from "../types";

const BASE_SYSTEM_INSTRUCTION = `
You are **RescueAI**, an advanced multimodal Disaster Response System for emergency teams and civilians.

Your outputs must ALWAYS be a **strict JSON object** following the provided schema.
Do NOT include explanations, comments, markdown, natural language paragraphs, or any text outside the JSON.

Your goals:
1. Analyze ALL input images and extract a structured assessment of the incident.
2. Produce:
   - High-level disaster classification
   - AI Visual Feature Map (list of specific visual observations detected in the image)
   - Severity Score + Severity Rationale (why this severity was chosen)
   - Responder Mode Plan (for trained emergency personnel)
   - Citizen Mode Plan (simple safety instructions for general public)
   - Immediate Action (single instruction for next 60 seconds)
   - Required Resources & Equipment
   - Safety Precautions
   - Optional map-based navigation analysis

STRICT RULES:
- All string fields must contain **plain text only** — no commas, no parentheses, no quotation marks inside values. Replace punctuation with hyphens.
- Always include a **severityRationale** field: short bullet-style reasons for the severity score.
- Always include a **visualFeatureMap** field describing all relevant visual cues detected from the image.
- Always include **responderModePlan** and **citizenModePlan** arrays.
- Keep all items short, factual, and tactical.
- If unsure, use conservative estimates and add alternate scenarios in the \`scenarios\` field.

MULTI-LANGUAGE EXTENSION:
- Output a top-level field \`language\` set to the ISO 639-1 code used.
- For every user-facing string field (e.g., shareableSummary, immediateAction, plans), produce TWO fields:
  1. The original field name (e.g., \`shareableSummary\`) containing the LOCALIZED text in the target language.
  2. A sibling field suffixed with \`_en\` (e.g., \`shareableSummary_en\`) containing the ENGLISH original.
- Localize number formatting and units if appropriate for the target language.
- \`urgencyLevel_en\` must be one of: "Critical", "High", "Moderate", "Low", "Unknown".
- \`urgencyLevel\` should be the localized string of the above.
- If translation confidence is low, duplicate the English text in the localized field.

REQUIRED OUTPUT FIELDS:
- language
- disasterType, disasterType_en
- severityScore
- severityRationale, severityRationale_en
- visualFeatureMap, visualFeatureMap_en
- responderModePlan, responderModePlan_en
- citizenModePlan, citizenModePlan_en
- urgencyLevel, urgencyLevel_en
- peopleAtRisk, peopleAtRisk_en
- visualEvidence, visualEvidence_en
- requiredResources, requiredResources_en
- responsePlan, responsePlan_en
- safetyPrecautions, safetyPrecautions_en
- equipmentChecklist, equipmentChecklist_en
- shareableSummary, shareableSummary_en
- immediateAction, immediateAction_en
- mapAnalysis (optional)
- scenarios (optional)

Never output anything outside the JSON object. Respond ONLY with valid JSON that matches the schema exactly.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    language: { type: Type.STRING },
    localizationConfidence: {
      type: Type.OBJECT,
      properties: {
        shareableSummary: { type: Type.STRING },
        immediateAction: { type: Type.STRING },
        general: { type: Type.STRING }
      }
    },
    disasterType: { type: Type.STRING },
    disasterType_en: { type: Type.STRING },
    
    severityScore: { type: Type.INTEGER, description: "1-10 scale" },
    
    severityRationale: { type: Type.ARRAY, items: { type: Type.STRING } },
    severityRationale_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    urgencyLevel: { type: Type.STRING },
    urgencyLevel_en: { type: Type.STRING, enum: ["Critical", "High", "Moderate", "Low", "Unknown"] },

    peopleAtRisk: { type: Type.STRING },
    peopleAtRisk_en: { type: Type.STRING },

    visualFeatureMap: { type: Type.ARRAY, items: { type: Type.STRING } },
    visualFeatureMap_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    visualEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
    visualEvidence_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    responderModePlan: { type: Type.ARRAY, items: { type: Type.STRING } },
    responderModePlan_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    citizenModePlan: { type: Type.ARRAY, items: { type: Type.STRING } },
    citizenModePlan_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    requiredResources: { type: Type.ARRAY, items: { type: Type.STRING } },
    requiredResources_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    responsePlan: { type: Type.ARRAY, items: { type: Type.STRING } },
    responsePlan_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    safetyPrecautions: { type: Type.ARRAY, items: { type: Type.STRING } },
    safetyPrecautions_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    equipmentChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
    equipmentChecklist_en: { type: Type.ARRAY, items: { type: Type.STRING } },

    shareableSummary: { type: Type.STRING },
    shareableSummary_en: { type: Type.STRING },

    immediateAction: { type: Type.STRING },
    immediateAction_en: { type: Type.STRING },

    mapAnalysis: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        safeZones: { type: Type.ARRAY, items: { type: Type.STRING } },
        safeZones_en: { type: Type.ARRAY, items: { type: Type.STRING } },
        blockedRoutes: { type: Type.ARRAY, items: { type: Type.STRING } },
        blockedRoutes_en: { type: Type.ARRAY, items: { type: Type.STRING } },
        rescueApproach: { type: Type.STRING },
        rescueApproach_en: { type: Type.STRING }
      }
    },
    scenarios: {
      type: Type.ARRAY,
      nullable: true,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          description_en: { type: Type.STRING },
          probability: { type: Type.STRING },
          nextSteps: { type: Type.STRING },
          nextSteps_en: { type: Type.STRING }
        }
      }
    }
  },
  required: [
    "language",
    "disasterType", "disasterType_en",
    "severityScore", 
    "severityRationale", "severityRationale_en",
    "urgencyLevel", "urgencyLevel_en",
    "peopleAtRisk", "peopleAtRisk_en",
    "visualFeatureMap", "visualFeatureMap_en",
    "visualEvidence", "visualEvidence_en",
    "responderModePlan", "responderModePlan_en",
    "citizenModePlan", "citizenModePlan_en",
    "requiredResources", "requiredResources_en",
    "responsePlan", "responsePlan_en",
    "safetyPrecautions", "safetyPrecautions_en",
    "equipmentChecklist", "equipmentChecklist_en",
    "shareableSummary", "shareableSummary_en",
    "immediateAction", "immediateAction_en"
  ]
};

// Helper: convert a browser File -> inlineData part expected by the GenAI client
const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const asStr = reader.result as string;
      const commaIndex = asStr.indexOf(',');
      const base64String = commaIndex >= 0 ? asStr.slice(commaIndex + 1) : asStr;
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type || "image/jpeg",
        },
      });
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export const analyzeDisaster = async (
  incidentFile: File,
  mapFile: File | null,
  language: string = "en"
): Promise<DisasterReport> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = "gemini-3-pro-preview";

    const parts: Array<any> = [];

    if (!incidentFile) {
      throw new Error("analyzeDisaster: incidentFile is required.");
    }

    const incidentPart = await fileToPart(incidentFile);
    parts.push(incidentPart);

    if (mapFile) {
      const mapPart = await fileToPart(mapFile);
      parts.push(mapPart);
      parts.push({ text: "The second image is a map/context screenshot. Please populate mapAnalysis." });
    }

    parts.push({ text: `Analyze the image(s) and provide the structured DisasterReport JSON in language: ${language}.` });

    // Append specific language instruction
    const systemInstruction = `${BASE_SYSTEM_INSTRUCTION}
    
    TARGET LANGUAGE: ${language}
    If the language is 'en' (English), the localized fields and _en fields will be identical.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: "user",
        parts,
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, 
      },
    });

    const raw = response.text;
    if (!raw) {
      throw new Error("No textual response from model.");
    }

    let jsonReport: DisasterReport;
    try {
      jsonReport = JSON.parse(raw.trim()) as DisasterReport;
    } catch (parseErr) {
      const truncated = raw.length > 2000 ? raw.slice(0, 2000) + "...(truncated)" : raw;
      throw new Error("Failed to parse model JSON response: " + String(parseErr) + "\nOutput: " + truncated);
    }

    return jsonReport;

  } catch (error) {
    console.error("analyzeDisaster ERROR:", error);
    throw error;
  }
};
