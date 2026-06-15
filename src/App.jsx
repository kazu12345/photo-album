import React, { useState, useEffect, useRef } from 'react';

export default function PhotoAlbumSmartphone() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const hideControlsTimerRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(imageUrls);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && images.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 10000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, images.length]);

  const handleScreenTap = () => {
    setShowControls(!showControls);

    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    if (!showControls) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  };

  const goNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
    setShowControls(true);
  };

  const goPrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setShowControls(true);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  if (images.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        gap: '2rem',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '500',
          color: '#333',
          textAlign: 'center'
        }}>
          写真を選んでください
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '1.5rem 3rem',
            fontSize: '20px',
            fontWeight: '500',
            backgroundColor: '#378ADD',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            minHeight: '80px',
            minWidth: '280px'
          }}
        >
          ファイルを選択
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div
      onClick={handleScreenTap}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#000',
        position: 'relative'
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        overflow: 'hidden'
      }}>
        <img
          src={currentImage.url}
          alt={`写真 ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '1rem',
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
          transition: 'opacity 0.3s ease',
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '500'
          }}>
            {currentIndex + 1} / {images.length}
          </div>
          <div style={{
            fontSize: '14px',
            opacity: 0.8
          }}>
            {isPlaying ? '▶ 再生中' : '⏸ 停止中'}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            style={{
              padding: '1.25rem 1rem',
              fontSize: '18px',
              fontWeight: '500',
              backgroundColor: '#378ADD',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minHeight: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            ← 戻る
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            style={{
              padding: '1.25rem 1rem',
              fontSize: '18px',
              fontWeight: '500',
              backgroundColor: '#378ADD',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minHeight: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            進む →
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlayback();
          }}
          style={{
            padding: '1.25rem 1rem',
            fontSize: '18px',
            fontWeight: '500',
            backgroundColor: isPlaying ? '#E24B4A' : '#378ADD',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%'
          }}
        >
          {isPlaying ? '⏸ 一時停止' : '▶ 再生'}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          style={{
            padding: '1rem',
            fontSize: '16px',
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '0.5px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '56px'
          }}
        >
          📁 別の写真を選択
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}