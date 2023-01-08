import React from 'react';
import './Gfycat.css';

export interface GfycatProps {
  id: string;
  title: string;
}

export function Gfycat({id, title}: GfycatProps) {
  return (
      <div className="Gfycat-container">
        <iframe className="Gfycat-frame"
                src={'https://gfycat.com/ifr/' + id + '?hd=1'}
                title={title}
                allowFullScreen>
        </iframe>
      </div>
  );
}
