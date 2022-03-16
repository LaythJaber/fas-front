import {FieldType} from '../enum/field-type';

export class SharedVariation {
  id: number;
  description: string;
  type: FieldType;
  active: boolean;
  variationValueList: VariationValue[];
}

export class VariationValue {
  id: number;
  value: string;
  color: string;
  colorCode: string;
  size: string;
  sizeCode: string;
  status: string;
  stock: VariationStock[];
  sizeId: number;
  colorId: number;
}

export class VariationStock {
  stock: string;
  price: number;
  sellPointId: number;
  sellPointDesc: string;
}

export class Values {
  valId: number;
  value: string;
  name: string;
  code: string;
}
