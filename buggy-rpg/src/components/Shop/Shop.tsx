import { useState } from 'react';
import type { Item, Character, InventoryItem } from '../../types';
import { Button } from '../UI';
import { getShopItems } from '../../data/items';
import './Shop.css';

interface ShopProps {
  character: Character;
  inventory: InventoryItem[];
  onBuyItem: (item: Item) => void;
  onSellItem: (item: Item) => void;
  onBack: () => void;
}

export const Shop: React.FC<ShopProps> = ({
  character,
  inventory,
  onBuyItem,
  onSellItem,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const shopItems = getShopItems();

  const handleBuy = (item: Item) => {
    // BUG_ID: L3 - お金が足りなくても購入できる
    // 正しくは: if (character.gold >= item.price) { onBuyItem(item); }
    onBuyItem(item);
  };

  const handleSell = (item: Item) => {
    onSellItem(item);
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>ショップ</h1>
        <div className="shop-gold">所持金: {character.gold}G</div>
      </div>

      <div className="shop-tabs">
        <button
          className={`tab ${activeTab === 'buy' ? 'active' : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          購入
        </button>
        <button
          className={`tab ${activeTab === 'sell' ? 'active' : ''}`}
          onClick={() => setActiveTab('sell')}
        >
          売却
        </button>
      </div>

      <div className="shop-content">
        {activeTab === 'buy' ? (
          <div className="shop-list">
            {shopItems.map((item) => (
              <div key={item.id} className="shop-item">
                <div className="shop-item-info">
                  <span className="shop-item-name">{item.name}</span>
                  <span className="shop-item-description">{item.description}</span>
                </div>
                <div className="shop-item-action">
                  <span className="shop-item-price">{item.price}G</span>
                  <Button size="small" onClick={() => handleBuy(item)}>
                    購入
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="shop-list">
            {inventory.length === 0 ? (
              <p className="empty-message">売れるアイテムがありません</p>
            ) : (
              inventory.map((inventoryItem) => (
                <div key={inventoryItem.item.id} className="shop-item">
                  <div className="shop-item-info">
                    <span className="shop-item-name">
                      {inventoryItem.item.name} x{inventoryItem.quantity}
                    </span>
                    <span className="shop-item-description">
                      {inventoryItem.item.description}
                    </span>
                  </div>
                  <div className="shop-item-action">
                    <span className="shop-item-price">
                      {Math.floor(inventoryItem.item.price / 2)}G
                    </span>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleSell(inventoryItem.item)}
                    >
                      売却
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="shop-footer">
        <Button variant="secondary" onClick={onBack}>
          戻る
        </Button>
      </div>
    </div>
  );
};

// BUG_ID: L7 - 売却処理（呼び出し元で使用）
export const calculateSellPrice = (item: Item): number => {
  // 正しくは: return Math.floor(item.price / 2);
  return -Math.floor(item.price / 2); // 符号が逆で所持金が減る
};
