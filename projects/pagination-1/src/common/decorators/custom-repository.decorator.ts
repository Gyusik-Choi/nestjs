import { SetMetadata } from "@nestjs/common";

export const TYPEORM_CUSTOM_REPOSITORY_TOKEN = 'TYPEORM_CUSTOM_REPOSITORY_TOKEN';

export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_CUSTOM_REPOSITORY_TOKEN, entity);
}
