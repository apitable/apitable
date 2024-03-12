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

package com.apitable.shared.component.mybatis;

import com.apitable.shared.holder.UserHolder;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Custom fill public fields, that is, fields that are not passed are automatically filled.
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
