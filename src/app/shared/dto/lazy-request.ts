export class LazyRequest {
  page: number;
  pageSize: number;
  textSearch?: string;
  type?: string;
  sort?: {
    attribute: string,
    direction: 'ASC' | 'DESC'
  };
}
