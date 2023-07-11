import {Box, Button, TextField} from '@mui/material';
import React, {FormEvent, useState} from 'react';
import './DiscordVideo.css';
import {useNavigate} from 'react-router-dom';

export function VideoInput() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleInput = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUrl(event?.currentTarget?.value);
  }

  const generateLink = () => {
    const postSplit = url.split("/attachments/");
    if (postSplit.length > 1) {
      navigate(postSplit[1]);
    }
  };

  return (
      <Box display="flex"
           flexDirection="column"
           alignContent="center"
           padding="20px">
        <TextField fullWidth label="URL" value={url} onChange={handleInput} />
        <Button onClick={generateLink}>Generate Link</Button>
      </Box>
  );
}
