import type { InventoryItem, Character, Equipment, Item } from '../../types';
import { Button, Modal } from '../UI';
import './Inventory.css';

interface InventoryProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  equipment: Equipment;
  character: Character;
  onUsePotion: (itemId: string) => void;
  onEquipItem: (item: Item) => void;
  onUnequipItem: (slot: keyof Equipment) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  isOpen,
  onClose,
  inventory,
  equipment,
  character: _character,
  onUsePotion,
  onEquipItem,
  onUnequipItem,
}) => {
  // character は将来の拡張用（現在は未使用）
  void _character;
  const renderItemAction = (inventoryItem: InventoryItem) => {
    const { item } = inventoryItem;

    if (item.type === 'potion') {
      return (
        <Button size="small" onClick={() => onUsePotion(item.id)}>
          使う
        </Button>
      );
    }

    if (['weapon', 'armor', 'accessory'].includes(item.type)) {
      const slot = item.type as keyof Equipment;
      const isEquipped = equipment[slot]?.id === item.id;

      return (
        <Button
          size="small"
          variant={isEquipped ? 'secondary' : 'primary'}
          onClick={() => onEquipItem(item)}
        >
          装備
        </Button>
      );
    }

    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="インベントリ">
      <div className="inventory-content">
        <div className="inventory-section">
          <h3>所持アイテム</h3>
          {inventory.length === 0 ? (
            <p className="empty-message">アイテムがありません</p>
          ) : (
            <ul className="item-list">
              {inventory.map((inventoryItem) => (
                <li key={inventoryItem.item.id} className="item-row">
                  <div className="item-info">
                    <span className="item-name">{inventoryItem.item.name}</span>
                    <span className="item-quantity">x{inventoryItem.quantity}</span>
                  </div>
                  <div className="item-description">{inventoryItem.item.description}</div>
                  <div className="item-actions">{renderItemAction(inventoryItem)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="inventory-section">
          <h3>装備中</h3>
          <div className="equipment-list">
            <div className="equipment-row">
              <span className="equipment-slot-name">武器:</span>
              <span className="equipment-item-name">
                {equipment.weapon?.name || 'なし'}
              </span>
              {equipment.weapon && (
                <Button size="small" variant="danger" onClick={() => onUnequipItem('weapon')}>
                  外す
                </Button>
              )}
            </div>
            <div className="equipment-row">
              <span className="equipment-slot-name">防具:</span>
              <span className="equipment-item-name">
                {equipment.armor?.name || 'なし'}
              </span>
              {equipment.armor && (
                <Button size="small" variant="danger" onClick={() => onUnequipItem('armor')}>
                  外す
                </Button>
              )}
            </div>
            <div className="equipment-row">
              <span className="equipment-slot-name">アクセサリー:</span>
              <span className="equipment-item-name">
                {equipment.accessory?.name || 'なし'}
              </span>
              {equipment.accessory && (
                <Button size="small" variant="danger" onClick={() => onUnequipItem('accessory')}>
                  外す
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
