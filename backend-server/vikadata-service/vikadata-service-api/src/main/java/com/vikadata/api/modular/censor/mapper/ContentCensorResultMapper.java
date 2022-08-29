package com.vikadata.api.modular.censor.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.vikadata.api.model.vo.censor.ContentCensorResultVo;
import com.vikadata.entity.ContentCensorResultEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 内容审核-举报记录表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-05-11
 */
public interface ContentCensorResultMapper extends BaseMapper<ContentCensorResultEntity> {

    /**
     * 根据条件查询举报信息列表
     *
     * @return  List<ContentCensorResultVo> 分页查询结果
     * @param status 审核处理结果
     * @param page 分页参数
     * @author Benson Cheung
     * @date 2020/5/11
     */
    IPage<ContentCensorResultVo> getPageByStatus(@Param("status") Integer status, Page<ContentCensorResultVo> page);


    /**
     * 根据nodeId查询该节点是否已被举报过
     * @param nodeId 节点ID
     * @return  ContentCensorResultEntity 回调结果
     * @author Benson Cheung
     * @date 2020/5/11
     */
    ContentCensorResultEntity getByNodeId(@Param("nodeId") String nodeId);
}
