export interface Event {
    color: string;
    summary: string;
    id: string;
    htmlLink: string;
    start: { date: Date };
    end: { date: Date };
}