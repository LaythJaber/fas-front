import {AuditSection} from './audit-section';
import {CategoryTranslation} from './category-translation';

export class Category {
  id: number;
  uuid: string;
  name: string;
  description: string;
  menuImage: string;
  bannerImage: string;
  status: boolean;
  priority: number;
  priority2: number;
  parent: Category;
  subCategoryNbr: number;
  subCategoryList: Category[];
  transInfo: CategoryTranslation[];
  auditSection: AuditSection;
  code: string;
  statusInLoading: boolean = false;
  parentId: number;
  ppId: number;
}
