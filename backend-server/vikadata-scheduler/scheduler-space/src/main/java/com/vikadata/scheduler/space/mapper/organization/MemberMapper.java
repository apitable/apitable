package com.vikadata.scheduler.space.mapper.organization;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.scheduler.space.model.UserSpaceRelDto;

/**
 * <p>
 * 成员表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2019/12/16
 */
public interface MemberMapper {

    /**
     * 获取空间内处于活跃空间状态的用户ID列表
     *
     * @param spaceIds 空间ID列表
     * @return 用户ID列表
     * @author Chambers
     * @date 2020/1/14
     */
    List<Long> selectUserIdBySpaceIds(@Param("list") List<String> spaceIds);

    /**
     * 逻辑删除成员
     *
     * @param spaceIds 空间ID列表
     * @return 修改数
     * @author Chambers
     * @date 2019/11/18
     */
    int updateIsDeletedBySpaceIds(@Param("list") List<String> spaceIds);

    /**
     * 获取空间内所有的用户ID和空间ID列表
     *
     * @param spaceIds 空间ID列表
     * @return 用户ID和空间ID列表
     * @author Chambers
     * @date 2019/11/18
     */
    List<UserSpaceRelDto> getDtoBySpaceIds(@Param("list") List<String> spaceIds);

    /**
     * 查询成员名称与用户昵称不一致的成员ID
     *
     * @return MemberIds
     * @author Chambers
     * @date 2020/10/13
     */
    List<Long> selectMemberIds();

    /**
     * 修改 name_modified
     *
     * @param memberIds 成员ID列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/10/13
     */
    int updateNameModifiedByIds(@Param("list") List<Long> memberIds);

    /**
     * 查询成员的用户ID
     *
     * @param memberId 成员ID
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/10/16 16:06
     */
    Long selectUserIdByMemberId(@Param("memberId") Long memberId);
}
