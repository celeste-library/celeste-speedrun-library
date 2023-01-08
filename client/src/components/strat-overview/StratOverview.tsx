import {Card, CardContent} from '@mui/material';
import React from 'react';
import {Strat} from '../../generated';
import {StratDetail} from '../strat-detail/StratDetail';
import './StratOverview.css';

interface Props {
  strat: Strat;
}

export function StratOverview({strat}: Props) {
  return (
      <Card sx={{marginY: 1}}>
        <CardContent>
          <div className="strat-row">
            <div className="preview-wrapper">
              Gif goes here
            </div>
            <div>
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
          </div>
          <div>
            <StratDetail strat={strat}></StratDetail>
          </div>
        </CardContent>
      </Card>
  );
}