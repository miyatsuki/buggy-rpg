import { useState, useCallback } from 'react';
import type { Item, InventoryItem, Equipment, Character } from '../types';

const initialEquipment: Equipment = {
  weapon: null,
  armor: null,
  accessory: null,
};

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment>(initialEquipment);

  const addItem = useCallback((item: Item, quantity: number = 1) => {
    setInventory((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { item, quantity }];
    });
  }, []);

  const removeItem = useCallback((itemId: string, quantity: number = 1) => {
    setInventory((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (!existing) return prev;

      if (existing.quantity <= quantity) {
        return prev.filter((i) => i.item.id !== itemId);
      }

      return prev.map((i) =>
        i.item.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
      );
    });
  }, []);

  const usePotion = useCallback(
    (itemId: string, character: Character): Character | null => {
      const inventoryItem = inventory.find((i) => i.item.id === itemId);
      if (!inventoryItem || inventoryItem.item.type !== 'potion') return null;

      const effect = inventoryItem.item.effect;
      if (!effect) return null;

      let newCharacter = { ...character };

      // BUG_ID: L2 - 最大HPを超えて回復してしまう
      if (effect.hp) {
        newCharacter.hp = character.hp + effect.hp; // 正しくは Math.min(character.hp + effect.hp, character.maxHp)
      }

      if (effect.mp) {
        newCharacter.mp = Math.min(character.mp + effect.mp, character.maxMp);
      }

      removeItem(itemId, 1);
      return newCharacter;
    },
    [inventory, removeItem]
  );

  const equipItem = useCallback(
    (item: Item, character: Character): Character => {
      const slot = item.type as keyof Equipment;
      if (!['weapon', 'armor', 'accessory'].includes(slot)) return character;

      let newCharacter = { ...character };
      const currentEquipped = equipment[slot];

      // BUG_ID: L8 - 同じアイテムを複数回装備すると効果が重複する
      // 現在の装備を外す処理がない
      // 正しくは: if (currentEquipped?.effect) で現在装備の効果を引く

      // 新しい装備の効果を適用
      if (item.effect) {
        if (item.effect.attack) newCharacter.attack += item.effect.attack;
        if (item.effect.defense) newCharacter.defense += item.effect.defense;
        if (item.effect.speed) newCharacter.speed += item.effect.speed;
      }

      setEquipment((prev) => ({ ...prev, [slot]: item }));

      // 装備したアイテムをインベントリから削除
      removeItem(item.id, 1);

      // 外した装備をインベントリに戻す
      if (currentEquipped) {
        addItem(currentEquipped, 1);
      }

      return newCharacter;
    },
    [equipment, removeItem, addItem]
  );

  const unequipItem = useCallback(
    (slot: keyof Equipment, character: Character): Character => {
      const item = equipment[slot];
      if (!item) return character;

      let newCharacter = { ...character };

      // 装備の効果を外す
      if (item.effect) {
        if (item.effect.attack) newCharacter.attack -= item.effect.attack;
        if (item.effect.defense) newCharacter.defense -= item.effect.defense;
        if (item.effect.speed) newCharacter.speed -= item.effect.speed;
      }

      setEquipment((prev) => ({ ...prev, [slot]: null }));
      addItem(item, 1);

      return newCharacter;
    },
    [equipment, addItem]
  );

  const getItemCount = useCallback(
    (itemId: string): number => {
      const item = inventory.find((i) => i.item.id === itemId);
      return item ? item.quantity : 0;
    },
    [inventory]
  );

  return {
    inventory,
    equipment,
    addItem,
    removeItem,
    usePotion,
    equipItem,
    unequipItem,
    getItemCount,
  };
};
