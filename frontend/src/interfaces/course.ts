import { type BlocksContent } from "@strapi/blocks-react-renderer";

// Category interface
export interface Category {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
}

// Image interface
export interface Image {
  id: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
  documentId: string;
  publishedAt: string;
}

// Author interface
export interface Author {
  id: string;
  firstname: string;
  lastname: string;
  username: string | null;
  preferedLanguage: string | null;
  createdAt: string;
  updatedAt: string;
  documentId: string;
  publishedAt: string;
}

// MuxAsset interface
export interface MuxAsset {
  id: number;
  title: string;
  upload_id: string;
  playback_id: string | null;
  asset_id: string | null;
  signed: boolean;
  error_message: string | null;
  isReady: boolean;
  duration: number | null;
  aspect_ratio: string | null;
  createdAt: string;
  updatedAt: string;
  documentId: string;
  publishedAt: string;
}

// Module interface
export interface Module {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
  media?: MuxAsset;
}

// Section interface
export interface Section {
  id: number;
  name: string;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
}

// TextNode interface for paragraphs
export interface TextNode {
  type: string;
  text: string;
}

// Course interface
export interface Course {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: BlocksContent;
  synopsis?: string;
  thumbnail?: Image;
  categories: Category[];
  authors: Author[];
  sections: Section[];
}

// ModuleStatus interface for tracking module progress in CourseStatusData
export interface SectionInfo {
  documentId: string;
  name?: string;
}

// ModuleStatus interface
export interface ModuleStatus {
  id?: number; // Made optional
  progress: number;
  module: {
    id?: number; // Made optional
    documentId: string;
  };
}

// SectionStatus interface
export interface SectionStatus {
  id?: number; // Made optional
  documentId: string;
  modules: ModuleStatus[];
}

// ModuleProgress interface for input
export interface ModuleProgress {
  moduleDocumentId: string;
  progress: number;
}

// SectionProgress interface for input
export interface SectionProgress {
  sectionDocumentId: string;
  modules: ModuleProgress[];
}

// CourseStatusInputData interface for input
export interface CourseStatusInputData {
  course: string;
  user?: number;
  progress?: number;
  isFavourite?: boolean;
  sections?: SectionProgress[];
}

export interface UserModule {
  id?: number;
  progress: number;
  module: {
    id?: number;
    documentId: string;
  };
}

export interface UserSection {
  id?: number;
  section: {
    id?: number;
    documentId: string;
  };
  modules: UserModule[];
}

export interface UserCourseStatus {
  id: number;
  documentId: string;
  progress: number;
  isFavourite?: boolean;
  course: {
    id: number;
    documentId: string;
  };
  sections: UserSection[];
}
