import React, { useState, useEffect } from 'react';
import { MapPin, Droplets, Plus, Trash2, X, CheckCircle2, Circle } from 'lucide-react';

const App = () => {
  // 1. Initiales Laden & Sofortiges Sortieren (Neueste zuerst)
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('yobo-hair-logs');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  });

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLocation, setNewLocation] = useState('Zuhause');

  const suggestedLocations = [...new Set(logs.map(log => log.location))];

  useEffect(() => {
    localStorage.setItem('yobo-hair-logs', JSON.stringify(logs));
  }, [logs]);

  // 2. Logik zum Hinzufügen mit Re-Sortierung
  const handleSave = (e) => {
    e.preventDefault();
    if (!newLocation || !newDate) return;

    const entry = {
      id: Date.now(),
      date: new Date(newDate).toLocaleDateString('de-DE'),
      rawDate: newDate, // technisches Format für präzise Sortierung
      location: newLocation,
      action: 'Hauptwäsche'
    };

    // Bestehende Logs + Neuer Eintrag -> Sortieren
    const updatedLogs = [...logs, entry].sort((a, b) => 
      new Date(b.rawDate) - new Date(a.rawDate)
    );
    
    setLogs(updatedLogs);
    setShowModal(false);
    setNewLocation('Zuhause');
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedIds([]);
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    if (confirm(`${selectedIds.length} Eintrag/Einträge löschen?`)) {
      setLogs(logs.filter(log => !selectedIds.includes(log.id)));
      setSelectedIds([]);
      setIsSelectMode(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-2xl relative">
      <header className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-[3rem] shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight text-center">Yobo Hair-Log ✨</h1>
      </header>

      <main className="p-6 flex-grow mb-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            {isSelectMode ? 'Auswählen' : 'Chronik'}
          </h2>
          
          <div className="flex gap-2">
            {logs.length > 0 && (
              <button 
                onClick={toggleSelectMode}
                className={`px-4 py-2 rounded-full font-bold text-xs transition-all border ${
                  isSelectMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border-slate-200 shadow-sm'
                }`}
              >
                {isSelectMode ? 'Abbrechen' : 'Bearbeiten'}
              </button>
            )}
            {!isSelectMode && (
              <button 
                onClick={() => setShowModal(true)} 
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                + Eintrag
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {logs.map(log => (
            <div 
              key={log.id} 
              onClick={() => isSelectMode && toggleSelection(log.id)}
              className={`p-5 border rounded-[2rem] flex items-center justify-between transition-all duration-300 ${
                selectedIds.includes(log.id) 
                ? 'bg-red-50 border-red-200 ring-2 ring-red-100' 
                : 'bg-white border-slate-100 shadow-sm'
              } ${isSelectMode ? 'cursor-pointer active:scale-95' : ''}`}
            >
              <div className="flex items-center gap-4">
                {isSelectMode && (
                  <div className="text-red-500 transition-all scale-110">
                    {selectedIds.includes(log.id) ? <CheckCircle2 size={24} fill="currentColor" className="text-white fill-red-500" /> : <Circle size={24} className="text-slate-200" />}
                  </div>
                )}
                <div className={`p-3 rounded-2xl ${selectedIds.includes(log.id) ? 'bg-white text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  <Droplets size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{log.date}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={12} /> {log.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-20 text-slate-300 italic text-sm">Keine Einträge vorhanden.</div>
          )}
        </div>
      </main>

      {isSelectMode && selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 animate-in slide-in-from-bottom-10">
          <button 
            onClick={deleteSelected}
            className="w-full bg-red-600 text-white py-4 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-2 hover:bg-red-700"
          >
            <Trash2 size={20} />
            {selectedIds.length} löschen
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Nachtragen</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400"><X /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <input 
                type="date" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" 
              />
              <input 
                type="text" 
                list="location-suggestions" 
                value={newLocation} 
                onChange={(e) => setNewLocation(e.target.value)} 
                placeholder="Ort" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" 
              />
              <datalist id="location-suggestions">
                {suggestedLocations.map((loc, i) => <option key={i} value={loc} />)}
              </datalist>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg">Speichern</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;