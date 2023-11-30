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

package com.apitable.shared.constants;

/**
 * <p>
 * paging constants.
 * </p>
 *
 * @author Shawn Deng
 */
public class PageConstants {

    /**
     * page request parameter.
     */
    public static final String PAGE_PARAM = "pageObjectParams";

    /**
     * page request example description.
     */
    public static final String PAGE_SIMPLE_EXAMPLE = "{\"pageNo\":1,\"pageSize\":20}";

    /**
     * page complex request example description.
     */
    public static final String PAGE_COMPLEX_EXAMPLE =
        "{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}";

    /**
     * page request usage description.
     */
    public static final String PAGE_DESC = "Description of Paging: <br/> "
        + "pageNo: number of paging <br/>"
        + "pageSize: size of paging。<br/>"
        + "order: order in current page。<br/>"
        + "sort: sorting in current page。<br/>"
        + "simple usage example：" + PAGE_SIMPLE_EXAMPLE + "<br/>"
        + "complex usage example：" + PAGE_COMPLEX_EXAMPLE;
}
