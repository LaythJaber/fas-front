import {Language} from "../../enum/language.enum";

export interface BlogPost {
  id: number;
  blogPostTrans: BlogPostTrans[];
  updatedAt: any;
  coverImageUrl: string;
}

export interface BlogPostTrans {
  id: number;
  langCodeId: number;
  langCode: Language;
  postTitle: string;
  post: string;
}
