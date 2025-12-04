import type { Enemy } from '../types';

export const enemies: Enemy[] = [
  {
    id: 'slime',
    name: 'スライム',
    hp: 20,
    maxHp: 20,
    attack: 5,
    defense: 2,
    speed: 3,
    expReward: 10,
    goldReward: 5,
  },
  {
    id: 'goblin',
    name: 'ゴブリン',
    hp: 35,
    maxHp: 35,
    attack: 10,
    defense: 5,
    speed: 6,
    expReward: 25,
    goldReward: 15,
  },
  {
    id: 'wolf',
    name: 'オオカミ',
    hp: 45,
    maxHp: 45,
    attack: 15,
    defense: 8,
    speed: 12,
    expReward: 40,
    goldReward: 20,
  },
  {
    id: 'skeleton',
    name: 'スケルトン',
    hp: 60,
    maxHp: 60,
    attack: 18,
    defense: 10,
    speed: 5,
    expReward: 55,
    goldReward: 30,
  },
  {
    id: 'orc',
    name: 'オーク',
    hp: 80,
    maxHp: 80,
    attack: 22,
    defense: 15,
    speed: 4,
    expReward: 75,
    goldReward: 50,
  },
  {
    id: 'dragon',
    name: 'ドラゴン',
    hp: 150,
    maxHp: 150,
    attack: 35,
    defense: 25,
    speed: 10,
    expReward: 200,
    goldReward: 150,
  },
];

export const getRandomEnemy = (playerLevel: number): Enemy => {
  // プレイヤーのレベルに応じて出現する敵を制限
  const availableEnemies = enemies.filter((_, index) => index <= playerLevel);
  const randomIndex = Math.floor(Math.random() * availableEnemies.length);
  return { ...availableEnemies[randomIndex] };
};
