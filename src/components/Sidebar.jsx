import { useState } from 'react';

const EXAMPLE_ITEMS = [
  { id: 'simple', icon: '🎨', label: 'Simple Grid' },
  { id: 'overlay', icon: '🖼️', label: 'With Overlays' },
  { id: 'custom', icon: '📦', label: 'Custom Heights' },
  { id: 'infinite', icon: '🔄', label: 'Infinite Scroll' },
  { id: 'scroll', icon: '🎯', label: 'Scroll To Item' },
];

export default function Sidebar({ activeExample, onExampleChange, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay visible" onClick={onClose} />
      )}

      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">P</div>
          <div className="sidebar-logo-text">
            Pint<span>Demo</span>
          </div>
        </div>

        <div className="sidebar-version">react-masonry-virtualized v2.2.0</div>

        {/* Examples Navigation */}
        <nav className="sidebar-nav" aria-label="Examples">
          <div className="sidebar-section-label">Examples</div>
          {EXAMPLE_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item${activeExample === item.id ? ' active' : ''}`}
              onClick={() => { onExampleChange(item.id); onClose?.(); }}
              aria-current={activeExample === item.id ? 'page' : undefined}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="sidebar-section-label">Resources</div>
          <a
            href="https://www.npmjs.com/package/react-masonry-virtualized"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-item"
          >
            <span className="sidebar-item-icon">📦</span>
            npm Package
            <span className="sidebar-external-icon">↗</span>
          </a>
          <a
            href="https://github.com/kedar200/react-masonry-virtualized"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-item"
          >
            <span className="sidebar-item-icon">🔗</span>
            GitHub
            <span className="sidebar-external-icon">↗</span>
          </a>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <code className="sidebar-install">npm i react-masonry-virtualized</code>
        </div>
      </aside>
    </>
  );
}
