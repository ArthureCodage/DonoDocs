import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  Tag
} from 'lucide-react';
import { Document } from '../types';

interface SidebarProps {
  documents: Document[];
  currentDocumentId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDocumentSelect: (id: string) => void;
  onCreateDocument: () => void;
  onDeleteDocument: (id: string) => void;
  onRenameDocument: (id: string, newTitle: string) => void;
  darkMode: boolean;
}

export function Sidebar({
  documents,
  currentDocumentId,
  searchQuery,
  onSearchChange,
  onDocumentSelect,
  onCreateDocument,
  onDeleteDocument,
  onRenameDocument,
  darkMode,
}: SidebarProps) {
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startRename = (doc: Document) => {
    setEditingDocId(doc.id);
    setEditTitle(doc.title);
  };

  const confirmRename = (docId: string) => {
    if (editTitle.trim()) {
      onRenameDocument(docId, editTitle.trim());
    }
    setEditingDocId(null);
    setEditTitle('');
  };

  const cancelRename = () => {
    setEditingDocId(null);
    setEditTitle('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`w-80 border-r ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            DonoDocs
          </h1>
          <button
            onClick={onCreateDocument}
            className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="New Document"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} size={18} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400'
            } focus:outline-none transition-colors`}
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-4 text-center">
            <FileText className={`mx-auto mb-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} size={48} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No documents found
            </p>
            <button
              onClick={onCreateDocument}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create your first document
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentDocumentId === doc.id
                    ? darkMode 
                      ? 'bg-gray-700 border-l-4 border-blue-500' 
                      : 'bg-white border-l-4 border-blue-500 shadow-sm'
                    : darkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-white hover:shadow-sm'
                }`}
              >
                {editingDocId === doc.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename(doc.id);
                        if (e.key === 'Escape') cancelRename();
                      }}
                      className={`flex-1 px-2 py-1 text-sm rounded border ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      autoFocus
                    />
                    <button
                      onClick={() => confirmRename(doc.id)}
                      className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={cancelRename}
                      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div 
                      onClick={() => onDocumentSelect(doc.id)}
                      className="flex-1"
                    >
                      <h3 className={`font-medium truncate ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {doc.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatDate(doc.updatedAt)}
                      </p>
                      {doc.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Tag size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                          <div className="flex gap-1 flex-wrap">
                            {doc.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-600 text-gray-300' 
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                            {doc.tags.length > 3 && (
                              <span className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                +{doc.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(doc);
                        }}
                        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                        }`}
                        title="Rename"
                      >
                        <Edit3 size={14} />
                      </button>
                      {documents.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this document?')) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}