package com.vikadata.api.modular.censor.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.vo.censor.ContentCensorResultVo;
import com.vikadata.entity.ContentCensorResultEntity;

/**
 * <p>
 * Content Censor Result Mapper
 * </p>
 */
public interface ContentCensorResultMapper extends BaseMapper<ContentCensorResultEntity> {

    /**
     * Query the report information list
     *
     * @param status    processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     * @param page      page params
     * @return List<ContentCensorResultVo>
     */
    IPage<ContentCensorResultVo> getPageByStatus(@Param("status") Integer status, Page<ContentCensorResultVo> page);


    /**
     * Check whether the node has been reported
     *
     * @param nodeId node id
     * @return ContentCensorResultEntity
     */
    ContentCensorResultEntity getByNodeId(@Param("nodeId") String nodeId);
}
