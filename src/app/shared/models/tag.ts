import {TagTranslation} from "./tag-translation";


export class Tag {
  id?: number;
  uuid?: string;
  tagTranslationDtos?: TagTranslation[];
  createdAt?: Date;
  updateAt?: Date;
  image?: string;
}
