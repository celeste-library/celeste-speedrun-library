import {Card, CardContent, CardHeader} from '@mui/material';
import React from 'react';
import {Checkpoint} from '../../generated';
import {CheckpointOverview} from './CheckpointOverview';
import './CheckpointSelect.css';

interface Props {
  checkpoints: Checkpoint[];
  onCheckpointSelect: (checkpoint: Checkpoint) => void;
}

export function CheckpointSelect({checkpoints, onCheckpointSelect}: Props) {
  return (
      <Card>
        <CardHeader title="Checkpoints"/>
        <CardContent>
          <div className="checkpoint-group">
            {checkpoints.map((checkpoint: any) =>
                <CheckpointOverview key={checkpoint.token} checkpoint={checkpoint}
                                    onClick={onCheckpointSelect}></CheckpointOverview>,
            )}
          </div>
        </CardContent>
      </Card>
  );
}