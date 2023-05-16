import {Breadcrumbs, Container, Link} from '@mui/material';
import {OrderedMap} from 'immutable';
import React from 'react';
import {Link as RouterLink, Outlet, useMatches} from 'react-router-dom';
import {Filters} from '../../generated';

interface Props {
  filters?: Filters;
}

interface RouteHandle {
  crumbs: (loadedData: any) => [string, string][];
  title: (loadedData: any) => string;
}

export function ChapterTree({filters}: Props) {
  const matches = useMatches() as {pathname: string, handle: RouteHandle, data: any}[];
  const crumbs = matches
      .filter(match => match.handle)
      .reduce((breadcrumbs: OrderedMap<string, string>, match) => {
        if (match.handle.crumbs) {
          const temp = OrderedMap(match.handle.crumbs(match.data)).mapKeys(key => match.pathname + key);
          return breadcrumbs.concat(temp);
        } else if (match.handle.title) {
          return breadcrumbs.set(match.pathname, match.handle.title(match.data));
        } else {
          return breadcrumbs;
        }
      }, OrderedMap<string, string>());

  return (
      <Container>
        <Breadcrumbs aria-label="breadcrumb">
          {crumbs.toArray().map(([path, label]: [string, string]) => (
              <Link component={RouterLink} to={path} key={path}>{label}</Link>
          ))}
        </Breadcrumbs>
        <Outlet />
      </Container>
  );
}
