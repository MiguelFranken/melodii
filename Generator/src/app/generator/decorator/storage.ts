import { MetadataArgsStorage } from './metadata-builder/metadata-args-storage';

export function defaultMetadataArgsStorage(): MetadataArgsStorage {
  // create metadata args storage if not already created
  if (!(window as any).metadataArgsStorage) {
    (window as any).metadataArgsStorage = new MetadataArgsStorage();
  }

  return (window as any).metadataArgsStorage;
}
