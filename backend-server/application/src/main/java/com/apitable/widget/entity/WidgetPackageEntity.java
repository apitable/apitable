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

package com.apitable.widget.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * Workbench - Widget Package Table.
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName(keepGlobalPrefix = true, value = "widget_package")
public class WidgetPackageEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key.
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * Widget ID.
     */
    private String packageId;

    /**
     * Internationalized widget name.
     */
    private String i18nName;

    /**
     * Internationalization Widget Description.
     */
    private String i18nDescription;

    /**
     * Icon.
     */
    private String icon;

    /**
     * Cover draw TOKEN.
     */
    private String cover;

    /**
     * Status (0: under development, 1: banned, 2: to be published, 3: published, 4: off the shelf - global temporarily closed) 3, 4.
     */
    private Integer status;

    /**
     * Number of installations.
     */
    private Integer installedNum;

    /**
     * Name - 【Discard Delete】.
     */
    private String name;

    /**
     * English name - 【Discard Delete】.
     */
    private String nameEn;

    /**
     * Version - 【Discard Delete】.
     */
    private String version;

    /**
     * Description - 【Discard Delete】.
     */
    private String description;

    /**
     * Author Name.
     */
    private String authorName;

    /**
     * Author email.
     */
    private String authorEmail;

    /**
     * Author icon TOKEN.
     */
    private String authorIcon;

    /**
     * Author website address.
     */
    private String authorLink;

    /**
     * Widget package type (0: third party, 1: official).
     */
    private Integer packageType;

    /**
     * 0: Publish to the component store in the space station, 1: Publish to the global application store (only allowed if the package_type is 0).
     */
    private Integer releaseType;

    /**
     * Widget package extension information.
     */
    private String widgetBody;

    /**
     * Whether the sandbox runs (0: No, 1: Yes).
     */
    private Boolean sandbox;

    /**
     * The release version ID, the currently active version, can be empty. When it is empty, it is only displayed to Creator in the build store.
     */
    private Long releaseId;

    /**
     * Is template (0: No, 1: Yes).
     */
    private Boolean isTemplate;

    /**
     * Enable or not, only for global widgets (0: not enabled, 1: enabled).
     */
    private Boolean isEnabled;

    /**
     * Delete Tag(0: No, 1: Yes).
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * Owner Id(link#xxxx_user#id).
     */
    private Long owner;

    /**
     * Creator.
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * Last Update By.
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    /**
     * Create Time.
     */
    private LocalDateTime createdAt;

    /**
     * Update Time.
     */
    private LocalDateTime updatedAt;

    /**
     * Installation environment code.
     */
    private String installEnvCode;

    /**
     * Operate environment code.
     */
    private String runtimeEnvCode;


}
