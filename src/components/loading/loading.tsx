import styles from "./loading.module.css";

export interface ILoadingProps {
  loading: boolean;
}

const Loading = ({loading}: ILoadingProps) => {
  return (
    <div className={styles.loading}>{loading ? "Loading" : ""}</div>
  );
}

export default Loading;
