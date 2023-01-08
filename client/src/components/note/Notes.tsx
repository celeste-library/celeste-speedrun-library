import React from 'react';

interface Props {
  notes: string;
}

export function Notes({notes}: Props) {
  return (
      <p>Note: {notes}</p>
  );
}
