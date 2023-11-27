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
import java.util.Collection;
import java.util.List;

/**
 * Team Facade.
 *
 * @author Chambers
 */
public interface TeamFacade {

    /**
     * Get all parent team id (contain self).
     *
     * @param teamId    team table id
     * @return parent team id list
     * @author Chambers
     */
    List<Long> getAllParentTeamIds(Long teamId);

    /**
     * Get all parent team id (contain self).
     *
     * @param teamIds   team table ids
     * @return parent team id list
     * @author Chambers
     */
    List<Long> getAllParentTeamIds(Collection<Long> teamIds);

    /**
     * Get all parent team (contain self).
     *
     * @param teamIds   team table ids
     * @return TeamPathInfo List
     * @author Chambers
     */
    List<TeamPathInfo> getAllParentTeam(Collection<Long> teamIds);

    /**
     * Get all child team (contain self).
     *
     * @param teamIds   team table ids
     * @return TeamCteInfo List
     * @author Chambers
     */
    List<TeamCteInfo> getAllChildTeam(Collection<Long> teamIds);

}
