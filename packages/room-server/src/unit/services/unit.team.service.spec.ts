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
import { UnitTeamService } from './unit.team.service';
import { UnitTeamRepository } from '../repositories/unit.team.repository';
import { UnitTeamBaseInfoDto } from '../dtos/unit.team.base.info.dto';
import { MemberType } from '@apitable/core';

describe('UnitTeamServiceTest', () => {
  let module: TestingModule;
  let service: UnitTeamService;
  let unitTeamRepository: UnitTeamRepository;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      providers: [
        UnitTeamService,
        UnitTeamRepository,
      ],
    }).compile();
    unitTeamRepository = module.get<UnitTeamRepository>(UnitTeamRepository);
    service = module.get<UnitTeamService>(UnitTeamService);
  });

  beforeEach(() => {
    const unitTeam = {
      id: '2023',
      teamName: 'teamName',
      isDeleted: false,
    };

    jest.spyOn(unitTeamRepository, 'selectTeamsByIdsIncludeDeleted')
      .mockImplementation((teamIds: number[]): Promise<UnitTeamBaseInfoDto[]> => {
        if(teamIds?.length === 1 && `${teamIds[0]}` == unitTeam.id) {
          return Promise.resolve([unitTeam]);
        }
        return Promise.resolve([]);
      });

    jest.spyOn(unitTeamRepository, 'selectIdBySpaceIdAndName')
      .mockImplementation((spaceId: string, teamName: string): Promise<{ id: string } | undefined> => {
        if(spaceId === 'spaceId' && teamName === 'teamName') {
          return Promise.resolve({ id: '2023' });
        }
        return Promise.resolve(undefined);
      });
  });

  it('should be return team base infos by team ids', async() => {
    const teamIdToTeamInfo = await service.getTeamsByIdsIncludeDeleted([2023]);
    expect(teamIdToTeamInfo['2023']?.name).toEqual('teamName');
    expect(teamIdToTeamInfo['2023']?.uuid).toEqual('');
    expect(teamIdToTeamInfo['2023']?.userId).toEqual('');
    expect(teamIdToTeamInfo['2023']?.type).toEqual(MemberType.Team);
    expect(teamIdToTeamInfo['2023']?.isDeleted).toBeFalsy();
  });

  it('return team id by space id and team name', async() => {
    const teamId = await service.getIdBySpaceIdAndName('spaceId', 'teamName');
    expect(teamId).toEqual('2023');
  });

  it('return null by space id and no exist team name', async() => {
    const teamId = await service.getIdBySpaceIdAndName('spaceId', 'noExistTeamName');
    expect(teamId).toEqual(null);
  } );
});