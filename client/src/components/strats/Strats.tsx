import {Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {DefaultApi, DefaultApiInterface, Filters, Strat} from '../../generated';
import {StratOverview} from '../strat-overview/StratOverview';

interface Props {
  chapter?: string;
  room?: string;
  filters?: Filters;
}

export function Strats({chapter, room, filters}: Props) {
  const api: DefaultApiInterface = new DefaultApi();
  const [strats, setStrats] = useState<Strat[]>([]);

  useEffect(() => {
    if (chapter && room) {
      api.getStrats({
        chapter: chapter,
        room: room,
        category: filters?.category,
      }).then(setStrats);
    } else {
      setStrats([]);
    }
  }, [chapter, room, filters]);

  return (
      <div>
        <Typography variant="h5">Strats</Typography>
        {strats?.map((strat: Strat, index: number) => <StratOverview key={index} strat={strat}></StratOverview>)}
      </div>
  );
}
