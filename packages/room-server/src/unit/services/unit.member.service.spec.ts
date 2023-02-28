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
import { Test, TestingModule } from '@nestjs/testing';
import { UnitMemberService } from './unit.member.service';
import { UnitMemberRepository } from '../repositories/unit.member.repository';
import { UserService } from 'user/services/user.service';
import { UnitMemberInfoDto } from '../dtos/unit.member.info.dto';
import { INamedUser } from '../../shared/interfaces';
import { MemberType } from '@apitable/core';
import { PermissionException } from '../../shared/exception';
import { UnitMemberBaseInfoDto } from '../dtos/unit.member.base.info.dto';

describe('UnitMemberServiceTest', () => {
  let module: TestingModule;
  let service: UnitMemberService;
  let userService: UserService;
  let unitMemberRepository: UnitMemberRepository;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      providers: [
        UnitMemberRepository,
        {
          provide: UserService,
          useValue: {
            getUserBaseInfoMapByUserIds: jest.fn(),
          },
        },
        UnitMemberService,
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    unitMemberRepository = module.get<UnitMemberRepository>(UnitMemberRepository);
    service = module.get<UnitMemberService>(UnitMemberService);
  });

  beforeAll(() => {
    const unitMember = {
      id: '2023',
      memberName: 'memberName',
      userId: 2023,
      mobile: 'mobile',
      spaceId: 'spaceId',
      isActive: true,
      isDeleted: false,
      isSocialNameModified: 0,
    };
    const namedUser = {
      id: 2023,
      uuid: '2023',
      avatar: 'avatar',
      nikeName: 'nickName',
      isSocialNameModified: 0,
      color: 0,
    };
    const unitMemberBaseInfo = {
      id: '2023',
      memberName: 'memberName',
      userId: '2023',
      isActive: 1,
      isDeleted: false,
      isMemberNameModified: false,
      unitId: '2023',
    };
    jest.spyOn(unitMemberRepository, 'selectMembersByIdsIncludeDeleted')
      .mockImplementation((memberIds: number[]): Promise<UnitMemberInfoDto[]> => {
        if (memberIds?.length === 1 && `${memberIds[0]}` === unitMember.id) {
          return Promise.resolve([unitMember]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(unitMemberRepository, 'selectIdBySpaceIdAndName')
      .mockImplementation((spaceId: string, memberName: string): Promise<{ id: string } | undefined> => {
        if(spaceId === 'spaceId' && memberName === 'memberName') {
          return Promise.resolve({ id: '2023' });
        }
        return Promise.resolve(undefined);
      });
    jest.spyOn(unitMemberRepository, 'selectIdBySpaceIdAndUserId')
      .mockImplementation((spaceId: string, userId: string): Promise<{ id: string } | undefined> => {
        if(spaceId === 'spaceId' && userId === '2023') {
          return Promise.resolve({ id: '2023' });
        }
        return Promise.resolve(undefined);
      });
    jest.spyOn(unitMemberRepository, 'selectMembersBySpaceIdAndUserIds')
      .mockImplementation((spaceId: string, userIds: string[], excludeDeleted = true): Promise<UnitMemberBaseInfoDto[]> => {
        if (spaceId === 'spaceId' && userIds?.length === 1 && userIds[0] === '2023' && excludeDeleted) {
          return Promise.resolve([unitMemberBaseInfo]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(userService, 'getUserBaseInfoMapByUserIds')
      .mockImplementation((userIds: number[]): Promise<Map<string, INamedUser>> => {
        if(userIds?.length === 1 && userIds[0] === 2023) {
          const map = new Map();
          map.set(namedUser.id, namedUser);
          return Promise.resolve(map);
        }
        return Promise.resolve(new Map());
      });
  });

  it('should be return user info map by user id', async() => {
    const userIdToUserInfoMap = await service.getMembersBaseInfo([2023]);
    expect(userIdToUserInfoMap[2023]?.userId).toEqual('2023');
    expect(userIdToUserInfoMap[2023]?.userId).toEqual('2023');
    expect(userIdToUserInfoMap[2023]?.name).toEqual('memberName');
    expect(userIdToUserInfoMap[2023]?.type).toEqual(MemberType.Member);
    expect(userIdToUserInfoMap[2023]?.avatar).toEqual('avatar');
    expect(userIdToUserInfoMap[2023]?.nickName).toEqual('nickName');
    expect(userIdToUserInfoMap[2023]?.avatarColor).toEqual(0);
    expect(userIdToUserInfoMap[2023]?.isActive).toBeTruthy();
    expect(userIdToUserInfoMap[2023]?.isDeleted).toBeFalsy();
    expect(userIdToUserInfoMap[2023]?.isNickNameModified).toBeFalsy();
    expect(userIdToUserInfoMap[2023]?.isMemberNameModified).toBeFalsy();
  });

  it('should get id by space id and member name', async() => {
    const id = await service.getIdBySpaceIdAndName('spaceId', 'memberName');
    expect(id).toEqual('2023');
  });

  it('should get null by space id and no exist member name', async() => {
    const id = await service.getIdBySpaceIdAndName('spaceId', 'noExistMemberName');
    expect(id).toEqual(null);
  });

  it('should get id by space id and user id', async() => {
    const id = await service.getIdBySpaceIdAndName('spaceId', 'memberName');
    expect(id).toEqual('2023');
  });

  it('should get null by space id and no exist user id', async() => {
    const id = await service.getIdBySpaceIdAndName('spaceId', '2024');
    expect(id).toEqual(null);
  });

  it('should throw when user no exist in space', async() => {
    await expect(async() => {
      await service.checkUserIfInSpace('spaceId', '2024');
    }).rejects.toThrow(PermissionException.ACCESS_DENIED.message);
  });

  it('should return members base info', async() => {
    const baseInfoVos = await service.getMembersBaseInfoBySpaceIdAndUserIds('spaceId', ['2023']);
    expect(baseInfoVos['2023']?.memberId).toEqual('2023');
    expect(baseInfoVos['2023']?.memberName).toEqual('memberName');
    expect(baseInfoVos['2023']?.isActive).toEqual(true);
    expect(baseInfoVos['2023']?.isDeleted).toEqual(false);
    expect(baseInfoVos['2023']?.isMemberNameModified).toEqual(false);
    expect(baseInfoVos['2023']?.unitId).toEqual('2023');
  });
});