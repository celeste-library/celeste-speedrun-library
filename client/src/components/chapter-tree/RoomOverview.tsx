import {Fade, Popper} from '@mui/material';
import React, {useRef} from 'react';
import {Room} from '../../generated';
import './RoomOverview.css';

interface Props {
  room: Room;
  onClick: (room: Room) => void;
}

export function RoomOverview({room, onClick}: Props) {
  const containerDivRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = () => {
    setAnchorEl(containerDivRef.current);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
      <div className="room-box" ref={containerDivRef} onClick={() => onClick(room)}>
        <img className="room-thumbnail" src={room.imagePreview} alt={room.code}
             onMouseEnter={handlePopoverOpen}
             onFocus={handlePopoverOpen}
             onMouseLeave={handlePopoverClose}
             onBlur={handlePopoverClose}></img>
        <Popper open={open} anchorEl={anchorEl} placement="bottom" transition keepMounted modifiers={[
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              padding: 8,
            },
          },
        ]}
        >
          {({TransitionProps}) => (
              <Fade {...TransitionProps} timeout={200}>
                <img className="room-full-image" src={room.imageFull}></img>
              </Fade>
          )}
        </Popper>
        {room.code}
      </div>
  );
}
