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

package com.apitable.widget.mapper;

import com.apitable.widget.dto.WidgetPackageDTO;
import com.apitable.widget.dto.WidgetSpaceByDTO;
import com.apitable.widget.entity.WidgetPackageEntity;
import com.apitable.widget.ro.WidgetStoreListRo;
import com.apitable.widget.vo.GlobalWidgetInfo;
import com.apitable.widget.vo.WidgetPackageInfoVo;
import com.apitable.widget.vo.WidgetStoreListInfo;
import com.apitable.widget.vo.WidgetTemplatePackageInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * widget package mapper.
 */
public interface WidgetPackageMapper extends BaseMapper<WidgetPackageEntity> {

    /**
     * query widget package list.
     *
     * @param userId      user id
     * @param spaceId     space id
     * @param storeListRo request parameters
     * @return widget store list information
     */
    List<WidgetStoreListInfo> selectWidgetStoreList(@Param("userId") Long userId,
                                                    @Param("spaceId") String spaceId,
                                                    @Param("storeListRo")
                                                    WidgetStoreListRo storeListRo);

    /**
     * query dto by widget package id.
     *
     * @param widgetPackageIds widgetPackageIds
     * @param language         language
     * @return WidgetPackageDTOs
     */
    List<WidgetPackageDTO> selectByPackageIdsIncludeDelete(
        @Param("list") Collection<String> widgetPackageIds, @Param("language") String language);

    /**
     * query status by widget package id.
     *
     * @param widgetPackageId widgetPackageId
     * @return installation package status
     */
    Integer selectStatusByPackageId(@Param("widgetPackageId") String widgetPackageId);

    /**
     * batch insert.
     *
     * @param entities WidgetPackage
     * @return affected rows
     */
    int insertBatch(@Param("entities") Collection<WidgetPackageEntity> entities);

    /**
     * Cumulative number of component package installations.
     *
     * @param widgetPackageId widgetPackageId
     * @param times           accumulation times
     * @return affected rows
     */
    int updateInstalledNumByPackageId(@Param("widgetPackageId") String widgetPackageId,
                                      @Param("times") Integer times);

    /**
     * query whether the widget package id exists.
     *
     * @param packageId packageId
     * @return exists or not
     */
    boolean countNumByPackageId(@Param("packageId") String packageId);

    /**
     * query widget package by package id.
     *
     * @param packageId widget package id
     * @return WidgetPackageEntity
     */
    WidgetPackageEntity selectWidgetByPackageId(@Param("packageId") String packageId);

    /**
     * update widget package status by package id.
     *
     * @param status    modify status
     * @param releaseId release id
     * @param packageId widget package id
     * @param userId    user id
     * @return affected rows
     */
    int updateStatusAndReleaseIdByPackageId(@Param("status") Integer status,
                                            @Param("releaseId") Long releaseId,
                                            @Param("packageId") String packageId,
                                            @Param("userId") Long userId);

    /**
     * query widget package by package id.
     *
     * @param packageId widget id
     * @param spaceId   space id
     * @param language  specify return language
     * @return WidgetPackageInfoVo
     */
    List<WidgetPackageInfoVo> selectWidgetPackageInfoByPackageIdOrSpaceId(
        @Param("packageId") String packageId, @Param("spaceId") String spaceId,
        @Param("language") String language);

    /**
     * query widget template package list.
     *
     * @param language specify return language
     * @return WidgetTemplatePackageInfo
     */
    List<WidgetTemplatePackageInfo> selectWidgetTemplatePackageList(
        @Param("language") String language);

    /**
     * query widget space by package id.
     *
     * @param packageId widget id
     * @return WidgetSpaceByDTO
     */
    WidgetSpaceByDTO selectWidgetSpaceBy(@Param("packageId") String packageId);

    /**
     * query the latest widget order.
     *
     * @param releaseType releaseType
     * @param spaceId     space id
     * @return the latest order
     */
    int selectMaxWidgetSort(@Param("releaseType") Integer releaseType,
                            @Param("spaceId") String spaceId);

    /**
     * check the order of official or template widgets.
     *
     * @param packageId widgetId
     * @return the latest order
     */
    Integer selectGlobalWidgetSort(@Param("packageId") String packageId);

    /**
     * Batch update global widget and widget template configuration.
     *
     * @param globalWidgetInfo global widget info
     * @return affected rows
     */
    int singleUpdateGlobalAndTemplateConfig(
        @Param("globalWidgetInfo") GlobalWidgetInfo globalWidgetInfo);

    /**
     * According to the issuance of global Id archive data statistics.
     *
     * @return int
     */
    int countByIssuedIdArchive(@Param("dstId") String dstId, @Param("recordId") String recordId);

    /**
     * archive statistics based on audit results.
     *
     * @return int
     */
    int countByAuditSubmitResultArchive(@Param("dstId") String dstId,
                                        @Param("recotdId") String recotdId);

    /**
     * query widget package by package id.
     *
     * @param fatherWidgetId parent widget id
     * @param version        version
     * @return widget to be approved
     */
    WidgetPackageEntity selectByFatherWidgetIdAndVersion(
        @Param("fatherWidgetId") String fatherWidgetId, @Param("version") String version);

    /**
     * update extend info.
     *
     * @param id         the widget's id
     * @param widgetBody the widget's extend info
     * @return updated rows' number
     */
    int updateWidgetBodyById(@Param("id") Long id, @Param("widgetBody") String widgetBody);
}
