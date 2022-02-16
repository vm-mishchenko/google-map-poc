import {AsyncThunkPayloadCreator, createAsyncThunk} from '@reduxjs/toolkit';
import {IPlace} from "../../places/interfaces";
import {RootState} from "../reducers/root-reducer";
import {
  selectCoordinate,
  selectSearchQuery,
  selectZoom
} from "../reducers/slices/place.slice";
import {
  LAT_QUERY_STRING_NAME,
  LNG_QUERY_STRING_NAME,
  SEARCH_QUERY_STRING_NAME,
  ZOOM_QUERY_STRING_NAME
} from "../../places/search/url-param-name.constants";

let currentFetch: any;

/**
 * Send new Search request.
 */
export const search: AsyncThunkPayloadCreator<IPlace[]> = async (action,
                                                                 {getState}) => {
  // improvement: use redux-observable for canceling existing search requests
  abortInFlightSearchRequest();
  const state = getState() as RootState;
  const searchParams = buildURLSearchParams(state);
  currentFetch = abortableFetch('/api/search?' + searchParams);

  const response = await currentFetch.ready;
  currentFetch = null;
  const result = await response.json();
  return result.data;
};

function buildURLSearchParams(state: RootState): URLSearchParams {
  const searchParams = new URLSearchParams();
  const searchQuery = selectSearchQuery(state);
  const coordinate = selectCoordinate(state);
  const zoom = selectZoom(state);
  searchParams.append(SEARCH_QUERY_STRING_NAME, searchQuery.trim());
  searchParams.append(LAT_QUERY_STRING_NAME, `${coordinate.lat}`);
  searchParams.append(LNG_QUERY_STRING_NAME, `${coordinate.lng}`);
  searchParams.append(ZOOM_QUERY_STRING_NAME, `${zoom}`);

  return searchParams;
}

function abortableFetch(url: string) {
  const controller = new AbortController();
  const signal = controller.signal;

  return {
    abort: () => controller.abort(),
    ready: fetch(url, {signal})
  };
}

export function abortInFlightSearchRequest() {
  if (!currentFetch) {
    return;
  }

  currentFetch.abort();
  currentFetch = null;
}

export const searchThunk = createAsyncThunk(`search`, search);
