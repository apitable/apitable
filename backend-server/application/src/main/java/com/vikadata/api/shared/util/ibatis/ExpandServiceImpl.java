package com.vikadata.api.shared.util.ibatis;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.transaction.annotation.Transactional;

/**
 * <p> 
 * IService Expand Class
 * </p> 
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
