export type MaterialAudience = 'pastor' | 'welfare' | 'general';
export type MaterialLevel = '입문' | '중급' | '고급';
export type MaterialFormat = 'slide' | 'workbook' | 'report' | 'guide';

export interface MaterialLinks {
    slide?: string;
    doc?: string;
    download?: string;
}

export interface MaterialItem {
    id: string;
    title: string;
    description: string;
    audience: MaterialAudience;
    level: MaterialLevel;
    format: MaterialFormat;
    duration: string;
    durationMinutes: number;
    updated: string;
    links: MaterialLinks;
    tags: string[];
    featured: boolean;
    isNew: boolean;
    thumbnail?: string;
    category: string;
    badgeClass: 'edu' | 'info' | 'web';
    fileType: string;
    actionText: string;
}

export interface RoadmapStep {
    step: number;
    materialId: string;
    anchor?: string;
    title: string;
    description: string;
    level: MaterialLevel;
    duration: string;
}

export interface StartGuideRef {
    materialId: string;
    icon: string;
    title: string;
    description: string;
    badgeText?: string;
    arrowText?: string;
    variant?: 'seminar' | 'guide' | 'default';
    showSlideButton?: boolean;
}

export interface FeaturedHighlightRef {
    materialId: string;
    badgeLabel: string;
    badgeStyle?: 'primary' | 'secondary' | 'report';
    title: string;
    description: string;
    highlights: { icon: string; text: string }[];
    fileTypeLabel: string;
    buttonLabel: string;
}
