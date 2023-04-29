import {Card, CardHeader} from '@mui/material';
import {List} from 'immutable';
import React from 'react';
import {LoaderFunctionArgs, useLoaderData, useNavigate} from 'react-router-dom';
import {Chapter, DefaultApi} from '../../generated';
import {ChapterOverview} from './ChapterOverview';
import './ChapterSelect.css';

export async function getChaptersLoader(): Promise<Chapter[]> {
  const api = new DefaultApi();
  return api.getChapters();
}

export async function showChapterLoader({params}: LoaderFunctionArgs): Promise<Chapter | undefined> {
  const api = new DefaultApi();
  if (params.chapterToken) {
    return api.showChapter({chapter: params.chapterToken});
  } else {
    return Promise.resolve(undefined);
  }
}

export function ChapterSelect() {
  const chapters = useLoaderData() as Awaited<ReturnType<typeof getChaptersLoader>>;
  const navigate = useNavigate();
  const groupedChapters = List<Chapter>(chapters).groupBy(chapter => chapter.group);
  return (
      <Card>
        <CardHeader title="Chapters" />
        <div className="chapter-table">
          {groupedChapters.toList().map((chapterGroup, index) =>
              <div className="chapter-group" key={index}>
                {chapterGroup.toList().map((chapter, index) =>
                    <div className="chapter-tile" key={index}>
                      <ChapterOverview chapter={chapter} onClick={() => navigate(chapter.token)}></ChapterOverview>
                    </div>
                )}
              </div>,
          )}
        </div>
      </Card>
  );
}
