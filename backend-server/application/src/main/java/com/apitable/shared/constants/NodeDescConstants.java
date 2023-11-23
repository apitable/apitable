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
 * node desc constants.
 * </p>
 *
 * @author zoe zheng
 */
public class NodeDescConstants {

    public static final String DESC_JSON_DATA_PREFIX = "data.ops";

    public static final String DESC_JSON_RENDER_PREFIX = "render.ops";

    public static final String DESC_JSON_DATA_NEW_PREFIX = "data";

    public static final String DESC_JSON_DATA_NEW_FOD_PREFIX = "slateData.document";

    public static final String DESC_JSON_DATA_TEXT_PREFIX = "insert";

    public static final String DESC_JSON_DATA_TEXT_CHILDREN_PREFIX = "children.text";

    public static final String DESC_JSON_DATA_IMAGE_URL_PREFIX = "data.url";

    public static final String DESC_JSON_DATA_IMAGE_PREFIX = "image";

    public static final String DESC_JSON_DATA_ESCAPE_RE = "\\s{2,}|\t|\r|\n";

    public static final Integer DESC_TEXT_META_LENGTH = 57;

    public static final String FORM_DESC_DESCRIPTION_PREFIX = "description";

    public static final String FORM_DESC_DESCRIPTION_CHILDREN_PREFIX = "children";

    public static final String FORM_DESC_DESCRIPTION_CHILDREN_TEXT_PREFIX = "text";

    public static final String FORM_DESC_DESCRIPTION_CHILDREN_RAW_PREFIX = "data.raw";
}
