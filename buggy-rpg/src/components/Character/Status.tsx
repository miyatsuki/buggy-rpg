import type { Character, Equipment } from '../../types';
import { HPBar } from '../UI';
import './Status.css';

interface StatusProps {
  character: Character;
  equipment: Equipment;
  requiredExp: number;
}

export const Status: React.FC<StatusProps> = ({
  character,
  equipment,
  requiredExp,
}) => {
  return (
    <div className="status-panel">
      <h2>{character.name}</h2>
      <div className="status-level">Lv. {character.level}</div>

      <div className="status-bars">
        <HPBar current={character.hp} max={character.maxHp} label="HP" color="green" />
        <HPBar current={character.mp} max={character.maxMp} label="MP" color="blue" />
      </div>

      <div className="status-exp">
        <span>EXP: {character.exp} / {requiredExp}</span>
      </div>

      {/* BUG_ID: U6 - 数値の表示がガタガタになる（固定幅なし） */}
      <div className="status-stats">
        <div className="stat-row">
          <span className="stat-label">攻撃力</span>
          <span className="stat-value">{character.attack}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">防御力</span>
          <span className="stat-value">{character.defense}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">素早さ</span>
          <span className="stat-value">{character.speed}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">所持金</span>
          <span className="stat-value">{character.gold}G</span>
        </div>
      </div>

      <div className="equipment-section">
        <h3>装備</h3>
        <div className="equipment-slot">
          <span className="slot-label">武器:</span>
          <span className="slot-value">{equipment.weapon?.name || 'なし'}</span>
        </div>
        <div className="equipment-slot">
          <span className="slot-label">防具:</span>
          <span className="slot-value">{equipment.armor?.name || 'なし'}</span>
        </div>
        <div className="equipment-slot">
          <span className="slot-label">アクセサリー:</span>
          <span className="slot-value">{equipment.accessory?.name || 'なし'}</span>
        </div>
      </div>
    </div>
  );
};
