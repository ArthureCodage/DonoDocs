import React, { useState, useRef, useEffect } from 'react';
import { Block, BlockType } from '../types';
import { Check, X } from 'lucide-react';

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
  onNewBlock: (type: BlockType) => void;
  darkMode: boolean;
  isActive: boolean;
  onFocus: () => void;
}

export function BlockEditor({ 
  block, 
  onChange, 
  onDelete, 
  onNewBlock, 
  darkMode, 
  isActive,
  onFocus
}: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing, editContent.length]);

  useEffect(() => {
    setEditContent(block.content);
  }, [block.content]);

  const handleContentChange = (newContent: string) => {
    onChange({ ...block, content: newContent });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (block.type === 'code') {
        // In code blocks, allow multiline
        const newContent = editContent + '\n';
        setEditContent(newContent);
        onChange({ ...block, content: newContent });
      } else {
        // For other blocks, create a new block
        setIsEditing(false);
        onNewBlock('paragraph');
      }
    } else if (e.key === 'Backspace' && editContent === '' && block.type !== 'paragraph') {
      e.preventDefault();
      onDelete();
    }
  };

  const handleCheckboxToggle = () => {
    onChange({
      ...block,
      metadata: {
        ...block.metadata,
        checked: !block.metadata?.checked,
      },
    });
  };

  const startEditing = () => {
    setIsEditing(true);
    onFocus();
  };

  const stopEditing = () => {
    setIsEditing(false);
    handleContentChange(editContent);
  };

  const getBlockStyles = () => {
    const baseClasses = `w-full resize-none border-none outline-none bg-transparent ${
      darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
    }`;

    switch (block.type) {
      case 'heading1':
        return `${baseClasses} text-3xl font-bold py-2`;
      case 'heading2':
        return `${baseClasses} text-2xl font-semibold py-2`;
      case 'heading3':
        return `${baseClasses} text-xl font-medium py-1`;
      case 'code':
        return `${baseClasses} font-mono text-sm p-3 rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`;
      default:
        return `${baseClasses} py-1`;
    }
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={stopEditing}
          onKeyDown={handleKeyDown}
          className={getBlockStyles()}
          placeholder={getPlaceholder()}
          rows={block.type === 'code' ? Math.max(3, editContent.split('\n').length) : 1}
        />
      );
    }

    const displayContent = block.content || getPlaceholder();
    const commonClasses = `cursor-text ${
      darkMode ? 'text-white' : 'text-gray-900'
    } ${!block.content && (darkMode ? 'text-gray-400' : 'text-gray-500')}`;

    switch (block.type) {
      case 'heading1':
        return (
          <h1 
            className={`text-3xl font-bold py-2 ${commonClasses}`}
            onClick={startEditing}
          >
            {displayContent}
          </h1>
        );
      case 'heading2':
        return (
          <h2 
            className={`text-2xl font-semibold py-2 ${commonClasses}`}
            onClick={startEditing}
          >
            {displayContent}
          </h2>
        );
      case 'heading3':
        return (
          <h3 
            className={`text-xl font-medium py-1 ${commonClasses}`}
            onClick={startEditing}
          >
            {displayContent}
          </h3>
        );
      case 'bulletList':
        return (
          <div className="flex items-start gap-3 py-1">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full ${
              darkMode ? 'bg-gray-400' : 'bg-gray-600'
            }`} />
            <div 
              className={`flex-1 ${commonClasses}`}
              onClick={startEditing}
            >
              {displayContent}
            </div>
          </div>
        );
      case 'numberList':
        return (
          <div className="flex items-start gap-3 py-1">
            <span className={`mt-0.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              1.
            </span>
            <div 
              className={`flex-1 ${commonClasses}`}
              onClick={startEditing}
            >
              {displayContent}
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-start gap-3 py-1">
            <button
              onClick={handleCheckboxToggle}
              className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                block.metadata?.checked
                  ? `bg-blue-500 border-blue-500`
                  : `border-gray-300 dark:border-gray-600 ${darkMode ? 'hover:border-gray-500' : 'hover:border-gray-400'}`
              } transition-colors`}
            >
              {block.metadata?.checked && <Check size={12} className="text-white" />}
            </button>
            <div 
              className={`flex-1 ${commonClasses} ${
                block.metadata?.checked ? 'line-through opacity-60' : ''
              }`}
              onClick={startEditing}
            >
              {displayContent}
            </div>
          </div>
        );
      case 'code':
        return (
          <pre 
            className={`font-mono text-sm p-3 rounded-lg overflow-x-auto ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            } ${commonClasses}`}
            onClick={startEditing}
          >
            <code>{displayContent}</code>
          </pre>
        );
      default:
        return (
          <p 
            className={`py-1 ${commonClasses}`}
            onClick={startEditing}
          >
            {displayContent}
          </p>
        );
    }
  };

  const getPlaceholder = () => {
    switch (block.type) {
      case 'heading1':
        return 'Heading 1';
      case 'heading2':
        return 'Heading 2';
      case 'heading3':
        return 'Heading 3';
      case 'bulletList':
        return 'Bullet point';
      case 'numberList':
        return 'Numbered item';
      case 'checkbox':
        return 'To-do item';
      case 'code':
        return 'Enter code here...';
      default:
        return 'Type something...';
    }
  };

  return (
    <div 
      ref={contentRef}
      className={`group relative ${
        isActive ? `border-l-2 border-blue-500 pl-4 ml-2` : ''
      } hover:bg-opacity-50 ${
        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
      } rounded-r-lg transition-all duration-200`}
    >
      {renderContent()}
    </div>
  );
}