package com.vikadata.api.space.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.shared.cache.bean.SpaceResourceDto;
import com.vikadata.api.space.dto.SpaceGroupResourceDto;
import com.vikadata.api.space.dto.SpaceMemberResourceDto;
import com.vikadata.api.space.dto.SpaceMenuResourceDto;
import com.vikadata.entity.SpaceResourceEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SpaceResourceMapper extends BaseMapper<SpaceResourceEntity> {

	/**
	 * @return all space resources
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceResourceDto> selectAllResource();

	/**
	 * @param memberId member id
	 * @return space resources
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceResourceDto> selectResourceByMemberId(@Param("memberId") Long memberId);

	/**
	 * Query the resource code amount that can be assigned
	 *
	 * @param resourceCodes resource codes
	 * @return amount resource code
	 */
	Integer selectAssignableCountInResourceCode(@Param("resourceCodes") List<String> resourceCodes);

	/**
	 * Query all resource groups that can be allocated
	 *
	 * @return resource groups
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceGroupResourceDto> selectGroupResource();

	/**
	 * query all menu resources
	 *
	 * @return space menu resources
	 */
    @InterceptorIgnore(illegalSql = "true")
	List<SpaceMenuResourceDto> selectMenuResource();

	/**
	 * @param groupCodes group codes
	 * @return resource codes
	 */
	List<String> selectResourceCodesByGroupCode(@Param("groupCodes") List<String> groupCodes);

	/**
	 * Query the resource code set corresponding to the role of a member
	 *
	 * @param memberId member ids
	 * @return resource codes
	 */
	List<String> selectResourceCodesByMemberId(@Param("memberId") Long memberId);

    /**
     * Gets a collection of resource codes corresponding to a member and its role
     *
     * @param memberIds member ids
     * @return space member resources
     */
    List<SpaceMemberResourceDto> selectMemberResource(@Param("list") List<Long> memberIds);
}
