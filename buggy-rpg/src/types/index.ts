// キャラクターのステータス
export interface CharacterStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
}

// プレイヤーキャラクター
export interface Character extends CharacterStats {
  name: string;
  level: number;
  exp: number;
  gold: number;
}

// アイテムの種類
export type ItemType = 'potion' | 'weapon' | 'armor' | 'accessory';

// アイテム
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  price: number;
  effect?: {
    hp?: number;
    mp?: number;
    attack?: number;
    defense?: number;
    speed?: number;
  };
}

// インベントリ内のアイテム
export interface InventoryItem {
  item: Item;
  quantity: number;
}

// 装備スロット
export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  accessory: Item | null;
}

// 敵キャラクター
export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  expReward: number;
  goldReward: number;
}

// 戦闘中の敵（HPが変動する）
export interface BattleEnemy extends Enemy {
  currentHp: number;
}

// 戦闘アクション
export type BattleAction = 'attack' | 'defend' | 'item' | 'flee';

// 戦闘ログのエントリ
export interface BattleLogEntry {
  id: number;
  message: string;
  type: 'player' | 'enemy' | 'system';
}

// ゲームの画面
export type GameScreen = 'title' | 'create' | 'main' | 'battle' | 'shop' | 'exploration';

// ゲーム全体の状態
export interface GameState {
  screen: GameScreen;
  character: Character | null;
  inventory: InventoryItem[];
  equipment: Equipment;
  currentEnemy: BattleEnemy | null;
  battleLog: BattleLogEntry[];
  isDefending: boolean;
}
