import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Code, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  CheckSquare,
  Type,
  Download,
  Moon,
  Sun
} from 'lucide-react';
import { BlockType, Document } from '../types';
import { exportAsMarkdown, exportAsPlainText, downloadFile } from '../utils/exportUtils';

interface ToolbarProps {
  onBlockTypeChange: (type: BlockType) => void;
  onFormatText: (format: 'bold' | 'italic' | 'underline' | 'link') => void;
  currentDocument: Document | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const blockTypeButtons: { type: BlockType; icon: React.ElementType; label: string }[] = [
  { type: 'paragraph', icon: Type, label: 'Paragraph' },
  { type: 'heading1', icon: Heading1, label: 'Heading 1' },
  { type: 'heading2', icon: Heading2, label: 'Heading 2' },
  { type: 'heading3', icon: Heading3, label: 'Heading 3' },
  { type: 'bulletList', icon: List, label: 'Bullet List' },
  { type: 'numberList', icon: ListOrdered, label: 'Numbered List' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
  { type: 'code', icon: Code, label: 'Code Block' },
];

const formatButtons: { format: 'bold' | 'italic' | 'underline' | 'link'; icon: React.ElementType; label: string }[] = [
  { format: 'bold', icon: Bold, label: 'Bold' },
  { format: 'italic', icon: Italic, label: 'Italic' },
  { format: 'underline', icon: Underline, label: 'Underline' },
  { format: 'link', icon: Link, label: 'Link' },
];

export function Toolbar({ 
  onBlockTypeChange, 
  onFormatText, 
  currentDocument, 
  darkMode, 
  toggleDarkMode 
}: ToolbarProps) {
  const handleExport = (format: 'md' | 'txt') => {
    if (!currentDocument) return;
    
    const content = format === 'md' 
      ? exportAsMarkdown(currentDocument)
      : exportAsPlainText(currentDocument);
    
    const filename = `${currentDocument.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
    
    downloadFile(content, filename, mimeType);
  };

  return (
    <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} px-6 py-3 flex items-center gap-2 flex-wrap`}>
      {/* Block Type Buttons */}
      <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
        {blockTypeButtons.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onBlockTypeChange(type)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            title={label}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Format Buttons */}
      <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
        {formatButtons.map(({ format, icon: Icon, label }) => (
          <button
            key={format}
            onClick={() => onFormatText(format)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            title={label}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
        <button
          onClick={() => handleExport('md')}
          disabled={!currentDocument}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Export as Markdown"
        >
          <Download size={18} />
          <span className="ml-1 text-xs">MD</span>
        </button>
        <button
          onClick={() => handleExport('txt')}
          disabled={!currentDocument}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Export as Text"
        >
          <Download size={18} />
          <span className="ml-1 text-xs">TXT</span>
        </button>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
        title={darkMode ? 'Light Mode' : 'Dark Mode'}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}