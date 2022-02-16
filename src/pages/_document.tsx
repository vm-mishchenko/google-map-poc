import Document, {Head, Html, Main, NextScript} from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (<Html lang="en">
        <Head>
          <title>Google map 2.0</title>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
            crossOrigin=""
          />
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}
