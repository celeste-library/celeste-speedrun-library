import React from 'react';
import {Media} from '../../generated';
import {StratVideo} from '../video-embed/StratVideo';

export function StratMedia({media}: {media?: Media[]}) {
  return <>
    {media?.map((media) => {
      if (media.mimetype?.startsWith('video')) {
        return <StratVideo key={media.url} url={media.url} framerate={media.framerate}/>;
      } else if (media.mimetype?.startsWith('image')) {
        return <img key={media.url} src={media.url} alt=""/>;
      }
      return <></>;
    })}
  </>;
}
