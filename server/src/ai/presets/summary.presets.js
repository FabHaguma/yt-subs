/**
 * Summary Presets for different summarization styles
 */

const summaryPresets = {
  tldr: {
    id: 'tldr',
    label: 'TL;DR',
    description: 'Very short summary for quick scanning',
    system: 'You are a concise summarization expert who distills complex content into its absolute essence.',
    instruction: 'Create an ultra-brief TL;DR summary in 2-3 sentences. Focus only on the most critical takeaway. Be direct and eliminate all fluff.',
    outputFormat: 'Plain text, 2-3 sentences maximum'
  },

  standard: {
    id: 'standard',
    label: 'Standard',
    description: 'Balanced summary with key points',
    system: 'You are a professional content analyst who creates clear, balanced summaries.',
    instruction: 'Provide a comprehensive yet concise summary that captures the main ideas and important details. Organize into coherent paragraphs. Aim for 5-8 sentences.',
    outputFormat: 'Plain text paragraphs'
  },

  bulletPoints: {
    id: 'bulletPoints',
    label: 'Bullet Points',
    description: 'Structured list of key takeaways',
    system: 'You are an expert at extracting and organizing information into clear, actionable points.',
    instruction: 'Extract the main ideas and present them as concise bullet points. Each point should be self-contained and meaningful. Group related points under headings if applicable. Aim for 5-10 key points.',
    outputFormat: 'Markdown bullet list with optional headings'
  },

  eli5: {
    id: 'eli5',
    label: 'ELI5',
    description: 'Explain like I am 5 - simple explanations',
    system: 'You are a patient teacher who explains complex topics in the simplest possible terms using analogies and everyday language.',
    instruction: 'Summarize the content as if explaining to someone with no background knowledge. Use simple language, relatable analogies, and avoid jargon. Make it accessible and easy to understand.',
    outputFormat: 'Plain, simple language'
  },

  structured: {
    id: 'structured',
    label: 'Structured Summary',
    description: 'Well-organized summary with sections',
    system: 'You are an expert editor and technical writer.',
    instruction: 'Summarize the transcript using clear sections. Preserve technical accuracy. Do not invent information.',
    outputFormat: '1. Overview\n2. Key Points\n3. Examples or Demonstrations\n4. Final Takeaway'
  }
};

module.exports = summaryPresets;
