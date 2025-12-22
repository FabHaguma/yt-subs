import { useEffect, useState } from 'react';
import { Header, Footer, SearchBar, VideoCard, ContentPanel, ErrorModal } from './components';
import { fetchMetadata, fetchSubtitles, summarizeText, searchContent, getPresets } from './services/api';
import { formatSubtitlesForCopy, downloadSubtitles, copyToClipboard, getFullText } from './utils/subtitles';
import styles from './App.module.css';

function App() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [rawSubtitles, setRawSubtitles] = useState('');
  const [activeTab, setActiveTab] = useState('subtitles');
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryMode, setSummaryMode] = useState('standard');
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMode, setChatMode] = useState('direct');
  const [presets, setPresets] = useState({ summary: [], search: [], extract: [], chat: [] });
  const [dialog, setDialog] = useState({ message: '', tone: 'error' });
  const [theme, setTheme] = useState(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Fetch available AI presets
    const loadPresets = async () => {
      try {
        const data = await getPresets();
        setPresets(data);
      } catch (error) {
        console.error('Failed to load AI presets:', error);
      }
    };
    loadPresets();
  }, []);

  const handleFetchVideo = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setMetadata(null);
    setSubtitles([]);
    setSummary('');
    setChatResponse('');

    try {
      // Fetch metadata
      const metaData = await fetchMetadata(url);
      setMetadata(metaData);

      // Fetch subtitles in JSON format
      const subData = await fetchSubtitles(url, 'json');
      
      // console.log('Subtitle data received:', subData); // Debug log
      
      // The backend returns the whole result object when format is 'json'
      let transcriptData = subData;
      
      // If it has a content property, parse it
      if (subData.content) {
        transcriptData = typeof subData.content === 'string' 
          ? JSON.parse(subData.content) 
          : subData.content;
      }
      
      // Convert to the format expected by the UI
      // youtube-transcript returns: [{ text, duration, offset }, ...]
      const formattedSubs = Array.isArray(transcriptData) 
        ? transcriptData.map(item => ({
            start: formatTime((item.offset || 0) / 1000),
            end: formatTime(((item.offset || 0) + (item.duration || 0)) / 1000),
            text: item.text || ''
          }))
        : [];
      
      // console.log('Formatted subtitles:', formattedSubs); // Debug log
      
      setSubtitles(formattedSubs);
      setRawSubtitles(JSON.stringify(transcriptData, null, 2));
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setDialog({ message: `Failed to fetch video data: ${errorMessage}\n\nMake sure the video has subtitles available.`, tone: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopy = async (withTimestamps) => {
    const text = formatSubtitlesForCopy(subtitles, withTimestamps);
    await copyToClipboard(text);
    setDialog({ message: 'Copied to clipboard!', tone: 'info' });
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



  const handleSummarize = async (forceRegenerate = false) => {
    if (summary && !forceRegenerate) return;
    setSummaryLoading(true);
    try {
      const text = getFullText(subtitles);
      const result = await summarizeText(text, summaryMode);
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      setDialog({ message: 'Failed to generate summary', tone: 'error' });
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSummaryModeChange = (newMode) => {
    setSummaryMode(newMode);
    // Keep the existing summary visible so the regenerate button stays visible
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatQuery) return;
    setChatLoading(true);
    try {
      const text = getFullText(subtitles);
      const result = await searchContent(text, chatQuery, chatMode);
      setChatResponse(result.answer);
    } catch (error) {
      console.error(error);
      setDialog({ message: 'Failed to get answer', tone: 'error' });
    } finally {
      setChatLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={styles.container}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

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
            summaryMode={summaryMode}
            onSummaryModeChange={handleSummaryModeChange}
            chatQuery={chatQuery}
            setChatQuery={setChatQuery}
            chatResponse={chatResponse}
            chatLoading={chatLoading}
            chatMode={chatMode}
            onChatModeChange={setChatMode}
            presets={presets}
            onSummarize={handleSummarize}
            onChat={handleChat}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        </div>
      )}

      <Footer />

      <ErrorModal
        isOpen={!!dialog.message}
        title={dialog.tone === 'info' ? 'Notice' : 'Error'}
        tone={dialog.tone}
        message={dialog.message}
        onClose={() => setDialog({ message: '', tone: 'error' })}
      />
    </div>
  );
}

export default App;
