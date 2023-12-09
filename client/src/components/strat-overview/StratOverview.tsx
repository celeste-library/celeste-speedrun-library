import LinkIcon from '@mui/icons-material/Link';
import {Card, CardContent, IconButton} from '@mui/material';
import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Strat} from '../../generated';
import {StratContent} from '../strat-content/StratContent';
import {StratMedia} from './StratMedia';
import './StratOverview.css';
import {StratSources} from './StratSources';

interface Props {
  strat: Strat;
}

export function StratOverview({strat}: Props) {
  return (
      <Card sx={{marginY: 1}}>
        <CardContent>
          <div className="strat-row">
            <div className="strat-info">
              <div className="strat-header">
                <StratSources sources={strat?.sources}/>
                <div>
                  <IconButton component={RouterLink} to={strat.token} relative="route"><LinkIcon/></IconButton>
                </div>
              </div>
              <StratContent strat={strat}></StratContent>
            </div>
            <div className="strat-media">
              <StratMedia media={strat.media}></StratMedia>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
