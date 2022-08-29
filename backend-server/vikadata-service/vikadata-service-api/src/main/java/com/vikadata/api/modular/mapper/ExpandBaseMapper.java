package com.vikadata.api.modular.mapper;

import java.util.Collection;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 真正实现批量插入的拓展接口
 *
 * @author Zoe Zheng
 * @date 2021-11-08 20:00:13
 */
public interface ExpandBaseMapper<T> extends BaseMapper<T> {
    /**
     * 批量插入 仅适用于mysql
     *
     * @param entityList 实体列表
     * @return 影响行数
     */
    int insertBatchSomeColumn(Collection<T> entityList);
}
