import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../root-reducer";
import {IPlace} from "../../../places/interfaces";
import {LatLngLiteral} from "leaflet";
import {searchThunk} from "../../operations/search";

export interface IPlaceState {
  zoom: number;
  coordinate: LatLngLiteral;
  places: IPlace[];
  searchQuery: string;
  selectedPlaceId: string;
  selectedPlace?: IPlace,
  loadingRequestCount: number;
}

export const DEFAULT_ZOOM = 9;
// Bay area, CA
export const DEFAULT_COORDINATE: LatLngLiteral = {
  lat: 37.65120864473176,
  lng: -122.18444824235515,
};

export const initialState: IPlaceState = {
  zoom: DEFAULT_ZOOM,
  coordinate: DEFAULT_COORDINATE,
  places: [],
  searchQuery: "",
  selectedPlaceId: "",
  selectedPlace: undefined,
  loadingRequestCount: 0
};

export interface IUpdateMapPositionOptions {
  coordinate: LatLngLiteral;
  zoom: number;
}

export const placeSlice = createSlice({
  name: 'place',
  initialState: initialState,
  reducers: {
    updateSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;

      if (!state.searchQuery) {
        state.places = [];
      }
    },

    updateMapPosition: (state, action: PayloadAction<IUpdateMapPositionOptions>) => {
      state.coordinate = action.payload.coordinate;
      state.zoom = action.payload.zoom;
    },

    selectPlace: (state, action: PayloadAction<string>) => {
      state.selectedPlaceId = action.payload;
      state.selectedPlace = state.places.find((place) => {
        return place.id === action.payload;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchThunk.pending, (state) => {
      state.loadingRequestCount++;
    });

    builder.addCase(searchThunk.rejected, (state) => {
      state.loadingRequestCount--;
    });

    builder.addCase(searchThunk.fulfilled, (state, action) => {
      state.places = action.payload;
      state.loadingRequestCount--;

      if (!state.selectedPlace && state.selectedPlaceId) {
        state.selectedPlace = state.places.find((place) => {
          return place.id === state.selectedPlaceId;
        });
      }
    });
  }
});

// actions
export const {
  selectPlace,
  updateSearchQuery,
  updateMapPosition,
} = placeSlice.actions;

// selectors
export const selectCoordinate = (state: RootState) => state.placeReducer.coordinate;
export const selectZoom = (state: RootState) => state.placeReducer.zoom;
export const selectPlaces = (state: RootState) => state.placeReducer.places;
export const selectSearchQuery = (state: RootState) => state.placeReducer.searchQuery;
export const selectSelectedPlace = (state: RootState) => state.placeReducer.selectedPlace;
export const selectLoading = (state: RootState) => Boolean(state.placeReducer.loadingRequestCount);

export const placeReducer = placeSlice.reducer;
