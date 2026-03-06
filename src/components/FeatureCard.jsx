export default function FeatureCard({ icon, title, description, tag }) {
  return (
    <div className="feature-card">
      <div className="feature-card-icon">{icon}</div>
      <div className="feature-card-title">{title}</div>
      <div className="feature-card-desc">{description}</div>
      {tag && <span className="feature-card-tag">{tag}</span>}
    </div>
  );
}
