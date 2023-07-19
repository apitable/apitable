import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class TimeMachineBaseService{

  public async generateTableBundle(_cookie: string, _dstId: string, _spaceId: string, _userId: string): Promise<any> {
    return await Promise.resolve();
  }

  public async getDataPack(_cookie: string, _dstId: string, _spaceId: string, _userId: string): Promise<any> {
    return await Promise.resolve();
  }

  public async getTableBundleById(_nodeId: string, _id?: string): Promise<any[]> {
    return await Promise.resolve([]);
  }

  public async renameTableBundle(_tablebundleId: string, _name: string): Promise<any> {
    return await Promise.resolve();
  }

  public async deleteTableBundle(_nodeId: string,_tablebundleId: string, _userId: string): Promise<any> {
    return await Promise.resolve();
  }

  public async recoverTableBundle(_userId: string, _tablebundleId: string, _spaceId :string,
    _dstId: string, _folderId: string, _name: string): Promise<any> {
    return await Promise.resolve();
  }

  public async previewTableBundle(_tablebundleId: string, _nodeId: string): Promise<any> {
    return await Promise.resolve();
  }

  public async downloadTableBundle(_tablebundleId: string, _nodeId: string, _fileName: string): Promise<string> {
    return await Promise.resolve('');
  }

}