/*
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

package com.apitable.organization.facade;

import com.apitable.organization.dto.TeamCteInfo;
import com.apitable.organization.dto.TeamPathInfo;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.shared.util.CollectionUtil;
import com.apitable.shared.util.DBUtil;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Default CTE team facade implement class.
 */
public class DefaultCTETeamFacadeImpl extends AbstractTeamFacade {

    private final TeamMapper teamMapper;

    public DefaultCTETeamFacadeImpl(TeamMapper teamMapper) {
        this.teamMapper = teamMapper;
    }

    @Override
    public List<TeamPathInfo> getAllParentTeam(Collection<Long> teamIds) {
        if (teamIds.isEmpty()) {
            return new ArrayList<>();
        }
        return teamMapper.selectParentTeamTree(teamIds);
    }

    @Override
    public List<TeamCteInfo> getAllChildTeam(Collection<Long> teamIds) {
        List<TeamCteInfo> teams = DBUtil.batchSelectByFieldIn(teamIds,
            teamMapper::selectChildTeamTree);
        return CollectionUtil.distinctByProperty(teams, TeamCteInfo::getId);
    }
}
