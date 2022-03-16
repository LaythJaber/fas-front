import {CartConfigurationTranslation} from "./cart-configuration-translation";

export class CartConfiguration {
  id: number;
  replaceableCheck: boolean;
  minimumCheck: boolean;
  minimumCart: number;
  sellPointId: number;
  transInfo: CartConfigurationTranslation[];
}
