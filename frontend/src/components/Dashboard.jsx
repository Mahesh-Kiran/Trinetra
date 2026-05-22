import { UserButton, useUser } from '@clerk/clerk-react';
import { useState, useEffect, useCallback } from 'react';
import { Satellite, Radar, Activity, Target, Signal, Database, Cpu, Radio, Droplets, Ship, Moon, Sun } from 'lucide-react';
import ImageUploadProcessor from './Imageprocessor';
import OilSpillProcessor from './OilSpillProcessor';

const Dashboard = () => {
  const { user } = useUser();
  const [activityLog, setActivityLog] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    total_scans: 0,
    ships_detected: 0,
    oil_spills_detected: 0,
    data_processed_mb: 0,
  });
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('light-theme');
  };
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  // Fetch stats from backend periodically
  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, logRes] = await Promise.all([
        fetch(`${backendUrl}/session-stats`),
        fetch(`${backendUrl}/activity-log`)
      ]);
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setSessionStats(stats);
      }
      if (logRes.ok) {
        const logData = await logRes.json();
        setActivityLog(logData.log || []);
      }
    } catch (e) {
      // Backend not reachable — keep local state
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Local activity logger for non-backend events
  const addLocalActivity = useCallback((action, type, status) => {
    setActivityLog(prev => [{
      action,
      time: new Date().toISOString().slice(11, 19) + ' UTC',
      type,
      status
    }, ...prev].slice(0, 50));
    // Refresh stats from backend after a short delay
    setTimeout(fetchStats, 1000);
  }, [fetchStats]);

  const formatDataSize = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)}GB`;
    if (mb >= 1) return `${mb.toFixed(1)}MB`;
    return `${(mb * 1024).toFixed(0)}KB`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-600/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-900/80 border border-gray-600/40 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold text-white font-mono tracking-wider uppercase">TRINETRA</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => document.getElementById('ship-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white font-mono text-sm tracking-wide uppercase">Ship Detection</button>
              <button onClick={() => document.getElementById('oil-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white font-mono text-sm tracking-wide uppercase">Oil Spill</button>
              <span className="text-gray-400 font-mono text-sm tracking-wide ml-4">
                OPERATOR: {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'UNKNOWN'}
              </span>
              <button onClick={toggleTheme} className="text-gray-400 hover:text-white p-2 border border-gray-600/40 rounded-full transition-colors ml-4 mr-2" aria-label="Toggle Theme">
                {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 border border-gray-600/40",
                    userButtonPopoverCard: "bg-gray-900/90 backdrop-blur-xl border border-gray-600/40 shadow-2xl",
                    userButtonPopoverActionButton: "text-white hover:bg-gray-800 font-mono text-sm",
                    userButtonPopoverActionButtonText: "text-white font-mono",
                    userButtonPopoverFooter: "bg-gray-800/50 border-t border-gray-600/30"
                  }
                }}
                afterSignOutUrl="/sign-in"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ship Detection */}
        <div id="ship-section" className="mb-12">
          <ImageUploadProcessor></ImageUploadProcessor>
        </div>

        {/* Oil Spill Detection */}
        <div id="oil-section" className="mb-12">
          <OilSpillProcessor onActivityLog={addLocalActivity} />
        </div>

        {/* System Status Bar */}
        <div className="mb-8 bg-gray-900/50 border border-gray-600/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 font-mono text-xs uppercase tracking-wide">SYSTEM ONLINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Signal className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 font-mono text-xs">SIGNAL: STRONG</span>
              </div>
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 font-mono text-xs">X-BAND: ACTIVE</span>
              </div>
            </div>
            <div className="text-gray-500 font-mono text-xs">
              {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
            </div>
          </div>
        </div>

        {/* Stats Cards — Real session data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono font-medium uppercase tracking-wide">TOTAL SCANS</p>
                <p className="text-3xl font-bold text-white font-mono">{sessionStats.total_scans}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">This session</p>
              </div>
              <div className="w-12 h-12 bg-black/40 border border-gray-600/30 flex items-center justify-center">
                <Radar className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono font-medium uppercase tracking-wide">SHIPS DETECTED</p>
                <p className="text-3xl font-bold text-white font-mono">{sessionStats.ships_detected}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">Deformable DETR</p>
              </div>
              <div className="w-12 h-12 bg-black/40 border border-gray-600/30 flex items-center justify-center">
                <Ship className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono font-medium uppercase tracking-wide">OIL SPILLS</p>
                <p className="text-3xl font-bold text-white font-mono">{sessionStats.oil_spills_detected}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">VisionTransformer</p>
              </div>
              <div className="w-12 h-12 bg-black/40 border border-gray-600/30 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono font-medium uppercase tracking-wide">DATA PROCESSED</p>
                <p className="text-3xl font-bold text-white font-mono">{formatDataSize(sessionStats.data_processed_mb)}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">Real-time analysis</p>
              </div>
              <div className="w-12 h-12 bg-black/40 border border-gray-600/30 flex items-center justify-center">
                <Database className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log — Real data */}
        <div className="mt-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider mb-6">SYSTEM ACTIVITY LOG</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {activityLog.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 font-mono text-sm">No activity yet — upload and analyze images to see logs</p>
                </div>
              ) : (
                activityLog.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-black/40 border border-gray-700/30">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${
                        item.type === 'scan' ? 'bg-green-500' :
                        item.type === 'analysis' ? 'bg-orange-500' :
                        item.type === 'upload' ? 'bg-blue-500' :
                        item.type === 'system' ? 'bg-purple-500' : 'bg-gray-400'
                      }`}></div>
                      {item.type === 'scan' && <Radar className="w-4 h-4 text-gray-500" />}
                      {item.type === 'analysis' && <Droplets className="w-4 h-4 text-gray-500" />}
                      {item.type === 'upload' && <Database className="w-4 h-4 text-gray-500" />}
                      {item.type === 'system' && <Cpu className="w-4 h-4 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-mono text-sm font-medium">{item.action}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-500 text-xs font-mono">{item.time}</p>
                        <span className={`text-xs font-mono px-2 py-1 border ${
                          item.status === 'SUCCESS' ? 'text-green-400 border-green-400/30' :
                          item.status === 'ERROR' ? 'text-red-400 border-red-400/30' :
                          item.status === 'PROCESSING' ? 'text-yellow-400 border-yellow-400/30' :
                          'text-gray-400 border-gray-400/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-8 mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-gray-500 animate-pulse" />
              <span className="text-gray-500 font-mono text-xs uppercase">Monitoring Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 font-mono text-xs uppercase">Models: Ship + Oil Spill</span>
            </div>
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 font-mono text-xs uppercase">Frequency: 9.6 GHz</span>
            </div>
          </div>
          <p className="text-gray-600 text-xs font-mono">
            TRINETRA — SAR MARITIME SURVEILLANCE SYSTEM
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
