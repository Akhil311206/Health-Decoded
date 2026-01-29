import React from "react";
import { ArrowLeft, Activity, AlertCircle, CheckCircle, TrendingDown } from "lucide-react";

export default function AnalysisResult({ data, onReset }) {
  const isReport = !!data.findings; // Check if it's a medical report

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <button onClick={onReset} className="mb-8 flex items-center gap-2 text-blue-600 hover:text-brand">
        <ArrowLeft size={20} /> Back to Home
      </button>

      
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          {isReport ? "Medical Report Analysis" : "Billing Audit Results"}
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {data.summary || `Bill Trust Score: ${data.bill_trust_score}/100`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isReport ? (
          // RENDER MEDICAL REPORT FINDINGS
          data.findings.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-slate-900 text-lg">{item.parameter}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  item.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-2xl font-mono text-brand mb-2">{item.value}</div>
              <p className="text-slate-500 text-sm italic">"Like a {item.explanation}"</p>
            </div>
          ))
        ) : (
          // RENDER BILL AUDIT FINDINGS
          data.audit_findings.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 border-l-4 border-l-audit-red shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="font-bold">{item.item}</span>
                <span className="text-slate-900 font-bold">${item.cost}</span>
              </div>
              <p className="text-red-600 text-sm font-medium mb-3 flex items-center gap-1">
                <AlertCircle size={14} /> {item.issue_detected}
              </p>
              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 font-medium">
                Recommendation: {item.suggested_action}
              </div>
            </div>
          ))
        )}
      </div>

      
      <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4 items-center">
        <Activity className="text-brand shrink-0" />
        <p className="text-sm text-blue-800">
          {data.safety_note || "This audit is powered by AI. Please consult with a healthcare administrator or doctor before taking financial or medical action."}
        </p>
      </div>
    </div>
  );
}