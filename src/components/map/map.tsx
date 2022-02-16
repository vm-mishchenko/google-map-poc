import styles from "./map.module.css";
import {MapContainer, TileLayer} from "react-leaflet";
import {LatLngLiteral, Map as LeafletMap} from "leaflet";
import React, {useEffect, useState} from "react";
import {IPlace} from "../../places/interfaces";
import MarkerList from "./marker-list";
import MapController from "./map-controller";

const MAP_ATTRIBUTION = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export interface IMapProps {
  center: LatLngLiteral;
  zoom: number;
  places: IPlace[];
  onPlaceSelected: (placeId: string) => void;
  onMapPositionChanged: (center: LatLngLiteral, zoom: number) => void;
}

const Map = ({
               center,
               zoom,
               places,
               onPlaceSelected,
               onMapPositionChanged,
             }: IMapProps) => {
  const [map, setMap] = useState<LeafletMap>();
  const onMapCreated = (leafletMap: LeafletMap) => {
    setMap(leafletMap);
  };

  // listen to props change and move the map accordingly
  useEffect(() => {
    if (!map) {
      return;
    }

    map.setView(center, zoom, {animate: false});
  }, [center, zoom]);

  return (<MapContainer className={styles.leafletContainer}
                        center={center}
                        whenCreated={onMapCreated}
                        zoom={zoom}
                        scrollWheelZoom={'center'}>
    <TileLayer url={TILE_URL} attribution={MAP_ATTRIBUTION}/>
    <MarkerList places={places} onPlaceSelected={onPlaceSelected}/>
    <MapController center={center} zoom={zoom}
                   onMapPositionChanged={onMapPositionChanged}/>
  </MapContainer>);
}

export default Map;
