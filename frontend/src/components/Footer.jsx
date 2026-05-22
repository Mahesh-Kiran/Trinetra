import { Satellite, Radio, Target, Shield, Radar, Signal, Database } from 'lucide-react';

const SarFooter = () => {
  return (
    <footer className="bg-black border-t border-gray-600/40 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gray-900/80 border border-gray-600/40 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-white font-mono tracking-wider uppercase">
                TRINETRA
              </h3>
            </div>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
              TRINETRA — SAR Maritime Surveillance System. 
              Ship detection and oil spill analysis platform.
            </p>
            
            {/* System Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 font-mono text-xs uppercase tracking-wide">System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                <span className="text-gray-400 font-mono text-xs uppercase tracking-wide">X-Band Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-700"></div>
                <span className="text-gray-400 font-mono text-xs uppercase tracking-wide">Signal Processing</span>
              </div>
            </div>
          </div>

          {/* System Operations */}
          <div>
            <h4 className="text-white font-mono font-bold uppercase tracking-wider text-sm mb-6 border-b border-gray-700 pb-2">
              System Operations
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm flex items-center space-x-2">
                  <Radar className="w-4 h-4" />
                  <span>Radar Control</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Target Acquisition</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Data Processing</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm flex items-center space-x-2">
                  <Signal className="w-4 h-4" />
                  <span>Signal Analysis</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-white font-mono font-bold uppercase tracking-wider text-sm mb-6 border-b border-gray-700 pb-2">
              Security Protocol
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Access Control</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm">
                  Authentication
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm">
                  Encryption Keys
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-mono text-sm">
                  Audit Logs
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Specifications */}
          <div>
            <h4 className="text-white font-mono font-bold uppercase tracking-wider text-sm mb-6 border-b border-gray-700 pb-2">
              Technical Specs
            </h4>
            <div className="space-y-3 text-gray-400 font-mono text-xs">
              <div>
                <span className="text-gray-500">Frequency:</span>
                <span className="text-white ml-2">9.6 GHz X-Band</span>
              </div>
              <div>
                <span className="text-gray-500">Polarization:</span>
                <span className="text-white ml-2">VV/VH/HH/HV</span>
              </div>
              <div>
                <span className="text-gray-500">Range:</span>
                <span className="text-white ml-2">450 km</span>
              </div>
              <div>
                <span className="text-gray-500">Resolution:</span>
                <span className="text-white ml-2">1.0m × 1.0m</span>
              </div>
              <div>
                <span className="text-gray-500">Coverage:</span>
                <span className="text-white ml-2">Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Left Side - Copyright */}
            <div className="flex items-center space-x-4">
              <div className="text-gray-500 font-mono text-xs">
                © 2025 TRINETRA Maritime Surveillance.
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="text-gray-600 font-mono text-xs uppercase">Authorized Access Only</span>
              </div>
            </div>

            {/* Center - System Time */}
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-gray-600" />
              <span className="text-gray-500 font-mono text-xs">
                {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
              </span>
            </div>

            {/* Right Side - Status */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-mono text-xs">STATUS:</span>
                <span className="text-green-400 font-mono text-xs font-bold">OPERATIONAL</span>
              </div>
              
              {/* Corner brackets indicator */}
              <div className="flex space-x-1">
                <div className="w-3 h-3 border-l border-t border-gray-600/60"></div>
                <div className="w-3 h-3 border-r border-t border-gray-600/60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-900/80 border-t border-gray-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center">
            <p className="text-gray-600 font-mono text-xs tracking-wide">
              WARNING: UNAUTHORIZED ACCESS TO THIS SYSTEM IS PROHIBITED AND WILL BE PROSECUTED TO THE FULL EXTENT OF THE LAW
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SarFooter;
