import React from 'react';
import './ChapterOverview.css';
import {Chapter} from '../../generated';

interface Props {
  chapter: Chapter;
  onClick: (chapter: Chapter) => void;
}

export function ChapterOverview({chapter, onClick}: Props) {
  return (
      chapter && <div className="chapter-box" onClick={() => onClick(chapter)}>
        <img className="chapter-thumbnail" src={chapter.image}></img>
        {chapter.name.replace('-', '-\u2060') /* Prevent line-breaks after a hyphen*/}
      </div>
  );
}
