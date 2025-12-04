import type { Character, Equipment } from '../../types';
import { Status } from '../Character/Status';
import './Exploration.css';

interface ExplorationProps {
  character: Character;
  equipment: Equipment;
  requiredExp: number;
  onExplore: () => void;
  onShop: () => void;
  onInventory: () => void;
  onRest: () => void;
}

export const Exploration: React.FC<ExplorationProps> = ({
  character,
  equipment,
  requiredExp,
  onExplore,
  onShop,
  onInventory,
  onRest,
}) => {
  return (
    <div className="exploration-container">
      <div className="exploration-header">
        <h1>冒険の拠点</h1>
      </div>

      <div className="exploration-content">
        <div className="status-sidebar">
          <Status
            character={character}
            equipment={equipment}
            requiredExp={requiredExp}
          />
        </div>

        <div className="exploration-actions">
          <div className="action-card" onClick={onExplore}>
            <span className="action-icon">🗺️</span>
            <span className="action-title">探索に出る</span>
            <span className="action-description">
              ダンジョンを探索してモンスターと戦う
            </span>
          </div>

          <div className="action-card" onClick={onShop}>
            <span className="action-icon">🏪</span>
            <span className="action-title">ショップ</span>
            <span className="action-description">
              アイテムの購入・売却
            </span>
          </div>

          <div className="action-card" onClick={onInventory}>
            <span className="action-icon">🎒</span>
            <span className="action-title">インベントリ</span>
            <span className="action-description">
              所持アイテムと装備の確認
            </span>
          </div>

          <div className="action-card" onClick={onRest}>
            <span className="action-icon">🏨</span>
            <span className="action-title">休息</span>
            <span className="action-description">
              HP/MPを全回復（10G）
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
