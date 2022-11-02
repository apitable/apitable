package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SpaceMenuEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SpaceMenuMapper extends BaseMapper<SpaceMenuEntity> {

	/**
	 * @param menuCodes menu codes
	 * @return space menus
	 */
	List<SpaceMenuEntity> selectByMenuCodes(@Param("menuCodes") List<String> menuCodes);
}
