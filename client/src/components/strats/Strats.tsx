import {Typography} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {DefaultApi, DefaultApiInterface, Strat} from '../../generated';
import {StratOverview} from '../strat-overview/StratOverview';

interface Props {
  room?: string;
}

export function Strats({room}: Props) {
  const api: DefaultApiInterface = useMemo(() => new DefaultApi(), []);
  const [strats, setStrats] = useState<Strat[]>([]);
  const [searchParams, _] = useSearchParams();
  const category = searchParams.get('category') ?? undefined;

  useEffect(() => {
    if (room) {
      api.getStrats({
        room: room,
        category: category,
      }).then(setStrats);
    } else {
      setStrats([]);
    }
  }, [room, api]);

  return (
      <div>
        <Typography variant="h5">Strats</Typography>
        {strats?.map((strat: Strat, index: number) => <StratOverview key={index} strat={strat}></StratOverview>)}
      </div>
  );
}
