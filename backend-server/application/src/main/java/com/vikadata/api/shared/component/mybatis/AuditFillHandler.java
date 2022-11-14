package com.vikadata.api.shared.component.mybatis;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;

import com.vikadata.api.shared.holder.UserHolder;

import org.springframework.stereotype.Component;

/**
 * <p>
 * Custom fill public fields, that is, fields that are not passed are automatically filled
 * </p>
 *
 * @author Kelly chen
 */
@Slf4j
@Component
class AuditFillHandler implements MetaObjectHandler {

    private static final String CREATED_BY_FIELD = "createdBy";

    private static final String UPDATED_BY_FIELD = "updatedBy";

    @Override
    public void insertFill(MetaObject metaObject) {
        Long userId = UserHolder.get();
        if (userId != null) {
            fillCreateMeta(metaObject, userId);
            fillUpdateMeta(metaObject, userId);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        Long userId = UserHolder.get();
        if (userId != null) {
            fillUpdateMeta(metaObject, userId);
        }
    }

    private void fillCreateMeta(MetaObject metaObject, Long userId) {
        if (metaObject.hasGetter(CREATED_BY_FIELD)) {
            strictFillStrategy(metaObject, CREATED_BY_FIELD, () -> userId);
        }
    }

    private void fillUpdateMeta(MetaObject metaObject, Long userId) {
        if (metaObject.hasGetter(UPDATED_BY_FIELD)) {
            strictFillStrategy(metaObject, UPDATED_BY_FIELD, () -> userId);
        }
    }
}
