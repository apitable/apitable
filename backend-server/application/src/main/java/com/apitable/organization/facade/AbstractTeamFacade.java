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

import com.apitable.organization.dto.TeamPathInfo;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Abstract team facade.
 */
public abstract class AbstractTeamFacade implements TeamFacade {

    public List<Long> getAllParentTeamIds(Long teamId) {
        return this.getAllParentTeamIds(Collections.singletonList(teamId));
    }

    public List<Long> getAllParentTeamIds(Collection<Long> teamIds) {
        List<TeamPathInfo> teams = this.getAllParentTeam(teamIds);
        return teams.stream().map(TeamPathInfo::getId).collect(Collectors.toList());
    }
}
