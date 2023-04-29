import {Toolbar} from '@mui/material';
import React, {useState} from 'react';
import {Filters} from '../generated';
import {ChapterTree} from './chapter-tree/ChapterTree';
import {MenuBar} from './MenuBar';

export function Root() {
  const [filters, setFilters] = useState<Filters>({});

  return (
      <>
        <MenuBar filters={filters} onFiltersSet={setFilters}></MenuBar>
        <Toolbar/>
        <ChapterTree filters={filters}></ChapterTree>
      </>
  );
}
