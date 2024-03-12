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

package com.apitable.shared.util.ibatis;

import cn.hutool.core.collection.CollUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * IService Expand Class.
 * </p>
 *
 * @author zoe zheng
 */
public class ExpandServiceImpl<M extends ExpandBaseMapper<T>, T> extends ServiceImpl<M, T> {

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean saveBatch(Collection<T> entityList, int batchSize) {
        List<List<T>> splitList = CollUtil.splitList(new ArrayList<>(entityList), batchSize);
        for (List<T> entities : splitList) {
            boolean addEntities = SqlHelper.retBool(baseMapper.insertBatchSomeColumn(entities));
            ExceptionUtil.isTrue(addEntities, DatabaseException.INSERT_ERROR);
        }
        return true;
    }
}
