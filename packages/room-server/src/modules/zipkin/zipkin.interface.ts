import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';

export interface IZipkinModuleOptions {
    enabled: boolean;
    endpoint: string;
}

export interface IZipkinModuleOptionsFactory {
    createZipkinModuleOptions(): Promise<IZipkinModuleOptions> | IZipkinModuleOptions;
}

export interface IZipkinModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useFactory?: (
        ...args: any[]
    ) => IZipkinModuleOptions | Promise<IZipkinModuleOptions>;
    inject?: FactoryProvider['inject'];
    // inject?: any[];
    useClass?: Type<IZipkinModuleOptionsFactory>;
}
