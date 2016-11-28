export interface Warning {
    id: string;
    insertedAt: Date;
    level: number;
    title: string;
    message: string;
    beginDate: Date;
    endDate: Date;
    region: Region;
    userId?: number;
}

export interface Region {
    type: number;
    radius?: number;
    center?: LatLng;
    polygon?: LatLng[];
}

export interface LatLng {
    lat: number;
    lon: number;
}
