import {AsyncThunkPayloadCreator, createAsyncThunk} from '@reduxjs/toolkit';
import {ParsedUrlQuery} from "querystring";
import {
  DEFAULT_COORDINATE,
  DEFAULT_ZOOM,
  selectCoordinate,
  selectPlace,
  selectSearchQuery,
  selectZoom,
  updateMapPosition,
  updateSearchQuery
} from "../reducers/slices/place.slice";
import {RootState} from "../reducers/root-reducer";
import {LatLngLiteral} from "leaflet";
import {
  LAT_QUERY_STRING_NAME,
  LNG_QUERY_STRING_NAME,
  SEARCH_QUERY_STRING_NAME,
  SELECTED_PLACE_ID_STRING_NAME,
  ZOOM_QUERY_STRING_NAME
} from "../../places/search/url-param-name.constants";

/**
 * Update the Store based on the new URL params.
 */
export const processUrlChange: AsyncThunkPayloadCreator<void, ParsedUrlQuery> = async (query,
                                                                                       {
                                                                                         dispatch,
                                                                                         getState
                                                                                       }) => {
  const state = getState() as RootState;
  const zoom = extractIntegerValue(query, ZOOM_QUERY_STRING_NAME) || DEFAULT_ZOOM;
  const lat = extractFloatValue(query, LAT_QUERY_STRING_NAME);
  const lng = extractFloatValue(query, LNG_QUERY_STRING_NAME);
  const coordinate = (lat && lng) ? {lat, lng} : DEFAULT_COORDINATE;
  const placeId = extractStringValue(query, SELECTED_PLACE_ID_STRING_NAME, "");
  const searchQuery = extractStringValue(query, SEARCH_QUERY_STRING_NAME, "");

  if (searchParamsHasChanged(state, zoom, coordinate, searchQuery)) {
    dispatch(updateSearchQuery(searchQuery));
    dispatch(updateMapPosition({coordinate: coordinate, zoom: zoom}));
  }

  dispatch(selectPlace(placeId));
};

function extractIntegerValue(query: ParsedUrlQuery, key: string): number | undefined {
  const value = parseInt(<string>query[key]);
  return isNaN(value) ? undefined : value;
}

function extractFloatValue(query: ParsedUrlQuery, key: string): number | undefined {
  const value = parseFloat(<string>query[key]);
  return isNaN(value) ? undefined : value;
}

function extractStringValue(query: ParsedUrlQuery, key: string, defaultValue: string): string {
  return <string>query[key] || defaultValue;
}

export function searchParamsPresent(zoom: number, coordinate: LatLngLiteral, searchQuery: string): boolean {
  return Boolean((zoom || zoom === 0) && searchQuery && coordinate.lat && coordinate.lng);
}

export function searchParamsHasChanged(state: RootState, zoom: number, coordinate: LatLngLiteral, searchQuery: string): boolean {
  return zoom !== selectZoom(state) ||
    coordinate.lat !== selectCoordinate(state).lat ||
    coordinate.lng !== selectCoordinate(state).lng ||
    searchQuery !== selectSearchQuery(state);
}

export const processUrlChangeThunk = createAsyncThunk(`processUrlChange`, processUrlChange);
