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

package com.apitable.interfaces.widget.model;

import java.util.Map;

import com.apitable.workspace.dto.DatasheetWidgetDTO;

public class WidgetCopyOption {

    private Long userId;

    private String destSpaceId;

    private Map<String, String> newNodeMap;

    private Map<String, String> newWidgetIdMap;

    private Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap;

    public WidgetCopyOption(Long userId, String destSpaceId, Map<String, String> newNodeMap, Map<String, String> newWidgetIdMap, Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap) {
        this.userId = userId;
        this.destSpaceId = destSpaceId;
        this.newNodeMap = newNodeMap;
        this.newWidgetIdMap = newWidgetIdMap;
        this.newWidgetIdToDstMap = newWidgetIdToDstMap;
    }

    public Long getUserId() {
        return userId;
    }

    public String getDestSpaceId() {
        return destSpaceId;
    }

    public Map<String, String> getNewNodeMap() {
        return newNodeMap;
    }

    public Map<String, String> getNewWidgetIdMap() {
        return newWidgetIdMap;
    }

    public Map<String, DatasheetWidgetDTO> getNewWidgetIdToDstMap() {
        return newWidgetIdToDstMap;
    }
}
