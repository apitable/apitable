/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *'
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { TestingModule, Test } from '@nestjs/testing';
import { NodeShareSettingRepository } from 'node/repositories/node.share.setting.repository';
import { Observable } from 'rxjs';
import { InternalServiceNodeInterfaceService } from 'shared/backend_client/api/internal-service-node-interface.service';
import { PermissionException, CommonException } from 'shared/exception';
import { NodeShareSettingService } from './node.share.setting.service';

describe('Test NodeShareSettingService', () => {
  let moduleFixture: TestingModule;
  let nodeShareSettingRepository: NodeShareSettingRepository;
  let nodeShareSettingService: NodeShareSettingService;
  let nodeInterfaceService: InternalServiceNodeInterfaceService;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: NodeShareSettingRepository,
          useValue: {
            selectByShareId: jest.fn(),
            selectByNodeId: jest.fn(),
          },
        },
        {
          provide: InternalServiceNodeInterfaceService,
          useValue: {
            getContainsStatus: jest.fn(),
          },
        },
        NodeShareSettingService,
      ],
    }).compile();
    nodeShareSettingRepository = moduleFixture.get<NodeShareSettingRepository>(NodeShareSettingRepository);
    nodeShareSettingService = moduleFixture.get<NodeShareSettingService>(NodeShareSettingService);
    nodeInterfaceService = moduleFixture.get<InternalServiceNodeInterfaceService>(InternalServiceNodeInterfaceService);
    jest.spyOn(nodeInterfaceService, 'getContainsStatus').mockImplementation((folderId: string, _nodeId: string): any => {
      return new Observable((observer) => {
        observer.next({
          data: {
            success: true,
            code: 200,
            message: 'SUCCESS',
            data: folderId == '1',
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        });
        observer.complete();
      });
    });
    jest.spyOn(nodeShareSettingRepository, 'selectByShareId').mockImplementation((shareId: string): any => {
      if (shareId === '1') {
        return {
          id: '1',
          nodeId: '1',
          shareId: '1',
          isEnabled: true,
          props: {
            canBeEdited: true,
          },
        };
      } else if (shareId === '2') {
        return {
          id: '2',
          nodeId: '3',
          shareId: '2',
          isEnabled: true,
        };
      } else if (shareId === '4') {
        return {
          id: '4',
          nodeId: '0',
          isEnabled: true,
          props: {},
        };
      }
      return undefined;
    });
    jest.spyOn(nodeShareSettingRepository, 'selectByNodeId').mockResolvedValue({
      id: '1',
      nodeId: '1',
      isEnabled: true,
    } as any);
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it('should be return share setting', async () => {
    const shareSetting = await nodeShareSettingService.getByShareId('1');
    expect(shareSetting).toBeDefined();
  });

  it('should be return share status', async () => {
    const shareStatus = await nodeShareSettingService.getShareStatusByNodeId('1');
    expect(shareStatus).toBeTruthy();
  });

  it('should be pass check', async () => {
    await nodeShareSettingService.checkNodeHasOpenShare('1', '1');
  });

  it('should be pass check', async () => {
    await nodeShareSettingService.checkNodeHasOpenShare('1', '0');
  });

  it('should be throw ACCESS_DENIED exception because empty share setting', async () => {
    await expect(async () => {
      await nodeShareSettingService.checkNodeHasOpenShare('0', '1');
    }).rejects.toThrow(PermissionException.ACCESS_DENIED.message);
  });

  it('should be throw ACCESS_DENIED exception because no share', async () => {
    await expect(async () => {
      await nodeShareSettingService.checkNodeHasOpenShare('2', '2');
    }).rejects.toThrow(PermissionException.ACCESS_DENIED.message);
  });

  it('should be check pass', async () => {
    await nodeShareSettingService.checkNodeShareCanBeEdited('1', '1');
  });

  it('should be throw NODE_SHARE_NO_ALLOW_EDIT error', async () => {
    await expect(async () => {
      await nodeShareSettingService.checkNodeShareCanBeEdited('2', '3');
    }).rejects.toThrow(CommonException.NODE_SHARE_NO_ALLOW_EDIT.message);
  });

  it('should be return null because empty share setting', async () => {
    const props = await nodeShareSettingService.getNodeShareProps('3', '-1');
    expect(props).toEqual(null);
  });

  it('should be return null because no share', async () => {
    const props = await nodeShareSettingService.getNodeShareProps('4', '-1');
    expect(props).toEqual(null);
  });

  it('should be return children propre', async () => {
    const props = await nodeShareSettingService.getNodeShareProps('1', '1');
    expect(props).toEqual({ canBeEdited: true });
  });
});
