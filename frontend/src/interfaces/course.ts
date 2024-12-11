import { type BlocksContent } from "@strapi/blocks-react-renderer";
import { BaseEntity, Image, Media } from "./shared";

// Category
export interface Category extends BaseEntity {
  name: string;
  description: string;
}

// Author
export interface Author extends BaseEntity {
  firstname: string;
  lastname: string;
  username?: string;
  preferredLanguage?: string;
}

// Module
export interface Module extends BaseEntity {
  title: string;
  description: string;
  media?: Media;
}

// Section
export interface Section extends BaseEntity {
  name: string;
  description: string;
  modules: Module[];
}

// Course
export interface Course extends BaseEntity {
  title: string;
  slug: string;
  description: BlocksContent;
  synopsis?: string;
  thumbnail?: Image;
  categories: Category[];
  authors: Author[];
  sections: Section[];
  isFavourite?: boolean;
}

// Progress Tracking
export interface ModuleStatus {
  id?: number;
  progress: number;
  module: {
    id?: number;
    documentId: string;
  };
}

export interface SectionStatus {
  id?: number;
  documentId: string;
  modules: ModuleStatus[];
}

export interface ModuleProgress {
  moduleDocumentId: string;
  progress: number;
}

export interface SectionProgress {
  sectionDocumentId: string;
  modules: ModuleProgress[];
}

export interface CourseStatusInputData {
  course: string;
  user?: number;
  progress?: number;
  isFavourite?: boolean;
  sections?: SectionProgress[];
}

// User-Specific Course Status
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

export interface CourseWithProgress extends Course {
  progress: number;
}

export interface CourseCardsProps {
  courses: CourseWithProgress[];
  showProgress?: boolean;
}

export interface SearchResults {
  courses: Course[];
  categories: Category[];
}
