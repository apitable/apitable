package com.vikadata.scheduler.bill.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SpaceEntity;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/22 12:03
 */
@Mapper
public interface SpaceMapper extends BaseMapper<SpaceEntity> {

    /**
     * 查询短缺审计字段的空间列表
     *
     * @return 空间列表
     * @author Shawn Deng
     * @date 2020/8/25 19:02
     */
    List<SpaceEntity> selectNullAuditList();

    /**
     * 更改空间的创建者
     *
     * @param spaceId   空间ID
     * @param createdBy 创建者
     * @return 是否成功
     * @author Shawn Deng
     * @date 2020/8/25 19:01
     */
    int updateCreatedBy(@Param("spaceId") String spaceId, @Param("createdBy") Long createdBy);

    /**
     * 更改空间的最后一次更改者
     *
     * @param spaceId   空间ID
     * @param updatedBy 最后一次更改者
     * @return 是否成功
     * @author Shawn Deng
     * @date 2020/8/25 19:02
     */
    int updateUpdatedBy(@Param("spaceId") String spaceId, @Param("updatedBy") Long updatedBy);
}
