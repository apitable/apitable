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

package com.apitable.shared.component.adapter;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

import com.apitable.workspace.enums.NodeType;

import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MultiDatasourceAdapterTemplate {

    public List<String> getRecentlyVisitNodeIds(Long memberId, NodeType nodeType) {
        DatasourceAdapter adapter = this.getDatasourceAdapter();
        return adapter.getRecentlyVisitNodeIds(memberId, nodeType);
    }

    public void saveOrUpdateNodeVisitRecord(String spaceId, Long memberId, String nodeId, NodeType nodeType) {
        DatasourceAdapter adapter = this.getDatasourceAdapter();
        adapter.saveOrUpdateNodeVisitRecord(spaceId, memberId, nodeId, nodeType);
    }

    private DatasourceAdapter getDatasourceAdapter() {
        return new MysqlAdapter();
    }

}
