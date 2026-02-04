
import React, { useState } from 'react';
import { gemini } from '../services/gemini';
import { Icons } from '../constants';

const MapSearch: React.FC = () => {
  const [query, setQuery] = useState('Find bookshops and quiet libraries near Catholic seminaries in Lagos.');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ text: string, links: any[] }>({ text: '', links: [] });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // For more accurate local results, we try to get user location
      let location = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {
        console.warn("Location permission denied, proceeding with general search.");
      }

      const result = await gemini.searchMaps(query, location);
      setResponse(result);
    } catch (err) {
      console.error(err);
      setResponse({ text: "Failed to fetch map data. Please try again.", links: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold serif text-slate-900">Seminary Map Services</h2>
        <p className="text-slate-500">Discover essential services, bookshops, and spiritual sites around you.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
            <button
              disabled={loading}
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icons.Map /> {loading ? 'Searching...' : 'Search Local'}
            </button>
          </div>
        </div>

        <div className="p-8">
          {response.text ? (
            <div className="space-y-6">
              <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                {response.text}
              </div>
              
              {response.links.length > 0 && (
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Verified Sources & Locations</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {response.links.map((chunk, idx) => {
                      const mapsInfo = chunk.maps;
                      if (!mapsInfo) return null;
                      return (
                        <a 
                          key={idx}
                          href={mapsInfo.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                        >
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                             <Icons.Map />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{mapsInfo.title || 'Location details'}</p>
                            <p className="text-xs text-blue-600 font-semibold uppercase">View on Google Maps</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 opacity-40">
              <div className="flex justify-center mb-4 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2"/><path d="m13 17 2 3 5-7"/><path d="M10 14h2"/><path d="M8 14H6"/></svg>
              </div>
              <p className="serif text-xl italic">Search for academic or spiritual landmarks nearby.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setQuery("Find Catholic bookshops near the seminary.")}>
          <h4 className="font-bold text-sm mb-1 text-slate-800">Academic Supplies</h4>
          <p className="text-xs text-slate-500">Find bookshops and stationery nearby.</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setQuery("Quiet parks or shrines within 5km for reflection.")}>
          <h4 className="font-bold text-sm mb-1 text-slate-800">Reflection Sites</h4>
          <p className="text-xs text-slate-500">Parks and shrines for meditation.</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setQuery("Health clinics and pharmacies in this area.")}>
          <h4 className="font-bold text-sm mb-1 text-slate-800">Health Services</h4>
          <p className="text-xs text-slate-500">Clinics and local pharmacies.</p>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
