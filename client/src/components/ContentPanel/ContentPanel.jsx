import { useState } from 'react';
import { FileText, Sparkles, Bot, Copy, Download } from 'lucide-react';
import SubtitlesTab from '../SubtitlesTab';
import SummaryTab from '../SummaryTab';
import ChatTab from '../ChatTab';
import styles from './ContentPanel.module.css';

function ContentPanel({
  activeTab,
  setActiveTab,
  subtitles,
  summary,
  summaryLoading,
  summaryMode,
  onSummaryModeChange,
  chatQuery,
  setChatQuery,
  chatResponse,
  chatLoading,
  chatMode,
  onChatModeChange,
  presets,
  onSummarize,
  onChat,
  onCopy,
  onDownload,
}) {
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const handleCopyWithTime = () => {
    onCopy(true);
    setCopyMenuOpen(false);
  };

  const handleCopyWithoutTime = () => {
    onCopy(false);
    setCopyMenuOpen(false);
  };

  const handleDownloadFormat = (format) => {
    onDownload(format);
    setDownloadMenuOpen(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'subtitles' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('subtitles')}
          >
            <FileText size={18} className={styles.tabIcon} /> Subtitles
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'summary' ? styles.activeTab : ''}`}
            onClick={() => {
              setActiveTab('summary');
              onSummarize();
            }}
          >
            <Sparkles size={18} className={styles.tabIcon} /> AI Summary
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'chat' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <Bot size={18} className={styles.tabIcon} /> AI Chat
          </button>
        </div>

        {activeTab === 'subtitles' && subtitles.length > 0 && (
          <div className={styles.actionButtons}>
            <div className={styles.dropdownContainer}>
              <button
                className={styles.actionButton}
                onClick={() => setCopyMenuOpen(!copyMenuOpen)}
              >
                <Copy size={16} /> Copy
              </button>
              {copyMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleCopyWithTime} className={styles.menuItem}>
                    Copy w/ Time
                  </button>
                  <button onClick={handleCopyWithoutTime} className={styles.menuItem}>
                    Copy Text Only
                  </button>
                </div>
              )}
            </div>

            <div className={styles.dropdownContainer}>
              <button
                className={styles.actionButton}
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              >
                <Download size={16} /> Download
              </button>
              {downloadMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => handleDownloadFormat('txt')} className={styles.menuItem}>
                    TXT
                  </button>
                  <button onClick={() => handleDownloadFormat('srt')} className={styles.menuItem}>
                    SRT
                  </button>
                  <button onClick={() => handleDownloadFormat('json')} className={styles.menuItem}>
                    JSON
                  </button>
                  <button onClick={() => handleDownloadFormat('vtt')} className={styles.menuItem}>
                    VTT
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === 'subtitles' && (
        <SubtitlesTab subtitles={subtitles} />
      )}

      {activeTab === 'summary' && (
        <SummaryTab 
          summary={summary} 
          loading={summaryLoading}
          mode={summaryMode}
          onModeChange={onSummaryModeChange}
          availableModes={presets.summary}
          onGenerate={() => onSummarize(true)}
        />
      )}

      {activeTab === 'chat' && (
        <ChatTab
          query={chatQuery}
          setQuery={setChatQuery}
          response={chatResponse}
          loading={chatLoading}
          onSubmit={onChat}
          mode={chatMode}
          onModeChange={onChatModeChange}
          availableModes={presets.search}
        />
      )}
    </div>
  );
}

export default ContentPanel;
