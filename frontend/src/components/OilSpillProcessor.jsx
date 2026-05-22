import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Droplets, Activity, AlertTriangle } from 'lucide-react';

const OilSpillProcessor = ({ onActivityLog }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const imageId = Date.now() + Math.random();
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = {
          id: imageId,
          name: file.name,
          size: file.size,
          src: reader.result,
          file: file,
          processed: false,
          result: null,
          uploadTime: new Date().toISOString(),
        };
        setUploadedImages(prev => [...prev, imageData]);
        setActiveImage(imageData);
        if (onActivityLog) {
          onActivityLog(`Image uploaded — ${file.name}`, 'upload', 'SUCCESS');
        }
      };
      reader.readAsDataURL(file);
    });
  }, [onActivityLog]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.webp'] },
    multiple: true,
    maxSize: 50 * 1024 * 1024
  });

  const processImage = async (imageId) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', image.file);

      const response = await fetch(`${backendUrl}/detect/oilspill`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setUploadedImages(prev =>
        prev.map(img =>
          img.id === imageId
            ? { ...img, processed: true, result: result }
            : img
        )
      );
      setActiveImage(prev => prev?.id === imageId ? { ...prev, processed: true, result } : prev);

      if (onActivityLog) {
        onActivityLog(
          `Oil spill analysis — ${result.classification.replace('_', ' ')} (${(result.confidence * 100).toFixed(1)}%) in ${image.name}`,
          'analysis',
          'SUCCESS'
        );
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert(`Error: ${error.message}`);
      if (onActivityLog) {
        onActivityLog(`Oil spill analysis failed — ${error.message}`, 'analysis', 'ERROR');
      }
    } finally {
      setProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-6 relative mb-8">
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-gray-500/60"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-gray-500/60"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-gray-500/60"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-gray-500/60"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">
            SAR Oil Spill Detection System
          </h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${backendUrl ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-gray-400 font-mono text-xs uppercase">
              TransUNet Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Panel */}
          <div className="lg:col-span-1">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed ${isDragActive ? 'border-orange-400/60' : 'border-gray-600/60'
                } p-8 text-center cursor-pointer transition-all duration-200 hover:border-orange-400/80`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-mono text-sm mb-2 uppercase tracking-wide">
                {isDragActive ? 'Drop SAR Images Here' : 'Upload SAR Images'}
              </p>
              <p className="text-gray-500 font-mono text-xs">
                Support: JPEG, PNG, TIFF, WebP
              </p>
              <p className="text-gray-500 font-mono text-xs mt-1">
                Click Analyze to detect oil spills
              </p>
            </div>

            {/* Image List */}
            <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className={`border p-3 cursor-pointer transition-all duration-200 ${activeImage?.id === image.id
                    ? 'border-orange-400/60 bg-gray-800/50'
                    : 'border-gray-600/40 hover:border-gray-500/60'
                    }`}
                  onClick={() => setActiveImage(image)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-mono text-sm truncate max-w-24">
                        {image.name}
                      </span>
                      {image.result && (
                        <Droplets className={`w-3 h-3 ${image.result.classification === 'oil_spill' ? 'text-red-400' : 'text-green-400'}`} />
                      )}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${image.processed ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-500">
                    <p>Size: {formatFileSize(image.size)}</p>
                    {image.result && (
                      <p className={image.result.classification === 'oil_spill' ? 'text-red-400' : 'text-green-400'}>
                        {image.result.classification === 'oil_spill' ? 'OIL SPILL DETECTED' : 'CLEAR'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Display */}
          <div className="lg:col-span-2">
            {activeImage ? (
              <div className="bg-black/40 border border-gray-600/30 p-4">
                {/* Image Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Droplets className="w-5 h-5 text-orange-400" />
                    <div>
                      <h3 className="text-white font-mono text-lg font-bold uppercase">
                        {activeImage.name}
                      </h3>
                      <p className="text-gray-400 font-mono text-xs">
                        {formatFileSize(activeImage.size)} • {new Date(activeImage.uploadTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results Banner */}
                {activeImage.result && (
                  <div className={`mb-4 p-3 border ${activeImage.result.classification === 'oil_spill'
                    ? 'bg-teal-900/20 border-teal-600/30'
                    : 'bg-green-900/20 border-green-600/30'
                    }`}>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-4">
                        <span className={activeImage.result.classification === 'oil_spill' ? 'text-teal-400' : 'text-green-400'}>
                          RESULT: {activeImage.result.classification === 'oil_spill' ? 'OIL SPILL DETECTED' : '✓ NO OIL SPILL'}
                        </span>
                        <span className={activeImage.result.classification === 'oil_spill' ? 'text-teal-400' : 'text-green-400'}>
                          CONFIDENCE: {(activeImage.result.confidence * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-400">
                          TIME: {activeImage.result.processing_time}s
                        </span>
                      </div>
                      <div className={activeImage.result.classification === 'oil_spill' ? 'text-teal-500' : 'text-green-500'}>
                        MODEL: TRANSUNET
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Display */}
                {activeImage.result ? (
                  // Show original + overlay side by side
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative aspect-square md:aspect-auto md:h-80">
                      <div className="bg-black/20 border border-gray-600/30 p-2 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-2 flex-shrink-0">
                          <p className="text-gray-400 font-mono text-xs uppercase">Original SAR Image</p>
                          <button onClick={() => setShowMask(!showMask)} className="bg-gray-800 hover:bg-gray-700 text-xs px-2 py-1 text-gray-300 font-mono border border-gray-600 transition-colors">
                            {showMask ? 'Hide Mask' : 'Show Mask'}
                          </button>
                        </div>
                        <div className="flex-1 overflow-hidden flex items-center justify-center">
                          <img
                            src={showMask ? `data:image/png;base64,${activeImage.result.mask_b64}` : activeImage.src}
                            alt="Original"
                            className="max-w-full max-h-full object-contain"
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative aspect-square md:aspect-auto md:h-80">
                      <div className="bg-black/20 border border-gray-600/30 p-2 h-full flex flex-col">
                        <div className="flex justify-center items-center mb-2 flex-shrink-0 min-h-[26px]">
                          <p className={`font-mono text-xs uppercase text-center ${activeImage.result.classification === 'oil_spill' ? 'text-teal-400' : 'text-green-400'}`}>
                            Oil Spill Visualization
                          </p>
                        </div>
                        <div className="flex-1 overflow-hidden flex items-center justify-center">
                          <img
                            src={`data:image/png;base64,${activeImage.result.overlay_b64}`}
                            alt="Oil Spill Overlay"
                            className="max-w-full max-h-full object-contain"
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show just the original
                  <div className="relative bg-black/20 border border-gray-600/30 p-4 flex items-center justify-center">
                    <img
                      src={activeImage.src}
                      alt="SAR Image"
                      className="max-w-full max-h-96 object-contain"
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                    {!activeImage.processed && (
                      <div className="absolute bottom-2 right-2 z-20">
                        <button
                          onClick={() => processImage(activeImage.id)}
                          disabled={processing}
                          className="bg-orange-600 hover:bg-orange-500 border border-orange-500 text-white font-mono font-semibold py-2 px-4 transition-all duration-200 disabled:bg-gray-700 disabled:text-gray-300 disabled:border-gray-600 tracking-wide uppercase text-sm"
                        >
                          {processing ? 'Analyzing...' : 'Analyze Image'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Processing indicator */}
                {processing && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="text-orange-400 font-mono text-sm uppercase">
                        Oil Spill Analysis in Progress...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-black/20 border border-gray-700/30 p-8 text-center h-64 flex items-center justify-center">
                <div>
                  <Droplets className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 font-mono text-sm uppercase tracking-wide">
                    No Image Selected
                  </p>
                  <p className="text-gray-600 font-mono text-xs mt-1">
                    Upload SAR images and click Analyze to detect oil spills
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer stats */}
        <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
            <span>IMAGES: {uploadedImages.length}</span>
            <span>ANALYZED: {uploadedImages.filter(img => img.processed).length}</span>
            <span>OIL DETECTED: {uploadedImages.filter(img => img.result?.classification === 'oil_spill').length}</span>
            <span>STATUS: {processing ? 'ANALYZING' : 'READY'}</span>
          </div>
          <div className="text-gray-600 font-mono text-xs">
            {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
          </div>
        </div>
      </div>
    </div>
  );
};

export default OilSpillProcessor;
