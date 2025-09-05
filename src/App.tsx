import React, { useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Toolbar } from './components/Toolbar';
import { useDocuments } from './hooks/useDocuments';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BlockType } from './types';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('donodocs-dark-mode', false);
  const {
    documents,
    currentDocument,
    filteredDocuments,
    currentDocumentId,
    searchQuery,
    setSearchQuery,
    setCurrentDocumentId,
    createDocument,
    deleteDocument,
    renameDocument,
    updateDocumentContent,
  } = useDocuments();

  const handleDocumentChange = useCallback((content: any) => {
    if (currentDocumentId) {
      updateDocumentContent(currentDocumentId, content);
    }
  }, [currentDocumentId, updateDocumentContent]);

  const handleBlockTypeChange = useCallback((type: BlockType) => {
    // This will be handled by the Editor component internally
    console.log('Block type change requested:', type);
  }, []);

  const handleFormatText = useCallback((format: 'bold' | 'italic' | 'underline' | 'link') => {
    // Simple text formatting - in a production app, you'd want more sophisticated text selection handling
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText) {
        let formattedText = selectedText;
        switch (format) {
          case 'bold':
            formattedText = `**${selectedText}**`;
            break;
          case 'italic':
            formattedText = `*${selectedText}*`;
            break;
          case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
          case 'link':
            const url = prompt('Enter URL:');
            if (url) {
              formattedText = `[${selectedText}](${url})`;
            }
            break;
        }
        
        if (formattedText !== selectedText) {
          range.deleteContents();
          range.insertNode(document.createTextNode(formattedText));
        }
      }
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  return (
    <div className={`h-screen flex flex-col ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-100'
    }`}>
      <Toolbar
        onBlockTypeChange={handleBlockTypeChange}
        onFormatText={handleFormatText}
        currentDocument={currentDocument}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          documents={filteredDocuments}
          currentDocumentId={currentDocumentId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onDocumentSelect={setCurrentDocumentId}
          onCreateDocument={createDocument}
          onDeleteDocument={deleteDocument}
          onRenameDocument={renameDocument}
          darkMode={darkMode}
        />
        
        <Editor
          document={currentDocument}
          onDocumentChange={handleDocumentChange}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

export default App;