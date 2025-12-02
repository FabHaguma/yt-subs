import { Eye, Clock, Calendar } from 'lucide-react';
import styles from './VideoCard.module.css';

// Format duration from seconds to MM:SS or HH:MM:SS
const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format YYYYMMDD to readable date
const formatDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

function VideoCard({ metadata }) {
  return (
    <div className={styles.card}>
      <img src={metadata.thumbnail} alt={metadata.title} className={styles.thumbnail} />
      <h2 className={styles.videoTitle}>{metadata.title}</h2>
      <div className={styles.metaInfo}>
        <div className={styles.metaItem}>
          <Eye size={16} /> {Number(metadata.viewCount).toLocaleString()} views
        </div>
        <div className={styles.metaItem}>
          <Clock size={16} /> {formatDuration(metadata.duration)}
        </div>
        <div className={styles.metaItem}>
          <Calendar size={16} /> {formatDate(metadata.uploadDate)}
        </div>
      </div>
      <div className={styles.metaItem}>Channel: {metadata.channel}</div>
    </div>
  );
}

export default VideoCard;
