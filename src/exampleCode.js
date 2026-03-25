// ─── Simple Example: Minimal masonry grid ───────────────────────────────
export const simpleExample = {
  title: "Simple Grid",
  desc: "Minimal Pinterest-style grid — just pass items and a render function.",
  code: `import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

const SimpleGrid = ({ images }) => (
  <MasonryGrid
    items={images}
    renderItem={(img) => <img src={img.url} alt={img.alt} />}
    getItemSize={(img) => getImageSize(img.url)}
    gap={16}
    minWidth={236}
  />
);`,
};

// ─── Overlay Example: Cards with hover overlay + actions ────────────────
export const overlayExample = {
  title: "With Overlays & Actions",
  desc: "Add hover overlays with Like, Save, and Share buttons for each card.",
  code: `import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

const OverlayGrid = ({ pins }) => {
  const renderItem = (pin) => (
    <div className="pin-card">
      <img src={pin.image} alt={pin.title} loading="lazy" />
      <div className="pin-overlay">
        <div className="pin-actions">
          <button onClick={() => handleLike(pin.id)}>❤️</button>
          <button onClick={() => handleSave(pin.id)}>📌</button>
          <button onClick={() => handleShare(pin.id)}>🔗</button>
        </div>
        <p className="pin-title">{pin.title}</p>
        <span className="pin-author">@{pin.author}</span>
      </div>
    </div>
  );

  return (
    <MasonryGrid
      items={pins}
      renderItem={renderItem}
      getItemSize={(pin) => getImageSize(pin.image)}
      gap={16}
      minWidth={236}
    />
  );
};`,
};

// ─── Custom Height Example: Cards with text footer ──────────────────────
export const customHeightExample = {
  title: "Custom Heights (Text Footer)",
  desc: "Add text content below images with calculated custom heights.",
  code: `import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

const CustomHeightGrid = ({ pins }) => {
  const renderItem = (pin) => (
    <div className="card-with-footer">
      <img src={pin.image} alt={pin.title} loading="lazy" />
      <div className="card-footer">
        <h3>{pin.title}</h3>
        <span>@{pin.author}</span>
      </div>
    </div>
  );

  // Custom size: image height + footer height
  const getCustomSize = async (pin) => {
    const { width, height } = await getImageSize(pin.image);
    const footerHeight = 52; // Fixed footer height
    return {
      width,
      height: height + (footerHeight * (width / 236))
    };
  };

  return (
    <MasonryGrid
      items={pins}
      renderItem={renderItem}
      getItemSize={getCustomSize}
      gap={20}
      minWidth={236}
    />
  );
};`,
};

// ─── Infinite Scroll Example ────────────────────────────────────────────
export const infiniteScrollExample = {
  title: "Infinite Scroll + Skeleton",
  desc: "Loading more items on scroll with skeleton placeholders.",
  code: `import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

const InfiniteGrid = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const next = await fetchNextPage();
    setItems(prev => [...prev, ...next]);
    setLoading(false);
  }, [loading]);

  const SkeletonCard = () => (
    <div className="skeleton-card" />
  );

  return (
    <MasonryGrid
      items={items}
      renderItem={(item) => <Card item={item} />}
      getItemSize={(item) => getImageSize(item.image)}
      gap={16}
      minWidth={236}
      loadingPlaceholder={<SkeletonCard />}
      skeletonCount={8}
      skeletonAspectRatios={[1.0, 1.4, 0.8, 1.8]}
      onEndReached={loadMore}
      onEndReachedThreshold={600}
    />
  );
};`,
};

// ─── Programmatic Scrolling Example ─────────────────────────────────────
export const programmaticScrollExample = {
  title: "Programmatic Scrolling",
  desc: "Scroll to any item by index using a ref.",
  code: `import { useRef } from 'react';
import { MasonryGrid, MasonryGridRef } from 'react-masonry-virtualized';

const ScrollableGrid = ({ items }) => {
  const gridRef = useRef<MasonryGridRef>(null);

  const scrollToItem = (index, behavior = 'smooth') => {
    gridRef.current?.scrollToIndex(index, {
      behavior,
      offset: 20
    });
  };

  return (
    <>
      <div className="scroll-controls">
        <button onClick={() => scrollToItem(0)}>
          ⬆ Back to Top
        </button>
        <button onClick={() => scrollToItem(50)}>
          Go to #50
        </button>
        <button onClick={() => scrollToItem(100, 'auto')}>
          Jump to #100
        </button>
      </div>
      <MasonryGrid
        ref={gridRef}
        items={items}
        renderItem={(item) => <Card item={item} />}
        getItemSize={(item) => ({
          width: item.width,
          height: item.height
        })}
        gap={16}
        minWidth={236}
      />
    </>
  );
};`,
};

// ─── SEO-Friendly Example ───────────────────────────────────────────────
export const seoExample = {
  title: "SEO-Friendly Grid",
  desc: "Semantic HTML with proper alt tags and lazy loading for search engines.",
  code: `import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

const SEOGrid = ({ pins }) => {
  const renderItem = (pin) => (
    <article className="pin-card" itemScope itemType="https://schema.org/ImageObject">
      <img
        src={pin.image}
        alt={pin.title}
        loading="lazy"
        itemProp="contentUrl"
        width={pin.width}
        height={pin.height}
      />
      <div className="pin-info">
        <h3 itemProp="name">{pin.title}</h3>
        <span itemProp="author">{pin.author}</span>
        <meta itemProp="description" content={pin.description} />
      </div>
    </article>
  );

  return (
    <section aria-label="Image Gallery">
      <MasonryGrid
        items={pins}
        renderItem={renderItem}
        getItemSize={(pin) => ({ width: pin.width, height: pin.height })}
        gap={16}
        minWidth={236}
      />
    </section>
  );
};`,
};

// ─── Geo-Responsive Example ─────────────────────────────────────────────
export const geoExample = {
  title: "Geo-Responsive Content",
  desc: "Serve locale-aware content based on the user's region.",
  code: `import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

const GeoGrid = ({ pins, userLocale = 'en-US' }) => {
  // Sort pins by relevance to user's region
  const sortedPins = useMemo(() => {
    return [...pins].sort((a, b) => {
      if (a.region === userLocale) return -1;
      if (b.region === userLocale) return 1;
      return 0;
    });
  }, [pins, userLocale]);

  const renderItem = (pin) => (
    <div className="pin-card">
      <img src={pin.image} alt={pin.title} loading="lazy" />
      <div className="pin-info">
        <h3>{pin.title}</h3>
        <span className="pin-region">{pin.regionName}</span>
      </div>
    </div>
  );

  return (
    <MasonryGrid
      items={sortedPins}
      renderItem={renderItem}
      getItemSize={(pin) => getImageSize(pin.image)}
      gap={16}
      minWidth={236}
    />
  );
};`,
};
