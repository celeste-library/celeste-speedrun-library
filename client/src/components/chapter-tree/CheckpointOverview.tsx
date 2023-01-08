import React from 'react';
import {Checkpoint} from '../../generated';
import './CheckpointOverview.css';

interface Props {
  checkpoint: Checkpoint;
  onClick: (checkpoint: Checkpoint) => void
}

export function CheckpointOverview({checkpoint, onClick}: Props) {
  return (
      <div className="checkpoint-box" onClick={() => onClick(checkpoint)}>
        <img className="checkpoint-thumbnail" src={checkpoint.image}></img>
        {checkpoint.name}
      </div>
  );
}
