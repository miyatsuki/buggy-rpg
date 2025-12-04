import React, { useState } from 'react';
import { Button } from '../UI';
import './CharacterCreate.css';

interface CharacterCreateProps {
  onCreateCharacter: (name: string) => void;
}

export const CharacterCreate: React.FC<CharacterCreateProps> = ({
  onCreateCharacter,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateCharacter(name.trim());
    }
  };

  return (
    <div className="character-create">
      <h1>キャラクター作成</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">名前を入力してください</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="勇者の名前"
            maxLength={10}
          />
        </div>
        <Button onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} disabled={!name.trim()}>
          冒険を始める
        </Button>
      </form>
    </div>
  );
};
