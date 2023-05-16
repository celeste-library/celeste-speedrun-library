import React from 'react';
import {Room} from '../../generated';
import './RoomOverview.css';

interface Props {
  room: Room;
  onClick: (room: Room) => void;
}

export function RoomOverview({room, onClick}: Props) {
  return (
      <div className="room-box" onClick={() => onClick(room)}>
        <img className="room-thumbnail" src={room.image} alt={room.code}></img>
        {room.code}
      </div>
  );
}
