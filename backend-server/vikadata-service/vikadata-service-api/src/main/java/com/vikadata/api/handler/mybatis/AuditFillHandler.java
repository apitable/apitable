package com.vikadata.api.handler.mybatis;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;

import com.vikadata.api.holder.UserHolder;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 自定义填充公共字段, 即没有传的字段自动填充
 * </p>
 *
 * @author Kelly chen
 * @date 2020/4/7 14:43
 */
@Slf4j
@Component
class AuditFillHandler implements MetaObjectHandler {

    private static final String CREATED_BY_FIELD = "createdBy";

    private static final String UPDATED_BY_FIELD = "updatedBy";

    @Override
    public void insertFill(MetaObject metaObject) {
        //获取当前登录用户
        Long userId = UserHolder.get();
        if (userId != null) {
            fillCreateMeta(metaObject, userId);
            fillUpdateMeta(metaObject, userId);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        //获取当前登录用户
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
