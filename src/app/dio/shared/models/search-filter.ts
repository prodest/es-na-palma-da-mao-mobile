export interface SearchFilter {
    query?: string;
    dateMin?: Date;
    dateMax?: Date;
    pageNumber: number;
    sort: string;
};