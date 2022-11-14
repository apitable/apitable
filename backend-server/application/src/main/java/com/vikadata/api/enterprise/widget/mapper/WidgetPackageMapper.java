package com.vikadata.api.enterprise.widget.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.apitable.starter.vika.core.model.GlobalWidgetInfo;
import com.vikadata.api.enterprise.widget.dto.WidgetPackageDTO;
import com.vikadata.api.enterprise.widget.dto.WidgetSpaceByDTO;
import com.vikadata.api.enterprise.widget.ro.WidgetStoreListRo;
import com.vikadata.api.enterprise.widget.vo.WidgetPackageInfo;
import com.vikadata.api.enterprise.widget.vo.WidgetPackageInfoVo;
import com.vikadata.api.enterprise.widget.vo.WidgetStoreListInfo;
import com.vikadata.api.enterprise.widget.vo.WidgetTemplatePackageInfo;
import com.vikadata.entity.WidgetPackageEntity;

public interface WidgetPackageMapper extends BaseMapper<WidgetPackageEntity> {

    /**
     *
     * @param userId user id
     * @param spaceId space id
     * @param filter    whether to filter unpublished widgets
     * @param language  specify return language
     * @return WidgetPackageInfo List
     */
    @Deprecated
    List<WidgetPackageInfo> selectWidgetPackageList(@Param("userId") Long userId, @Param("spaceId") String spaceId, @Param("filter") Boolean filter, @Param("language") String language);

    /**
     * @param userId user id
     * @param spaceId space id
     * @param storeListRo   request parameters
     * @return widget store list information
     */
    List<WidgetStoreListInfo> selectWidgetStoreList(@Param("userId") Long userId, @Param("spaceId") String spaceId, @Param("storeListRo") WidgetStoreListRo storeListRo);

    /**
     * @param widgetPackageIds widgetPackageIds
     * @param language language
     * @return WidgetPackageDTOs
     */
    List<WidgetPackageDTO> selectByPackageIdsIncludeDelete(@Param("list") Collection<String> widgetPackageIds, @Param("language") String language);

    /**
     * @param widgetPackageId widgetPackageId
     * @return datasheet id
     */
    Long selectIdByPackageId(@Param("widgetPackageId") String widgetPackageId);

    /**
     * @param widgetPackageId widgetPackageId
     * @return installation package status
     */
    Integer selectStatusByPackageId(@Param("widgetPackageId") String widgetPackageId);

    /**
     * @param entities WidgetPackage
     * @return affected rows
     */
    int insertBatch(@Param("entities") Collection<WidgetPackageEntity> entities);

    /**
     * Cumulative number of component package installations
     *
     * @param widgetPackageId widgetPackageId
     * @param times           accumulation times
     * @return affected rows
     */
    int updateInstalledNumByPackageId(@Param("widgetPackageId") String widgetPackageId, @Param("times") Integer times);

    /**
     * query whether the widget package id exists
     *
     * @param packageId packageId
     * @return exists or not
     */
    boolean countNumByPackageId(@Param("packageId") String packageId);

    /**
     * @param packageId widget package id
     * @return WidgetPackageEntity
     */
    WidgetPackageEntity selectWidgetByPackageId(@Param("packageId") String packageId);

    /**
     * @param packageId packageId
     * @return widget status
     */
    int selectWidgetStatusByPackageId(@Param("packageId") String packageId);

    /**
     * @param status modify status
     * @param releaseId release id
     * @param packageId widget package id
     * @param userId user id
     * @return affected rows
     */
    int updateStatusAndReleaseIdByPackageId(@Param("status") Integer status, @Param("releaseId") Long releaseId, @Param("packageId") String packageId, @Param("userId") Long userId);

    /**
     * @param packageId widget id
     * @param spaceId space id
     * @param language specify return language
     * @return WidgetPackageInfoVo
     */
    List<WidgetPackageInfoVo> selectWidgetPackageInfoByPackageIdOrSpaceId(@Param("packageId") String packageId, @Param("spaceId") String spaceId, @Param("language") String language);

    /**
     * @param language  specify return language
     * @return WidgetTemplatePackageInfo
     */
    List<WidgetTemplatePackageInfo> selectWidgetTemplatePackageList(@Param("language") String language);

    /**
     * @param packageId widget id
     * @return WidgetSpaceByDTO
     */
    WidgetSpaceByDTO selectWidgetSpaceBy(@Param("packageId") String packageId);

    /**
     * query the latest widget order
     *
     * @param releaseType   releaseType
     * @param spaceId space id
     * @return the latest order
     */
    int selectMaxWidgetSort(@Param("releaseType") Integer releaseType, @Param("spaceId") String spaceId);

    /**
     * check the order of official or template widgets
     *
     * @param packageId widgetId
     * @return the latest order
     */
    Integer selectGlobalWidgetSort(@Param("packageId") String packageId);

    /**
     * Batch update global widget and widget template configuration
     *
     * @param globalWidgetInfo global widget info
     * @return affected rows
     */
    int singleUpdateGlobalAndTemplateConfig(@Param("globalWidgetInfo") GlobalWidgetInfo globalWidgetInfo);

    /**
     * According to the issuance of global Id archive data statistics
     *
     * @return int
     */
    int countByIssuedIdArchive(@Param("dstId") String dstId, @Param("recotdId") String recotdId);

    /**
     * archive statistics based on audit results
     *
     * @return int
     */
    int countByAuditSubmitResultArchive(@Param("dstId") String dstId, @Param("recotdId") String recotdId);

    /**
     * @param fatherWidgetId parent widget id
     * @param version        version
     * @return widget to be approved
     */
    WidgetPackageEntity selectByFatherWidgetIdAndVersion(@Param("fatherWidgetId") String fatherWidgetId, @Param("version") String version);

    /**
     * update extend info
     *
     * @param id            the widget's id
     * @param widgetBody    the widget's extend info
     * @return  updated rows' number
     */
    int updateWidgetBodyById(@Param("id") Long id, @Param("widgetBody")String widgetBody);
}
