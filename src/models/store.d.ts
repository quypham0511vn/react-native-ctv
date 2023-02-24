import { Id } from './id';

export interface Location {
    lat: number;
    lng: number;
}

export interface StoreModel {
    _id: Id;
    name: string;
    phone: string;
    address: string;
    location: Location;
}
