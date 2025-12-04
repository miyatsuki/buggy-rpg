import { useState, useCallback } from 'react';
import type { GameScreen } from '../types';

export const useGame = () => {
  const [screen, setScreen] = useState<GameScreen>('title');

  const goToScreen = useCallback((newScreen: GameScreen) => {
    setScreen(newScreen);
  }, []);

  const goToTitle = useCallback(() => setScreen('title'), []);
  const goToCreate = useCallback(() => setScreen('create'), []);
  const goToMain = useCallback(() => setScreen('main'), []);
  const goToBattle = useCallback(() => setScreen('battle'), []);
  const goToShop = useCallback(() => setScreen('shop'), []);
  const goToExploration = useCallback(() => setScreen('exploration'), []);

  return {
    screen,
    goToScreen,
    goToTitle,
    goToCreate,
    goToMain,
    goToBattle,
    goToShop,
    goToExploration,
  };
};
