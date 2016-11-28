import {ProcessUpdate} from './processUpdate';

export interface Process {
    number: string;
    parts: string[];
    subject: string;
    summary: string;
    status: string;
    updates: ProcessUpdate[];
    district: string;
    extra: string;
    pageUrl: string;
}