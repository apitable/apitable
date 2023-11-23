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

package com.apitable.control.infrastructure;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * control id builder.
 *
 * @author Shawn Deng
 */
public class ControlIdBuilder {

    public static final String SYMBOL = "-";

    public static ControlId nodeId(String nodeId) {
        return nodeIds(Collections.singletonList(nodeId));
    }

    public static ControlId nodeIds(List<String> nodeIds) {
        return new NodeControlId(nodeIds);
    }

    public static ControlId fieldId(String datasheetId, String fieldId) {
        return fieldIds(datasheetId, Collections.singletonList(fieldId));
    }

    /**
     * build with filed id.
     *
     * @param datasheetId datasheet id
     * @param fieldIds    field id list
     * @return control id
     */
    public static ControlId fieldIds(String datasheetId, List<String> fieldIds) {
        List<String> controlIds =
            fieldIds.stream().map(fieldId -> datasheetId.concat(SYMBOL).concat(fieldId))
                .collect(Collectors.toList());
        return new FieldControlId(controlIds);
    }

    public static ControlId viewId(String datasheetId, String viewId) {
        return viewIds(datasheetId, Collections.singletonList(viewId));
    }

    /**
     * build with view id.
     *
     * @param datasheetId datasheet id
     * @param viewIds     view id list
     * @return control id
     */
    public static ControlId viewIds(String datasheetId, List<String> viewIds) {
        List<String> controlIds =
            viewIds.stream().map(viewId -> datasheetId.concat(SYMBOL).concat(viewId))
                .collect(Collectors.toList());
        return new ViewControlId(controlIds);
    }

    /**
     * control id.
     */
    public interface ControlId {

        List<String> getControlIds();

        ControlType getControlType();

        List<String> toRealIdList();
    }

    /**
     * control id abstract class.
     */
    private abstract static class AbstractControlId implements ControlId {

        private final List<String> controlIds;

        public AbstractControlId(List<String> controlIds) {
            this.controlIds = controlIds;
        }

        @Override
        public List<String> getControlIds() {
            return this.controlIds;
        }

        @Override
        public List<String> toRealIdList() {
            if (getControlType() == ControlType.NODE) {
                return getControlIds();
            }
            return getControlIds().stream().map(
                    controlId -> controlId.substring(controlId.indexOf(ControlIdBuilder.SYMBOL) + 1))
                .collect(Collectors.toList());
        }

        @Override
        public String toString() {
            if (controlIds != null) {
                if (controlIds.size() == 1) {
                    return controlIds.get(0);
                }
                return controlIds.stream().map(String::toString)
                    .reduce("", (s, s2) -> s.concat(",").concat(s2));
            }
            return "";
        }
    }

    /**
     * node control id.
     */
    public static class NodeControlId extends AbstractControlId {

        public NodeControlId(List<String> controlIds) {
            super(controlIds);
        }

        @Override
        public ControlType getControlType() {
            return ControlType.NODE;
        }
    }

    /**
     * field control id.
     */
    public static class FieldControlId extends AbstractControlId {

        public FieldControlId(List<String> controlIds) {
            super(controlIds);
        }

        @Override
        public ControlType getControlType() {
            return ControlType.DATASHEET_FIELD;
        }
    }

    /**
     * view control id.
     */
    public static class ViewControlId extends AbstractControlId {

        public ViewControlId(List<String> controlIds) {
            super(controlIds);
        }

        @Override
        public ControlType getControlType() {
            return ControlType.DATASHEET_VIEW;
        }
    }
}
