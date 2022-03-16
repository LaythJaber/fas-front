import {ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector} from '@angular/core';
import { ProductManagementFormComponent } from 'src/app/content/pages/products-and-services/product-management/product-management-form/product-management-form.component';

@Injectable()
export class ProductFormService {
  dialogComponentRef: ComponentRef<ProductManagementFormComponent>;

  constructor( private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector) { }

  openForm(container, data?: any) {
    // close form if opened
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
    }
    // open form component and pass data to it
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ProductManagementFormComponent);
    componentFactory.create(this.injector);
    const componentRef = container.createComponent(componentFactory);
    componentRef.instance.data = data;
    componentRef.instance.appRef = this.appRef;
    componentRef.instance.dialogComponentRef = componentRef;

    // return a ref of the opened form component
    return this.dialogComponentRef = componentRef;
  }

}


