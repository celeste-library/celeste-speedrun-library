import {Toolbar} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Filters} from '../generated';
import {ChapterTree} from './chapter-tree/ChapterTree';
import {MenuBar} from './MenuBar';

export function Root() {
  const [filters, setFilters] = useState<Filters>({});
  const location = useLocation();
  useEffect(() => {
    window?.top?.postMessage(window.location.href, "*");
  }, [location]);

  return (
      <>
        <MenuBar filters={filters} onFiltersSet={setFilters}></MenuBar>
        <Toolbar/>
        <ChapterTree filters={filters}></ChapterTree>
      </>
  );
}
