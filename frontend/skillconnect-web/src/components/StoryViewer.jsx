import React, { useState, useEffect, useRef } from 'react';

const StoryViewer = ({ 
  stories = [], 
  initialIndex = 0, 
  onClose, 
  onStoryEnd,
  onDeleteStory,
  currentUserId
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const progressInterval = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const currentStory = stories && stories.length > 0 ? stories[currentIndex] : null;

  const isOwnStory = currentStory && currentStory.contractorId === currentUserId;

  useEffect(() => {
    setProgress(0);
    setShowDeleteConfirm(false);
    setIsDeleting(false);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!currentStory || isDeleting) return;

    if (isPaused) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      return;
    }

    const startTime = Date.now();
    const duration = 5000;

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
        if (currentIndex < stories.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          if (onStoryEnd) onStoryEnd();
          else onClose();
        }
      }
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [currentIndex, isPaused, currentStory, stories.length, isDeleting]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(!isPaused);
      } else if (e.key === 'Delete' || e.key === 'd') {
        e.preventDefault();
        if (isOwnStory && !isDeleting) {
          handleDeleteClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stories.length, isPaused, isOwnStory, isDeleting]);

  const goToNext = () => {
    if (isDeleting) return;
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (onStoryEnd) onStoryEnd();
      else onClose();
    }
  };

  const goToPrev = () => {
    if (isDeleting) return;
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDeleteClick = () => {
    if (isDeleting) return;
    setShowDeleteConfirm(true);
    setIsPaused(true);
  };

  const confirmDelete = async () => {
    if (isDeleting || !onDeleteStory || !currentStory) return;
    
    setIsDeleting(true);
    const storyId = currentStory.id;
    
    try {
      // ✅ Delete the story
      await onDeleteStory(storyId);
      
      // ✅ Close the viewer immediately after deletion
      setShowDeleteConfirm(false);
      onClose();
      
    } catch (error) {
      console.error('Error deleting story:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setIsPaused(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setIsPaused(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);
    
    if (Math.abs(diffX) > 50 && diffY < 100) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    
    setIsPaused(false);
  };

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);

  const handleLeftClick = (e) => {
    e.stopPropagation();
    goToPrev();
  };

  const handleRightClick = (e) => {
    e.stopPropagation();
    goToNext();
  };

  if (!currentStory || !stories || stories.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition z-20"
      >
        ✕
      </button>

      {isOwnStory && onDeleteStory && !isDeleting && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-16 text-red-500 hover:text-red-400 text-2xl transition z-20 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
          title="Delete this story"
        >
          🗑️
        </button>
      )}

      <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
        {stories.map((_, index) => (
          <div 
            key={index}
            className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: index < currentIndex ? '100%' : 
                       index === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-lg mx-auto h-screen max-h-[80vh]">
        <div className="w-full h-full bg-black rounded-lg overflow-hidden">
          {currentStory.type === 'VIDEO' ? (
            <video 
              src={currentStory.mediaUrl} 
              className="w-full h-full object-contain"
              controls={isPaused}
              autoPlay
              playsInline
              muted
            />
          ) : (
            <img 
              src={currentStory.mediaUrl} 
              alt={currentStory.caption || 'Story'} 
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-purple-500">
              {currentStory.contractorProfilePhoto ? (
                <img 
                  src={currentStory.contractorProfilePhoto} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xl">👤</div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                {currentStory.contractorName || 'Unknown'}
              </p>
              <p className="text-gray-300 text-xs">
                {new Date(currentStory.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            {stories.length > 1 && (
              <span className="text-white/50 text-xs">
                {currentIndex + 1}/{stories.length}
              </span>
            )}
          </div>
          {currentStory.caption && (
            <p className="text-white text-sm mt-2">{currentStory.caption}</p>
          )}
        </div>
      </div>

      <div 
        className="absolute top-0 left-0 w-1/3 h-full z-10 cursor-pointer"
        onClick={handleLeftClick}
      />
      <div 
        className="absolute top-0 right-0 w-1/3 h-full z-10 cursor-pointer"
        onClick={handleRightClick}
      />

      {isPaused && !showDeleteConfirm && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-6xl z-20">
          ⏸
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70">
          <div 
            className="bg-[#161B22] rounded-2xl p-6 max-w-sm w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-bold mb-2">Delete Story?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure you want to delete this story? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;