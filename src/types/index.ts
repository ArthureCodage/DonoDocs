export interface Document {
  id: string;
  title: string;
  content: Block[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: BlockMetadata;
}

export type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3' 
  | 'bulletList' 
  | 'numberList' 
  | 'checkbox' 
  | 'code';

export interface BlockMetadata {
  checked?: boolean;
  language?: string;
  level?: number;
}

export interface AppState {
  documents: Document[];
  currentDocumentId: string | null;
  darkMode: boolean;
  searchQuery: string;
}