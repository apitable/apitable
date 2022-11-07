package com.vikadata.api.component;

import java.util.List;

import com.vikadata.api.control.ControlIdBuilder;
import com.vikadata.api.event.FieldPermissionEvent;
import com.vikadata.api.event.FieldPermissionEvent.Arg;
import com.vikadata.core.util.SpringContextHolder;

import org.springframework.stereotype.Component;

import static com.vikadata.api.enums.datasheet.FieldPermissionChangeEvent.FIELD_PERMISSION_DISABLE;

/**
 * <p> 
 * Permission broadcast factory
 * </p> 
 *
 * @author Chambers
 */
@Component
public class SocketBroadcastFactory {

    public static SocketBroadcastFactory me() {
        return SpringContextHolder.getBean(SocketBroadcastFactory.class);
    }

    public void fieldBroadcast(String memberName, List<String> controlIds) {
        controlIds.forEach(controlId -> {
            int index = controlId.indexOf(ControlIdBuilder.SYMBOL);
            Arg arg = Arg.builder().event(FIELD_PERMISSION_DISABLE)
                    .datasheetId(controlId.substring(0, index))
                    .fieldId(controlId.substring(index + 1))
                    .operator(memberName).build();
            SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        });
    }
}
