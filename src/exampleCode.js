export const simpleExampleCode = `// Simple Pinterest-style Grid
import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

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
    </div>
  );

  return (
    <MasonryGrid
      items={pins}
      renderItem={renderItem}
      // Standard usage: just pass the image URL
      getItemSize={(pin) => getImageSize(pin.image)} 
      gap={20}
      minWidth={236}
    />
  );
};`;

export const customExampleCode = `// Custom Height Grid (Text Footer)
import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

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
       </div>
    </div>
  );

  // Custom size calculator
  const getCustomItemSize = async (pin) => {
    const dimensions = await getImageSize(pin.image);
    const footerHeight = 40; // Approx height for text area
    
    // Add logic to maintain aspect ratio with added height
    // (height + footer) relative to standard column width (236)
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
};`;
