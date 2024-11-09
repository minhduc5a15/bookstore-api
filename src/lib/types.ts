export interface Book {
    title: string;
    subtitle?: string;
    id: string;
    authors: string[];
    publisher: string;
    description: string;
    categories: string[];
    pageCount?: number;
    thumbnailId?: string;
    language: string;
    price: string; // dollar
    publishedDate: string;
}

export interface Blog {
    id: string;
    title: string;
    preview: string;
    blogImage: string;
    author: string;
    publishedDate: string;
    blogContent: string;
}

export interface User {
    username: string;
    email: string;
    password: string;
    [newProp: string]: any;
}
