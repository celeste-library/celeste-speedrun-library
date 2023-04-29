import {Card, CardContent, CardHeader, Link} from '@mui/material';
import React, {Fragment} from 'react';
import {Link as RouterLink, LoaderFunctionArgs, useLoaderData} from 'react-router-dom';
import {DefaultApi, Room} from '../../generated';
import {Strats} from '../strats/Strats';

export async function getRoomDetailsLoader({params}: LoaderFunctionArgs): Promise<Room | undefined> {
  const api = new DefaultApi();
  if (params.roomToken) {
    return api.showRoom({room: params.roomToken});
  } else {
    return Promise.resolve(undefined);
  }
}

export function RoomDetails() {
  const room = useLoaderData() as Awaited<ReturnType<typeof getRoomDetailsLoader>>;
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
                      <Link component={RouterLink} to={'../' + connection.token} relative="path">
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
        <Strats room={room.token}></Strats>
      </>) || <></>
  );
}
