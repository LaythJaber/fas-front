export class Size {
  id: number;
  description: string;
  sizeNumber: number;
  existVariant: boolean;
  code: string;
  enabled: boolean;
  schemas: SizeSchema[] = [];
}

export class SizeSchema {
  id: number;
  description: string;
  code: string;
  alias: string;
  step: number;
  existVariant: boolean;
}
