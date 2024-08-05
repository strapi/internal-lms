export interface Course {
  id: string;
  title: string;
  description: string;
  photo: string;
  progress: number;
  subtitle: string;
  category: string;
  sections: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  completed: boolean;
}
