export class Registry {

  protected _registryMap = new Map<Function, any>();

  public get(key: Function): any | null {
    return this._registryMap.get(key);
  }

  public set(key: Function, value: any): any {
    this._registryMap.set(key, value);
    return value;
  }

  public has(key: Function): boolean {
    return this._registryMap.has(key);
  }

}
