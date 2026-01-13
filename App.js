// Vorschlag für die Hauptansicht (Dashboard)
import React, { useState } from 'react';
import { Calendar, Droplets, MapPin, Plus } from 'lucide-react';

const YoboApp = () => {
  const [logs, setLogs] = useState([
    { id: 1, date: '2026-01-12', location: 'Hamburg', action: 'Full Wash' },
    { id: 2, date: '2026-01-10', location: 'Berlin', action: 'Conditioner only' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Yobo hat die Haare schön ✨</h1>
        <p className="text-slate-500">Dein Hair-Care Logbuch</p>
      </header>

      {/* Kalender-Übersicht-Karte */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="text-blue-500" size={20} /> Letzte Wäschen
          </h2>
          <button className="bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200 transition">
            <Plus size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <Droplets className="text-cyan-500" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{log.date}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} /> {log.location}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full text-slate-600 border border-slate-100">
                {log.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YoboApp;