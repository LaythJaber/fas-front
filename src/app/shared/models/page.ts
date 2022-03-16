export class Page{
  id?: number;
  createdAt?:Date;
  updatedAt?: Date;
  name?: string;
  active?: boolean;
  info?: string;
  htmlContent?: string;
  mandatory?: boolean;
  langEnum?: number;
  transInfo?: PageTrans[];
}


export class PageTrans{
  name?: string;
  info?: string;
  htmlContent?: string;
  langEnum?: string;
}
