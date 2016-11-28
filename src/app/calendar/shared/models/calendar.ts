import { Event } from './event';

export interface Calendar {
    color: string;
    summary: string;
    etag: string;
    items: Event[];
}