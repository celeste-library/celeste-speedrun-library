import {Breadcrumbs, Container, Link} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {Chapter, Checkpoint, DefaultApi, DefaultApiInterface, Filters, Room} from '../../generated';
import {ChapterSelect} from './ChapterSelect';
import {CheckpointSelect} from './CheckpointSelect';
import {RoomDetails} from './RoomDetails';
import {RoomSelect} from './RoomSelect';

interface Props {
  filters?: Filters;
}

export function ChapterTree({filters}: Props) {
  const api: DefaultApiInterface = useMemo(() => new DefaultApi(), []);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint>();
  const [selectedRoom, setSelectedRoom] = useState<Room>();

  useEffect(() => {
    api.getChapters().then(setChapters);
  }, [api]);

  useEffect(() => {
    setSelectedRoom(undefined);
    setSelectedCheckpoint(undefined);
    if (selectedChapter) {
      api.getCheckpoints({chapter: selectedChapter.token}).then(setCheckpoints);
    } else {
      setCheckpoints([]);
    }
  }, [selectedChapter, api]);

  useEffect(() => {
    setSelectedRoom(undefined);
    if (selectedCheckpoint) {
      api.getRooms({checkpoint: selectedCheckpoint.token}).then((res) => {
        setRooms(res);
      });
    } else {
      setRooms([]);
    }
  }, [selectedCheckpoint, api]);

  const selectConnectedRoom = (connectedRoom: Room) => {
    /*
    TODO: need to check if room belongs to current checkpoint or not.
    If not, then we need to check across the whole chapter.
    Maybe instead have an effect on the token of the selected room that selects the chapter + checkpoint?
     */
  }

  const getActivePanel = () => {
    if (selectedRoom) {
      return (
          <RoomDetails room={selectedRoom} filters={filters}
                       onConnectedRoomSelected={selectConnectedRoom}></RoomDetails>
      );
    } else if (selectedCheckpoint) {
      return (
          <RoomSelect rooms={rooms} onRoomSelect={setSelectedRoom}></RoomSelect>
      );
    } else if (selectedChapter) {
      return (
          <CheckpointSelect checkpoints={checkpoints} onCheckpointSelect={setSelectedCheckpoint}></CheckpointSelect>
      );
    } else {
      return (
          <ChapterSelect chapters={chapters} onChapterSelect={setSelectedChapter}></ChapterSelect>
      );
    }
  };

  return (
      <Container>
        <Breadcrumbs aria-label="breadcrumb">
          <Link onClick={() => setSelectedChapter(undefined)}>Home</Link>
          {selectedChapter && <Link onClick={() => setSelectedCheckpoint(undefined)}>{selectedChapter.name}</Link>}
          {selectedCheckpoint && <Link onClick={() => setSelectedRoom(undefined)}>{selectedCheckpoint.name}</Link>}
          {selectedRoom && <Link>{selectedRoom.code}</Link>}
        </Breadcrumbs>
        {getActivePanel()}
      </Container>
  );
}
