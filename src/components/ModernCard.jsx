// components/ModernCard.jsx
import React from 'react';
import '../styles/ModernCard.css';

const ModernCard = ({ icon: Icon, title, description, stats, color = 'primary' }) => {
  return (
    <div className={`modern-card card-${color}`}>
      <div className="card-header">
        <div className="card-icon">
          {Icon && <Icon size={24} />}
        </div>
        <h3 className="card-title">{title}</h3>
      </div>
      <p className="card-description">{description}</p>
      {stats && (
        <div className="card-stats">
          {stats.map((stat, index) => (
            <div key={index} className="card-stat">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="card-footer">
        <button className="card-action">Learn More →</button>
      </div>
    </div>
  );
};

export default ModernCard;
