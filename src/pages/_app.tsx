import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {initializeStore} from "../redux/store";
import {Provider} from "react-redux";

function MyApp({Component, pageProps}: AppProps) {
  const store = initializeStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
