import type { DataModel } from "@toolpad/core";

export interface Base {
    id: number;
}

export interface Artwork extends DataModel {
    id: number;
    base: Base
    artist: Artist
    title: string;
    medium: string;
    art_height: string;
    art_width: string;
    art_depth: string;
    year: string;
    url: string;
}

export interface Artist extends DataModel {
    id: number;
    base: Base
    first_name: string;
    last_name: string;
    bio: string;
}

export interface Donor extends DataModel {
    id: number;
    base: Base
    first_name: string;
    last_name: string;
    bio: string;
}