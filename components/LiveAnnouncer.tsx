import React from 'react';

interface LiveAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({ message, politeness = 'polite' }) => {
  return (
    <div
      className="sr-only"
      aria-live={politeness}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

export default LiveAnnouncer;