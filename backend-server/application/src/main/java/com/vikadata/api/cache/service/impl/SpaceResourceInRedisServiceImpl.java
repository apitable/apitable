package com.vikadata.api.cache.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.SpaceMenuResourceGroupDto;
import com.vikadata.api.cache.bean.SpaceResourceGroupDto;
import com.vikadata.api.cache.service.SpaceResourceService;
import com.vikadata.api.modular.space.mapper.SpaceMenuMapper;
import com.vikadata.api.modular.space.mapper.SpaceResourceMapper;
import com.vikadata.api.modular.space.model.SpaceGroupResourceDto;
import com.vikadata.api.modular.space.model.SpaceMenuResourceDto;
import com.vikadata.api.modular.space.service.ISpaceMenuService;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.entity.SpaceMenuEntity;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SpaceResourceInRedisServiceImpl implements SpaceResourceService {

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
				SpaceMenuEntity topParent = this.findTopParent(menuResource.getMenuCode(), allMenus);
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
	 * find top menu
	 *
	 * @param menuCode menu code
	 * @return space menu
	 */
	private SpaceMenuEntity findTopParent(String menuCode,List<SpaceMenuEntity> allSpaceMenuList) {
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
	 * inverse search menu
	 *
	 * @param allSpaceMenuList all menu list in space
	 * @param menu menu searched
	 * @return root menu
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
