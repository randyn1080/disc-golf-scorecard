// src/pages/PlayerSetupPage.tsx
import React, { useContext, useState } from 'react';
import { RoundContext } from '../context/RoundContext';
import { Player } from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const PlayerSetupPage: React.FC = () => {
  const { players, setPlayers } = useContext(RoundContext)!;
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const addPlayer = () => {
    if (playerName.trim()) {
      const newPlayer: Player = { id: uuidv4(), name: playerName.trim() };
      setPlayers([...players, newPlayer]);
      setPlayerName('');
    }
  };

  const startRound = () => {
    if (players.length === 0) {
      alert('Add at least one player.');
    } else {
      navigate('/score/1'); // Start at hole 1
    }
  };

  return (
    <div>
      <h2>Player Setup</h2>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
      />
      <button onClick={addPlayer}>Add Player</button>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <button onClick={startRound}>Start Round</button>
    </div>
  );
};

export default PlayerSetupPage;