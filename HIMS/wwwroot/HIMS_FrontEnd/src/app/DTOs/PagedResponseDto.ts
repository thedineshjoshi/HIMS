export interface PagedResponseDto<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}