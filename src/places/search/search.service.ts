import {IPlace} from "../interfaces";
import {LatLngLiteral} from "leaflet";

const DEFAULT_PLACES_COUNT = 10;

// improvement: add nextPageToken for fetching next set of search results
export interface ISearchRequestOptions {
  query: string;
  coordinate: LatLngLiteral;
  zoom: number;
}

export class PlaceSearchService {
  async search(searchOption: ISearchRequestOptions): Promise<IPlace[]> {
    // improvement: cache results
    const requestDelay = randomNumber(1000, 1300);
    return new Promise((resolve) => {
      const places = this.generatePlaces(searchOption);
      setTimeout(() => {
        resolve(places);
      }, requestDelay);
    });
  }

  private generatePlaces(searchOption: ISearchRequestOptions): IPlace[] {
    return new Array(DEFAULT_PLACES_COUNT)
      .fill(null)
      .map((_, index) => generatePlace(searchOption, index));
  }
}

function generatePlace(searchOption: ISearchRequestOptions, index: number): IPlace {
  const id = generatePlaceId(searchOption, index);

  return {
    id,
    location: getRandomLocationNearby(searchOption, index),
    name: `Place: ${index}`,
    description: "Relaxed destination with a patio & a colorful contemporary decor dishing up meat-free classics.",
    rating: Math.floor(randomNumber(1, 5)),
  };
}

// Generate random Place id that is stable for a specific map coordinates
function generatePlaceId(searchOption: ISearchRequestOptions, index: number) {
  const lat = Math.abs(Math.floor(searchOption.coordinate.lat * 1000));
  const lng = Math.abs(Math.floor(searchOption.coordinate.lng * 1000));
  const zoom = Math.floor(searchOption.zoom);

  return `${lat}-${lng}-${zoom}-${index}`;
}

// Generate random Place location that is stable for a specific map coordinates
function getRandomLocationNearby(searchOption: ISearchRequestOptions, index: number): LatLngLiteral {
  const queryCoefficient = searchOption.query.length / 100;

  return {
    lat: searchOption.coordinate.lat + index / 10 - 0.07 + queryCoefficient,
    lng: searchOption.coordinate.lng + index / 10 - 0.07 + queryCoefficient,
  };
}

function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

