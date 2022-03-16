import {Injectable} from "@angular/core";
import {Product} from "../models/product";
import {PurchaseRow} from "../models/purchase/purchase-row";
import {GeneralConfigurationsService} from "./general-configurations.service";

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  sellPointId: number;

  constructor(
    private generalConfigurationsService: GeneralConfigurationsService,
  ) {
    this.generalConfigurationsService.getCurrentEnterpriseGeneralConfigurations()
      .subscribe((config) => {
        this.sellPointId = config.sellPointId;
      });
  }

  getPriceInOfferPerUnit(product: Product, quantity: number) {
    return product.priceOff;
  }

  getPricePerKiloOrLiter(product: Product, quantity: number) {
    return product.pricePerPrincipalMeasureUnit; // ça sera change
  }

  getPriceInOffer(product: Product, quantity: number) {
    return this.getPriceInOfferPerUnit(product, quantity) * quantity; // ça sera changé
  }


  getPricePerUnit(product: Product, quantity: number, colorId: number, sizeId: number) {
    if (product.weighted) {
      return (product.pricePerPrincipalMeasureUnit / 1000) * product.weight;
    }
    if (!colorId || !sizeId) {
      return product.priceSale; // ça sera change
    }
    if (product) {
      const v = product.sharedVariationList[0].variationValueList.find(c => c.colorId === colorId && c.sizeId === sizeId);
      if (v) {
        const stock = v.stock.find(s => s.sellPointId === this.sellPointId);
        if (stock) {
          return stock.price;
        }
      }
    }
    return 0;
  }

  getPrice(product: Product, quantity: number, colorId: number, sizeId: number) {
    return this.getPricePerUnit(product, quantity, colorId, sizeId) * quantity; // ça sera change
  }

  getQuantityInKgLtr(quantity: number, weight: number, weightUm: string, unit: string) {
    let wqte =  (weight * quantity);
    let wunit = weightUm?.toLocaleLowerCase();
    if (wqte >= 1000) {
      wqte = wqte / 1000;
      wunit = unit;
    }
    return wqte + wunit;
  }

  getWeightQuantityInRow(row: PurchaseRow, quantity: number) {
    let wqte =  Math.round(row.weight * quantity);
    let wunit = row.weightUm.toLocaleLowerCase();
    if (wqte >= 1000) {
      wqte = wqte / 1000;
      wunit = row.product.measureUnit.description;
    }
    return wqte + wunit;
  }

  getUnit(product: Product | PurchaseRow | {weighted: boolean, weight: number, weightUm: string}) {
    return (!product?.weighted ? 'pz' : product?.weight + product?.weightUm).toString().toLowerCase();
  }


  getWeightQuantity(product: Product, quantity: number) {
    if (quantity <= 0) {
      quantity = 1;
    }
    let wqte =  (product.weight * quantity);
    let wunit = product.weightUm?.toLocaleLowerCase();
    if (wqte >= 1000) {
      wqte = wqte / 1000;
      wunit = product.unit;
    }
    return wqte + wunit;
  }

}
