import React, { useMemo, useState } from 'react';
import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';
import CodeBlock from './components/CodeBlock';
import { simpleExampleCode, customExampleCode } from './exampleCode';
import { pinterestImages } from './demoData';
import './index.css';

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
const SimpleMasonry = ({ pins }) => {
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
       {/* No text content, just image */}
    </div>
  );

  return (
    <MasonryGrid
      items={pins}
      renderItem={renderItem}
      // Standard usage: just pass the image URL for size calculation
      getItemSize={(pin) => getImageSize(pin.image)} 
      gap={20}
      minWidth={236}
    />
  );
};

// 2. Custom Height Example Component
const CustomHeightMasonry = ({ pins }) => {
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
          {/* We can add more text here, space is reserved */}
       </div>
    </div>
  );

  // Custom size calculator that adds fixed height for text
  const getCustomItemSize = async (pin) => {
    const dimensions = await getImageSize(pin.image);
    const footerHeight = 40; // Approx height for text area
    
    // We add the footer height relative to the aspect ratio
    // The library uses aspect ratio to layout. If we add height, we effectively change the aspect ratio.
    // The internal calculation for column height will then account for this extra vertical space.
    // Note: 236 is a standard Pinterest column width used for normalization here.
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
    />
  );
};

function App() {
  const pins = useMemo(() => generateMockData(pinterestImages), []);
  const [mode, setMode] = useState('simple'); // 'simple' or 'custom'

  return (
    <div className="app">
        <div className="header">
            <div className="header-title">Pint<span className="highlight">Demo</span></div>
            <div className="header-links">
                <button 
                  className={`header-btn ${mode === 'simple' ? 'active' : ''}`} 
                  onClick={() => setMode('simple')}
                >
                  Simple Example
                </button>
                <button 
                  className={`header-btn ${mode === 'custom' ? 'active' : ''}`} 
                  onClick={() => setMode('custom')}
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
                  <SimpleMasonry pins={pins} />
                </>
              ) : (
                <>
                  <CodeBlock title="Custom Height Logic" code={customExampleCode} />
                  <CustomHeightMasonry pins={pins} />
                </>
              )}
            </div>
        </div>
    </div>
  );
}

export default App;
