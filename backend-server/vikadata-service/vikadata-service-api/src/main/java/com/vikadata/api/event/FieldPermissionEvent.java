package com.vikadata.api.event;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.vikadata.api.enums.datasheet.FieldPermissionChangeEvent;
import com.vikadata.api.modular.control.model.FieldControlProp;

import org.springframework.context.ApplicationEvent;

/**
 * <p>
 * 字段权限事件
 * </p>
 *
 * @author Chambers
 * @date 2021/4/1
 */
public class FieldPermissionEvent extends ApplicationEvent {

    private static final long serialVersionUID = 4958921396891987695L;

    private final Arg arg;

    public FieldPermissionEvent(Object source, Arg arg) {
        super(source);
        this.arg = arg;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class Arg {

        private FieldPermissionChangeEvent event;

        private String datasheetId;

        private String fieldId;

        private String uuid;

        private String operator;

        private Integer changeTime;

        private String role;

        private List<Long> changedUnitIds;

        private List<Long> delUnitIds;

        private FieldControlProp setting;

        private Boolean includeExtend;
    }

    public Arg getArg() {
        return arg;
    }
}
