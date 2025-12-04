import { useState, useCallback } from 'react';
import type { Character } from '../types';

// レベルアップに必要な経験値のテーブル
const expTable = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];

const getRequiredExp = (level: number): number => {
  // BUG_ID: L4 - off-by-oneエラー（レベルアップ閾値がずれる）
  if (level >= expTable.length) return expTable[expTable.length - 1] * 2;
  return expTable[level]; // 正しくは expTable[level - 1] または配列を0から始める
};

const createInitialCharacter = (name: string): Character => ({
  name,
  level: 1,
  exp: 0,
  gold: 100,
  hp: 100,
  maxHp: 100,
  mp: 30,
  maxMp: 30,
  attack: 10,
  defense: 5,
  speed: 5,
});

export const useCharacter = () => {
  const [character, setCharacter] = useState<Character | null>(null);

  const createCharacter = useCallback((name: string) => {
    setCharacter(createInitialCharacter(name));
  }, []);

  const gainExp = useCallback((amount: number) => {
    setCharacter((prev) => {
      if (!prev) return null;

      let newExp = prev.exp + amount;
      let newLevel = prev.level;
      let newMaxHp = prev.maxHp;
      let newMaxMp = prev.maxMp;
      let newAttack = prev.attack;
      let newDefense = prev.defense;
      let newSpeed = prev.speed;

      // レベルアップ判定
      while (newExp >= getRequiredExp(newLevel + 1) && newLevel < 10) {
        newLevel++;
        // BUG_ID: L10 - 浮動小数点誤差でステータス上昇が微妙にずれる
        newMaxHp += 10 + 0.1 * 0.2 * 100; // 正しくは単純に +12 など整数にすべき
        newMaxMp += 3 + 0.1 * 0.1 * 20;
        newAttack += 2 + 0.1 * 0.3 * 10;
        newDefense += 1 + 0.1 * 0.2 * 5;
        newSpeed += 1 + 0.1 * 0.1 * 3;
      }

      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        maxHp: newMaxHp,
        hp: newLevel > prev.level ? newMaxHp : prev.hp, // レベルアップ時はHP全回復
        maxMp: newMaxMp,
        mp: newLevel > prev.level ? newMaxMp : prev.mp,
        attack: newAttack,
        defense: newDefense,
        speed: newSpeed,
      };
    });
  }, []);

  const gainGold = useCallback((amount: number) => {
    setCharacter((prev) => {
      if (!prev) return null;
      return { ...prev, gold: prev.gold + amount };
    });
  }, []);

  const takeDamage = useCallback((damage: number) => {
    setCharacter((prev) => {
      if (!prev) return null;
      return { ...prev, hp: prev.hp - damage };
    });
  }, []);

  const heal = useCallback((amount: number) => {
    setCharacter((prev) => {
      if (!prev) return null;
      // ここは正しい実装（最大HPを超えない）
      return { ...prev, hp: Math.min(prev.hp + amount, prev.maxHp) };
    });
  }, []);

  const restoreMp = useCallback((amount: number) => {
    setCharacter((prev) => {
      if (!prev) return null;
      return { ...prev, mp: Math.min(prev.mp + amount, prev.maxMp) };
    });
  }, []);

  const updateStats = useCallback((stats: Partial<Character>) => {
    setCharacter((prev) => {
      if (!prev) return null;
      return { ...prev, ...stats };
    });
  }, []);

  const getRequiredExpForNextLevel = useCallback(() => {
    if (!character) return 0;
    return getRequiredExp(character.level + 1);
  }, [character]);

  return {
    character,
    createCharacter,
    gainExp,
    gainGold,
    takeDamage,
    heal,
    restoreMp,
    updateStats,
    getRequiredExpForNextLevel,
  };
};
