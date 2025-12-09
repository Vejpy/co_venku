import { LatLngExpression } from 'leaflet';

// Address structure from API
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

// Represents a place returned from the API
export interface CulturePlace {
  id: number;
  name: string;
  description?: string;
  website?: string;
  address: Address;
  type: string;
  else?: string; // JSON string containing Image
}

// Root structure from the API response
export interface CulturePlaceResponse {
  type: string;
  message: string;
  data: CulturePlace[];
}

// Existing MarkerData interface for the map
export interface MarkerData {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  type: string;
  number: number;
  position: LatLngExpression;
}