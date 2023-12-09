import {ReactComponent as DiscordIcon} from '../../discord_icon_white.svg';

import {IconButton, SvgIcon} from '@mui/material';
import React, {Fragment} from 'react';
import {Source} from '../../generated';

export function StratSources({sources}: {sources?: Source[]}) {
  return <div>{sources?.map(source =>
      <Fragment>
        Source:
        <IconButton href={source.url}
                    aria-label="Discord message link">
          <SvgIcon component={DiscordIcon} viewBox="0 0 128 96" />
        </IconButton>
        {source.author}
      </Fragment>
  )}
  </div>
}