import {Card, CardContent, CardHeader, Grid} from '@mui/material';
import React from 'react';
import {LoaderFunctionArgs, useLoaderData, useNavigate} from 'react-router-dom';
import {DefaultApi, Room} from '../../generated';
import {RoomOverview} from './RoomOverview';
import './RoomSelect.css';

export async function getRoomsLoader({params}: LoaderFunctionArgs): Promise<Room[]> {
  const api = new DefaultApi();
  if (params.checkpointToken) {
    return api.getRooms({checkpoint: params.checkpointToken});
  } else {
    return Promise.resolve([]);
  }
}

export function RoomSelect() {
  const rooms = useLoaderData() as Awaited<ReturnType<typeof getRoomsLoader>>;
  const navigate = useNavigate();
  return (
      <Card>
        <CardHeader title="Rooms"/>
        <CardContent>
          <Grid container rowSpacing={2} columnSpacing={2}>
            {rooms.map(room =>
                <Grid item key={room.code} xs={3}>
                  <RoomOverview room={room} onClick={() => navigate('../room/' + room.token)}></RoomOverview>
                </Grid>,
            )}
          </Grid>
        </CardContent>
      </Card>
  );
}
