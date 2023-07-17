import React from 'react';
import {VideoJS} from './VideoJS'
import './DiscordVideo.css';

interface StratVideoProps {
  url: string;
  framerate?: number; // TODO: use it later
}

export function StratVideo({url, framerate}: StratVideoProps) {
  const options = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    loop: true,

    sources: [{src: url}],
  };

  return (
    <div>
      <VideoJS options={{...options}}/>
    </div>
  );
}
