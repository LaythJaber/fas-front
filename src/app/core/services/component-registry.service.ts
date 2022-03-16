import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ComponenRegistryService {

  // tslint:disable-next-line:variable-name
  private _registry: {} = {};
  public onRegistryChanged: BehaviorSubject<any>;

  constructor() {
    this.onRegistryChanged = new BehaviorSubject(this._registry);
  }

  register(key, component): void {
    // Check if the key already being used
    if (this._registry[key]) {
      console.log(`The component with the key '${key}' already exists.`);

      return;
    }

    // Add to the registry
    this._registry[key] = component;
    this.onRegistryChanged.next(this._registry);
  }

  unregister(key): void {
    // Check if the component exists
    if (!this._registry[key]) {
      console.warn(`The component with the key '${key}' doesn't exist in the registry.`);
    } else {
      // Unregister the component
      delete this._registry[key];
    }
  }

  /**
   * Return the component with the given key
   */
  getComponent(key) {
    // Check if the component exists
    if (!this._registry[key]) {
      console.warn(`The component with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Return the component
    return this._registry[key];
  }

}
