import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import styles from "./search-box.module.css";
import Loading from "../loading/loading";

export interface ISearchBoxProps {
  searchQuery: string;
  onSearchQueryUpdate: (searchQuery: string) => void;
  loading: boolean;
}

const SearchBox = ({
                     searchQuery,
                     onSearchQueryUpdate,
                     loading
                   }: ISearchBoxProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    processNewSearchQuery(localSearchQuery);
  }

  const onSubmitBtnClick = () => {
    processNewSearchQuery(localSearchQuery);
  }

  const processNewSearchQuery = (searchQuery: string) => {
    onSearchQueryUpdate(searchQuery);
  }

  const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(() => {
      return event.target.value;
    });
  }

  // when a search query in URL has changed, update a local value as well
  useEffect(() => {
    setLocalSearchQuery(() => searchQuery);
  }, [searchQuery])

  // improvement: add "Clear" button
  return (
    <div className={styles.searchBoxContainer}>
      <form className={styles.searchBox} onSubmit={onSubmit}>
        <input placeholder="Search places"
               type="search"
               onChange={onSearchQueryChange}
               value={localSearchQuery}/>
        <button onClick={onSubmitBtnClick} type="submit">Search</button>
      </form>
      <Loading loading={loading}/>
    </div>
  );
};

export default SearchBox;
