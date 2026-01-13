import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Droplets, Plus, Trash2, X, CheckCircle2, Circle, ArrowUp, ArrowDown, SortAsc, SortDesc } from 'lucide-react';

const App = () => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('yobo-hair-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLocation, setNewLocation] = useState('');

  // --- SMART INTELLIGENCE: HÄUFIGKEIT BERECHNEN ---
  const locationStats = useMemo(() => {
    if (logs.length === 0) return { favorite: 'Zuhause', topList: [] };
    
    const counts = logs.reduce((acc, log) => {
      acc[log.location] = (acc[log.location] || 0) + 1;
      return acc;
    }, {});

    // Sortiere alle Orte nach Häufigkeit (meiste zuerst)
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return { 
      favorite: sorted[0], 
      topList: sorted.slice(0, 5) // Zeige die Top 5 als Schnellwahl
    };
  }, [logs]);

  // Automatisches Vorbelegen des häufigsten Ortes
  useEffect(() => {
    if (showModal) setNewLocation(locationStats.favorite);
  }, [showModal, locationStats]);

  useEffect(() => {
    localStorage.setItem('yobo-hair-logs', JSON.stringify(logs));
  }, [logs]);

  // Dynamische Sortierung der Hauptliste
  const sortedLogs = useMemo(() => {
    let items = [...logs];
    items.sort((a, b) => {
      let valA = sortConfig.key === 'date' ? new Date(a.rawDate) : a.location.toLowerCase();
      let valB = sortConfig.key === 'date' ? new Date(b.rawDate) : b.location.toLowerCase();
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return items;
  }, [logs, sortConfig]);

  const handleSave = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: new Date(newDate).toLocaleDateString('de-DE'),
      rawDate: newDate,
      location: newLocation || 'Unbekannt'
    };
    setLogs([...logs, entry]);
    setShowModal(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-2xl relative font-sans">
      
      {/* HEADER */}
      <header className="p-6 bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-b-[2.5rem] shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-black tracking-tighter italic leading-tight max-w-[75%] drop-shadow-sm">
            Yobo hat die Haare schön ✨
          </h1>
          <button 
            onClick={() => { setIsSelectMode(!isSelectMode); setSelectedIds([]); }}
            className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase transition-all mt-1 ${isSelectMode ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}
          >
            {isSelectMode ? 'Abbrechen' : 'Bearbeiten'}
          </button>
        </div>

        <div className="flex gap-3 mt-2">
          <button 
            disabled={!isSelectMode || selectedIds.length === 0}
            onClick={() => { if(confirm("Löschen?")) { setLogs(logs.filter(l => !selectedIds.includes(l.id))); setSelectedIds([]); setIsSelectMode(false); } }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${isSelectMode && selectedIds.length > 0 ? 'bg-red-500 text-white scale-105' : 'bg-indigo-400/30 text-indigo-200 cursor-not-allowed'}`}
          >
            <Trash2 size={18} /> Löschen {selectedIds.length > 0 && `(${selectedIds.length})`}
          </button>
          <button onClick={() => setShowModal(true)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-50 transition-all active:scale-95">
            <Plus size={18} /> Eintrag
          </button>
        </div>
      </header>

      <main className="p-6 flex-grow overflow-y-auto">
        {/* SORTIER-CONTROLS */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setSortConfig({ key: 'date', direction: sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sortConfig.key === 'date' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-400 border-slate-200'}`}
          >
            Datum {sortConfig.key === 'date' && (sortConfig.direction === 'desc' ? <ArrowDown size={12}/> : <ArrowUp size={12}/>)}
          </button>
          <button 
            onClick={() => setSortConfig({ key: 'location', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sortConfig.key === 'location' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-400 border-slate-200'}`}
          >
            A-Z {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? <SortAsc size={12}/> : <SortDesc size={12}/>)}
          </button>
        </div>

        {/* LISTE */}
        <div className="space-y-3">
          {sortedLogs.map(log => (
            <div 
              key={log.id} 
              onClick={() => isSelectMode && setSelectedIds(prev => prev.includes(log.id) ? prev.filter(i => i !== log.id) : [...prev, log.id])}
              className={`p-4 border rounded-3xl flex items-center justify-between transition-all ${selectedIds.includes(log.id) ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : 'bg-white border-slate-100 shadow-sm'}`}
            >
              <div className="flex items-center gap-4 text-left">
                {isSelectMode && (selectedIds.includes(log.id) ? <CheckCircle2 size={20} className="text-red-500 animate-in zoom-in" /> : <Circle size={20} className="text-slate-200" />)}
                <div className={`p-2 rounded-xl ${selectedIds.includes(log.id) ? 'bg-white text-red-400' : 'bg-blue-50 text-blue-500'}`}>
                  <Droplets size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base leading-none">{log.date}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                    <MapPin size={10} /> {log.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL MIT SMART-CHIPS */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600"><X size={24}/></button>
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter">Neuer Log</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-indigo-500 uppercase mb-2 block ml-1">Datum</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-black text-indigo-500 uppercase mb-2 block ml-1">Ort</label>
                <input 
                  type="text" 
                  value={newLocation} 
                  onChange={(e) => setNewLocation(e.target.value)} 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 mb-2" 
                  placeholder="Wo?" 
                />
                
                {/* SMART QUICK-CHIPS */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <p className="w-full text-[9px] text-slate-400 font-bold uppercase mb-1">Häufigste Orte:</p>
                  {locationStats.topList.map((loc, i) => (
                    <button 
                      key={i} 
                      type="button"
                      onClick={() => setNewLocation(loc)}
                      className={`text-[10px] px-3 py-1.5 rounded-full font-bold border transition-all ${newLocation === loc ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95">SPEICHERN</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;