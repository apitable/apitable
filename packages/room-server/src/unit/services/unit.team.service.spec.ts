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
import { UnitTeamService } from './unit.team.service';
import { UnitTeamRepository } from '../repositories/unit.team.repository';
import { UnitTeamBaseInfoDto } from '../dtos/unit.team.base.info.dto';
import { MemberType } from '@apitable/core';
import { Test, TestingModule } from '@nestjs/testing';

describe('UnitTeamServiceTest', () => {
  let moduleFixture: TestingModule;
  let service: UnitTeamService;
  let unitTeamRepository: UnitTeamRepository;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      providers: [
        UnitTeamService,
        UnitTeamRepository,
      ],
    }).compile();
    unitTeamRepository = moduleFixture.get<UnitTeamRepository>(UnitTeamRepository);
    service = moduleFixture.get<UnitTeamService>(UnitTeamService);
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

  afterEach(async() => {
    await moduleFixture.close();
  });

  describe('getTeamsByIdsIncludeDeleted', () => {
    it('should be return team base infos by team ids', async() => {
      const teamIdToTeamInfo = await service.getTeamsByIdsIncludeDeleted([2023]);
      expect(teamIdToTeamInfo['2023']?.name).toEqual('teamName');
      expect(teamIdToTeamInfo['2023']?.uuid).toEqual('');
      expect(teamIdToTeamInfo['2023']?.userId).toEqual('');
      expect(teamIdToTeamInfo['2023']?.type).toEqual(MemberType.Team);
      expect(teamIdToTeamInfo['2023']?.isDeleted).toBeFalsy();
    });
  });

  describe('getIdBySpaceIdAndName', () => {
    it('return team id by space id and team name', async() => {
      const teamId = await service.getIdBySpaceIdAndName('spaceId', 'teamName');
      expect(teamId).toEqual('2023');
    });

    it('return null by space id and no exist team name', async() => {
      const teamId = await service.getIdBySpaceIdAndName('spaceId', 'noExistTeamName');
      expect(teamId).toEqual(null);
    } );
  });

  describe('getTeamIdSubTeamIdsMapBySpaceIdAndParentIds', () => {
    it('should return an empty map and sub team list when there are no teams', async() => {
      const spaceId = 'space1';
      const parentTeamIds: string[] = [];
      jest.spyOn(unitTeamRepository, 'selectTeamsBySpaceId').mockResolvedValue([]);
      const result = await service.getTeamIdSubTeamIdsMapBySpaceIdAndParentIds(spaceId, parentTeamIds);
      expect(result).toEqual({ teamIdSubTeamIdsMap: {}, subTeams: [] });
    });
  
    it('should return team ID - sub team IDs map and sub team list', async() => {
      const spaceId = 'space1';
      const parentTeamIds = ['team1', 'team2'];
      const unitTeams = [
        { id: 'team1', groupId: 'group1' },
        { id: 'team2', groupId: 'group1' },
        { id: 'team3', groupId: 'team1' },
        { id: 'team4', groupId: 'team1' },
      ];
      jest.spyOn(unitTeamRepository, 'selectTeamsBySpaceId').mockResolvedValue(Object.assign(unitTeams));
      const result = await service.getTeamIdSubTeamIdsMapBySpaceIdAndParentIds(spaceId, parentTeamIds);
      expect(result).toEqual({
        teamIdSubTeamIdsMap: {
          team1: ['team3', 'team4'],
          team2: [],
        },
        subTeams: ['team3', 'team4'],
      });
    });
  });

  describe('getSubTeamIdsByParentSubRefMap', () => {
    it('should return an empty array when there are no sub teams', () => {
      const parentSubRefMap: { [parentTeamId: string]: string[] } = {};
      const unitTeam = { id: 'team1', groupId: 'group1' };
      const result = service.getSubTeamIdsByParentSubRefMap(parentSubRefMap, unitTeam);
      expect(result).toEqual([]);
    });
  
    it('should return direct sub team IDs', () => {
      const parentSubRefMap: { [parentTeamId: string]: string[] } = {
        team1: ['team2', 'team3'],
      };
      const unitTeam = { id: 'team1', groupId: 'group1' };
      const result = service.getSubTeamIdsByParentSubRefMap(parentSubRefMap, unitTeam);
      expect(result).toEqual(['team2', 'team3']);
    });
  
    it('should return all sub team IDs recursively', () => {
      const parentSubRefMap: { [parentTeamId: string]: string[] } = {
        team1: ['team2'],
        team2: ['team3', 'team4'],
        team3: ['team5'],
      };
      const unitTeam = { id: 'team1', groupId: 'group1' };
      const result = service.getSubTeamIdsByParentSubRefMap(parentSubRefMap, unitTeam);
      expect(result).toEqual(['team2', 'team3', 'team4', 'team5']);
    });
  });
});