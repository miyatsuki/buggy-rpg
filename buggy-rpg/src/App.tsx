import { useState, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import { useCharacter } from './hooks/useCharacter';
import { useInventory } from './hooks/useInventory';
import { useBattle } from './hooks/useBattle';
import { CharacterCreate } from './components/Character/CharacterCreate';
import { Exploration } from './components/Exploration/Exploration';
import { Battle } from './components/Battle/Battle';
import { Shop, calculateSellPrice } from './components/Shop/Shop';
import { Inventory } from './components/Inventory/Inventory';
import { Button } from './components/UI';
import { getRandomEnemy } from './data/enemies';
import type { Equipment, Item } from './types';
import './App.css';

function App() {
  const { screen, goToCreate, goToMain, goToBattle, goToShop } = useGame();
  const {
    character,
    createCharacter,
    gainExp,
    gainGold,
    updateStats,
    getRequiredExpForNextLevel,
  } = useCharacter();
  const {
    inventory,
    equipment,
    addItem,
    removeItem,
    usePotion,
    equipItem,
    unequipItem,
  } = useInventory();
  const {
    enemy,
    battleLog,
    isBattleOver,
    startBattle,
    playerAttack,
    playerDefend,
    attemptFlee,
    endBattle,
  } = useBattle();

  const [showInventory, setShowInventory] = useState(false);

  const handleCreateCharacter = useCallback(
    (name: string) => {
      createCharacter(name);
      goToMain();
    },
    [createCharacter, goToMain]
  );

  const handleExplore = useCallback(() => {
    if (!character) return;
    const enemyData = getRandomEnemy(character.level);
    startBattle(enemyData);
    goToBattle();
  }, [character, startBattle, goToBattle]);

  const handleAttack = useCallback(() => {
    if (!character) return;
    const result = playerAttack(character);
    updateStats(result.newCharacter);
  }, [character, playerAttack, updateStats]);

  const handleDefend = useCallback(() => {
    if (!character) return;
    const result = playerDefend(character);
    updateStats(result.newCharacter);
  }, [character, playerDefend, updateStats]);

  const handleFlee = useCallback(() => {
    if (!character) return;
    const result = attemptFlee(character);
    updateStats(result.newCharacter);
    if (result.escaped) {
      setTimeout(() => {
        endBattle();
        goToMain();
      }, 1500);
    }
  }, [character, attemptFlee, updateStats, endBattle, goToMain]);

  const handleEndBattle = useCallback(() => {
    if (!character || !enemy) return;

    // 勝利した場合、報酬を獲得
    if (enemy.currentHp <= 0) {
      gainExp(enemy.expReward);
      gainGold(enemy.goldReward);
    }

    endBattle();
    goToMain();
  }, [character, enemy, gainExp, gainGold, endBattle, goToMain]);

  const handleBattleUseItem = useCallback(
    (itemId: string) => {
      if (!character) return;
      const newCharacter = usePotion(itemId, character);
      if (newCharacter) {
        updateStats(newCharacter);
      }
    },
    [character, usePotion, updateStats]
  );

  // BUG_ID: L9 - インベントリを開くと敵のHPがリセットされる
  const handleOpenInventoryInBattle = useCallback(() => {
    if (!character || !enemy) return;
    // バグ：ここで startBattle を再度呼ぶと敵のHPがリセットされる
    const enemyData = getRandomEnemy(character.level);
    startBattle(enemyData);
  }, [character, enemy, startBattle]);

  const handleBuyItem = useCallback(
    (item: Item) => {
      if (!character) return;
      // BUG_ID: L3 - お金のチェックがされていない
      addItem(item, 1);
      updateStats({ ...character, gold: character.gold - item.price });
    },
    [character, addItem, updateStats]
  );

  const handleSellItem = useCallback(
    (item: Item) => {
      if (!character) return;
      removeItem(item.id, 1);
      // BUG_ID: L7 - calculateSellPrice が負の値を返すので所持金が減る
      const sellPrice = calculateSellPrice(item);
      updateStats({ ...character, gold: character.gold + sellPrice });
    },
    [character, removeItem, updateStats]
  );

  const handleUsePotion = useCallback(
    (itemId: string) => {
      if (!character) return;
      const newCharacter = usePotion(itemId, character);
      if (newCharacter) {
        updateStats(newCharacter);
      }
    },
    [character, usePotion, updateStats]
  );

  const handleEquipItem = useCallback(
    (item: Item) => {
      if (!character) return;
      const newCharacter = equipItem(item, character);
      updateStats(newCharacter);
    },
    [character, equipItem, updateStats]
  );

  const handleUnequipItem = useCallback(
    (slot: keyof Equipment) => {
      if (!character) return;
      const newCharacter = unequipItem(slot, character);
      updateStats(newCharacter);
    },
    [character, unequipItem, updateStats]
  );

  const handleRest = useCallback(() => {
    if (!character || character.gold < 10) return;
    updateStats({
      ...character,
      hp: character.maxHp,
      mp: character.maxMp,
      gold: character.gold - 10,
    });
  }, [character, updateStats]);

  // タイトル画面
  if (screen === 'title') {
    return (
      <div className="app title-screen">
        <div className="title-content">
          <h1 className="game-title">Buggy Quest</h1>
          <p className="game-subtitle">〜バグだらけの冒険〜</p>
          <Button onClick={goToCreate}>ゲームスタート</Button>
        </div>
      </div>
    );
  }

  // キャラクター作成画面
  if (screen === 'create') {
    return (
      <div className="app">
        <CharacterCreate onCreateCharacter={handleCreateCharacter} />
      </div>
    );
  }

  // ショップ画面
  if (screen === 'shop') {
    return (
      <div className="app">
        <Shop
          character={character}
          inventory={inventory}
          onBuyItem={handleBuyItem}
          onSellItem={handleSellItem}
          onBack={goToMain}
        />
      </div>
    );
  }

  // 戦闘画面
  if (screen === 'battle' && enemy) {
    return (
      <div className="app">
        <Battle
          character={character}
          enemy={enemy}
          battleLog={battleLog}
          inventory={inventory}
          isBattleOver={isBattleOver}
          onAttack={handleAttack}
          onDefend={handleDefend}
          onFlee={handleFlee}
          onUseItem={handleBattleUseItem}
          onEndBattle={handleEndBattle}
          onOpenInventory={handleOpenInventoryInBattle}
        />
      </div>
    );
  }

  // メイン画面（探索）
  return (
    <div className="app">
      <Exploration
        character={character}
        equipment={equipment}
        requiredExp={getRequiredExpForNextLevel()}
        onExplore={handleExplore}
        onShop={goToShop}
        onInventory={() => setShowInventory(true)}
        onRest={handleRest}
      />

      <Inventory
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        inventory={inventory}
        equipment={equipment}
        character={character}
        onUsePotion={handleUsePotion}
        onEquipItem={handleEquipItem}
        onUnequipItem={handleUnequipItem}
      />
    </div>
  );
}

export default App;
