import {Toolbar} from '@mui/material';
import React, {useEffect} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {Filters} from '../generated';
import {ChapterTree} from './chapter-tree/ChapterTree';
import {MenuBar} from './MenuBar';

export function Root() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  useEffect(() => {
    window?.top?.postMessage(window.location.href, "*");
  }, [location]);
  const filters = Object.fromEntries(searchParams) as Filters;
  const setFilters = (filters: Filters) => {
    setSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null)));
  }

  return (
      <>
        <MenuBar filters={filters} onFiltersSet={setFilters}></MenuBar>
        <Toolbar/>
        <ChapterTree></ChapterTree>
      </>
  );
}
