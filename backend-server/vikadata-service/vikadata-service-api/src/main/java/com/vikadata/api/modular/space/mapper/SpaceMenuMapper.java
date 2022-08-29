package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SpaceMenuEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作空间-菜单表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface SpaceMenuMapper extends BaseMapper<SpaceMenuEntity> {

	/**
	 * 根据菜单编码集合查询
	 *
	 * @param menuCodes 菜单编码集合
	 * @return 结果集合
	 * @author Shawn Deng
	 * @date 2020/2/14 17:15
	 */
	List<SpaceMenuEntity> selectByMenuCodes(@Param("menuCodes") List<String> menuCodes);
}
