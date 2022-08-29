package com.vikadata.api.modular.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.mapper.ExpandBaseMapper;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.transaction.annotation.Transactional;

/**
 * <p> 
 * IService 实现类（ 泛型：M 是 mapper 对象，T 是实体 ）
 * </p> 
 * @author zoe zheng 
 * @date 2021/11/10 11:31
 */
public class ExpandServiceImpl<M extends ExpandBaseMapper<T>, T> extends ServiceImpl<M, T> {

    /**
     * 批量插入
     *
     * @param entityList ignore
     * @param batchSize  ignore
     * @return ignore
     */
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
