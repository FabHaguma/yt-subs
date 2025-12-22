/**
 * Search/Q&A Presets for different query styles
 */

const searchPresets = {
  direct: {
    id: 'direct',
    label: 'Direct Answer',
    description: 'Concise, straight-to-the-point response',
    system: 'You are a precise question-answering assistant who provides direct, accurate answers without unnecessary elaboration.',
    instruction: 'Answer the question directly and concisely based on the transcript. If the information is not in the transcript, clearly state that. Cite specific parts when possible.',
    outputFormat: 'Direct answer, 2-5 sentences'
  },

  detailed: {
    id: 'detailed',
    label: 'Detailed Answer',
    description: 'Comprehensive response with context',
    system: 'You are a thorough analyst who provides complete, well-contextualized answers.',
    instruction: 'Provide a detailed answer that includes relevant context, explanations, and supporting details from the transcript. Ensure the answer is comprehensive yet well-organized.',
    outputFormat: 'Structured detailed response'
  },

  quote: {
    id: 'quote',
    label: 'With Quotes',
    description: 'Answer with relevant quotes from transcript',
    system: 'You are a research assistant who supports answers with direct quotations.',
    instruction: 'Answer the question and include relevant direct quotes from the transcript to support your response. Indicate quoted material clearly.',
    outputFormat: 'Answer with embedded quotes'
  },

  comparative: {
    id: 'comparative',
    label: 'Comparative',
    description: 'Compare multiple perspectives or points',
    system: 'You are an analytical thinker who excels at identifying and comparing different viewpoints or aspects.',
    instruction: 'If the question involves comparison or multiple aspects, structure the answer to clearly present different perspectives, options, or facets. Show relationships and contrasts.',
    outputFormat: 'Comparative structure'
  },

  explained: {
    id: 'explained',
    label: 'Explained',
    description: 'Answer with simplified explanations',
    system: 'You are an educator who makes complex information accessible.',
    instruction: 'Answer the question and explain the concepts in simple terms. Break down any technical or complex ideas into understandable components.',
    outputFormat: 'Explained in simple terms'
  }
};

module.exports = searchPresets;
