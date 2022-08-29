package com.vikadata.scheduler.space.mapper.space;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SpaceAssetEntity;
import com.vikadata.scheduler.space.model.SpaceAssetBaseDto;
import com.vikadata.scheduler.space.model.SpaceAssetDto;

/**
 * <p>
 * 空间-附件表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/4/23
 */
public interface SpaceAssetMapper {

    /**
     * 获取空间附件资源信息
     *
     * @param nodeIds 节点ID列表
     * @return dto
     * @author Chambers
     * @date 2020/4/23
     */
    List<SpaceAssetDto> selectDtoByNodeIds(@Param("list") Collection<String> nodeIds);

    /**
     * 更改引用次数
     *
     * @param ids  ID列表
     * @param cite 引用次数
     * @author Chambers
     * @date 2020/4/23
     */
    void updateCiteByIds(@Param("list") List<Long> ids, @Param("cite") Integer cite);

    /**
     * 批量新增
     *
     * @param list 实体列表
     * @return 新增数量
     * @author Chambers
     * @date 2020/4/27
     */
    int insertList(@Param("list") List<SpaceAssetEntity> list);

    /**
     * 逻辑删除
     *
     * @param nodeIds 节点ID列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/9/21
     */
    int removeByNodeIds(@Param("list") List<String> nodeIds);

    /**
     * 获取空间附件资源信息
     *
     * @param type 资源类型
     * @param spaceId 空间ID
     * @param startAt 开始时间
     * @param endAt 结束时间
     * @return dto
     */
    List<SpaceAssetBaseDto> selectZeroCiteDtoBySpaceIdAndCreatedAt(@Param("spaceId") String spaceId, @Param("type") int type, @Param("startAt") LocalDateTime startAt, @Param("endAt") LocalDateTime endAt);

    /**
     * 逻辑删除
     *
     * @param ids 主键IDs
     * @return 执行结果数
     */
    int updateIsDeletedByIds(@Param("ids") Set<Long> ids);
}
