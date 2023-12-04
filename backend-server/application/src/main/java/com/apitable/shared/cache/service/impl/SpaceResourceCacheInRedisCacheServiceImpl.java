/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.cache.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.apitable.core.constants.RedisConstants;
import com.apitable.shared.cache.bean.SpaceMenuResourceGroupDto;
import com.apitable.shared.cache.bean.SpaceResourceGroupDto;
import com.apitable.shared.cache.service.SpaceResourceCacheService;
import com.apitable.space.dto.SpaceGroupResourceDto;
import com.apitable.space.dto.SpaceMenuResourceDto;
import com.apitable.space.entity.SpaceMenuEntity;
import com.apitable.space.mapper.SpaceMenuMapper;
import com.apitable.space.mapper.SpaceResourceMapper;
import com.apitable.space.service.ISpaceMenuService;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * space resource cache service impl.
 */
@Service
@Slf4j
public class SpaceResourceCacheInRedisCacheServiceImpl implements SpaceResourceCacheService {

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
        BoundValueOperations<String, List<SpaceMenuResourceGroupDto>> opts =
            redisTemplate.boundValueOps(RedisConstants.SPACE_MENU_RESOURCE_GROUP_KEY);
        List<SpaceMenuResourceGroupDto> menuResourceGroupMap = opts.get();
        if (CollUtil.isEmpty(menuResourceGroupMap)) {
            List<SpaceMenuResourceDto> menuResources = spaceResourceMapper.selectMenuResource();
            List<SpaceGroupResourceDto> groupResources = spaceResourceMapper.selectGroupResource();

            Map<String, List<String>> menuMap = new HashMap<>();

            List<SpaceMenuEntity> allMenus = spaceMenuMapper.selectList(null);

            for (SpaceMenuResourceDto menuResource : menuResources) {
                SpaceMenuEntity topParent =
                    this.findTopParent(menuResource.getMenuCode(), allMenus);
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

                Collection<SpaceGroupResourceDto> filterList = CollUtil.filterNew(groupResources,
                    groupResource -> CollUtil.containsAny(entry.getValue(),
                        groupResource.getResources()));

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
     * find top menu.
     *
     * @param menuCode menu code
     * @return space menu
     */
    private SpaceMenuEntity findTopParent(String menuCode, List<SpaceMenuEntity> allSpaceMenuList) {
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
     * inverse search menu.
     *
     * @param allSpaceMenuList all menu list in space
     * @param menu             menu searched
     * @return root menu
     */
    private SpaceMenuEntity inverseRecursion(List<SpaceMenuEntity> allSpaceMenuList,
                                             SpaceMenuEntity menu) {
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
