import { FileText, Sparkles, Bot } from 'lucide-react';
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
  chatQuery,
  setChatQuery,
  chatResponse,
  chatLoading,
  onSummarize,
  onChat,
  onCopy,
  onDownload,
}) {
  return (
    <div className={styles.card}>
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

      {activeTab === 'subtitles' && (
        <SubtitlesTab
          subtitles={subtitles}
          onCopy={onCopy}
          onDownload={onDownload}
        />
      )}

      {activeTab === 'summary' && (
        <SummaryTab summary={summary} loading={summaryLoading} />
      )}

      {activeTab === 'chat' && (
        <ChatTab
          query={chatQuery}
          setQuery={setChatQuery}
          response={chatResponse}
          loading={chatLoading}
          onSubmit={onChat}
        />
      )}
    </div>
  );
}

export default ContentPanel;
