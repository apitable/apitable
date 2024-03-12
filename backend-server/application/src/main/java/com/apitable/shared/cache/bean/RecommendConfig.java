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

package com.apitable.shared.cache.bean;

import cn.hutool.core.collection.CollUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Template Center - Recommend Config.
 * </p>
 *
 * @author Chambers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendConfig {

    /**
     * top banner.
     */
    List<Banner> top;

    /**
     * custom category dto.
     * delete after using new recommend config(include all poc)
     */
    List<CategoryDto> categories;

    /**
     * custom album group config.
     */
    private List<AlbumGroup> albumGroups;

    /**
     * custom template group config.
     */
    private List<TemplateGroup> templateGroups;

    public RecommendConfig(List<Banner> top, List<CategoryDto> categories) {
        this.top = top;
        this.categories = categories;
    }

    /**
     * get album group config.
     *
     * @return album group config
     */
    public List<TemplateGroup> getTemplateGroups() {
        if (CollUtil.isNotEmpty(templateGroups)) {
            return templateGroups;
        }
        // compatible old version config
        if (CollUtil.isNotEmpty(categories)) {
            return categories.stream()
                .map(item -> new TemplateGroup(item.getCategoryName(), item.getTemplateIds()))
                .collect(Collectors.toList());
        }
        return templateGroups;
    }

    //TODO compatible code (delete after 0.13.9)
    /**
     * set album group.
     */
    public void setTemplateGroups(List<TemplateGroup> templateGroups) {
        this.templateGroups = templateGroups;
        this.categories = templateGroups.stream()
            .map(item -> new CategoryDto(item.getName(), item.getTemplateIds()))
            .collect(Collectors.toList());
    }

    /**
     * album group.
     */
    public static class AlbumGroup {
        private String name;

        private List<String> albumIds;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<String> getAlbumIds() {
            return albumIds;
        }

        public void setAlbumIds(List<String> albumIds) {
            this.albumIds = albumIds;
        }
    }

    /**
     * template group.
     */
    public static class TemplateGroup {
        private String name;

        private List<String> templateIds;

        public TemplateGroup() {
        }

        public TemplateGroup(String name, List<String> templateIds) {
            this.name = name;
            this.templateIds = templateIds;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<String> getTemplateIds() {
            return templateIds;
        }

        public void setTemplateIds(List<String> templateIds) {
            this.templateIds = templateIds;
        }
    }

}
