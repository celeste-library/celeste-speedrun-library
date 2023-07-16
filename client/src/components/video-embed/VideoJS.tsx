import {useEffect, useRef} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';


// TODO: receive and use framerate
interface Props {
  options: videojs.PlayerOptions;
  onReady?: (player: videojs.Player) => void;
}

/*
 * This is a generic component for a video.js player.
 * Reference: https://videojs.com/guides/react/
 */
export function VideoJS({options, onReady}: Props) {
  const videoRef = useRef<HTMLDivElement>(null);
  //const [player, setPlayer] = useState<null | videojs.Player>(null);

  useEffect(() => {
    if (videoRef.current) {
      // create the player
      const videoJSElement = document.createElement('video-js');
      videoJSElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoJSElement);

      const player = videojs(videoJSElement, options, () => {
        onReady && onReady(player);
      });

      return () => {
        if (player && !player.isDisposed()) {
          player.dispose();
        }
      };
    }
  }, [options, onReady, videoRef]);

  // Outer div wrapper makes React Strict Mode happy:
  return (
    <div data-vjs-player>
      <div ref={videoRef}/>
    </div>
  );
}
