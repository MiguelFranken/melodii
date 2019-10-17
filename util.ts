export type Optional<T> = T | null;

export function isPresent(obj: Optional<any>): boolean {
  return obj != null;
}

export function get<T>(obj: Optional<T>): T {
  return obj as T;
}