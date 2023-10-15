import {Card, CardContent} from '@mui/material';
import React from 'react';
import {Strat} from '../../generated';
import {StratDetail} from '../strat-detail/StratDetail';
import {StratVideo} from '../video-embed/StratVideo';
import './StratOverview.css';

interface Props {
  strat: Strat;
}

export function StratOverview({strat}: Props) {
  return (
      <Card sx={{marginY: 1}}>
        <CardContent>
          <div className="strat-row">
            <div className="strat-info">
              <StratDetail strat={strat}></StratDetail>
            </div>
            <div className="strat-media">
              {strat.media?.map((media) => {
                if (media.mimetype?.startsWith('video')) {
                  return <StratVideo key={media.url} url={media.url} framerate={media.framerate}/>;
                } else if (media.mimetype?.startsWith('image')) {
                  return <img key={media.url} src={media.url} alt=""/>;
                }
                return null;
              })}
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
