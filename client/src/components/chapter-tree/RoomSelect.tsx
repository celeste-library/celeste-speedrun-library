import {Card, CardContent, CardHeader, Grid} from '@mui/material';
import React from 'react';
import {LoaderFunctionArgs, useLoaderData, useNavigate, useSearchParams} from 'react-router-dom';
import {DefaultApi, Room} from '../../generated';
import {RoomOverview} from './RoomOverview';
import './RoomSelect.css';

export async function getRoomsLoader({request, params}: LoaderFunctionArgs): Promise<Room[]> {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') ?? undefined;
  const api = new DefaultApi();
  if (params.checkpointToken) {
    return api.getRooms({checkpoint: params.checkpointToken, category: category});
  } else {
    return Promise.resolve([]);
  }
}

export function RoomSelect() {
  const rooms = useLoaderData() as Awaited<ReturnType<typeof getRoomsLoader>>;
  const navigate = useNavigate();
  const [searchParams,] = useSearchParams();
  const navigateWithParams = (url: string) => navigate({pathname: url, search: searchParams.toString()});
  return (
      <Card>
        <CardHeader title="Rooms"/>
        <CardContent>
          <Grid container rowSpacing={2} columnSpacing={2}>
            {rooms.map(room =>
                <Grid item key={room.code} xs={3}>
                  <RoomOverview room={room} onClick={() => navigateWithParams('../room/' + room.token)}></RoomOverview>
                </Grid>,
            )}
          </Grid>
        </CardContent>
      </Card>
  );
}
