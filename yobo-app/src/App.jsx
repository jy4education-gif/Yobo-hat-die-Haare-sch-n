import React, { useState, useEffect } from 'react';
import { MapPin, Droplets, Plus, Trash2, X, RotateCcw } from 'lucide-react';

const App = () => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('yobo-hair-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLocation, setNewLocation] = useState('Zuhause');

  const suggestedLocations = [...new Set(logs.map(log => log.location))];

  useEffect(() => {
    localStorage.setItem('yobo-hair-logs', JSON.stringify(logs));
  }, [logs]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!newLocation || !newDate) return;

    const dateObj = new Date(newDate);
    const formattedDate = dateObj.toLocaleDateString('de-DE');

    const entry = {
      id: Date.now(),
      date: formattedDate,
      rawDate: newDate,
      location: newLocation,
      action: 'Hauptwäsche'
    };

    const updatedLogs = [entry, ...logs].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    setLogs(updatedLogs);
    setShowModal(false);
    setNewLocation('Zuhause');
  };

  // NEU: Funktion zum Löschen des aktuellsten Eintrags
  const handleDeleteLatest = () => {
    if (logs.length === 0) return;
    
    if (confirm("Möchtest du den aktuellsten Eintrag wirklich löschen?")) {
      const updatedLogs = [...logs];
      updatedLogs.shift(); // Entfernt das erste Element (den neuesten Eintrag)
      setLogs(updatedLogs);
    }
  };

  const deleteIndividual = (id) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-2xl relative">
      <header className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-[3rem] shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Yobo Hair-Log ✨</h1>
        <p className="opacity-80 text-sm italic">Dein persönliches Haar-Tagebuch</p>
      </header>

      <main className="p-6 flex-grow mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Verlauf</h2>
          
          {/* NEU: Button-Gruppe oben rechts */}
          <div className="flex gap-2">
            {logs.length > 0 && (
              <button 
                onClick={handleDeleteLatest}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-full font-bold text-xs hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-sm flex items-center gap-1 border border-red-100"
              >
                <RotateCcw size={14} /> Letzten löschen
              </button>
            )}
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-indigo-700 transition-all transform active:scale-95 shadow-md"
            >
              + Eintrag
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="p-5 border border-slate-100 rounded-[2rem] bg-white flex items-center justify-between shadow-sm animate-in slide-in-from-top-2 duration-300">
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
              <button onClick={() => deleteIndividual(log.id)} className="text-slate-200 hover:text-red-500 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-20 text-slate-300 italic text-sm">Noch keine Wäschen geloggt.</div>
          )}
        </div>
      </main>

      {/* MODAL (Eingabemaske) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Nachtragen</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Datum</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Ort</label>
                <input type="text" list="location-suggestions" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" />
                <datalist id="location-suggestions">
                  {suggestedLocations.map((loc, i) => <option key={i} value={loc} />)}
                </datalist>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors">Speichern</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;