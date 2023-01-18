import {Card, CardContent, CardHeader, Link} from '@mui/material';
import React, {Fragment} from 'react';
import {Filters, Room} from '../../generated';
import {Strats} from '../strats/Strats';

interface Props {
  room?: Room;
  filters?: Filters
  onConnectedRoomSelected: (room: Room) => void;
}

export function RoomDetails({room, filters, onConnectedRoomSelected}: Props) {
  return (
      (room && <>
        <Card>
          <CardHeader title="Room Details"></CardHeader>
          <CardContent>
            <img className="room-thumbnail" src={room.image} alt={room.code}></img>
          <div>
            <table>
              <tbody>
              <tr>
                <td>Room Code:</td>
                <td>{room.code}</td>
              </tr>
              <tr>
                <td>Connected Rooms:</td>
                <td>{room.connected?.map((connection, index) =>
                    <Fragment key={connection.token}>
                      {index > 0 && ', '}
                      <Link onClick={() => onConnectedRoomSelected(connection)}>
                        {connection.code}
                      </Link>
                    </Fragment>)
                }</td>
              </tr>
              </tbody>
            </table>
          </div>
          </CardContent>
        </Card>
        <Strats room={room.token} filters={filters}></Strats>
      </>) || <></>
  );
}
