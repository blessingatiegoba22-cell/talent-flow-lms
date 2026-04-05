export interface Course {
    id: number;
    title: string;
    author: string;
    lesson: string;
    duration: string;
    progress: number;
    image?: string;
    primaryAction?: boolean;
}