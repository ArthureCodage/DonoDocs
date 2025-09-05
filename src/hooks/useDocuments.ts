import { useState, useCallback, useMemo } from 'react';
import { Document, Block } from '../types';
import { useLocalStorage } from './useLocalStorage';

const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Welcome to DonoDocs',
    tags: ['welcome', 'guide'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: [
      {
        id: '1-1',
        type: 'heading1',
        content: 'Welcome to DonoDocs! 🚀',
      },
      {
        id: '1-2',
        type: 'paragraph',
        content: 'DonoDocs is a modern, minimalist document editor inspired by Notion and Google Docs. Create, edit, and manage your documents with ease.',
      },
      {
        id: '1-3',
        type: 'heading2',
        content: 'Features',
      },
      {
        id: '1-4',
        type: 'bulletList',
        content: 'Rich text editing with multiple block types',
      },
      {
        id: '1-5',
        type: 'bulletList',
        content: 'Auto-save functionality',
      },
      {
        id: '1-6',
        type: 'bulletList',
        content: 'Export as Markdown or plain text',
      },
      {
        id: '1-7',
        type: 'bulletList',
        content: 'Dark mode support',
      },
      {
        id: '1-8',
        type: 'heading3',
        content: 'Getting Started',
      },
      {
        id: '1-9',
        type: 'paragraph',
        content: 'Start by creating a new document or editing this one. Use the toolbar above to format your text, or use keyboard shortcuts for quick formatting.',
      },
      {
        id: '1-10',
        type: 'code',
        content: 'console.log("Happy writing!");',
        metadata: { language: 'javascript' },
      },
    ],
  },
  {
    id: '2',
    title: 'Project Ideas',
    tags: ['projects', 'brainstorm'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: [
      {
        id: '2-1',
        type: 'heading1',
        content: 'Project Ideas',
      },
      {
        id: '2-2',
        type: 'checkbox',
        content: 'Build a personal portfolio website',
        metadata: { checked: true },
      },
      {
        id: '2-3',
        type: 'checkbox',
        content: 'Create a mobile app for productivity',
        metadata: { checked: false },
      },
      {
        id: '2-4',
        type: 'checkbox',
        content: 'Write technical blog posts',
        metadata: { checked: false },
      },
      {
        id: '2-5',
        type: 'heading2',
        content: 'Web Development',
      },
      {
        id: '2-6',
        type: 'numberList',
        content: 'E-commerce platform with React',
      },
      {
        id: '2-7',
        type: 'numberList',
        content: 'Real-time chat application',
      },
      {
        id: '2-8',
        type: 'numberList',
        content: 'Task management system',
      },
    ],
  },
];

export function useDocuments() {
  const [documents, setDocuments] = useLocalStorage<Document[]>('donodocs-documents', SAMPLE_DOCUMENTS);
  const [currentDocumentId, setCurrentDocumentId] = useLocalStorage<string | null>('donodocs-current-doc', '1');
  const [searchQuery, setSearchQuery] = useState('');

  const currentDocument = useMemo(() => 
    documents.find(doc => doc.id === currentDocumentId) || null,
    [documents, currentDocumentId]
  );

  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
      doc.content.some(block => block.content.toLowerCase().includes(query))
    );
  }, [documents, searchQuery]);

  const createDocument = useCallback(() => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: [
        {
          id: `${Date.now()}-1`,
          type: 'paragraph',
          content: '',
        },
      ],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setDocuments(prev => [newDoc, ...prev]);
    setCurrentDocumentId(newDoc.id);
    return newDoc;
  }, [setDocuments, setCurrentDocumentId]);

  const updateDocument = useCallback((docId: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
        : doc
    ));
  }, [setDocuments]);

  const deleteDocument = useCallback((docId: string) => {
    setDocuments(prev => {
      const filtered = prev.filter(doc => doc.id !== docId);
      if (currentDocumentId === docId && filtered.length > 0) {
        setCurrentDocumentId(filtered[0].id);
      } else if (filtered.length === 0) {
        setCurrentDocumentId(null);
      }
      return filtered;
    });
  }, [setDocuments, currentDocumentId, setCurrentDocumentId]);

  const renameDocument = useCallback((docId: string, newTitle: string) => {
    updateDocument(docId, { title: newTitle });
  }, [updateDocument]);

  const updateDocumentContent = useCallback((docId: string, content: Block[]) => {
    updateDocument(docId, { content });
  }, [updateDocument]);

  return {
    documents,
    currentDocument,
    filteredDocuments,
    currentDocumentId,
    searchQuery,
    setSearchQuery,
    setCurrentDocumentId,
    createDocument,
    updateDocument,
    deleteDocument,
    renameDocument,
    updateDocumentContent,
  };
}