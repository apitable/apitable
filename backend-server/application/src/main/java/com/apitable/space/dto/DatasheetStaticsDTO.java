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

package com.apitable.space.dto;

import com.apitable.workspace.enums.ViewType;
import java.util.HashMap;
import java.util.Map;
import lombok.Data;

/**
 * Datasheet Statistics Vo.
 */
@Data
public class DatasheetStaticsDTO {

    private long kanbanViews;

    private long calendarViews;

    private long galleryViews;

    private long ganttViews;

    /**
     * cache map.
     *
     * @return map
     */
    public Map<Integer, Long> toMap() {
        Map<Integer, Long> map = new HashMap<>();
        map.put(ViewType.KANBAN.getType(), kanbanViews);
        map.put(ViewType.CALENDAR.getType(), calendarViews);
        map.put(ViewType.GALLERY.getType(), galleryViews);
        map.put(ViewType.GANTT.getType(), ganttViews);
        return map;
    }

    /**
     * get bean from cached map.
     *
     * @param entries map
     * @return DatasheetStaticsDTO
     */
    public static DatasheetStaticsDTO mapToBean(Map<Object, Object> entries) {
        DatasheetStaticsDTO viewVO = new DatasheetStaticsDTO();
        for (Map.Entry<Object, Object> entry : entries.entrySet()) {
            ViewType viewType = ViewType.of(Integer.parseInt(entry.getKey().toString()));
            if (null == viewType) {
                continue;
            }
            switch (viewType) {
                case KANBAN:
                    viewVO.setKanbanViews(Long.parseLong(entry.getValue().toString()));
                    break;
                case GALLERY:
                    viewVO.setGalleryViews(Long.parseLong(entry.getValue().toString()));
                    break;
                case CALENDAR:
                    viewVO.setCalendarViews(Long.parseLong(entry.getValue().toString()));
                    break;
                case GANTT:
                    viewVO.setGanttViews(Long.parseLong(entry.getValue().toString()));
                    break;
                default:
                    break;
            }
        }
        return viewVO;
    }
}
