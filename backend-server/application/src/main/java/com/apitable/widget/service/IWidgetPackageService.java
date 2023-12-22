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

package com.apitable.widget.service;

import com.apitable.widget.entity.WidgetPackageEntity;
import com.apitable.widget.ro.WidgetPackageCreateRo;
import com.apitable.widget.ro.WidgetPackageReleaseV2Ro;
import com.apitable.widget.ro.WidgetPackageRollbackRo;
import com.apitable.widget.ro.WidgetPackageSubmitV2Ro;
import com.apitable.widget.ro.WidgetPackageUnpublishRo;
import com.apitable.widget.ro.WidgetTransferOwnerRo;
import com.apitable.widget.vo.WidgetPackageInfoVo;
import com.apitable.widget.vo.WidgetReleaseCreateVo;
import com.apitable.widget.vo.WidgetReleaseListVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * widget package service.
 */
public interface IWidgetPackageService extends IService<WidgetPackageEntity> {

    /**
     * check packageId exist.
     *
     * @param customPackageId custom widget id
     * @return whether widget exist
     */
    boolean checkCustomPackageId(String customPackageId);

    /**
     * create widget.
     *
     * @param opUserId opUserId
     * @param widget   create widget package request parameters
     * @return widget id
     */
    WidgetReleaseCreateVo createWidget(Long opUserId, WidgetPackageCreateRo widget);

    /**
     * get a list of publishing history.
     *
     * @param opUserId  opUserId
     * @param packageId widget id
     * @param page      page object
     * @return publish list
     */
    List<WidgetReleaseListVo> releaseListWidget(Long opUserId, String packageId,
                                                Page<WidgetReleaseListVo> page);

    /**
     * rollback widget.
     *
     * @param opUserId opUserId
     * @param widget   rollback widget request parameters
     */
    void rollbackWidget(Long opUserId, WidgetPackageRollbackRo widget);

    /**
     * unpublish widget.
     *
     * @param opUserId opUserId
     * @param widget   unpublish widget request parameters
     */
    void unpublishWidget(Long opUserId, WidgetPackageUnpublishRo widget);

    /**
     * get widget package info.
     *
     * @param packageId widget id
     * @return WidgetPackageInfoVo
     */
    WidgetPackageInfoVo getWidgetPackageInfo(String packageId);

    /**
     * get widget package list info.
     *
     * @param spaceId space id
     * @return WidgetPackageInfoVo
     */
    List<WidgetPackageInfoVo> getWidgetPackageListInfo(String spaceId);

    /**
     * transfer widget owner.
     *
     * @param opUserId        opUserId
     * @param transferOwnerRo request to transfer widget parameters
     */
    void transferWidgetOwner(Long opUserId, WidgetTransferOwnerRo transferOwnerRo);

    /**
     * get entity by package id.
     *
     * @param packageId widget packageId id
     * @param checkBan  check if the widget is disabled
     * @return WidgetPackageEntity
     */
    WidgetPackageEntity getByPackageId(String packageId, boolean checkBan);

    /**
     * Get WidgetPackageEntity.
     *
     * @param packageId widget packageId id
     * @return WidgetPackageEntity
     * @author Chambers
     */
    WidgetPackageEntity getByPackageId(String packageId);

    /**
     * release widget.
     *
     * @param opUserId opUserId
     * @param widget   publish widget request parameters
     */
    void releaseWidget(Long opUserId, WidgetPackageReleaseV2Ro widget);

    /**
     * submit widget.
     *
     * @param opUserId opUserId
     * @param widget   publish widget request parameters
     */
    void submitWidget(Long opUserId, WidgetPackageSubmitV2Ro widget);
}
