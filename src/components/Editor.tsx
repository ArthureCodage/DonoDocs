import React, { useState, useCallback, useEffect } from 'react';
import { BlockEditor } from './BlockEditor';
import { Document, Block, BlockType } from '../types';

interface EditorProps {
  document: Document | null;
  onDocumentChange: (content: Block[]) => void;
  darkMode: boolean;
}

export function Editor({ document, onDocumentChange, darkMode }: EditorProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (document && document.content.length > 0) {
      setActiveBlockId(document.content[0].id);
    }
  }, [document?.id]);

  const handleBlockChange = useCallback((updatedBlock: Block) => {
    if (!document) return;
    
    const updatedContent = document.content.map(block =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    onDocumentChange(updatedContent);
  }, [document, onDocumentChange]);

  const handleBlockDelete = useCallback((blockId: string) => {
    if (!document || document.content.length <= 1) return;
    
    const blockIndex = document.content.findIndex(block => block.id === blockId);
    const updatedContent = document.content.filter(block => block.id !== blockId);
    
    // Focus previous block if available, otherwise next block
    if (updatedContent.length > 0) {
      const newActiveIndex = Math.max(0, blockIndex - 1);
      setActiveBlockId(updatedContent[newActiveIndex]?.id);
    }
    
    onDocumentChange(updatedContent);
  }, [document, onDocumentChange]);

  const handleNewBlock = useCallback((afterBlockId: string, type: BlockType = 'paragraph') => {
    if (!document) return;
    
    const blockIndex = document.content.findIndex(block => block.id === afterBlockId);
    const newBlock: Block = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      content: '',
    };
    
    const updatedContent = [
      ...document.content.slice(0, blockIndex + 1),
      newBlock,
      ...document.content.slice(blockIndex + 1),
    ];
    
    setActiveBlockId(newBlock.id);
    onDocumentChange(updatedContent);
  }, [document, onDocumentChange]);

  const handleBlockTypeChange = useCallback((type: BlockType) => {
    if (!document || !activeBlockId) return;
    
    const activeBlock = document.content.find(block => block.id === activeBlockId);
    if (!activeBlock) return;
    
    const updatedBlock: Block = {
      ...activeBlock,
      type,
      metadata: type === 'checkbox' ? { checked: false } : undefined,
    };
    
    handleBlockChange(updatedBlock);
  }, [document, activeBlockId, handleBlockChange]);

  if (!document) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
      }`}>
        <p className="text-lg">Select a document to start editing</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-y-auto`}>
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-2">
          {document.content.map((block) => (
            <BlockEditor
              key={block.id}
              block={block}
              onChange={handleBlockChange}
              onDelete={() => handleBlockDelete(block.id)}
              onNewBlock={(type) => handleNewBlock(block.id, type)}
              darkMode={darkMode}
              isActive={activeBlockId === block.id}
              onFocus={() => setActiveBlockId(block.id)}
            />
          ))}
        </div>
        
        {document.content.length === 0 && (
          <div className="text-center py-16">
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Start typing to create your first block
            </p>
          </div>
        )}
      </div>
    </div>
  );
}