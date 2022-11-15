package com.vikadata.api.space.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.space.model.SpaceAuditPageParam;
import com.vikadata.entity.SpaceAuditEntity;

public interface SpaceAuditMapper {

    IPage<SpaceAuditEntity> selectSpaceAuditPage(Page<SpaceAuditEntity> page, @Param("spaceId") String spaceId, @Param("param") SpaceAuditPageParam param);

    int insert(@Param("entity") SpaceAuditEntity entity);
}
