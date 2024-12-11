export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
}

export interface Image extends BaseEntity {
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
}

export interface Media {
  id: number;
  title: string;
  duration?: number;
  playback_id?: string;
  isReady: boolean;
}
