import {combineReducers} from 'redux';
import {placeReducer} from "./slices/place.slice";

const rootReducer = combineReducers({
  placeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
