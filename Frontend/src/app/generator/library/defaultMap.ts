/**
 * A Map that will create a new value when the key is not present.
 */
export class DefaultMap<K, V> {

  private map: Map<K, V> = new Map();

  constructor(private readonly defaultValue: () => V) {
  }

  public get(key: K): V {
    const match = this.map.get(key);
    if (match) {
      return match;
    } else {
      const newValue = this.defaultValue();
      this.map.set(key, newValue);

      return newValue;
    }
  }

  public set(key: K, value: V): DefaultMap<K, V> {
    this.map.set(key, value);
    return this;
  }

  public delete(key: K): boolean {
    return this.map.delete(key);
  }

  public forEach(mapping: (value: V, key: K, map: DefaultMap<K, V>) => void) {
    return this.map.forEach((v, k) => mapping(v, k, this));
  }
}
