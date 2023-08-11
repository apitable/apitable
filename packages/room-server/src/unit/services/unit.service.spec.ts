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
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { UserService } from 'user/services/user.service';
import { UnitRepository } from '../repositories/unit.repository';
import { UnitService } from './unit.service';
import { UnitTeamService } from './unit.team.service';
import { UnitMemberService } from './unit.member.service';
import { MemberType } from '@apitable/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UnitTeamMemberRefRepository } from 'unit/repositories/unit.team.member.ref.repository';
import { UnitRoleMemberRepository } from 'unit/repositories/unit.role.member.repository';

describe('Test', () => {
  let moduleFixture: TestingModule;
  let unitService: UnitService;
  let unitRepository: UnitRepository;
  let unitMemberService: UnitMemberService;
  let unitTeamService: UnitTeamService;
  let userService: UserService;
  let configService: EnvConfigService;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      providers: [
        UnitService,
        UnitRepository,
        UnitTeamMemberRefRepository,
        UnitRoleMemberRepository,
        {
          provide: UnitTeamService,
          useValue: {
            getTeamsByIdsIncludeDeleted: jest.fn(),
          },
        },
        {
          provide: UnitMemberService,
          useValue: {
            getMembersBaseInfo: jest.fn(),
            getMembersBaseInfoBySpaceIdAndUserIds: jest.fn(),
          },
        },
        {
          provide: EnvConfigService,
          useValue: {
            getRoomConfig: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            selectUserBaseInfoByIds: jest.fn(),
          },
        }
      ],
    }).compile();
    unitRepository = moduleFixture.get<UnitRepository>(UnitRepository);
    unitMemberService = moduleFixture.get<UnitMemberService>(UnitMemberService);
    unitTeamService = moduleFixture.get<UnitTeamService>(UnitTeamService);
    configService = moduleFixture.get<EnvConfigService>(EnvConfigService);
    userService = moduleFixture.get<UserService>(UserService);
    unitService = moduleFixture.get<UnitService>(UnitService);
    jest.spyOn(unitRepository, 'selectUnitMembersByIdsIncludeDeleted')
      .mockResolvedValue([{ id: '2023',unitRefId: 2023, unitType: 3 }]);
    jest.spyOn(unitMemberService, 'getMembersBaseInfo')
      .mockResolvedValue({
        2023: {
          uuid: '2023',
          userId: '2023',
          name: 'memberName',
          type: MemberType.Member,
          avatar: 'avatar',
          nickName: 'nikeName',
          avatarColor: 0,
          isActive: true,
          isDeleted: false,
          isNickNameModified: false,
          isMemberNameModified: false,
        }
      });
    jest.spyOn(unitTeamService, 'getTeamsByIdsIncludeDeleted')
      .mockResolvedValue({});
    jest.spyOn(configService, 'getRoomConfig')
      .mockReturnValue({
        host: 'host',
        bucket: 'bucket',
        ossSignatureEnabled: false,
      });
    jest.spyOn(userService, 'selectUserBaseInfoByIds')
      .mockResolvedValue([{
        id: '2023',
        uuid: '2023',
        avatar: 'avatar',
        nikeName: 'nickName',
        color: 0,
        isSocialNameModified: 0,
      }]);
    jest.spyOn(unitMemberService, 'getMembersBaseInfoBySpaceIdAndUserIds')
      .mockResolvedValue({
        2023: {
          memberId: '2023',
          memberName: 'memberName',
          isActive: true,
          isDeleted: false,
          isMemberNameModified: false,
          unitId: '2023',
        }
      });
    jest.spyOn(unitRepository, 'selectUnitInfosBySpaceIdAndUnitIds')
      .mockResolvedValue([{
        unitId: '2023',
        type: 3,
        isDeleted: false,
        name: 'memberName',
        avatar: 'avatar',
        avatarColor: 0,
        nickName: 'nickName',
        isMemberNameModified: false,
        isActive: true,
        userId: '2023',
        uuid: '2023',
      }]);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be return unit info', async() => {
    const unitBaseInfoDtos = await unitService.getUnitMemberInfoByIds(['2023']);
    expect(unitBaseInfoDtos.length).toEqual(1);
    expect(unitBaseInfoDtos[0]?.avatar).toEqual('host/avatar');
    expect(unitBaseInfoDtos[0]?.isActive).toEqual(true);
    expect(unitBaseInfoDtos[0]?.isDeleted).toEqual(false);
    expect(unitBaseInfoDtos[0]?.isNickNameModified).toEqual(false);
    expect(unitBaseInfoDtos[0]?.isMemberNameModified).toEqual(false);
    expect(unitBaseInfoDtos[0]?.nickName).toEqual('nikeName');
    expect(unitBaseInfoDtos[0]?.avatarColor).toEqual(0);
    expect(unitBaseInfoDtos[0]?.name).toEqual('memberName');
    expect(unitBaseInfoDtos[0]?.type).toEqual(MemberType.Member);
    expect(unitBaseInfoDtos[0]?.unitId).toEqual('2023');
    expect(unitBaseInfoDtos[0]?.userId).toEqual('2023');
    expect(unitBaseInfoDtos[0]?.uuid).toEqual('2023');
  });

  it('should be return unit member info by user ids', async() => {
    const userIdToUnitMember = await unitService.getUnitMemberInfoByUserIds('spaceId', ['2023']);
    expect(userIdToUnitMember.get('2023')).toBeDefined();
    expect(userIdToUnitMember.get('2023')?.userId).toEqual('2023');
    expect(userIdToUnitMember.get('2023')?.unitId).toEqual('2023');
    expect(userIdToUnitMember.get('2023')?.type).toEqual(MemberType.Member);
    expect(userIdToUnitMember.get('2023')?.avatar).toEqual('host/avatar');
    expect(userIdToUnitMember.get('2023')?.avatarColor).toEqual(0);
    expect(userIdToUnitMember.get('2023')?.name).toEqual('memberName');
    expect(userIdToUnitMember.get('2023')?.isMemberNameModified).toEqual(false);
    expect(userIdToUnitMember.get('2023')?.isNickNameModified).toEqual(false);
    expect(userIdToUnitMember.get('2023')?.isActive).toBeTruthy();
    expect(userIdToUnitMember.get('2023')?.isDeleted).toBeFalsy();
  });

  it('should be return unit info by space id and unit id', async() => {
    const unitInfos = await unitService.getUnitInfo('spaceId', ['2023']);
    expect(unitInfos.length).toEqual(1);
    expect(unitInfos[0]?.uuid).toEqual('2023');
    expect(unitInfos[0]?.userId).toEqual('2023');
    expect(unitInfos[0]?.unitId).toEqual('2023');
    expect(unitInfos[0]?.isActive).toBeTruthy();
    expect(unitInfos[0]?.isDeleted).toBeFalsy();
    expect(unitInfos[0]?.avatar).toEqual('host/avatar');
    expect(unitInfos[0]?.avatarColor).toEqual(0);
    expect(unitInfos[0]?.name).toEqual('memberName');
    expect(unitInfos[0]?.nickName).toEqual('nickName');
    expect(unitInfos[0]?.type).toEqual(3);
  });
});