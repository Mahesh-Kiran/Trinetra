import React, { useState, useEffect, useRef } from 'react';

const ImageViewer = ({ src, detectionResults = null, onProcess, processing = false }) => {
  const [dimensions, setDimensions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [imageDisplayDimensions, setImageDisplayDimensions] = useState(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const imgElementRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      setLoading(false);
    };
    
    img.onerror = () => {
      setError("Failed to load image");
      setLoading(false);
    };
    
    img.src = src;
    imageRef.current = img;
    
    return () => {
      if (imageRef.current) {
        imageRef.current = null;
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    if (!imgElementRef.current || !containerRef.current || !dimensions) return;

    const imgElement = imgElementRef.current;
    const imgRect = imgElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const scaleX = imgElement.clientWidth / dimensions.width;
    const scaleY = imgElement.clientHeight / dimensions.height;
    
    const offsetX = imgRect.left - containerRect.left;
    const offsetY = imgRect.top - containerRect.top;
    
    setImageDisplayDimensions({
      width: imgElement.clientWidth,
      height: imgElement.clientHeight,
      offsetX: offsetX,
      offsetY: offsetY,
      scaleX: scaleX,
      scaleY: scaleY
    });
  };

  useEffect(() => {
    if (imgElementRef.current && dimensions) {
      const timer = setTimeout(() => {
        handleImageLoad();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [dimensions, detectionResults]);

  useEffect(() => {
    if (detectionResults) {
      setShowBoundingBoxes(true);
    }
  }, [detectionResults]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-black/20 border border-gray-700/30">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono text-sm uppercase">Loading Image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-red-900/20 border border-red-600/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <p className="text-red-400 font-mono text-sm mb-2">Error Loading SAR Image</p>
          <p className="text-red-300 font-mono text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-gray-800/30 border border-gray-600/30">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              RESOLUTION: {dimensions?.width?.toLocaleString()} × {dimensions?.height?.toLocaleString()}
            </span>
            <span className="text-gray-400">
              TYPE: STANDARD
            </span>
            {detectionResults && (
              <span className="text-green-400">
                DETECTIONS: {detectionResults.num_detections}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {detectionResults && (
              <button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className="text-green-400 hover:text-green-300 transition-colors font-mono text-xs uppercase"
              >
                {showBoundingBoxes ? 'Hide' : 'Show'} Boxes
              </button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-400">DIRECT VIEW</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative bg-black/20 border border-gray-600/30 p-4 flex items-center justify-center overflow-hidden"
      >
        <img 
          ref={imgElementRef}
          src={src} 
          alt="SAR Image" 
          className="max-w-full max-h-96 object-contain"
          style={{ imageRendering: 'crisp-edges' }}
          onLoad={handleImageLoad}
        />
        
        {detectionResults && showBoundingBoxes && imageDisplayDimensions && (
          <div className="absolute inset-0 pointer-events-none">
            {detectionResults.detections.map((detection, index) => {
              const [x1, y1, x2, y2] = detection.bbox;
              
              const bboxWidth = x2 - x1;
              const bboxHeight = y2 - y1;
              
              const scaledX = x1 * imageDisplayDimensions.scaleX;
              const scaledY = y1 * imageDisplayDimensions.scaleY;
              const scaledWidth = bboxWidth * imageDisplayDimensions.scaleX;
              const scaledHeight = bboxHeight * imageDisplayDimensions.scaleY;
              
              const left = imageDisplayDimensions.offsetX + scaledX;
              const top = imageDisplayDimensions.offsetY + scaledY;
              
              return (
                <div
                  key={index}
                  className="absolute border-2 border-green-400 bg-green-400/20"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    zIndex: 10
                  }}
                >
                  <div 
                    className="absolute bg-green-400 text-black px-2 py-1 text-xs font-mono whitespace-nowrap"
                    style={{
                      top: '-25px',
                      left: '0px'
                    }}
                  >
                    SHIP {index + 1} ({(detection.confidence * 100).toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 z-20">
          <button
            onClick={onProcess}
            disabled={processing}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-mono font-semibold py-2 px-4 transition-all duration-200 disabled:bg-gray-700 disabled:text-gray-300 disabled:border-gray-600 tracking-wide uppercase text-sm"
          >
            {processing ? 'Processing...' : 'Process Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;