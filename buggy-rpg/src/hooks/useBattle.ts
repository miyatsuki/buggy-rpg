import { useState, useCallback } from 'react';
import type { BattleEnemy, BattleLogEntry, Character, Enemy } from '../types';

let logIdCounter = 0;

export const useBattle = () => {
  const [enemy, setEnemy] = useState<BattleEnemy | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [isDefending, setIsDefending] = useState(false);
  const [isBattleOver, setIsBattleOver] = useState(false);

  const addLog = useCallback((message: string, type: BattleLogEntry['type']) => {
    setBattleLog((prev) => [
      ...prev,
      { id: ++logIdCounter, message, type },
    ]);
  }, []);

  const startBattle = useCallback((enemyData: Enemy) => {
    // BUG_ID: L9 - 戦闘中にこの関数が呼ばれると敵のHPがリセットされる
    setEnemy({
      ...enemyData,
      currentHp: enemyData.maxHp,
    });
    setBattleLog([]);
    setIsDefending(false);
    setIsBattleOver(false);
    addLog(`${enemyData.name}が現れた！`, 'system');
  }, [addLog]);

  const calculateDamage = useCallback(
    (attackerAttack: number, defenderDefense: number, isDefending: boolean): number => {
      const baseDamage = Math.max(1, attackerAttack - defenderDefense);
      const variance = Math.floor(Math.random() * 5) - 2; // -2 ~ +2

      // BUG_ID: L5 - 防御しても軽減が適用されない
      // 正しくは: if (isDefending) return Math.max(1, Math.floor((baseDamage + variance) / 2));
      if (isDefending) {
        // 軽減を忘れている
      }

      return Math.max(1, baseDamage + variance);
    },
    []
  );

  const playerAttack = useCallback(
    (character: Character): { newCharacter: Character; battleEnded: boolean; victory: boolean } => {
      if (!enemy || isBattleOver) {
        return { newCharacter: character, battleEnded: false, victory: false };
      }

      const damage = calculateDamage(character.attack, enemy.defense, false);
      const newEnemyHp = enemy.currentHp - damage;

      setEnemy((prev) => prev ? { ...prev, currentHp: newEnemyHp } : null);
      addLog(`${character.name}の攻撃！ ${enemy.name}に${damage}のダメージ！`, 'player');

      // BUG_ID: L1 - HPが0以下になっても戦闘が続く
      // 正しくは: if (newEnemyHp <= 0)
      if (newEnemyHp < 0) {
        setIsBattleOver(true);
        addLog(`${enemy.name}を倒した！`, 'system');
        return { newCharacter: character, battleEnded: true, victory: true };
      }

      // 敵のターン
      setIsDefending(false);
      const enemyDamage = calculateDamage(enemy.attack, character.defense, isDefending);
      const newPlayerHp = character.hp - enemyDamage;

      addLog(`${enemy.name}の攻撃！ ${character.name}に${enemyDamage}のダメージ！`, 'enemy');

      if (newPlayerHp <= 0) {
        setIsBattleOver(true);
        addLog('あなたは倒れた...', 'system');
        return {
          newCharacter: { ...character, hp: 0 },
          battleEnded: true,
          victory: false,
        };
      }

      return {
        newCharacter: { ...character, hp: newPlayerHp },
        battleEnded: false,
        victory: false,
      };
    },
    [enemy, isBattleOver, isDefending, calculateDamage, addLog]
  );

  const playerDefend = useCallback(
    (character: Character): { newCharacter: Character; battleEnded: boolean; victory: boolean } => {
      if (!enemy || isBattleOver) {
        return { newCharacter: character, battleEnded: false, victory: false };
      }

      setIsDefending(true);
      addLog(`${character.name}は防御の構えを取った！`, 'player');

      // 敵のターン
      const enemyDamage = calculateDamage(enemy.attack, character.defense, true);
      const newPlayerHp = character.hp - enemyDamage;

      addLog(`${enemy.name}の攻撃！ ${character.name}に${enemyDamage}のダメージ！`, 'enemy');

      if (newPlayerHp <= 0) {
        setIsBattleOver(true);
        addLog('あなたは倒れた...', 'system');
        return {
          newCharacter: { ...character, hp: 0 },
          battleEnded: true,
          victory: false,
        };
      }

      return {
        newCharacter: { ...character, hp: newPlayerHp },
        battleEnded: false,
        victory: false,
      };
    },
    [enemy, isBattleOver, calculateDamage, addLog]
  );

  const attemptFlee = useCallback(
    (character: Character): { newCharacter: Character; escaped: boolean; battleEnded: boolean } => {
      if (!enemy || isBattleOver) {
        return { newCharacter: character, escaped: false, battleEnded: false };
      }

      // BUG_ID: L6 - 逃走成功率が逆（敵が強いほど逃げやすい）
      // 正しくは: const fleeChance = Math.min(0.9, character.speed / (enemy.speed + character.speed));
      const fleeChance = Math.min(0.9, enemy.speed / (enemy.speed + character.speed));

      if (Math.random() < fleeChance) {
        setIsBattleOver(true);
        addLog('うまく逃げ切った！', 'system');
        return { newCharacter: character, escaped: true, battleEnded: true };
      }

      addLog('逃げられなかった！', 'system');

      // 敵のターン
      const enemyDamage = calculateDamage(enemy.attack, character.defense, false);
      const newPlayerHp = character.hp - enemyDamage;

      addLog(`${enemy.name}の攻撃！ ${character.name}に${enemyDamage}のダメージ！`, 'enemy');

      if (newPlayerHp <= 0) {
        setIsBattleOver(true);
        addLog('あなたは倒れた...', 'system');
        return {
          newCharacter: { ...character, hp: 0 },
          escaped: false,
          battleEnded: true,
        };
      }

      return {
        newCharacter: { ...character, hp: newPlayerHp },
        escaped: false,
        battleEnded: false,
      };
    },
    [enemy, isBattleOver, calculateDamage, addLog]
  );

  const endBattle = useCallback(() => {
    setEnemy(null);
    setBattleLog([]);
    setIsDefending(false);
    setIsBattleOver(false);
  }, []);

  return {
    enemy,
    battleLog,
    isDefending,
    isBattleOver,
    startBattle,
    playerAttack,
    playerDefend,
    attemptFlee,
    endBattle,
    addLog,
  };
};
