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
              <table>
                <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{strat.name}</td>
                </tr>
                <tr>
                  <td>Start Point:</td>
                  <td>{strat.start}</td>
                </tr>
                <tr>
                  <td>End Point:</td>
                  <td>{strat.end}</td>
                </tr>
                <tr>
                  <td>Difficulty:</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>Time:</td>
                  <td>{}</td>
                </tr>
                </tbody>
              </table>
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
          <div>
            <StratDetail strat={strat}></StratDetail>
          </div>
        </CardContent>
      </Card>
  );
}
