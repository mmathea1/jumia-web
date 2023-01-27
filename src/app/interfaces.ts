export interface User {
    id: number;
    email: string;
    name: string;
    gender: string;
    age: number;
    registered: number;
    phone: string;
    nationality: string;
}

export interface UserFilter {
    name: string;
    options: string[];
    defaultValue: string;
}