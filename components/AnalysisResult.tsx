
import React, { useState } from "react";
import { DisasterReport } from "../types";
import {
  AlertTriangle,
  Users,
  Eye,
  Hammer,
  ClipboardList,
  ShieldAlert,
  BriefcaseMedical,
  Map,
  Share2,
  Clock,
  ScanEye,
  Megaphone,
  Shield,
  Languages
} from "lucide-react";

interface AnalysisResultProps {
  report: DisasterReport;
}

const SeverityGauge: React.FC<{ score: number; rationale: string[] }> = ({ score, rationale }) => {
  const getColor = (s: number) => {
    if (s >= 8) return "bg-red-600";
    if (s >= 5) return "bg-orange-500";
    return "bg-yellow-500";
  };

  return (
    <div className="flex flex-col p-4 bg-gray-900 rounded-lg border border-gray-800 w-full md:w-auto md:min-w-[250px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-xs uppercase tracking-wider">Severity Score</span>
        <span className={`text-2xl font-bold ${score >= 8 ? "text-red-500" : score >= 5 ? "text-orange-400" : "text-yellow-400"}`}>
          {score}/10
        </span>
      </div>
      <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div className={`h-full ${getColor(score)} transition-all duration-1000 ease-out`} style={{ width: `${Math.max(0, Math.min(100, score * 10))}%` }} />
      </div>
      {rationale && rationale.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-bold mb-1">RATIONALE</p>
          <ul className="space-y-1">
            {rationale.slice(0, 3).map((r, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-1">
                <span className="text-gray-600 mt-0.5">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-200 mt-6 mb-3 border-b border-gray-800 pb-2">
    {icon}
    {title}
  </h3>
);

const ListSection: React.FC<{ items?: string[]; emptyText?: string; bulletColor?: string }> = ({ 
  items, 
  emptyText = "None identified",
  bulletColor = "bg-red-500"
}) => {
  if (!items || items.length === 0) return <p className="text-gray-500 italic text-sm">{emptyText}</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${bulletColor} flex-shrink-0`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ report }) => {
  const [viewMode, setViewMode] = useState<'responder' | 'citizen'>('responder');

  // Use the Strict English Enum field if available, otherwise fallback to the potentially localized string
  const urgencyLevelEnum = report.urgencyLevel_en || report.urgencyLevel;

  const urgencyColor =
    urgencyLevelEnum === "Critical"
      ? "text-red-500 border-red-900 bg-red-950/30"
      : urgencyLevelEnum === "High"
      ? "text-orange-500 border-orange-900 bg-orange-950/30"
      : "text-yellow-500 border-yellow-900 bg-yellow-950/30";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-28 animate-fade-in">
      {/* Header Card */}
      <div className="bg-gray-850 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-850 p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${urgencyColor}`}>
                  <AlertTriangle size={14} />
                  {report.urgencyLevel.toUpperCase()}
                </div>
                {report.language !== 'en' && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-gray-700 bg-gray-800 text-gray-400 uppercase">
                    <Languages size={12} />
                    {report.language}
                  </div>
                )}
              </div>
              
              <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none mb-2">{report.disasterType}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users size={16} />
                <span>Risk: <span className="text-white font-bold">{report.peopleAtRisk}</span></span>
              </div>
            </div>
            <SeverityGauge score={report.severityScore} rationale={report.severityRationale} />
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
             {/* Visual Features Chips */}
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase">
                  <ScanEye size={14} /> AI Visual Feature Map
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.visualFeatureMap && report.visualFeatureMap.length > 0 ? (
                    report.visualFeatureMap.map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-950/40 border border-blue-900/50 text-blue-200 text-xs rounded-md">
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600 text-xs italic">No features detected</span>
                  )}
                </div>
             </div>
             
             {/* Summary Box */}
             <div className="flex-1 bg-gray-900/60 p-3 rounded-lg border border-gray-700">
               <div className="flex items-start gap-2">
                 <Share2 className="text-emerald-400 mt-0.5" size={16} />
                 <div>
                   <p className="text-xs text-emerald-400 font-bold uppercase mb-1">Comm Summary</p>
                   <p className="text-gray-300 font-mono text-xs leading-relaxed">{report.shareableSummary}</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setViewMode('responder')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              viewMode === 'responder' 
                ? 'bg-gray-800 text-red-400 border-b-2 border-red-500' 
                : 'bg-gray-900 text-gray-500 hover:text-gray-300'
            }`}
          >
            <Shield size={16} /> Responder Mode
          </button>
          <button
            onClick={() => setViewMode('citizen')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              viewMode === 'citizen' 
                ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-500' 
                : 'bg-gray-900 text-gray-500 hover:text-gray-300'
            }`}
          >
            <Megaphone size={16} /> Citizen Mode
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-900/50">
          {/* Left Column: Data & Resources */}
          <div className="space-y-2">
            <SectionHeader icon={<Eye className="text-blue-500" size={20} />} title="Key Observations" />
            <ListSection items={report.visualEvidence} bulletColor="bg-blue-500" />

            {viewMode === 'responder' && (
              <>
                <SectionHeader icon={<Hammer className="text-orange-500" size={20} />} title="Required Resources" />
                <ListSection items={report.requiredResources} bulletColor="bg-orange-500" />

                <SectionHeader icon={<BriefcaseMedical className="text-emerald-500" size={20} />} title="Equipment Checklist" />
                <ListSection items={report.equipmentChecklist} bulletColor="bg-emerald-500" />
              </>
            )}
            
            {viewMode === 'citizen' && (
              <>
                 <SectionHeader icon={<ShieldAlert className="text-red-500" size={20} />} title="Safety Precautions" />
                 <ListSection items={report.safetyPrecautions} bulletColor="bg-red-500" />
              </>
            )}
          </div>

          {/* Right Column: Plans */}
          <div className="space-y-2">
            <SectionHeader 
              icon={<ClipboardList className={viewMode === 'responder' ? "text-red-500" : "text-blue-500"} size={20} />} 
              title={viewMode === 'responder' ? "Tactical Response Plan" : "Civilian Safety Instructions"} 
            />
            
            <div className="space-y-3">
              {viewMode === 'responder' ? (
                 report.responderModePlan && report.responderModePlan.length > 0 ? (
                  report.responderModePlan.map((step, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-800/50 rounded border border-gray-700/50">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900/50 border border-red-800 text-red-200 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-200 text-sm">{step}</p>
                    </div>
                  ))
                 ) : <p className="text-gray-500 italic">No responder plan available.</p>
              ) : (
                report.citizenModePlan && report.citizenModePlan.length > 0 ? (
                  report.citizenModePlan.map((step, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-800/50 rounded border border-gray-700/50">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/50 border border-blue-800 text-blue-200 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-200 text-sm">{step}</p>
                    </div>
                  ))
                ) : <p className="text-gray-500 italic">No citizen instructions available.</p>
              )}
            </div>

            {viewMode === 'responder' && (
              <>
                <SectionHeader icon={<ShieldAlert className="text-red-500" size={20} />} title="Safety Precautions" />
                <ListSection items={report.safetyPrecautions} bulletColor="bg-red-500" />
              </>
            )}
          </div>
        </div>

        {/* Map Analysis Section */}
        {report.mapAnalysis && (report.mapAnalysis.safeZones?.length > 0 || report.mapAnalysis.blockedRoutes?.length > 0) && (
          <div className="border-t border-gray-700 p-6 bg-gray-900/80">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <Map className="text-emerald-500" />
              Map Analysis & Navigation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <h4 className="text-emerald-400 text-xs uppercase font-bold mb-2">Safe Zones</h4>
                <ListSection items={report.mapAnalysis.safeZones} bulletColor="bg-emerald-500" />
              </div>
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <h4 className="text-red-400 text-xs uppercase font-bold mb-2">Blocked Routes</h4>
                <ListSection items={report.mapAnalysis.blockedRoutes} bulletColor="bg-red-500" />
              </div>
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <h4 className="text-blue-400 text-xs uppercase font-bold mb-2">Recommended Approach</h4>
                <p className="text-gray-300 text-sm">{report.mapAnalysis.rescueApproach || "Standard approach"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios (Ambiguity Handling) */}
        {report.scenarios && report.scenarios.length > 0 && (
          <div className="border-t border-gray-700 p-6 bg-gray-800/30">
            <h3 className="text-gray-400 font-bold text-xs uppercase mb-3">Ambiguity Scenarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.scenarios.map((scenario, idx) => (
                <div key={idx} className="bg-gray-800 p-4 rounded border border-gray-600">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-200 text-sm">{scenario.description}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{scenario.probability}</span>
                  </div>
                  <p className="text-xs text-gray-400">Next Step: {scenario.nextSteps}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Item */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950 border-t border-red-900 z-50 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center gap-4 animate-pulse-slow">
          <div className="bg-red-600 p-3 rounded-full shadow-lg shadow-red-900/50">
            <Clock className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-0.5">Immediate Action (Next 60s)</p>
            <p className="text-white font-bold text-lg md:text-xl leading-tight">{report.immediateAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
