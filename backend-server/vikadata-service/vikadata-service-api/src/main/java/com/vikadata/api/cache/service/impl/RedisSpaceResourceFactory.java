package com.vikadata.api.cache.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.vikadata.api.cache.bean.SpaceMenuResourceGroupDto;
import com.vikadata.api.cache.bean.SpaceResourceGroupDto;
import com.vikadata.api.cache.service.SpaceResourceFactory;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.SpaceMenuEntity;
import com.vikadata.api.modular.space.mapper.SpaceMenuMapper;
import com.vikadata.api.modular.space.mapper.SpaceResourceMapper;
import com.vikadata.api.modular.space.model.SpaceGroupResourceDto;
import com.vikadata.api.modular.space.model.SpaceMenuResourceDto;
import com.vikadata.api.modular.space.service.ISpaceMenuService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 空间资源存储工厂
 * 基于Redis缓存
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/15 19:37
 */
@Service
@Slf4j
public class RedisSpaceResourceFactory implements SpaceResourceFactory {

	/**
	 * 存储时间，单位：小时
	 */
	private static final int TIMEOUT = 2;

	@Resource
	private SpaceMenuMapper spaceMenuMapper;

	@Resource
	private SpaceResourceMapper spaceResourceMapper;

	@Resource
	private ISpaceMenuService iSpaceMenuService;

	@Resource
	private RedisTemplate<String, List<SpaceMenuResourceGroupDto>> redisTemplate;

	@Override
	public List<SpaceMenuResourceGroupDto> getMenuResourceGroup() {
		BoundValueOperations<String, List<SpaceMenuResourceGroupDto>> opts = redisTemplate.boundValueOps(RedisConstants.SPACE_MENU_RESOURCE_GROUP_KEY);
		List<SpaceMenuResourceGroupDto> menuResourceGroupMap = opts.get();
		if (CollUtil.isEmpty(menuResourceGroupMap)) {
			List<SpaceMenuResourceDto> menuResources = spaceResourceMapper.selectMenuResource();
			List<SpaceGroupResourceDto> groupResources = spaceResourceMapper.selectGroupResource();

			Map<String, List<String>> menuMap = CollUtil.newHashMap();

			List<SpaceMenuEntity> allMenus = spaceMenuMapper.selectList(null);

			for (SpaceMenuResourceDto menuResource : menuResources) {
				//查找父节点
				SpaceMenuEntity topParent = this.findTopParent(menuResource.getMenuCode(), allMenus);
				//归类
				List<String> resourceCodes = menuMap.get(topParent.getMenuCode());
				if (CollUtil.isEmpty(resourceCodes)) {
					resourceCodes = new ArrayList<>();
				}
				resourceCodes.addAll(menuResource.getResources());
				menuMap.put(topParent.getMenuCode(), resourceCodes);
			}

			menuResourceGroupMap = new ArrayList<>();

			for (Map.Entry<String, List<String>> entry : menuMap.entrySet()) {
				SpaceMenuEntity menu = iSpaceMenuService.findByMenuCode(entry.getKey());
				SpaceMenuResourceGroupDto dto = new SpaceMenuResourceGroupDto();
				dto.setMenuCode(menu.getMenuCode());
				dto.setMenuName(menu.getMenuName());

				List<SpaceGroupResourceDto> filterList = CollUtil.filterNew(groupResources, groupResource -> CollUtil.containsAny(entry.getValue(), groupResource.getResources()));

				Set<SpaceResourceGroupDto> resourceGroupDtoSet = new HashSet<>();
				for (SpaceGroupResourceDto groupResource : filterList) {
					SpaceResourceGroupDto groupDto = new SpaceResourceGroupDto();
					groupDto.setGroupCode(groupResource.getGroupCode());
					groupDto.setGroupName(groupResource.getGroupName());
					groupDto.setGroupDesc(groupResource.getGroupDesc());
					groupDto.setResourceCodes(CollUtil.newHashSet(groupResource.getResources()));
					resourceGroupDtoSet.add(groupDto);
				}
				dto.setGroupResources(resourceGroupDtoSet);

				menuResourceGroupMap.add(dto);
			}

			opts.set(menuResourceGroupMap, TIMEOUT, TimeUnit.HOURS);

		}
		return menuResourceGroupMap;
	}

	/**
	 * 查询指定菜单的一级菜单
	 *
	 * @param menuCode 菜单编码
	 * @return 一级菜单对象
	 * @author Shawn Deng
	 * @date 2020/2/16 16:38
	 */
	private SpaceMenuEntity findTopParent(String menuCode,List<SpaceMenuEntity> allSpaceMenuList) {
		log.info("查找菜单的一级");
		SpaceMenuEntity topParent = null;
		for (SpaceMenuEntity menuEntity : allSpaceMenuList) {
			if (menuEntity.getMenuCode().equals(menuCode)) {
				if (menuEntity.getParentCode() != null) {
					topParent = inverseRecursion(allSpaceMenuList, menuEntity);
				} else {
					topParent = menuEntity;
				}
				break;
			}
		}
		return topParent;
	}

	/**
	 * 反递归查询根节点
	 *
	 * @param allSpaceMenuList 所有菜单列表
	 * @param menu             递归节点
	 * @return 一级节点
	 */
	private SpaceMenuEntity inverseRecursion(List<SpaceMenuEntity> allSpaceMenuList, SpaceMenuEntity menu) {
		if (menu.getParentCode() != null) {
			SpaceMenuEntity topParent = null;
			for (SpaceMenuEntity menuEntity : allSpaceMenuList) {
				if (menuEntity.getMenuCode().equals(menu.getParentCode())) {
					topParent = inverseRecursion(allSpaceMenuList, menuEntity);
					break;
				}
			}
			return topParent;
		}
		return menu;
	}
}
