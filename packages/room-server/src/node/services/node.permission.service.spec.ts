/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { NodePermissionService } from './node.permission.service';
import { MetaService } from 'database/resource/services/meta.service';
import { RestService } from 'shared/services/rest/rest.service';
import { UserService } from 'user/services/user.service';
import { NodeShareSettingService } from './node.share.setting.service';
import { PermissionException } from 'shared/exception';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { NodeRepository } from '../repositories/node.repository';

describe('Test NodePermissionService', () => {
  let moduleFixture: TestingModule;
  let nodePermissionService: NodePermissionService;
  let restService: RestService;
  let userService: UserService;
  let nodeShareSettingService: NodeShareSettingService;
  let metaService: MetaService;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        {
          provide: MetaService,
          useValue: {
            selectMetaByResourceId: jest.fn(),
          },
        },
        {
          provide: RestService,
          useValue: {
            getFieldPermission: jest.fn(),
            getNodePermission: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            session: jest.fn(),
          },
        },
        {
          provide: NodeShareSettingService,
          useValue: {
            getNodeShareProps: jest.fn(),
          },
        },
        {
          provide: NodeRepository,
          useValue: {},
        },
        NodePermissionService,
      ],
    }).compile();
    restService = moduleFixture.get<RestService>(RestService);
    userService = moduleFixture.get<UserService>(UserService);
    nodeShareSettingService = moduleFixture.get<NodeShareSettingService>(NodeShareSettingService);
    metaService = moduleFixture.get<MetaService>(MetaService);
    nodePermissionService = moduleFixture.get<NodePermissionService>(NodePermissionService);
    jest.spyOn(restService, 'getNodePermission').mockImplementation((_auth: any, nodeId: string, shareId?: string): any => {
      if (nodeId === '1') {
        return {
          hasRole: true,
          readable: true,
        };
      } else if (nodeId === '0') {
        return {
          hasRole: false,
        };
      } else if (nodeId === '2' && shareId === '2') {
        return {
          editable: true,
        };
      } else if (nodeId === '3' && shareId === '3') {
        return {
          editable: false,
          isDeleted: false,
        };
      } else if (shareId === 'emb1') {
        return {
          readable: true,
        };
      } else if (shareId === 'emb2') {
        return {
          readable: false,
        };
      }
    });
    jest.spyOn(userService, 'session').mockImplementation((cookie: string): any => {
      return cookie === 'true';
    });
    jest.spyOn(nodeShareSettingService, 'getNodeShareProps').mockImplementation((shareId: string, _nodeId: string): any => {
      if (shareId === '1') {
        return {};
      } else if (shareId === 'emb1') {
        return {};
      } else if (shareId === '2') {
        return {
          canBeEdited: true,
        };
      } else if (shareId === '3') {
        return {
          canBeEdited: true,
        };
      }
    });
    jest.spyOn(metaService, 'selectMetaByResourceId').mockImplementation((_nodeId: string): any => {
      return { fillAnonymous: true } ;
    });
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be return node permission on-space form', async() => {
    const nodePermission = await nodePermissionService.getNodePermission('', {}, { internal: true, form: true });
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be return node permission on-space table', async() => {
    const nodePermission = await nodePermissionService.getNodePermission('1', {}, { internal: true });
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be return node permission on-space main table', async() => {
    const nodePermission = await nodePermissionService.getNodePermission('1', {}, { internal: true, main: true });
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be throw ACCESS_DENIED on-space main table  no node permission ', async() => {
    await expect(async() => {
      await nodePermissionService.getNodePermission('0', {}, { internal: true, main: true });
    }).rejects.toThrow(PermissionException.ACCESS_DENIED.message);
  });

  it('should be return node permission off-space template', async() => {
    const nodePermission = await nodePermissionService.getNodePermission('1', {}, { internal: false });
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be return node permission off-space main share datasheet not login in', async() => {
    const nodePermission = await nodePermissionService.getNodePermission('1', { cookie: 'false' }, { internal: false, shareId: '1', main: true });
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be return node permission off-space share datasheet not login in', async() => {
    const nodePermission = await nodePermissionService.getNodePermission('1', { cookie: 'false' }, { internal: false, shareId: '1' });
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be return node permission off-space share anonymous form not login in', async() => {
    const nodePermission = await nodePermissionService.getNodePermission('1', { cookie: 'false' }, { internal: false, shareId: '1', form: true });
    expect(nodePermission.hasRole).toEqual(true);
    expect(nodePermission.editable).toEqual(true);
  });

  it('should be return node permission off-space share datasheet login in', async() => {
    const nodePermission = await nodePermissionService.getNodeRole('1', { cookie: 'true' }, '0');
    expect(nodePermission.hasRole).toEqual(false);
  });

  it('should be return share node permission off-space share datasheet login in', async() => {
    const nodePermission = await nodePermissionService.getNodeRole('2', { cookie: 'true' }, '2');
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be return false node permission off-space datasheet login in', async() => {
    const nodePermission = await nodePermissionService.getNodeRole('3', { cookie: 'true' }, '3');
    expect(nodePermission.hasRole).toEqual(false);
  });

  it('should be return true node permission off-space embed datasheet login in', async() => {
    const nodePermission = await nodePermissionService.getNodeRole('-1', { cookie: 'true' }, 'emb1');
    expect(nodePermission.hasRole).toEqual(true);
  });

  it('should be return false node permission off-space embed datasheet login in', async() => {
    const nodePermission = await nodePermissionService.getNodeRole('-1', { cookie: 'true' }, 'emb2');
    expect(nodePermission.hasRole).toEqual(false);
  });
});
