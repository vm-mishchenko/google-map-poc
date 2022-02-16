import styles from "./place.module.css";
import {IPlace} from "../../places/interfaces";

export interface IPlaceProps {
  place: IPlace;
  onClosePlace: () => void;
}

const Place = ({place, onClosePlace}: IPlaceProps) => {
  return (
    <div className={styles.placeContainer}>
      <div className={styles.placeHeader}>
        <h2>{place.name}</h2>
        <div>
          <button onClick={onClosePlace}>Close</button>
        </div>
      </div>
      <p>{place.description}</p>
      <p>Rating: {place.rating}</p>
    </div>
  );
};

export default Place;
