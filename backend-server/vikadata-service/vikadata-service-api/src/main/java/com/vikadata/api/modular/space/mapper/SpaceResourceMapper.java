package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.cache.bean.SpaceResourceDto;
import com.vikadata.api.modular.space.model.SpaceGroupResourceDto;
import com.vikadata.api.modular.space.model.SpaceMemberResourceDto;
import com.vikadata.api.modular.space.model.SpaceMenuResourceDto;
import com.vikadata.entity.SpaceResourceEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作空间-权限资源表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface SpaceResourceMapper extends BaseMapper<SpaceResourceEntity> {

	/**
	 * 查询所有权限资源
	 * 主管理员
	 *
	 * @return 结果集视图
	 * @author Shawn Deng
	 * @date 2020/2/14 02:44
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceResourceDto> selectAllResource();

	/**
	 * 查询指定成员的权限资源
	 *
	 * @param memberId 成员ID
	 * @return 结果集视图
	 * @author Shawn Deng
	 * @date 2020/2/14 02:44
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceResourceDto> selectResourceByMemberId(@Param("memberId") Long memberId);

	/**
	 * 查询可分配的资源编码
	 *
	 * @param resourceCodes 资源编码
	 * @return 总数
	 * @author Shawn Deng
	 * @date 2020/2/13 23:01
	 */
	Integer selectAssignableCountInResourceCode(@Param("resourceCodes") List<String> resourceCodes);

	/**
	 * 查询所有可分配的资源分组视图
	 *
	 * @return 结果集视图
	 * @author Shawn Deng
	 * @date 2020/2/15 00:16
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceGroupResourceDto> selectGroupResource();

	/**
	 * 查询所有菜单资源视图
	 *
	 * @return 结果集视图
	 * @author Shawn Deng
	 * @date 2020/2/15 13:22
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceMenuResourceDto> selectMenuResource();

	/**
	 * 根据分组编码查询资源编码集合
	 *
	 * @param groupCodes 分组编码
	 * @return 资源编码集合
	 * @author Shawn Deng
	 * @date 2020/2/15 22:15
	 */
	List<String> selectResourceCodesByGroupCode(@Param("groupCodes") List<String> groupCodes);

	/**
	 * 查询成员的角色对应资源编码集合
	 *
	 * @param memberId 成员ID
	 * @return 资源编码列表
	 * @author Shawn Deng
	 * @date 2020/2/16 14:31
	 */
	List<String> selectResourceCodesByMemberId(@Param("memberId") Long memberId);

    /**
     * 获取成员和其角色对应资源编码集合
     *
     * @param memberIds 成员ID列表
     * @return dto列表
     * @author Chambers
     * @date 2020/3/25
     */
    List<SpaceMemberResourceDto> selectMemberResource(@Param("list") List<Long> memberIds);
}
