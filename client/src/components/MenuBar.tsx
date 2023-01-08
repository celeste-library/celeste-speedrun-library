import {AppBar, Box, Toolbar} from '@mui/material';
import React from 'react';
import {Filters} from '../generated';
import {CategoryFilter} from './filters/CategoryFilter';
import {GithubLink} from './GithubLink';

interface Props {
  filters: Filters;
  onFiltersSet: (filters: Filters) => void;
}

export function MenuBar({filters, onFiltersSet}: Props) {
  const setCategory = (category: string) => {
    onFiltersSet({
      ...filters,
      category: category,
    });
  };

  return (
      <AppBar position="fixed">
        <Toolbar>
          Filters
          <CategoryFilter selectedCategory={filters.category} onCategorySelect={setCategory}></CategoryFilter>
          <Box sx={{flexGrow: 1}}>
          </Box>
          <Box sx={{flexGrow: 0}}>
            <GithubLink></GithubLink>
          </Box>
        </Toolbar>
      </AppBar>
  );
}
