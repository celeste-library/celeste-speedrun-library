import {IconButton, SvgIcon} from '@mui/material';
import React from 'react';
import {ReactComponent as GithubLogo} from '../github-mark-white.svg';

export function GithubLink() {
  return (
      <IconButton href="https://github.com/celeste-library"
          aria-label="GitHub">
        <SvgIcon component={GithubLogo} viewBox="0 0 96 96" />
      </IconButton>
  );
}
