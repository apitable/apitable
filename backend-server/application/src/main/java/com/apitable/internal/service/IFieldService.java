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

package com.apitable.internal.service;

import java.util.List;

import com.apitable.internal.vo.UrlAwareContentsVo;

/**
 * Field related functions
 *
 */
public interface IFieldService {

    /**
     * get the url information of the url
     * @param urls url
     * @param userId User id
     * @return url information
     */
    UrlAwareContentsVo getUrlAwareContents(List<String> urls, Long userId);
}
