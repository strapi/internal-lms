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
  thumbnail?: Image;
  categories: Category[];
  authors: Author[];
  section: Section[];
}

// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  courseStatuses?: CourseStatusData[];
}

// SectionStatus interface representing the section component in CourseStatusData
export interface SectionStatus {
  section: SectionInfo;
  modules: ModuleStatus[];
}

// ModuleStatus interface for tracking module progress in CourseStatusData
export interface SectionInfo {
  documentId: string;
  name?: string;
}

export interface ModuleStatus {
  moduleDocumentId: string;
  progress: number;
}

// CourseStatusData interface representing the course-status content type
export interface CourseStatusData {
  id?: number;
  courseDocumentId: string;
  progress: number;
  user?: number;
  section: {
    sectionDocumentId: string;
    modules: ModuleStatus[];
  }[];
}
