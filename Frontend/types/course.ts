export interface Course {
    id: number;
    title: string;
    author: string;
    lesson: string;
    duration: string;
    progress?: number;
    image?: string;
    rating?: number;
    primaryAction?: boolean;
    isPopular?: boolean,
    isRecommended?: boolean,
    category?: string,
    level?: string,
    price?: string
}