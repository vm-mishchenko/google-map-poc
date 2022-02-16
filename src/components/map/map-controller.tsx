import {LatLngLiteral} from "leaflet";
import {useMapEvents} from "react-leaflet";

interface IMapControllerProps {
  zoom: number;
  center: LatLngLiteral;
  onMapPositionChanged: (center: LatLngLiteral, zoom: number) => void;
}

const MapController = ({
                         zoom,
                         center,
                         onMapPositionChanged,
                       }: IMapControllerProps) => {
  const map = useMapEvents({
    moveend() {
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      if (currentCenter.equals(center, 0.01) && currentZoom === zoom) {
        return;
      }

      onMapPositionChanged({
        lat: currentCenter.lat,
        lng: currentCenter.lng
      }, map.getZoom());
    },
  });

  return null;
}

export default MapController;
