import { DynamicModule, Provider } from "@nestjs/common";
import { TYPEORM_CUSTOM_REPOSITORY_TOKEN } from "../decorators/custom-repository.decorator";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

export class TypeORMCustomModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
    const providers: Provider[] = [];
    
    for (const repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_CUSTOM_REPOSITORY_TOKEN, repository);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
        }
      });
    }

    return {
      exports: providers,
      module: TypeORMCustomModule,
      providers,
    }
  }
}
