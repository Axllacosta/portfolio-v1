export interface Project {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    longDescription: string;
    technologies: string[];
    architecture: string[];
    features: string[];
    businessRules: string[];
    technicalHighlights: string[];
    repoUrl?: string;
    demoUrl?: string;
    apiDocsUrl?: string;
}