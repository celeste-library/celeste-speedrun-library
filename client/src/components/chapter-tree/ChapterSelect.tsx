import {Card, CardHeader} from '@mui/material';
import {List} from 'immutable';
import React from 'react';
import {Chapter} from '../../generated';
import {ChapterOverview} from './ChapterOverview';
import './ChapterSelect.css';

interface Props {
  chapters: Chapter[];
  onChapterSelect: (chapter: Chapter) => void;
}

export function ChapterSelect({chapters, onChapterSelect}: Props) {
  const groupedChapters = List<Chapter>(chapters).groupBy(chapter => chapter.group);
  return (
      <Card>
        <CardHeader title="Chapters" />
        <div className="chapter-table">
          {groupedChapters.toList().map((chapterGroup, index) =>
              <div className="chapter-group" key={index}>
                {chapterGroup.toList().map((chapter, index) =>
                    <div className="chapter-tile" key={index}>
                      <ChapterOverview chapter={chapter} onClick={onChapterSelect}></ChapterOverview>
                    </div>
                )}
              </div>,
          )}
        </div>
      </Card>
  );
}
