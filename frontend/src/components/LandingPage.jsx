import { Link } from 'react-router-dom';
import { Satellite, Radar, Target, ArrowRight, Shield, Signal, Database, Ship, Droplets, Radio } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/bg.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-black/85"></div>
      </div>

      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Radar animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-gray-700/15 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-gray-600/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-gray-500/8 rounded-full"></div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-48 bg-gradient-to-t from-transparent via-white/20 to-transparent origin-bottom -translate-x-1/2 animate-spin opacity-30" style={{ animationDuration: '20s' }}></div>
        </div>
      </div>

      <div className="relative z-10">
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
                <Link
                  to="/sign-in"
                  className="text-gray-400 hover:text-white transition-colors duration-200 font-mono text-sm tracking-wide uppercase"
                >
                  Access System
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-mono font-semibold py-2 px-4 transition-all duration-200 shadow-lg hover:shadow-xl tracking-wide uppercase text-sm"
                >
                  Initialize
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-900/80 border border-gray-600/40 flex items-center justify-center shadow-2xl">
                  <Satellite className="w-12 h-12 text-gray-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 -left-1">
                  <Target className="w-6 h-6 text-gray-400 animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-mono tracking-[0.1em] uppercase">
              TRINETRA
              <span className="block text-gray-400 text-3xl md:text-4xl mt-2">
                SAR Maritime Surveillance
              </span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto font-mono leading-relaxed">
              SYNTHETIC APERTURE RADAR ANALYSIS PLATFORM
              <br />
              <span className="text-gray-500 text-sm tracking-wider">
                SHIP DETECTION • OIL SPILL ANALYSIS • REAL-TIME PROCESSING
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/sign-up"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-mono font-semibold py-4 px-8 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 tracking-wide uppercase"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/sign-in"
                className="bg-black/40 backdrop-blur-sm border border-gray-600/40 text-white font-mono font-semibold py-4 px-8 hover:bg-gray-800/40 transition-all duration-200 tracking-wide uppercase"
              >
                System Login
              </Link>
            </div>
          </div>

          {/* Two Feature Divs — Ship Detection & Oil Spill */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Ship Detection */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-8 text-center hover:border-gray-500/60 transition-all duration-300">
              <div className="w-20 h-20 bg-black/40 border border-gray-600/30 flex items-center justify-center mx-auto mb-6">
                <Ship className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-mono uppercase tracking-wide">Ship Detection</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4">
                Detect and locate ships in SAR imagery using Deformable DETR object detection model with bounding box annotations.
              </p>
              <div className="text-gray-500 font-mono text-xs space-y-1">
                <p>MODEL: DEFORMABLE DETR</p>
                <p>OUTPUT: BOUNDING BOXES + CONFIDENCE</p>
              </div>
            </div>

            {/* Oil Spill Detection */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-8 text-center hover:border-gray-500/60 transition-all duration-300">
              <div className="w-20 h-20 bg-black/40 border border-gray-600/30 flex items-center justify-center mx-auto mb-6">
                <Droplets className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-mono uppercase tracking-wide">Oil Spill Detection</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4">
                Identify oil spill regions in SAR imagery using TransUNet segmentation with color-contrast visualization.
              </p>
              <div className="text-gray-500 font-mono text-xs space-y-1">
                <p>MODEL: TransUNet</p>
                <p>OUTPUT: SEGMENTATION MASK + OVERLAY</p>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-black/40 border border-gray-600/30 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-mono uppercase tracking-wide">Secure Access</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                MULTI-FACTOR AUTHENTICATION WITH CLERK INTEGRATION.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-black/40 border border-gray-600/30 flex items-center justify-center mx-auto mb-6">
                <Signal className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-mono uppercase tracking-wide">Real-time Analysis</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                GPU-ACCELERATED INFERENCE WITH CUDA SUPPORT.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-black/40 border border-gray-600/30 flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-mono uppercase tracking-wide">Session Tracking</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                REAL-TIME ACTIVITY LOGS AND SESSION STATISTICS.
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-16 bg-gray-900/50 border border-gray-600/40 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 font-mono text-xs uppercase tracking-wide">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400 font-mono text-xs">X-Band: 9.6 GHz</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Radar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400 font-mono text-xs">Models: 2 Active</span>
                </div>
              </div>
              <div className="text-gray-500 font-mono text-xs">
                {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
              </div>
            </div>
          </div>

          {/* Footer text */}
          <div className="text-center mt-12">
            <p className="text-gray-600 text-xs font-mono tracking-wide">
              TRINETRA — SAR MARITIME SURVEILLANCE SYSTEM
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
