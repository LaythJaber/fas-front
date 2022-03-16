export class SearchResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages?: number;
}
