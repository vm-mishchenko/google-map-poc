import type {GetServerSideProps, NextPage} from 'next'
import {useRouter} from "next/router";
import {LatLngLiteral} from "leaflet";
import React, {Fragment, useEffect} from "react";
import dynamic from "next/dynamic";
import {useAppDispatch, useAppSelector} from "../redux/store";
import {
  selectCoordinate,
  selectLoading,
  selectPlaces,
  selectSearchQuery,
  selectSelectedPlace,
  selectZoom
} from "../redux/reducers/slices/place.slice";
import Place from "../components/place/place";
import {ParsedUrlQueryInput} from "querystring";
import SearchBox from "../components/search-box/search-box";
import {
  processUrlChangeThunk,
  searchParamsPresent
} from "../redux/operations/process-url-change";
import {
  LAT_QUERY_STRING_NAME,
  LNG_QUERY_STRING_NAME,
  SEARCH_QUERY_STRING_NAME,
  SELECTED_PLACE_ID_STRING_NAME,
  ZOOM_QUERY_STRING_NAME
} from "../places/search/url-param-name.constants";
import {
  abortInFlightSearchRequest,
  searchThunk
} from "../redux/operations/search";

// Dynamically load Map component since it cannot be Server side rendered
// because it depends on Browser runtime deps (window)
const MapWithNoSSR = dynamic(() => import("../components/map/map"), {
  ssr: false
});

const Home: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const places = useAppSelector(selectPlaces);
  const zoom = useAppSelector(selectZoom);
  const coordinate = useAppSelector(selectCoordinate);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedPlace = useAppSelector(selectSelectedPlace);
  const loading = useAppSelector(selectLoading);

  // URL has been updated --> update Redux store
  useEffect(() => {
    dispatch(processUrlChangeThunk(router.query));
  }, [router.query]);

  // Store has been updated --> send Search request
  useEffect(() => {
    searchParamsPresent(zoom, coordinate, searchQuery) ?
      dispatch(searchThunk()) : abortInFlightSearchRequest();
  }, [zoom, coordinate, searchQuery]);

  // Update URL with a new query parameters
  const updateQueryString = (coordinate?: LatLngLiteral,
                             zoom?: number,
                             searchQuery?: string,
                             placeId?: string) => {
    const query: ParsedUrlQueryInput = {};

    if (coordinate) {
      query[LAT_QUERY_STRING_NAME] = coordinate.lat;
      query[LNG_QUERY_STRING_NAME] = coordinate.lng;
    }

    if (zoom || zoom === 0) {
      query[ZOOM_QUERY_STRING_NAME] = zoom;
    }

    if (searchQuery) {
      query[SEARCH_QUERY_STRING_NAME] = searchQuery;
    }

    if (placeId) {
      query[SELECTED_PLACE_ID_STRING_NAME] = placeId;
    }

    // update current URL with a new query parameters
    router.push({query}, undefined, {
      shallow: true
    });
  }

  // Map has been moved --> Update URL
  const onMapPositionChanged = (newCoordinate: LatLngLiteral, newZoom: number) => {
    updateQueryString(newCoordinate, newZoom, searchQuery, selectedPlace?.id);
  };

  // Selected place has been changed --> Update URL
  const onPlaceSelected = (placeId: string) => {
    updateQueryString(coordinate, zoom, searchQuery, placeId);
  };

  // Selected place has been changed --> Update URL
  const onClosePlace = () => {
    updateQueryString(coordinate, zoom, searchQuery, /* placeId= */undefined);
  };

  // Search query has been changed --> Update URL
  const onSearchQueryUpdate = (searchQuery: string) => {
    updateQueryString(coordinate, zoom, searchQuery, selectedPlace?.id);
  }

  return (
    <Fragment>
      <SearchBox onSearchQueryUpdate={onSearchQueryUpdate}
                 searchQuery={searchQuery}
                 loading={loading}/>

      <MapWithNoSSR onMapPositionChanged={onMapPositionChanged}
                    onPlaceSelected={onPlaceSelected}
                    places={places}
                    center={coordinate}
                    zoom={zoom}/>

      {selectedPlace &&
      <Place onClosePlace={onClosePlace} place={selectedPlace}/>}
    </Fragment>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  // improvement: search for Places and render them on server
  return {
    props: {},
  };
};
