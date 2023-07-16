import React from 'react';
import {LoaderFunctionArgs, useLoaderData} from 'react-router-dom';
import './DiscordVideo.css';

export function getAttachmentId({params}: LoaderFunctionArgs): string {
  return params.parentDir + '/' + params.childDir + '/' + params.filename;
}

export function DiscordVideo() {
  const attachmentId = useLoaderData() as ReturnType<typeof getAttachmentId>;
  const url = 'https://media.discordapp.net/attachments/' + attachmentId;
  return (
        <video className='video' src={url} controls></video>
  );
}
