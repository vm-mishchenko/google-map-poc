import {IPlace} from "../../places/interfaces";
import React, {Fragment} from "react";
import {Marker} from "react-leaflet";

interface IMarkerListProps {
  places: IPlace[];
  onPlaceSelected: (placeId: string) => void;
}

const MarkerList = ({places, onPlaceSelected}: IMarkerListProps) => {
  return (<Fragment>
    {
      places.map(({id, location}) => {
        return <Marker key={id} position={location}
                       eventHandlers={{
                         click() {
                           onPlaceSelected(id);
                         }
                       }}>
        </Marker>
      })
    }
  </Fragment>);
};

export default MarkerList;
