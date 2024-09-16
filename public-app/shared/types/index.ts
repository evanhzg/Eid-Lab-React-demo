import type { ObjectId as MongoObjectId } from 'mongodb';
export type ObjectId = MongoObjectId;

export interface Student {
    _id?: ObjectId;
    numericId?: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    region: string;
    city: string;
    school: string;
    grade: string;
    available: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Offer {
    _id?: ObjectId;
    title: string;
    company: ObjectId;
    description: string;
    short_description: string;
    type: string;
    location: string;
    salary: string;
    requirements: string[];
    start_date: string;
    end_date: string;
    available: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Company {
    _id: ObjectId;
    name: string;
    size: string;
    type: string;
    acceptsUnsolicited: boolean;
    domains: string[];
    countries: string[];
    cities: string[];
    description: string;
    shortDescription: string;
    logo: string;
    available: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Professional {
    _id?: ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: Company | ObjectId;
    position: string;
    linkedin: string;
    available: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Column<T = any> {
    header: string;
    accessor: string;
    cell?: (value: any) => React.ReactNode;
    render?: (value: any) => React.ReactNode;
}