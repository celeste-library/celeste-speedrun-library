import {Card, CardContent, CardHeader} from '@mui/material';
import React from 'react';
import {Room} from '../../generated';
import {RoomOverview} from './RoomOverview';
import './RoomSelect.css';

interface Props {
  rooms: Room[];
  onRoomSelect: (room: Room) => void;
}

export function RoomSelect({rooms, onRoomSelect}: Props) {
  return (
      <Card>
        <CardHeader title="Rooms"/>
        <CardContent>
          <div className="room-group">
            {rooms.map(room => <RoomOverview room={room} key={room.code} onClick={onRoomSelect}></RoomOverview>)}
          </div>
        </CardContent>
      </Card>
  );
}
