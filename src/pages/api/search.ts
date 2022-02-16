// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {IPlace} from "../../places/interfaces";
import {
  ISearchRequestOptions,
  PlaceSearchService
} from "../../places/search/search.service";
import {
  LAT_QUERY_STRING_NAME,
  LNG_QUERY_STRING_NAME,
  SEARCH_QUERY_STRING_NAME,
  ZOOM_QUERY_STRING_NAME
} from "../../places/search/url-param-name.constants";

export type SearchResponse = {
  // improvement: add nextPageToken for fetching next set of search results
  data: IPlace[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  // improvement: move request processing to a separate module
  const requestOptions = extractOptions(req);
  const requestErrors = validateOptions(requestOptions);

  if (requestErrors.length) {
    return res.status(400).end();
  }

  // improvement: use dependency injection, e.g. InversifyJs
  const placesSearchService = new PlaceSearchService();
  const places = await placesSearchService.search(requestOptions);
  res.status(200).json({
    data: places
  });
}

function extractOptions(req: NextApiRequest): ISearchRequestOptions {
  // improvement: process search request with some library
  return {
    query: <string>req.query[SEARCH_QUERY_STRING_NAME],
    coordinate: {
      lat: parseFloat(<string>req.query[LAT_QUERY_STRING_NAME]),
      lng: parseFloat(<string>req.query[LNG_QUERY_STRING_NAME]),
    },
    zoom: parseInt(<string>req.query[ZOOM_QUERY_STRING_NAME]),
  };
}

function validateOptions(searchOptions: ISearchRequestOptions): string[] {
  // improvement: use validation library
  // improvement: validate all search options
  const errors: string[] = [];

  if (!searchOptions.query) {
    errors.push('Query should be present');
  }

  return errors;
}
