import {Popover} from '@mui/material';
import React from 'react';
import {Room} from '../../generated';
import './RoomOverview.css';

interface Props {
  room: Room;
  onClick: (room: Room) => void;
}

export function RoomOverview({room, onClick}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
      <div className="room-box" onClick={() => onClick(room)}>
        <img className="room-thumbnail" src={room.imagePreview} alt={room.code}
             onMouseEnter={handlePopoverOpen}
             onMouseLeave={handlePopoverClose}></img>
        <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: -24,
              horizontal: 'center',
            }}
            transitionDuration={150}
            marginThreshold={24}
            onClose={handlePopoverClose}
            keepMounted
            disableScrollLock
            disableRestoreFocus>
          <div className="popover-image-wrapper">
            <img className="room-full-image" src={room.imageFull} alt={room.code}></img>
          </div>
        </Popover>
        {room.code}
      </div>
  );
}
