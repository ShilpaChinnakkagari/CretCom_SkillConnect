import React, { useState, useEffect } from 'react';

const StoryViewer = ({ stories, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          goToNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md h-full max-h-[800px] bg-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ 
                  width: index < currentIndex ? '100%' : 
                         index === currentIndex ? `${progress}%` : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        <div className="w-full h-full flex items-center justify-center">
          {currentStory.type === 'VIDEO' ? (
            <video 
              src={currentStory.mediaUrl} 
              className="w-full h-full object-contain"
              controls
              autoPlay
              onEnded={goToNext}
            />
          ) : (
            <img 
              src={currentStory.mediaUrl || 'https://via.placeholder.com/400x600?text=Story'} 
              alt="Story" 
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {currentStory.caption && (
          <div className="absolute bottom-20 left-0 right-0 text-center text-white text-sm bg-black/50 py-2 px-4 mx-4 rounded-lg">
            {currentStory.caption}
          </div>
        )}

        <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer" onClick={goToPrevious} />
        <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer" onClick={goToNext} />

        <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs">
          {currentIndex + 1} / {stories.length}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;