import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createTheme, CssBaseline, ThemeProvider, Toolbar} from '@mui/material';
import {blue, purple} from '@mui/material/colors';
import React, {useState} from 'react';
import './App.css';
import {ChapterTree} from './components/chapter-tree/ChapterTree';
import {MenuBar} from './components/MenuBar';
import {Filters} from './generated';

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

function App() {
  const [filters, setFilters] = useState<Filters>({});
  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline></CssBaseline>
        <MenuBar filters={filters} onFiltersSet={setFilters}></MenuBar>
        <Toolbar/>
        <ChapterTree filters={filters}></ChapterTree>
      </ThemeProvider>
  );
}

export default App;
