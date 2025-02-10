// src/components/PlayerList.tsx

import React, { useState } from "react";
import { Player } from "../models/types";
import { v4 as uuidv4 } from "uuid";

interface PlayerListProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
}) => {
  const [playerName, setPlayerName] = useState("");

  const addPlayer = () => {
    if (playerName.trim() !== "") {
      const newPlayer: Player = { id: uuidv4(), name: playerName.trim() };
      onAddPlayer(newPlayer);
      setPlayerName("");
    }
  };

  return (
    <div>
      <h3>Players</h3>
      <input
        type="text"
        value={playerName}
        placeholder="Enter player name"
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={addPlayer}>Add Player</button>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name}{" "}
            <button onClick={() => onRemovePlayer(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;