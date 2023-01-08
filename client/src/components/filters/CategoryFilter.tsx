import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {Category, DefaultApi, DefaultApiInterface} from '../../generated';

interface Props {
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
}


export function CategoryFilter({selectedCategory, onCategorySelect}: Props) {
  const api: DefaultApiInterface = new DefaultApi();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof selectedCategory>) => {
    onCategorySelect(
        // On autofill we get a stringified value.
        // typeof value === 'string' ? value.split(',') : value,
        event.target.value as string
    );
  };

  return (
      <FormControl sx={{m: 1, width: 250}} size="small">
        <InputLabel>Category</InputLabel>
        <Select label="Category" value={selectedCategory ?? ''} onChange={handleChange}>
          {categories.map(category => (
              <MenuItem key={category.token} value={category.token}>{category.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}
