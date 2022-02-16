## Data flow
1) user changes map position / search query / selected Place
2) update URL
3) update Store based on new URL
4) make Search request if necessary


## Covered cases
1. Current Map position / Zoom is saved in URL
2. Search query is saved in URL
3. Selected place is saved in URL
4. Cancel previous Search call
5. Save Selected Place after new search request


## Not Covered cases
- message for empty search result
- no error message for a failed Search request
- no cache (frontend/backend)
- only simple server side rendering
- detect location automatically
- many more...
