import React, { useState, useEffect } from 'react';
import { MapPin, Droplets, Plus, Trash2, X } from 'lucide-react';

const App = () => {
  // Zustand für die Wasch-Einträge
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('yobo-hair-logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Zustände für das Eingabe-Modal
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLocation, setNewLocation] = useState('Zuhause');

  // Automatisches Speichern im Browser
  useEffect(() => {
    localStorage.setItem('yobo-hair-logs', JSON.stringify(logs));
  }, [logs]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!newLocation || !newDate) return;

    // Erstelle einen neuen Eintrag
    const dateObj = new Date(newDate);
    const formattedDate = dateObj.toLocaleDateString('de-DE');

    const entry = {
      id: Date.now(),
      date: formattedDate,
      rawDate: newDate, // Wichtig für die Sortierung
      location: newLocation,
      action: 'Hauptwäsche'
    };

    // Füge hinzu und sortiere nach Datum (neueste oben)
    const updatedLogs = [entry, ...logs].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    
    setLogs(updatedLogs);
    setShowModal(false); // Modal schließen
    setNewLocation('Zuhause'); // Reset
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-2xl relative">
      {/* Header */}
      <header className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-[3rem] shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Yobo Hair-Log ✨</h1>
        <p className="opacity-80 text-sm italic">Dein persönliches Haar-Tagebuch</p>
      </header>

      <main className="p-6 flex-grow mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Verlauf</h2>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all transform active:scale-95 shadow-md"
          >
            + Eintrag
          </button>
        </div>

        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="p-5 border border-slate-100 rounded-[2rem] bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
                  <Droplets size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{log.date}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={12} /> {log.location}
                  </p>
                </div>
              </div>
              <button onClick={() => setLogs(logs.filter(l => l.id !== log.id))} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-20 text-slate-300 italic">Noch keine Wäschen geloggt.</div>
          )}
        </div>
      </main>

      {/* MODAL FÜR NEUEN EINTRAG (Overlay) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Nachtragen</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Datum der Wäsche</label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Ort</label>
                <input 
                  type="text" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Z.B. Hamburg, Fitnessstudio..."
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors mt-2"
              >
                Speichern
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;