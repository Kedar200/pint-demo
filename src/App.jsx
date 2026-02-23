import { useState, useCallback, useRef } from "react";
import { MasonryGrid, getImageSize } from "react-masonry-virtualized";

// ─── Data ──────────────────────────────────────────────────────────────────

const RATIOS = [1.0, 1.4, 0.8, 1.8, 1.2, 1.6, 0.9, 1.5, 1.3, 1.1];
const TITLES = [
  "Morning Light", "Urban Geometry", "Forest Path", "Ocean Sunset",
  "Mountain View", "City Lights", "Desert Bloom", "Autumn Leaves",
  "Rainy Day", "Starry Night",
];
const AUTHORS = ["Alex Kim", "Sara Chen", "Leo Park", "Mia Torres", "Jake Lee"];

const ALL_PINS = Array.from({ length: 200 }, (_, i) => {
  const ratio = RATIOS[i % RATIOS.length];
  const w = 400;
  const h = Math.round(w * ratio);
  return {
    id: i + 1,
    image: `https://picsum.photos/seed/${i + 10}/${w}/${h}`,
    title: TITLES[i % TITLES.length],
    author: AUTHORS[i % AUTHORS.length],
    likes: ((i * 137 + 53) % 1950) + 50,
    width: w,
    height: h,
  };
});

const PAGE_SIZE = 8;
const SKELETON_RATIOS = [1.0, 1.6, 0.85, 1.4, 1.2, 1.8, 0.95, 1.3];

// ─── Code Snippet ───────────────────────────────────────────────────────────

const CODE = `import { MasonryGrid, getImageSize } from 'react-masonry-virtualized';

const PinterestGrid = ({ pins }) => {
  const [page, setPage] = useState([]);
  const [fetching, setFetching] = useState(false);

  const loadMore = useCallback(async () => {
    if (fetching) return;
    setFetching(true);
    const next = await fetchNextPage();
    setPage(prev => [...prev, ...next]);
    setFetching(false);
  }, [fetching]);

  return (
    <MasonryGrid
      items={pins}
      renderItem={(pin) => <PinCard pin={pin} />}
      getItemSize={async (pin) => {
        const size = await getImageSize(pin.image);
        return size; // { width, height }
      }}
      gap={16}
      minWidth={236}
      loadingPlaceholder={<SkeletonCard />}
      skeletonCount={8}
      skeletonAspectRatios={[1.0, 1.6, 0.85, 1.4, 1.2, 1.8, 0.95, 1.3]}
      onEndReached={loadMore}
      onEndReachedThreshold={600}
    />
  );
};`;

// ─── Card Component ─────────────────────────────────────────────────────────

function PinCard({ pin }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="pin-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,.45)"
          : "0 4px 20px rgba(0,0,0,.25)",
        transition: "box-shadow .25s ease, transform .25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <img
        src={pin.image}
        alt={pin.title}
        loading="lazy"
        style={{ display: "block", width: "100%", height: "auto" }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity .25s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "14px 14px 16px",
        }}
      >
        {/* Like button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
            style={{
              background: liked
                ? "linear-gradient(135deg,#ff3d6b,#ff6b3d)"
                : "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "none",
              borderRadius: 50,
              width: 38,
              height: 38,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              transition: "background .2s ease, transform .15s ease",
              transform: liked ? "scale(1.15)" : "scale(1)",
            }}
            aria-label="Like"
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Info */}
        <div>
          <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: 0.2, textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
            {pin.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ color: "rgba(255,255,255,.75)", fontSize: 12 }}>@{pin.author}</span>
            <span style={{ color: "rgba(255,255,255,.65)", fontSize: 12 }}>
              ♥ {(pin.likes + (liked ? 1 : 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        background: "linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
        width: "100%",
        height: "100%",
      }}
    />
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

function fetchNextPage(page) {
  const start = page * PAGE_SIZE;
  return Promise.resolve(ALL_PINS.slice(start, start + PAGE_SIZE));
}

export default function App() {
  const [gap, setGap] = useState(16);
  const [minWidth, setMinWidth] = useState(236);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d0d1a 0%, #12122a 100%)", color: "#fff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,13,26,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

          {/* Left: branding */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(90deg,#a78bfa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -0.5 }}>
              Pint<span style={{ WebkitTextFillColor: "#fff" }}>Demo</span>
            </span>
            <span style={{ background: "rgba(167,139,250,.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,.3)", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>
              react-masonry-virtualized v2.0.3
            </span>
          </div>

          {/* Right: controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.65)" }}>
              Gap
              <input type="range" min={4} max={40} value={gap} onChange={(e) => setGap(Number(e.target.value))} style={{ accentColor: "#a78bfa", width: 80 }} />
              <span style={{ minWidth: 28 }}>{gap}px</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.65)" }}>
              Min Width
              <input type="range" min={160} max={400} value={minWidth} onChange={(e) => setMinWidth(Number(e.target.value))} style={{ accentColor: "#a78bfa", width: 80 }} />
              <span style={{ minWidth: 36 }}>{minWidth}px</span>
            </label>
            <button
              onClick={() => setShowCode((v) => !v)}
              style={{
                background: showCode ? "linear-gradient(135deg,#a78bfa,#818cf8)" : "rgba(167,139,250,.12)",
                color: showCode ? "#fff" : "#a78bfa",
                border: "1px solid rgba(167,139,250,.3)",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all .2s",
              }}
            >
              {showCode ? "Hide Code" : "View Code"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", padding: "56px 24px 32px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, margin: 0, background: "linear-gradient(135deg,#fff 30%,#a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15 }}>
          Pinterest-style Masonry Grid
        </h1>
        <p style={{ color: "rgba(255,255,255,.5)", marginTop: 14, fontSize: 16, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.6 }}>
          Virtualized masonry with{" "}
          <code style={{ background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 6, padding: "1px 7px", color: "#a78bfa", fontSize: 14 }}>MasonryGrid</code>
          {" "}+{" "}
          <code style={{ background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 6, padding: "1px 7px", color: "#a78bfa", fontSize: 14 }}>getImageSize</code>
          . Infinite scroll, skeleton loading, zero boilerplate.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
          {[
            { label: "Shown", value: `${visiblePins.length} / ${ALL_PINS.length}` },
            { label: "Virtualized", value: "✓" },
            { label: "Page size", value: `${PAGE_SIZE}` },
            { label: "Version", value: "v2.0.3" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "10px 22px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(90deg,#a78bfa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Code Panel ── */}
      {showCode && (
        <div style={{ maxWidth: 860, margin: "0 auto 32px", padding: "0 24px" }}>
          <div style={{ background: "#0f0f1c", border: "1px solid rgba(167,139,250,.2)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid rgba(167,139,250,.1)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontFamily: "monospace" }}>MasonryGrid usage</span>
              <button
                onClick={handleCopy}
                style={{ background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", color: copied ? "#4ade80" : "#a78bfa", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre style={{ padding: "22px 24px", overflowX: "auto", fontSize: 13, lineHeight: 1.7, color: "#c4b5fd", margin: 0 }}>
              <code>{CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ── Skeleton Feature Callout ── */}
      <div style={{ maxWidth: 860, margin: "0 auto 32px", padding: "0 24px" }}>
        <div style={{ background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 14, padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 28 }}>💀</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#a78bfa", marginBottom: 2 }}>Skeleton loading in action</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>
              Scroll to the bottom — existing pins stay in place while new ones shimmer in. Uses{" "}
              <code style={{ color: "#a78bfa", fontSize: 12 }}>loadingPlaceholder</code>,{" "}
              <code style={{ color: "#a78bfa", fontSize: 12 }}>skeletonCount</code>, and{" "}
              <code style={{ color: "#a78bfa", fontSize: 12 }}>skeletonAspectRatios</code> props.
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
        <MasonryGrid
          items={visiblePins}
          renderItem={(pin) => <PinCard pin={pin} />}
          getItemSize={async (pin) => {
            // Real image size fetch — triggers skeleton while waiting
            return await getImageSize(pin.image);
          }}
          gap={gap}
          minWidth={minWidth}
          loadingPlaceholder={<SkeletonCard />}
          skeletonCount={PAGE_SIZE}
          skeletonAspectRatios={SKELETON_RATIOS}
          onEndReached={loadMore}
          onEndReachedThreshold={600}
        />
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "32px 0 56px", color: "rgba(255,255,255,.35)", fontSize: 13 }}>
        {hasMore ? (
          <span style={{ opacity: 0.4 }}>Scroll down for more</span>
        ) : (
          <span>— You've seen all {ALL_PINS.length} pins —</span>
        )}
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        input[type="range"] { cursor: pointer; }
      `}</style>
    </div>
  );
}
