package com.vikadata.api.control.infrastructure;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * control id builder
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

    public static ControlId fieldIds(String datasheetId, List<String> fieldIds) {
        List<String> controlIds = fieldIds.stream().map(fieldId -> datasheetId.concat(SYMBOL).concat(fieldId)).collect(Collectors.toList());
        return new FieldControlId(controlIds);
    }

    public static ControlId viewId(String datasheetId, String viewId) {
        return viewIds(datasheetId, Collections.singletonList(viewId));
    }

    public static ControlId viewIds(String datasheetId, List<String> viewIds) {
        List<String> controlIds = viewIds.stream().map(viewId -> datasheetId.concat(SYMBOL).concat(viewId)).collect(Collectors.toList());
        return new ViewControlId(controlIds);
    }

    public interface ControlId {

        List<String> getControlIds();

        ControlType getControlType();

        List<String> toRealIdList();
    }

    private static abstract class AbstractControlId implements ControlId {

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
            return getControlIds().stream().map(controlId -> controlId.substring(controlId.indexOf(ControlIdBuilder.SYMBOL) + 1)).collect(Collectors.toList());
        }

        @Override
        public String toString() {
            if (controlIds != null) {
                if (controlIds.size() == 1) {
                    return controlIds.get(0);
                }
                return controlIds.stream().map(String::toString).reduce("", (s, s2) -> s.concat(",").concat(s2));
            }
            return "";
        }
    }

    public static class NodeControlId extends AbstractControlId {

        public NodeControlId(List<String> controlIds) {
            super(controlIds);
        }

        @Override
        public ControlType getControlType() {
            return ControlType.NODE;
        }
    }

    public static class FieldControlId extends AbstractControlId {

        public FieldControlId(List<String> controlIds) {
            super(controlIds);
        }

        @Override
        public ControlType getControlType() {
            return ControlType.DATASHEET_FIELD;
        }
    }

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
