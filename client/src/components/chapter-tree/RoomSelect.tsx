import {Card, CardContent, CardHeader, Grid} from '@mui/material';
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
          <Grid container rowSpacing={2} columnSpacing={2}>
            {rooms.map(room =>
                <Grid item key={room.code} xs={3}>
                  <RoomOverview room={room} onClick={onRoomSelect}></RoomOverview>
                </Grid>,
            )}
          </Grid>
        </CardContent>
      </Card>
  );
}
