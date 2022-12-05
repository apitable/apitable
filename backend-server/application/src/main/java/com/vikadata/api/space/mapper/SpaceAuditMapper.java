package com.vikadata.api.space.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.space.dto.SpaceAuditPageParamDTO;
import com.vikadata.entity.SpaceAuditEntity;

public interface SpaceAuditMapper {

    IPage<SpaceAuditEntity> selectSpaceAuditPage(Page<SpaceAuditEntity> page, @Param("spaceId") String spaceId, @Param("param") SpaceAuditPageParamDTO param);

    int insert(@Param("entity") SpaceAuditEntity entity);
}
