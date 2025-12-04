import { useState } from 'react';
import type { Character, BattleEnemy, BattleLogEntry, InventoryItem } from '../../types';
import { Button, HPBar, Modal } from '../UI';
import { BattleLog } from './BattleLog';
import './Battle.css';

interface BattleProps {
  character: Character;
  enemy: BattleEnemy;
  battleLog: BattleLogEntry[];
  inventory: InventoryItem[];
  isBattleOver: boolean;
  onAttack: () => void;
  onDefend: () => void;
  onFlee: () => void;
  onUseItem: (itemId: string) => void;
  onEndBattle: () => void;
  onOpenInventory: () => void;
}

export const Battle: React.FC<BattleProps> = ({
  character,
  enemy,
  battleLog,
  inventory,
  isBattleOver,
  onAttack,
  onDefend,
  onFlee,
  onUseItem,
  onEndBattle,
  onOpenInventory,
}) => {
  const [showItemModal, setShowItemModal] = useState(false);

  const potions = inventory.filter((i) => i.item.type === 'potion');

  const handleUseItem = (itemId: string) => {
    onUseItem(itemId);
    setShowItemModal(false);
  };

  // BUG_ID: L9 - インベントリを開く処理が戦闘状態に影響する可能性がある
  const handleOpenItems = () => {
    setShowItemModal(true);
    // ここで意図せず状態がリセットされる可能性がある処理を呼ぶ
    onOpenInventory();
  };

  return (
    <div className="battle-container">
      <div className="battle-arena">
        <div className="enemy-section">
          <h2 className="enemy-name">{enemy.name}</h2>
          <div className="enemy-sprite">
            <span className="enemy-icon">👾</span>
          </div>
          <HPBar
            current={enemy.currentHp}
            max={enemy.maxHp}
            label="HP"
            color="red"
          />
        </div>

        <div className="vs-divider">VS</div>

        <div className="player-section">
          <h2 className="player-name">{character.name}</h2>
          <div className="player-sprite">
            <span className="player-icon">⚔️</span>
          </div>
          <HPBar
            current={character.hp}
            max={character.maxHp}
            label="HP"
            color="green"
          />
          <HPBar
            current={character.mp}
            max={character.maxMp}
            label="MP"
            color="blue"
          />
        </div>
      </div>

      <BattleLog logs={battleLog} />

      <div className="battle-actions">
        {isBattleOver ? (
          <Button onClick={onEndBattle}>戦闘終了</Button>
        ) : (
          <>
            <Button onClick={onAttack}>攻撃</Button>
            <Button onClick={onDefend} variant="secondary">
              防御
            </Button>
            <Button onClick={handleOpenItems} variant="secondary">
              アイテム
            </Button>
            <Button onClick={onFlee} variant="danger">
              逃げる
            </Button>
          </>
        )}
      </div>

      <Modal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title="アイテムを使う"
      >
        <div className="item-select">
          {potions.length === 0 ? (
            <p>使えるアイテムがありません</p>
          ) : (
            potions.map((p) => (
              <div key={p.item.id} className="item-option">
                <span>
                  {p.item.name} x{p.quantity}
                </span>
                <Button size="small" onClick={() => handleUseItem(p.item.id)}>
                  使う
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
