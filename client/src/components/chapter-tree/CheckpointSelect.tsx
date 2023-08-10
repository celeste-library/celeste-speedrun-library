import {Card, CardContent, CardHeader} from '@mui/material';
import React from 'react';
import {LoaderFunctionArgs, useLoaderData, useNavigate, useSearchParams} from 'react-router-dom';
import {Checkpoint, DefaultApi} from '../../generated';
import {CheckpointOverview} from './CheckpointOverview';
import './CheckpointSelect.css';

export async function getCheckpointsLoader({params}: LoaderFunctionArgs): Promise<Checkpoint[]> {
  const api = new DefaultApi();
  if (params.chapterToken) {
    return api.getCheckpoints({chapter: params.chapterToken});
  } else {
    return Promise.resolve([]);
  }
}

export async function showCheckpointLoader({params}: LoaderFunctionArgs): Promise<Checkpoint | undefined> {
  const api = new DefaultApi();
  if (params.checkpointToken) {
    return api.showCheckpoint({checkpoint: params.checkpointToken});
  } else {
    return Promise.resolve(undefined);
  }
}

export function CheckpointSelect() {
  const checkpoints = useLoaderData() as Awaited<ReturnType<typeof getCheckpointsLoader>>;
  const navigate = useNavigate();
  const [searchParams,] = useSearchParams();
  const navigateWithParams = (url: string) => navigate({pathname: url, search: searchParams.toString()});
  return (
      <Card>
        <CardHeader title="Checkpoints"/>
        <CardContent>
          <div className="checkpoint-group">
            {checkpoints.map((checkpoint: any) =>
                <CheckpointOverview key={checkpoint.token} checkpoint={checkpoint}
                                    onClick={() => navigateWithParams(checkpoint.token)}></CheckpointOverview>,
            )}
          </div>
        </CardContent>
      </Card>
  );
}
