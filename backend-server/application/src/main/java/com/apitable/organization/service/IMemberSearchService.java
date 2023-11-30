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

package com.apitable.organization.service;

import com.apitable.organization.vo.SearchMemberResultVo;
import com.apitable.organization.vo.SearchMemberVo;
import java.util.List;

/**
 * member search service.
 */
public interface IMemberSearchService {

    /**
     * fuzzy query member by keyword.
     *
     * @param spaceId            space id
     * @param keyword            keyword
     * @param highlightClassName the highlight style
     * @return SearchMemberResultVo
     */
    List<SearchMemberResultVo> getByName(String spaceId, String keyword, String highlightClassName);

    /**
     * fuzzy query member by member name.
     *
     * @param spaceId            space id
     * @param keyword            keyword
     * @param filter             whether to filter unadded members
     * @param highlightClassName the highlight style
     * @return SearchMemberVos
     */
    List<SearchMemberVo> getLikeMemberName(String spaceId, String keyword, Boolean filter,
                                           String highlightClassName);
}
