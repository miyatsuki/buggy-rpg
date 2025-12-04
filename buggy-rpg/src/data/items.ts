import type { Item } from '../types';

export const items: Item[] = [
  // ポーション類
  {
    id: 'potion',
    name: 'ポーション',
    type: 'potion',
    description: 'HPを30回復する',
    price: 50,
    effect: { hp: 30 },
  },
  {
    id: 'hi-potion',
    name: 'ハイポーション',
    type: 'potion',
    description: 'HPを100回復する',
    price: 150,
    effect: { hp: 100 },
  },
  {
    id: 'mp-potion',
    name: 'マジックポーション',
    type: 'potion',
    description: 'MPを20回復する',
    price: 80,
    effect: { mp: 20 },
  },

  // 武器
  {
    id: 'wooden-sword',
    name: '木の剣',
    type: 'weapon',
    description: '攻撃力+5',
    price: 100,
    effect: { attack: 5 },
  },
  {
    id: 'iron-sword',
    name: '鉄の剣',
    type: 'weapon',
    description: '攻撃力+15',
    price: 300,
    effect: { attack: 15 },
  },
  {
    id: 'steel-sword',
    name: '鋼の剣',
    type: 'weapon',
    description: '攻撃力+30',
    price: 800,
    effect: { attack: 30 },
  },
  {
    id: 'legendary-sword',
    name: '伝説の剣',
    type: 'weapon',
    description: '攻撃力+50',
    price: 2000,
    effect: { attack: 50 },
  },

  // 防具
  {
    id: 'leather-armor',
    name: '革の鎧',
    type: 'armor',
    description: '防御力+5',
    price: 80,
    effect: { defense: 5 },
  },
  {
    id: 'iron-armor',
    name: '鉄の鎧',
    type: 'armor',
    description: '防御力+15',
    price: 250,
    effect: { defense: 15 },
  },
  {
    id: 'steel-armor',
    name: '鋼の鎧',
    type: 'armor',
    description: '防御力+30',
    price: 700,
    effect: { defense: 30 },
  },

  // アクセサリー
  {
    id: 'speed-ring',
    name: 'スピードリング',
    type: 'accessory',
    description: '素早さ+10',
    price: 200,
    effect: { speed: 10 },
  },
  {
    id: 'power-ring',
    name: 'パワーリング',
    type: 'accessory',
    description: '攻撃力+10',
    price: 250,
    effect: { attack: 10 },
  },
  {
    id: 'guard-ring',
    name: 'ガードリング',
    type: 'accessory',
    description: '防御力+10',
    price: 250,
    effect: { defense: 10 },
  },
];

export const getItemById = (id: string): Item | undefined => {
  return items.find(item => item.id === id);
};

export const getShopItems = (): Item[] => {
  return items;
};
