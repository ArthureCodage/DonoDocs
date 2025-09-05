import { Document, Block } from '../types';

export function exportAsMarkdown(document: Document): string {
  let markdown = `# ${document.title}\n\n`;
  
  if (document.tags.length > 0) {
    markdown += `*Tags: ${document.tags.map(tag => `#${tag}`).join(', ')}*\n\n`;
  }
  
  let listCounter = 1;
  let lastListType: string | null = null;
  
  for (const block of document.content) {
    if (block.type !== 'numberList') {
      listCounter = 1;
      lastListType = null;
    }
    
    switch (block.type) {
      case 'heading1':
        markdown += `# ${block.content}\n\n`;
        break;
      case 'heading2':
        markdown += `## ${block.content}\n\n`;
        break;
      case 'heading3':
        markdown += `### ${block.content}\n\n`;
        break;
      case 'paragraph':
        markdown += `${block.content}\n\n`;
        break;
      case 'bulletList':
        markdown += `- ${block.content}\n`;
        break;
      case 'numberList':
        if (lastListType !== 'numberList') {
          listCounter = 1;
        }
        markdown += `${listCounter}. ${block.content}\n`;
        listCounter++;
        lastListType = 'numberList';
        break;
      case 'checkbox':
        const checked = block.metadata?.checked ? 'x' : ' ';
        markdown += `- [${checked}] ${block.content}\n`;
        break;
      case 'code':
        const language = block.metadata?.language || '';
        markdown += `\`\`\`${language}\n${block.content}\n\`\`\`\n\n`;
        break;
    }
  }
  
  return markdown;
}

export function exportAsPlainText(document: Document): string {
  let text = `${document.title}\n${'='.repeat(document.title.length)}\n\n`;
  
  if (document.tags.length > 0) {
    text += `Tags: ${document.tags.join(', ')}\n\n`;
  }
  
  let listCounter = 1;
  let lastListType: string | null = null;
  
  for (const block of document.content) {
    if (block.type !== 'numberList') {
      listCounter = 1;
      lastListType = null;
    }
    
    switch (block.type) {
      case 'heading1':
        text += `${block.content}\n${'='.repeat(block.content.length)}\n\n`;
        break;
      case 'heading2':
        text += `${block.content}\n${'-'.repeat(block.content.length)}\n\n`;
        break;
      case 'heading3':
        text += `${block.content}\n\n`;
        break;
      case 'paragraph':
        text += `${block.content}\n\n`;
        break;
      case 'bulletList':
        text += `• ${block.content}\n`;
        break;
      case 'numberList':
        if (lastListType !== 'numberList') {
          listCounter = 1;
        }
        text += `${listCounter}. ${block.content}\n`;
        listCounter++;
        lastListType = 'numberList';
        break;
      case 'checkbox':
        const checked = block.metadata?.checked ? '☑' : '☐';
        text += `${checked} ${block.content}\n`;
        break;
      case 'code':
        text += `${block.content}\n\n`;
        break;
    }
  }
  
  return text;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}