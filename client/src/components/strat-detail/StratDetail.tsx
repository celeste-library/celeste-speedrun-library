import React from 'react';
import {Strat} from '../../generated';
import {Notes} from '../note/Notes';

interface Props {
  strat: Strat;
}

export function StratDetail({strat}: Props) {
  return (
      <div>
        <p>{strat.description}</p>
        {strat.notes && <Notes notes={strat.notes}></Notes>}
      </div>
  );
}