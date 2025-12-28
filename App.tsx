
import React, { useState, useRef, useEffect } from "react";
import { analyzeDisaster } from "./services/geminiService";
import { DisasterReport } from "./types";
import { AnalysisResult } from "./components/AnalysisResult";
import { Upload, Map as MapIcon, Image as ImageIcon, AlertCircle, Languages, Loader2 } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "pt", name: "Português (Portuguese)" },
  { code: "ja", name: "日本語 (Japanese)" },
  { code: "zh", name: "中文 (Chinese)" },
];

const App: React.FC = () => {
  const [incidentImage, setIncidentImage] = useState<File | null>(null);
  const [mapImage, setMapImage] = useState<File | null>(null);
  const [incidentPreviewUrl, setIncidentPreviewUrl] = useState<string | null>(null);
  const [mapPreviewUrl, setMapPreviewUrl] = useState<string | null>(null);
  const [report, setReport] = useState<DisasterReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const incidentInputRef = useRef<HTMLInputElement>(null);
  const mapInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If you want to detect environment keys show a dev warning. Studio provides credentials.
    if (typeof process !== "undefined" && !process.env?.API_KEY) {
      // Keep as a non-blocking console hint for developers.
      console.debug("Note: No API key in env. In Studio preview credentials are provided by the platform.");
    }
  }, []);

  // Cleanup object URLs when files change/unmount
  useEffect(() => {
    return () => {
      if (incidentPreviewUrl) URL.revokeObjectURL(incidentPreviewUrl);
      if (mapPreviewUrl) URL.revokeObjectURL(mapPreviewUrl);
    };
  }, [incidentPreviewUrl, mapPreviewUrl]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      setError(null);

      // create and set preview URL
      const url = URL.createObjectURL(file);
      previewSetter(url);
    }
  };

  const handleAnalyze = async () => {
    if (!incidentImage) {
      setError("Please upload at least one incident image.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeDisaster(incidentImage, mapImage, selectedLanguage);
      setReport(result);
    } catch (err: any) {
      console.error("analyze error", err);
      setError(err?.message || "Failed to analyze the disaster. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIncidentImage(null);
    setMapImage(null);
    setReport(null);
    setError(null);

    if (incidentInputRef.current) incidentInputRef.current.value = "";
    if (mapInputRef.current) mapInputRef.current.value = "";

    if (incidentPreviewUrl) {
      URL.revokeObjectURL(incidentPreviewUrl);
      setIncidentPreviewUrl(null);
    }
    if (mapPreviewUrl) {
      URL.revokeObjectURL(mapPreviewUrl);
      setMapPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-red-900 selection:text-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetForm}>
            <div className="bg-red-600 p-1.5 rounded-lg">
              <SirenIcon className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              RESCUE<span className="text-red-500">AI</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                   <Languages size={16} className="text-gray-400" />
                   <select 
                     value={selectedLanguage}
                     onChange={(e) => setSelectedLanguage(e.target.value)}
                     className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer appearance-none pr-4"
                     disabled={loading}
                   >
                     {SUPPORTED_LANGUAGES.map(lang => (
                       <option key={lang.code} value={lang.code} className="bg-gray-900 text-gray-100">
                         {lang.name}
                       </option>
                     ))}
                   </select>
                </div>
             </div>
             <div className="text-xs font-mono text-gray-500 hidden sm:block">SYSTEM v1.0</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg mb-8 flex items-center gap-3">
            <AlertCircle size={20} />
            <div>{error}</div>
          </div>
        )}

        {/* Upload Section */}
        {!report && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-white">Incident Analysis</h2>
              <p className="text-gray-400">Upload visuals from the scene for immediate AI assessment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Incident Image Upload */}
              <div
                className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  incidentImage ? "border-red-500 bg-red-950/10" : "border-gray-700 hover:border-gray-500 hover:bg-gray-900"
                }`}
                onClick={() => incidentInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={incidentInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setIncidentImage, setIncidentPreviewUrl)}
                />
                {incidentImage ? (
                  <>
                    {incidentPreviewUrl && (
                      <img src={incidentPreviewUrl} alt="Incident" className="w-full h-32 object-cover rounded-lg mb-2 opacity-80" />
                    )}
                    <span className="text-sm font-semibold text-red-400 truncate w-full px-2">{incidentImage.name}</span>
                    <span className="text-xs text-gray-500 mt-1">Click to change</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Incident Photo</h3>
                    <p className="text-sm text-gray-500 mt-2">Required</p>
                  </>
                )}
              </div>

              {/* Map Image Upload */}
              <div
                className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  mapImage ? "border-emerald-500 bg-emerald-950/10" : "border-gray-700 hover:border-gray-500 hover:bg-gray-900"
                }`}
                onClick={() => mapInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={mapInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setMapImage, setMapPreviewUrl)}
                />
                {mapImage ? (
                  <>
                    {mapPreviewUrl && (
                      <img src={mapPreviewUrl} alt="Map" className="w-full h-32 object-cover rounded-lg mb-2 opacity-80" />
                    )}
                    <span className="text-sm font-semibold text-emerald-400 truncate w-full px-2">{mapImage.name}</span>
                    <span className="text-xs text-gray-500 mt-1">Click to change</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MapIcon className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Map / Context</h3>
                    <p className="text-sm text-gray-500 mt-2">Optional</p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !incidentImage}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg ${
                loading || !incidentImage ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  ANALYZING SITUATION...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  ANALYZE DISASTER
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Disclaimer: RescueAI is an assistive tool. Always follow official protocols and chain of command. Do not rely solely on AI for life-critical decisions.
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {report && !loading && (
          <div className="relative">
            <button onClick={resetForm} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              &larr; New Analysis
            </button>
            <AnalysisResult report={report} />
          </div>
        )}

        {/* Loading Overlay */}
        {loading && !report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm pointer-events-none">
            <div className="text-center p-8">
              <div className="inline-block relative">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-red-600/30 border-b-transparent rounded-full animate-pulse absolute inset-0"></div>
              </div>
              <p className="mt-4 text-xl font-bold text-white tracking-widest animate-pulse">ASSESSING THREATS</p>
              <p className="text-sm text-gray-500 mt-2">Processing visual data...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple Icon component for the logo
const SirenIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z" />
    <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2Z" />
    <path d="M21 12h1" />
    <path d="M18.5 4.5 18 5" />
    <path d="M2 12h1" />
    <path d="M12 2v1" />
    <path d="m4.929 4.929.707.707" />
    <path d="M12 12v6" />
  </svg>
);

export default App;
