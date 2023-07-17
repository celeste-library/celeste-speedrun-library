import React, {ReactElement} from 'react';
import {Strat} from '../../generated';
import {Notes} from '../note/Notes';
import './StratDetail.css';

interface Props {
  strat: Strat;
}

function stratDescriptionParser(description: string): (string | ReactElement)[] {
  return description.split(/(\[img].*?\[\/img])/)
      .map(item => {
        if (item.startsWith('[img]') && item.endsWith('[/img]')) {
          const filename = item.replace('[img]', '').replace('[/img]', '');
          const url = `https://media.celestespeed.run/strats/${filename}`;
          return <img className='inline-media' src={url} alt={filename}/>;
        }
        return <p>{item}</p>;
      });
}

export function StratDetail({strat}: Props) {
  return (
      <div className='description-container'>
        {stratDescriptionParser(strat.description ?? '')}
        {strat.notes && <Notes notes={strat.notes}></Notes>}
      </div>
  );
}
