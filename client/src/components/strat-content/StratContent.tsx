import React, {ReactElement} from 'react';
import {Strat} from '../../generated';
import {Notes} from '../note/Notes';
import './StratContent.css';

function stratDescriptionParser(description: string): (string | ReactElement)[] {
  return description.split(/(\[img].*?\[\/img])/)
      .map((item, index) => {
        if (item.startsWith('[img]') && item.endsWith('[/img]')) {
          const filename = item.replace('[img]', '').replace('[/img]', '');
          const url = `https://media.celestespeed.run/strats/${filename}`;
          return <img key={index} className='inline-media' src={url} alt={filename}/>;
        }
        return <p key={index}>{item}</p>;
      });
}

export function StratContent({strat}: {strat: Strat}) {
  return (
      <div className='description-container'>
        {stratDescriptionParser(strat.description ?? '')}
        {strat.notes && <Notes notes={strat.notes}></Notes>}
      </div>
  );
}
