import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {blue, purple} from '@mui/material/colors';
import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './App.css';
import {ChapterSelect, getChaptersLoader, showChapterLoader} from './components/chapter-tree/ChapterSelect';
import {CheckpointSelect, getCheckpointsLoader, showCheckpointLoader} from './components/chapter-tree/CheckpointSelect';
import {getRoomDetailsLoader, RoomDetails} from './components/chapter-tree/RoomDetails';
import {getRoomsLoader, RoomSelect} from './components/chapter-tree/RoomSelect';
import {Root} from './components/Root';
import {Chapter, Checkpoint, Room} from './generated';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: purple[500],
    },
  },
  spacing: 10,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    // errorElement: <div>URL not found</div>,
    handle: {
      title: () => 'Home',
    },
    children: [
      {
        path: '',
        loader: getChaptersLoader,
        element: <ChapterSelect/>,
      },
      {
        path: ':chapterToken',
        loader: showChapterLoader,
        handle: {
          title: (chapter: Chapter) => chapter.name,
        },
        children: [
          {
            path: '',
            loader: getCheckpointsLoader,
            element: <CheckpointSelect/>,
          },
          {
            path: ':checkpointToken',
            loader: showCheckpointLoader,
            handle: {
              title: (checkpoint: Checkpoint) => checkpoint.name,
            },
            children: [
              {
                path: '',
                loader: getRoomsLoader,
                element: <RoomSelect/>,
              },
            ],
          },
          {
            path: 'room/:roomToken',
            loader: getRoomDetailsLoader,
            element: <RoomDetails/>,
            handle: {
              crumbs: (room: Room) => [
                ['/../../' + room.checkpoint?.token, room.checkpoint?.name],
                ['/../' + room.token, room.code],
              ],
              title: (room: Room) => room.code,
            },
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline></CssBaseline>
        <RouterProvider router={router} />
      </ThemeProvider>
  );
}

export default App;
