import { LatLngExpression } from 'leaflet';

export interface Address {
  id: number;
  city: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  lat: number;
  lon: number;
  regionId: number;
}

export interface CulturePlace {
  id: number;
  name: string;
  description?: string;
  website?: string;
  address: Address;
  type: string;
  else?: string; 
}

export interface CulturePlaceResponse {
  type: string;
  message: string;
  data: CulturePlace[];
}

export interface MarkerData {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  type: string;
  number: number;
  position: LatLngExpression;
}