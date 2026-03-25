import { useState, useCallback, useRef, useEffect } from "react";
import { MasonryGrid } from "react-masonry-virtualized";
import Sidebar from "./components/Sidebar";
import CodeBlock from "./components/CodeBlock";
import FeatureCard from "./components/FeatureCard";
import {
  simpleExample,
  overlayExample,
  customHeightExample,
  infiniteScrollExample,
  programmaticScrollExample,
} from "./exampleCode";

// ─── Data ──────────────────────────────────────────────────────────────────
const RATIOS = [1.0, 1.4, 0.8, 1.8, 1.2, 1.6, 0.9, 1.5, 1.3, 1.1];
const TITLES = [
  "Morning Light", "Urban Geometry", "Forest Path", "Ocean Sunset",
  "Mountain View", "City Lights", "Desert Bloom", "Autumn Leaves",
  "Rainy Day", "Starry Night", "Golden Hour", "Street Art",
  "Wildflowers", "Coastal Walk", "Neon District", "Misty Valley",
];
const AUTHORS = [
  "Alex Kim", "Sara Chen", "Leo Park", "Mia Torres", "Jake Lee",
  "Nina Patel", "Riku Sato", "Emma Davis",
];
const CATEGORIES = ["Nature", "Urban", "Portrait", "Food", "Travel", "Art", "Architecture", "Fashion"];

const ALL_PINS = Array.from({ length: 200 }, (_, i) => {
  const ratio = RATIOS[i % RATIOS.length];
  const w = 400;
  const h = Math.round(w * ratio);
  return {
    id: i + 1,
    image: `https://picsum.photos/seed/${i + 10}/${w}/${h}`,
    title: TITLES[i % TITLES.length],
    author: AUTHORS[i % AUTHORS.length],
    category: CATEGORIES[i % CATEGORIES.length],
    likes: ((i * 137 + 53) % 1950) + 50,
    width: w,
    height: h,
  };
});

const PAGE_SIZE = 8;
const SKELETON_RATIOS = [1.0, 1.4, 0.8, 1.8, 1.2, 1.6, 0.9, 1.5];

// ─── Example Configs ────────────────────────────────────────────────────
const EXAMPLES = {
  simple: {
    title: "Simple Grid",
    tagline: "Minimal setup — just items and a render function",
    description: "The most basic Pinterest-style masonry layout. Pass your items array, a render function, and the grid handles everything else — virtualization, positioning, and responsive columns. Zero boilerplate, zero layout math.",
    features: ["Auto-responsive columns", "Virtualized rendering", "Lazy image loading"],
    code: simpleExample,
  },
  overlay: {
    title: "With Overlays & Actions",
    tagline: "Interactive cards with Like, Save, and Share buttons",
    description: "Add hover overlays with custom action buttons to each card. Perfect for social feeds, e-commerce product grids, and any interactive gallery. Full control over overlay content and interaction handlers.",
    features: ["Hover overlay effects", "Like / Save / Share actions", "Glassmorphism backdrop"],
    code: overlayExample,
  },
  custom: {
    title: "Custom Heights",
    tagline: "Cards with text footers and calculated heights",
    description: "Add text content below images with custom height calculations. The getItemSize callback lets you account for footers, badges, or any extra content while keeping the masonry layout perfectly aligned.",
    features: ["Custom getItemSize", "Text footer below image", "Dynamic height calculation"],
    code: customHeightExample,
  },
  infinite: {
    title: "Infinite Scroll",
    tagline: "Load more items on scroll with skeleton placeholders",
    description: "Seamless infinite loading with skeleton placeholders that match your grid's aspect ratios. Existing pins stay in place while new ones shimmer in. Uses onEndReached, loadingPlaceholder, and skeletonCount props.",
    features: ["onEndReached callback", "Skeleton loading placeholders", "Smooth append animation"],
    code: infiniteScrollExample,
  },
  scroll: {
    title: "Programmatic Scrolling",
    tagline: "Scroll to any item by index using a ref",
    description: "Navigate to any item in the grid programmatically using the scrollToIndex method. Pass a ref to MasonryGrid and call scrollToIndex(index, options) to scroll with smooth or instant behavior. Perfect for back-to-top buttons, deep linking, and keyboard navigation.",
    features: ["scrollToIndex method", "Smooth & instant modes", "Configurable offset"],
    code: programmaticScrollExample,
  },
};

// ─── Feature Data ───────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "⚡",
    title: "Virtualized Rendering",
    description: "Only renders items visible in the viewport. Handles thousands of items without dropping frames.",
    tag: "Performance",
  },
  {
    icon: "💀",
    title: "Skeleton Loading",
    description: "Built-in skeleton placeholders that match your grid's aspect ratios with shimmer animations.",
    tag: "UX",
  },
  {
    icon: "🔍",
    title: "SEO-Optimized",
    description: "Semantic HTML output with proper img alt tags, lazy loading, and structured data support.",
    tag: "SEO",
  },
  {
    icon: "📐",
    title: "Custom Sizing",
    description: "Control item heights with getItemSize — add text footers, badges, or any extra content.",
    tag: "Layout",
  },
  {
    icon: "🎯",
    title: "Programmatic Scrolling",
    description: "Scroll to any item by index via ref — back-to-top, deep linking, and keyboard nav.",
    tag: "Navigation",
  },
];

// ─── Card Components ────────────────────────────────────────────────────

function PinCardSimple({ pin }) {
  return (
    <div className="pin-card">
      <img src={pin.image} alt={`${pin.title} by ${pin.author}`} loading="lazy" />
    </div>
  );
}

function PinCardOverlay({ pin }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="pin-card">
      <img src={pin.image} alt={`${pin.title} by ${pin.author}`} loading="lazy" />
      <div className="pin-overlay">
        <div className="pin-actions-top">
          <button
            className={`pin-action-btn${saved ? " saved" : ""}`}
            onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
            aria-label={saved ? "Unsave pin" : "Save pin"}
          >
            {saved ? "📌" : "📍"}
          </button>
          <button
            className={`pin-action-btn${liked ? " liked" : ""}`}
            onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
            aria-label={liked ? "Unlike" : "Like"}
          >
            {liked ? "❤️" : "🤍"}
          </button>
          <button
            className="pin-action-btn"
            onClick={(e) => e.stopPropagation()}
            aria-label="Share pin"
          >
            🔗
          </button>
        </div>
        <div className="pin-info">
          <p className="pin-title">{pin.title}</p>
          <div className="pin-meta">
            <span className="pin-author">@{pin.author}</span>
            <span className="pin-likes">♥ {(pin.likes + (liked ? 1 : 0)).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PinCardCustom({ pin }) {
  return (
    <div className="pin-card-custom">
      <img src={pin.image} alt={`${pin.title} by ${pin.author}`} loading="lazy" />
      <div className="pin-card-custom-footer">
        <h3>{pin.title}</h3>
        <span className="pin-author">@{pin.author} · {pin.category}</span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        background: "linear-gradient(90deg, #e8e4df 25%, #f0ece6 50%, #e8e4df 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
        width: "100%",
        height: "100%",
      }}
    />
  );
}

// ─── Helper ─────────────────────────────────────────────────────────────
function fetchNextPage(page) {
  const start = page * PAGE_SIZE;
  return Promise.resolve(ALL_PINS.slice(start, start + PAGE_SIZE));
}

// ─── Main App ───────────────────────────────────────────────────────────
export default function App() {
  // Intro animation
  const [introVisible, setIntroVisible] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIntroFading(true), 1800);
    const hideTimer = setTimeout(() => setIntroVisible(false), 2400);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeExample, setActiveExample] = useState("overlay");

  // Code toggle
  const [showCode, setShowCode] = useState(false);

  // Scroll demo state
  const [scrollIndex, setScrollIndex] = useState(50);
  const [scrollBehavior, setScrollBehavior] = useState("smooth");
  const gridRef = useRef(null);

  // Infinite scroll
  const [visiblePins, setVisiblePins] = useState(ALL_PINS.slice(0, PAGE_SIZE));
  const [isFetching, setIsFetching] = useState(false);
  const pageRef = useRef(1);
  const hasMore = visiblePins.length < ALL_PINS.length;

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    const next = await fetchNextPage(pageRef.current);
    pageRef.current += 1;
    setVisiblePins((prev) => [...prev, ...next]);
    setIsFetching(false);
  }, [isFetching, hasMore]);

  // Current example config
  const example = EXAMPLES[activeExample];

  // Card renderer
  const renderCard = useCallback(
    (pin) => {
      switch (activeExample) {
        case "simple":
          return <PinCardSimple pin={pin} />;
        case "custom":
          return <PinCardCustom pin={pin} />;
        case "overlay":
        case "infinite":
        default:
          return <PinCardOverlay pin={pin} />;
      }
    },
    [activeExample]
  );

  // getItemSize
  const getItemSize = useCallback(
    (pin) => {
      if (activeExample === "custom") {
        const footerHeight = 52;
        return { width: pin.width, height: pin.height + Math.round(footerHeight * (pin.width / 236)) };
      }
      return { width: pin.width, height: pin.height };
    },
    [activeExample]
  );

  // Scroll handler
  const handleScrollToIndex = useCallback(() => {
    gridRef.current?.scrollToIndex(scrollIndex, {
      behavior: scrollBehavior,
      offset: 20,
    });
  }, [scrollIndex, scrollBehavior]);

  // Items to show
  const displayPins = activeExample === "infinite" ? visiblePins : ALL_PINS.slice(0, 40);

  // ─── Intro Screen ──────────────────────────────────────────────────────
  if (introVisible) {
    return (
      <div className={`intro-screen${introFading ? " intro-fade-out" : ""}`}>
        <div className="intro-content">
          <div className="intro-logo-icon">P</div>
          <h1 className="intro-title">
            Pint<span>Demo</span>
          </h1>
          <p className="intro-tagline">Pinterest-style Masonry Grids for React</p>
          <div className="intro-loader">
            <div className="intro-loader-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout app-enter">
      {/* ── Sidebar ── */}
      <Sidebar
        activeExample={activeExample}
        onExampleChange={setActiveExample}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main ── */}
      <main className="main-content">
        {/* ── Minimal Top Bar ── */}
        <header className="top-bar" role="banner">
          <div className="top-bar-inner">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <div className="top-bar-title">
              <h2>{example.title}</h2>
              <span className="top-bar-tagline">{example.tagline}</span>
            </div>

            <button
              className={`btn-toggle ${showCode ? "btn-toggle-on" : "btn-toggle-off"}`}
              onClick={() => setShowCode((v) => !v)}
            >
              {showCode ? "← Hide Code" : "View Code →"}
            </button>
          </div>
        </header>

        {/* ── Example Description ── */}
        <section className="example-intro" aria-labelledby="example-heading">
          <div className="example-intro-inner">
            <h1 id="example-heading" className="example-heading">{example.title}</h1>
            <p className="example-description">{example.description}</p>
            <div className="example-features">
              {example.features.map((f) => (
                <span key={f} className="example-feature-tag">✓ {f}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Code Panel ── */}
        {showCode && (
          <div className="code-panel">
            <CodeBlock code={example.code.code} title={example.code.title} />
          </div>
        )}

        {/* ── Scroll Controls (only for scroll demo) ── */}
        {activeExample === "scroll" && (
          <div className="scroll-toolbar">
            <div className="scroll-toolbar-inner">
              <div className="scroll-input-group">
                <label htmlFor="scroll-index">Item Index</label>
                <input
                  id="scroll-index"
                  type="number"
                  min={0}
                  max={displayPins.length - 1}
                  value={scrollIndex}
                  onChange={(e) => setScrollIndex(Math.max(0, Math.min(displayPins.length - 1, Number(e.target.value))))}
                  className="scroll-input"
                />
              </div>
              <div className="scroll-input-group">
                <label>Behavior</label>
                <div className="scroll-behavior-toggle">
                  <button
                    className={`scroll-behavior-btn${scrollBehavior === "smooth" ? " active" : ""}`}
                    onClick={() => setScrollBehavior("smooth")}
                  >
                    Smooth
                  </button>
                  <button
                    className={`scroll-behavior-btn${scrollBehavior === "auto" ? " active" : ""}`}
                    onClick={() => setScrollBehavior("auto")}
                  >
                    Instant
                  </button>
                </div>
              </div>
              <button className="scroll-go-btn" onClick={handleScrollToIndex}>
                🎯 Scroll to Item
              </button>
              <div className="scroll-quick-actions">
                <button
                  className="scroll-quick-btn"
                  onClick={() => { setScrollIndex(0); gridRef.current?.scrollToIndex(0, { behavior: scrollBehavior, offset: 20 }); }}
                >
                  ⬆ Top
                </button>
                <button
                  className="scroll-quick-btn"
                  onClick={() => { setScrollIndex(Math.floor(displayPins.length / 2)); gridRef.current?.scrollToIndex(Math.floor(displayPins.length / 2), { behavior: scrollBehavior, offset: 20 }); }}
                >
                  ↕ Middle
                </button>
                <button
                  className="scroll-quick-btn"
                  onClick={() => { setScrollIndex(displayPins.length - 1); gridRef.current?.scrollToIndex(displayPins.length - 1, { behavior: scrollBehavior, offset: 20 }); }}
                >
                  ⬇ Bottom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Live Grid ── */}
        <section className="grid-section" aria-label={`${example.title} live demo`}>
          <div className="grid-container">
            <MasonryGrid
              ref={gridRef}
              items={displayPins}
              renderItem={renderCard}
              getItemSize={getItemSize}
              gap={16}
              minWidth={236}
              loadingPlaceholder={<SkeletonCard />}
              skeletonCount={PAGE_SIZE}
              skeletonAspectRatios={SKELETON_RATIOS}
              onEndReached={activeExample === "infinite" ? loadMore : undefined}
              onEndReachedThreshold={600}
              enableZoomOnHover
              zoomScale={1.3}
            />
          </div>
        </section>

        {/* ── Features (only on first example) ── */}
        {activeExample === "overlay" && (
          <section className="features-section" aria-labelledby="features-heading">
            <h2 className="section-title" id="features-heading">Why react-masonry-virtualized?</h2>
            <p className="section-subtitle">Built for performance, SEO, and developer experience</p>
            <div className="features-grid">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="app-footer" role="contentinfo">
          <div className="footer-content">
            <div className="footer-left">
              <h3>react-masonry-virtualized</h3>
              <p>
                A lightweight, performant React component for building Pinterest-style masonry grids.
                Supports virtualization, infinite scroll, skeleton loading, and custom actions.
                MIT licensed and ready for production.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Resources</h4>
                <a href="https://www.npmjs.com/package/react-masonry-virtualized" target="_blank" rel="noopener noreferrer">npm Package</a>
                <a href="https://github.com/kedar200/react-masonry-virtualized" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Docs</a>
              </div>
              <div className="footer-col">
                <h4>Examples</h4>
                <button className="footer-link-btn" onClick={() => setActiveExample("simple")}>Simple Grid</button>
                <button className="footer-link-btn" onClick={() => setActiveExample("overlay")}>Overlays</button>
                <button className="footer-link-btn" onClick={() => setActiveExample("custom")}>Custom Heights</button>
                <button className="footer-link-btn" onClick={() => setActiveExample("infinite")}>Infinite Scroll</button>
                <button className="footer-link-btn" onClick={() => setActiveExample("scroll")}>Scroll To Item</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Built with react-masonry-virtualized v2.2.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
