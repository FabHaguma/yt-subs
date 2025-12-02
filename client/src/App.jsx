import { useState } from 'react';
import { Header, Footer, SearchBar, VideoCard, ContentPanel } from './components';
import { fetchMetadata, fetchSubtitles, summarizeText, searchContent } from './services/api';
import { formatSubtitlesForCopy, downloadSubtitles, copyToClipboard, getFullText } from './utils/subtitles';
import styles from './App.module.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [rawSubtitles, setRawSubtitles] = useState('');
  const [activeTab, setActiveTab] = useState('subtitles');
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleFetchVideo = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setMetadata(null);
    setSubtitles([]);
    setSummary('');
    setChatResponse('');

    try {
      const metaData = await fetchMetadata(url);
      setMetadata(metaData);

      const subData = await fetchSubtitles(url);
      setSubtitles(subData.parsed);
      setRawSubtitles(subData.raw);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch video data. Make sure the video has English subtitles.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (withTimestamps) => {
    const text = formatSubtitlesForCopy(subtitles, withTimestamps);
    await copyToClipboard(text);
    alert('Copied to clipboard!');
  };

  const handleDownload = (format) => {
    downloadSubtitles({
      subtitles,
      rawSubtitles,
      title: metadata?.title,
      channel: metadata?.channel,
      format,
    });
  };

  const handleSummarize = async () => {
    if (summary) return;
    setSummaryLoading(true);
    try {
      const text = getFullText(subtitles);
      const result = await summarizeText(text);
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      alert('Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatQuery) return;
    setChatLoading(true);
    try {
      const text = getFullText(subtitles);
      const result = await searchContent(text, chatQuery);
      setChatResponse(result.answer);
    } catch (error) {
      console.error(error);
      alert('Failed to get answer');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <SearchBar
        url={url}
        setUrl={setUrl}
        onSubmit={handleFetchVideo}
        loading={loading}
      />

      {loading && <div className={styles.loading}>Fetching video data and subtitles...</div>}

      {metadata && (
        <div className={styles.grid}>
          <VideoCard metadata={metadata} />
          
          <ContentPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            subtitles={subtitles}
            summary={summary}
            summaryLoading={summaryLoading}
            chatQuery={chatQuery}
            setChatQuery={setChatQuery}
            chatResponse={chatResponse}
            chatLoading={chatLoading}
            onSummarize={handleSummarize}
            onChat={handleChat}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
