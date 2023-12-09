import {Card, CardContent} from '@mui/material';
import React from 'react';
import {LoaderFunctionArgs, useLoaderData} from 'react-router-dom';
import {DefaultApi, Strat} from '../../generated';
import {StratContent} from '../strat-content/StratContent';
import {StratMedia} from './StratMedia';
import './StratOverview.css';
import {StratSources} from './StratSources';

export async function getStratLoader({params}: LoaderFunctionArgs): Promise<Strat | undefined> {
  const api = new DefaultApi();
  if (params.stratToken) {
    return api.showStrat({strat: params.stratToken});
  } else {
    return Promise.resolve(undefined);
  }
}

export function StratDetails() {
  const strat = useLoaderData() as Awaited<ReturnType<typeof getStratLoader>>;
  if (!strat) {
    return <></>;
  }
  return <Card>
    <CardContent>
      <div className="strat-row">
        <div className="strat-info">
          <StratSources sources={strat.sources}/>
          <StratContent strat={strat}></StratContent>
        </div>
        <div className="strat-media">
          <StratMedia media={strat.media}></StratMedia>
        </div>
      </div>
    </CardContent>
  </Card>
}
