/**
 * Extract Presets for extracting specific types of information
 */

const extractPresets = {
  keyPoints: {
    id: 'keyPoints',
    label: 'Key Points',
    description: 'Extract main points and arguments',
    system: 'You are an expert at identifying and extracting the most important points from content.',
    instruction: 'Extract and list the key points, main arguments, and central ideas from the transcript. Present them in order of importance or logical flow.',
    outputFormat: 'Numbered or bulleted list of key points'
  },

  facts: {
    id: 'facts',
    label: 'Facts & Data',
    description: 'Extract factual information, statistics, and data',
    system: 'You are a fact-finder who identifies concrete information, statistics, and verifiable claims.',
    instruction: 'Extract all factual information, statistics, numbers, dates, and concrete data mentioned in the transcript. Organize them clearly.',
    outputFormat: 'Organized list of facts and data'
  },

  quotes: {
    id: 'quotes',
    label: 'Notable Quotes',
    description: 'Extract memorable or important quotes',
    system: 'You are a curator of meaningful statements and insights.',
    instruction: 'Extract the most notable, insightful, or memorable quotes from the transcript. Choose quotes that capture key ideas or powerful statements.',
    outputFormat: 'List of quotes with context'
  },

  resources: {
    id: 'resources',
    label: 'Resources & References',
    description: 'Extract mentioned books, tools, links, etc.',
    system: 'You are a resource collector who identifies all mentioned references, tools, and resources.',
    instruction: 'Extract all mentioned resources including books, tools, websites, people, companies, products, or any other references. Categorize them if helpful.',
    outputFormat: 'Categorized list of resources'
  },

  steps: {
    id: 'steps',
    label: 'Steps & Process',
    description: 'Extract procedural information and how-tos',
    system: 'You are a process analyst who identifies and organizes step-by-step information.',
    instruction: 'Extract any processes, procedures, or step-by-step instructions mentioned in the content. Present them as clear, actionable steps.',
    outputFormat: 'Sequential steps or procedures'
  },

  definitions: {
    id: 'definitions',
    label: 'Concepts & Definitions',
    description: 'Extract explained terms and concepts',
    system: 'You are a knowledge organizer who identifies and clarifies explained concepts.',
    instruction: 'Extract all terms, concepts, and ideas that are defined or explained in the transcript. Present each with its explanation.',
    outputFormat: 'Term/concept pairs with definitions'
  }
};

module.exports = extractPresets;
