import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Radar, Target, Cpu, Database, Zap, AlertTriangle, Ship, Activity } from 'lucide-react';
import ImageViewer from './ImageViewer';

const ImageUploadProcessor = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [detectionResults, setDetectionResults] = useState({});
  const [backendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'); 

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const imageId = Date.now() + Math.random();
      
      if (file.size > 50 * 1024 * 1024) {
        setUploadProgress(prev => ({ ...prev, [imageId]: 0 }));
      }

      let imageSrc;
      if (file.size > 10 * 1024 * 1024) {
        imageSrc = URL.createObjectURL(file);
        
        const imageData = {
          id: imageId,
          name: file.name,
          size: file.size,
          src: imageSrc,
          file: file,
          processed: false,
          detectionResults: null,
          uploadTime: new Date().toISOString()
        };
        
        setUploadedImages(prev => [...prev, imageData]);
        setActiveImage(imageData);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[imageId];
          return newProgress;
        });
      } else {
        const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(prev => ({ ...prev, [imageId]: progress }));
          }
        };
        
        reader.onload = () => {
          const imageData = {
            id: imageId,
            name: file.name,
            size: file.size,
            src: reader.result,
            file: file,
            processed: false,
            detectionResults: null,
            uploadTime: new Date().toISOString()
          };
          setUploadedImages(prev => [...prev, imageData]);
          setActiveImage(imageData);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[imageId];
            return newProgress;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tiff', '.webp']
    },
    multiple: true,
    maxSize: 500 * 1024 * 1024
  });

  const processImage = async (imageId) => {

    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;

    setProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', image.file);

      console.log(`🔄 Sending image to backend: ${backendUrl}/detect`);
      
      const response = await fetch(`${backendUrl}/detect`, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'any' 
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      console.log(' Detection results:', results);

      const transformedResults = {
        status: results.status,
        filename: results.filename,
        objects_detected: results.num_detections,
        max_confidence: results.detections.length > 0 
          ? Math.max(...results.detections.map(d => d.confidence))
          : 0,
        processing_time: '0.5', 
        detections: results.detections.map(detection => ({
          bbox: detection.bbox,
          confidence: detection.confidence,
          class_id: detection.class_id,
          class_name: detection.class_name
        })),
        image_size: results.image_size
      };

      setUploadedImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { 
                ...img, 
                processed: true, 
                detectionResults: transformedResults,
                processedTime: new Date().toISOString() 
              }
            : img
        )
      );

      setDetectionResults(prev => ({
        ...prev,
        [imageId]: transformedResults
      }));

    } catch (error) {
      console.error(' Error processing image:', error);
      alert(`Error processing image: ${error.message}`);
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

  React.useEffect(() => {
    return () => {
      uploadedImages.forEach(image => {
        if (image.src.startsWith('blob:')) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, [uploadedImages]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-600/40 shadow-2xl p-6 relative">
     
      <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-gray-500/60"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-gray-500/60"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-gray-500/60"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-gray-500/60"></div>

      <div className="relative z-10">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">
            SAR Ship Detection System
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse bg-green-500"></div>
            <span className="text-gray-400 font-mono text-xs uppercase">
              Backend Connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
          <div className="lg:col-span-1">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed ${
                isDragActive ? 'border-white/60' : 'border-gray-600/60'
              } p-8 text-center cursor-pointer transition-all duration-200 hover:border-gray-400/80`}
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
                Click Process to detect ships
              </p>
              {Object.keys(uploadProgress).length > 0 && (
                <div className="mt-4">
                  <p className="text-yellow-400 font-mono text-xs mb-2">Processing large file...</p>
                  {Object.entries(uploadProgress).map(([id, progress]) => (
                    <div key={id} className="bg-gray-800 h-2 mb-2">
                      <div 
                        className="bg-yellow-400 h-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            
            <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className={`border p-3 cursor-pointer transition-all duration-200 ${
                    activeImage?.id === image.id
                      ? 'border-white/60 bg-gray-800/50'
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
                      {image.detectionResults && (
                        <Ship className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      image.processed ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-500">
                    <p>Size: {formatFileSize(image.size)}</p>
                    <p>Time: {new Date(image.uploadTime).toLocaleTimeString()}</p>
                    {image.detectionResults && (
                      <p className="text-green-400">
                        Ships: {image.detectionResults.objects_detected}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeImage ? (
              <div className="bg-black/40 border border-gray-600/30 p-4">
            
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Target className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="text-white font-mono text-lg font-bold uppercase">
                        {activeImage.name}
                      </h3>
                      <p className="text-gray-400 font-mono text-xs">
                        {formatFileSize(activeImage.size)} • 
                        {new Date(activeImage.uploadTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {activeImage.processed && activeImage.detectionResults && (
                    <div className="flex items-center space-x-2 text-green-400 font-mono text-sm">
                      <Database className="w-4 h-4" />
                      <span>
                        {activeImage.detectionResults.objects_detected} SHIPS DETECTED
                      </span>
                    </div>
                  )}
                </div>

                {activeImage.detectionResults && (
                  <div className="mb-4 p-3 bg-green-900/20 border border-green-600/30">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-4">
                        <span className="text-green-400">
                          OBJECTS: {activeImage.detectionResults.objects_detected}
                        </span>
                        <span className="text-green-400">
                          MAX CONFIDENCE: {(activeImage.detectionResults.max_confidence * 100).toFixed(1)}%
                        </span>
                        <span className="text-green-400">
                          PROCESS TIME: {activeImage.detectionResults.processing_time}s
                        </span>
                      </div>
                      <div className="text-green-500">
                        MODEL: DEFORMABLE DETR
                      </div>
                    </div>
                  </div>
                )}

               
                <ImageViewer 
                  src={activeImage.src} 
                  detectionResults={activeImage.detectionResults}
                  onProcess={() => processImage(activeImage.id)}
                  processing={processing}
                />

           
                {processing && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span className="text-blue-400 font-mono text-sm uppercase">
                        Ship Detection in Progress...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-black/20 border border-gray-700/30 p-8 text-center h-64 flex items-center justify-center">
                <div>
                  <Ship className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 font-mono text-sm uppercase tracking-wide">
                    No Image Selected
                  </p>
                  <p className="text-gray-600 font-mono text-xs mt-1">
                    Upload SAR images and click Process to detect ships
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
            <span>IMAGES: {uploadedImages.length}</span>
            <span>ANALYZED: {uploadedImages.filter(img => img.processed).length}</span>
            <span>SHIPS FOUND: {uploadedImages.reduce((total, img) => total + (img.detectionResults?.objects_detected || 0), 0)}</span>
            <span>STATUS: {processing ? 'DETECTING' : 'READY'}</span>
          </div>
          <div className="text-gray-600 font-mono text-xs">
            {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadProcessor;
