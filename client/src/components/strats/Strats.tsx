import {Typography} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {DefaultApi, DefaultApiInterface, Filters, Strat} from '../../generated';
import {StratOverview} from '../strat-overview/StratOverview';

interface Props {
  room?: string;
  filters?: Filters;
}

export function Strats({room, filters}: Props) {
  const api: DefaultApiInterface = useMemo(() => new DefaultApi(), []);
  const [strats, setStrats] = useState<Strat[]>([]);

  useEffect(() => {
    if (room) {
      api.getStrats({
        room: room,
        category: filters?.category,
      }).then(setStrats);
    } else {
      setStrats([]);
    }
  }, [room, filters, api]);

  return (
      <div>
        <Typography variant="h5">Strats</Typography>
        {strats?.map((strat: Strat, index: number) => <StratOverview key={index} strat={strat}></StratOverview>)}
      </div>
  );
}
