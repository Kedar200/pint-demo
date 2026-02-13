import React, { useMemo, useState, useCallback } from 'react';
import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';
import CodeBlock from './components/CodeBlock';
import { simpleExampleCode, customExampleCode } from './exampleCode';
import { pinterestImages } from './demoData';
import './index.css';

const PAGE_SIZE = 20;

// Helper to generate consistent mock data
const generateMockData = (images) => {
  const titles = [
    "Minimalist Interior Design", "Urban Photography", "Healthy Breakfast Ideas",
    "Travel Destinations 2024", "DIY Home Decor", "Abstract Art Inspiration",
    "Summer Fashion Trends", "Modern Architecture", "Nature Landscapes",
    "Creative Workspace Setup", "Digital Art Showcase", "Vintage aesthetics"
  ];

  const users = [
    { name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=1" },
    { name: "Creative Studio", avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Design Daily", avatar: "https://i.pravatar.cc/150?u=3" },
    { name: "Alex Morgan", avatar: "https://i.pravatar.cc/150?u=4" },
    { name: "Visual Arts", avatar: "https://i.pravatar.cc/150?u=5" }
  ];

  return images.map((url, index) => ({
    id: `pin-${index}`,
    image: url,
    title: titles[index % titles.length],
    user: users[index % users.length],
    likes: Math.floor(Math.random() * 1000) + 100
  }));
};

// 1. Simple Example Component
const SimpleMasonry = ({ pins, onEndReached }) => {
  const renderItem = (pin) => (
    <div className="masonry-card simple-card">
       <div className="card-image-wrapper">
          <img 
            src={pin.image} 
            alt={pin.title}
            loading="lazy"
            className="card-image"
          />
       </div>
    </div>
  );

  return (
    <MasonryGrid
      items={pins}
      renderItem={renderItem}
      getItemSize={(pin) => getImageSize(pin.image)} 
      gap={20}
      minWidth={236}
      onEndReached={onEndReached}
      onEndReachedThreshold={500}
    />
  );
};

// 2. Custom Height Example Component
const CustomHeightMasonry = ({ pins, onEndReached }) => {
  const renderItem = (pin) => (
    <div className="masonry-card custom-card">
       <div className="card-image-wrapper">
          <img 
            src={pin.image} 
            alt={pin.title}
            loading="lazy"
            className="card-image"
          />
          <div className="card-overlay">
            <button className="save-btn">Save</button>
          </div>
       </div>
       <div className="card-content">
          <h3 className="card-title">{pin.title}</h3>
       </div>
    </div>
  );

  const getCustomItemSize = async (pin) => {
    const dimensions = await getImageSize(pin.image);
    const footerHeight = 40;
    return {
      width: dimensions.width,
      height: dimensions.height + (footerHeight * (dimensions.width / 236)) 
    };
  };

  return (
    <MasonryGrid
      items={pins}
      renderItem={renderItem}
      getItemSize={getCustomItemSize} 
      gap={20}
      minWidth={236}
      onEndReached={onEndReached}
      onEndReachedThreshold={500}
    />
  );
};

function App() {
  const allPins = useMemo(() => generateMockData(pinterestImages), []);
  const [mode, setMode] = useState('simple');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Load next batch when scrolled near the end
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allPins.length));
  }, [allPins.length]);

  // Slice the pins to only show the current page
  const visiblePins = useMemo(() => allPins.slice(0, visibleCount), [allPins, visibleCount]);

  // Reset visible count when switching modes
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setVisibleCount(PAGE_SIZE);
  }, []);

  return (
    <div className="app">
        <div className="header">
            <div className="header-title">Pint<span className="highlight">Demo</span></div>
            <div className="header-links">
                <button 
                  className={`header-btn ${mode === 'simple' ? 'active' : ''}`} 
                  onClick={() => handleModeChange('simple')}
                >
                  Simple Example
                </button>
                <button 
                  className={`header-btn ${mode === 'custom' ? 'active' : ''}`} 
                  onClick={() => handleModeChange('custom')}
                >
                  Custom Height Example
                </button>
                <div className="user-profile-icon">K</div>
            </div>
        </div>
        <div className="main-content">
            <div className="example-wrapper">
              {mode === 'simple' ? (
                <>
                  <CodeBlock title="Simple Usage" code={simpleExampleCode} />
                  <SimpleMasonry pins={visiblePins} onEndReached={loadMore} />
                </>
              ) : (
                <>
                  <CodeBlock title="Custom Height Logic" code={customExampleCode} />
                  <CustomHeightMasonry pins={visiblePins} onEndReached={loadMore} />
                </>
              )}
              {visibleCount < allPins.length && (
                <p style={{ textAlign: 'center', color: '#767676', padding: '20px' }}>
                  Showing {visibleCount} of {allPins.length} items — scroll to load more
                </p>
              )}
            </div>
        </div>
    </div>
  );
}

export default App;
