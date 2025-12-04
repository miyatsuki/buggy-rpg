import React from 'react';
import './HPBar.css';

interface HPBarProps {
  current: number;
  max: number;
  label?: string;
  color?: 'green' | 'blue' | 'red';
}

export const HPBar: React.FC<HPBarProps> = ({
  current,
  max,
  label = 'HP',
  color = 'green',
}) => {
  // BUG_ID: U1 - HPバーの幅が実際のHP割合と一致しない（計算式ミス）
  const percentage = (current / max) * 50 + 25; // 正しくは (current / max) * 100

  return (
    <div className="hp-bar-container">
      <div className="hp-bar-label">
        <span>{label}</span>
        <span>{current} / {max}</span>
      </div>
      <div className="hp-bar-background">
        <div
          className={`hp-bar-fill hp-bar-${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
