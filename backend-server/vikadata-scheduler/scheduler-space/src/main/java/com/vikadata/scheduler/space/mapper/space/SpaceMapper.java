package com.vikadata.scheduler.space.mapper.space;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 空间表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2019/11/21
 */
public interface SpaceMapper {

    /**
     * 获取需要删除的空间ID列表
     *
     * @param date 删除截止时间
     * @return 空间ID列表
     * @author Chambers
     * @date 2019/11/21
     */
    List<String> findDelSpaceIds(String date);

    /**
     * 逻辑删除空间
     *
     * @param spaceIds 空间ID列表
     * @return 修改数
     * @author Chambers
     * @date 2019/11/21
     */
    int updateIsDeletedBySpaceIdIn(@Param("list") List<String> spaceIds);

    /**
     * 获取数量判断空间是否存在
     *
     * @param spaceId  空间ID
     * @param isPreDel 是否处于预删除状态（非必须）
     * @return 数量
     * @author Chambers
     * @date 2020/4/1
     */
    Integer countBySpaceId(@Param("spaceId") String spaceId, @Param("isPreDel") Boolean isPreDel);

    /**
     * 查询空间的主管理员ID
     *
     * @param spaceId 空间ID
     * @return 成员ID
     * @author Shawn Deng
     * @date 2020/2/13 22:17
     */
    Long selectSpaceMainAdmin(@Param("spaceId") String spaceId);
}
