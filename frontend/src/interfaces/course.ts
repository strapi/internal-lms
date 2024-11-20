export interface Category {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
}

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

export interface Module {
  id: number;
  title: string;
  section: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
  media?: MuxAsset;
}

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

export interface Media {
  id: number;
  title: string;
  upload_id: string;
  asset_id: string | null;
  playback_id: string | null;
  signed: boolean;
  error_message: string | null;
  isReady: boolean;
  duration: number | null;
  aspect_ratio: string | null;
  asset_data: string | null;
  createdAt: string;
  updatedAt: string;
  documentId: string;
  publishedAt: string;
}
export interface Course {
  id: string;
  documentId: string;
  title: string;
  description: Paragraph[];
  thumbnail?: Image;
  categories: Category[];
  // ratings: any[];
  authors: Author[];
  modules: Module[];
}

export interface Paragraph {
  type: string;
  children: TextNode[];
}

export interface TextNode {
  type: string;
  text: string;
}
