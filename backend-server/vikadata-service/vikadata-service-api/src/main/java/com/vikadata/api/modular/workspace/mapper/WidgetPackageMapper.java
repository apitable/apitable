package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.widget.WidgetPackageDTO;
import com.vikadata.api.model.dto.widget.WidgetSpaceByDTO;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetPackageInfo;
import com.vikadata.api.model.vo.widget.WidgetPackageInfoVo;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;
import com.vikadata.api.model.vo.widget.WidgetTemplatePackageInfo;
import com.vikadata.entity.WidgetPackageEntity;
import com.vikadata.integration.vika.model.GlobalWidgetInfo;

/**
 * <p>
 * 工作台-组件包信息表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
public interface WidgetPackageMapper extends BaseMapper<WidgetPackageEntity> {

    /**
     * 获取组件包列表
     *
     * @param userId    用户Id
     * @param spaceId   空间站ID
     * @param filter    是否过滤未发布的小组件
     * @param language  指定返回语言
     * @return WidgetPackageInfo List
     * @author Chambers
     * @date 2020/12/23
     */
    @Deprecated
    List<WidgetPackageInfo> selectWidgetPackageList(@Param("userId") Long userId, @Param("spaceId") String spaceId, @Param("filter") Boolean filter, @Param("language") String language);

    /**
     *  获取小组件商店列表信息
     *
     * @param userId        用户Id
     * @param spaceId       空间站ID
     * @param storeListRo   请求参数
     * @return 小组件商店列表信息
     * @author Pengap
     * @date 2021/9/28 15:08:52
     */
    List<WidgetStoreListInfo> selectWidgetStoreList(@Param("userId") Long userId, @Param("spaceId") String spaceId, @Param("storeListRo") WidgetStoreListRo storeListRo);

    /**
     * 查询实体列表
     *
     * @param widgetPackageIds 安装包ID 列表
     * @param language 指定返回语言
     * @return entities
     * @author Chambers
     * @date 2021/01/11
     */
    List<WidgetPackageDTO> selectByPackageIdsIncludeDelete(@Param("list") Collection<String> widgetPackageIds, @Param("language") String language);

    /**
     * 查询表ID
     *
     * @param widgetPackageId 安装包ID
     * @return 表ID
     * @author Chambers
     * @date 2021/1/25
     */
    Long selectIdByPackageId(@Param("widgetPackageId") String widgetPackageId);

    /**
     * 查询安装包状态
     *
     * @param widgetPackageId 安装包ID
     * @return 表ID
     * @author Chambers
     * @date 2020/12/23
     */
    Integer selectStatusByPackageId(@Param("widgetPackageId") String widgetPackageId);

    /**
     * 批量新增组件安装包
     *
     * @param entities 实体列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/12/23
     */
    int insertBatch(@Param("entities") Collection<WidgetPackageEntity> entities);

    /**
     * 组件包累计安装次数
     *
     * @param widgetPackageId 安装包ID
     * @param times           累加次数
     * @return 执行结果数
     * @author Chambers
     * @date 2020/12/23
     */
    int updateInstalledNumByPackageId(@Param("widgetPackageId") String widgetPackageId, @Param("times") Integer times);

    /**
     * 查询小组件包Id是否存在
     *
     * @param packageId 包ID
     * @return packageId是否存在
     * @author Pengap
     * @date 2021/7/8
     */
    boolean countNumByPackageId(@Param("packageId") String packageId);

    /**
     * 查询小组件包信息
     *
     * @param packageId 小组件包ID
     * @return 小组件包信息
     * @author Pengap
     * @date 2021/7/8
     */
    WidgetPackageEntity selectWidgetByPackageId(@Param("packageId") String packageId);

    /**
     * 查询小组件包状态
     *
     * @param packageId 小组件包信息
     * @return 小组件包状态
     * @author Pengap
     * @date 2021/7/8
     */
    int selectWidgetStatusByPackageId(@Param("packageId") String packageId);

    /**
     * 修改小组件状态
     *
     * @param status 修改状态
     * @param releaseId 发布版本Id
     * @param packageId 小组件包ID
     * @param userId 操作用户Id
     * @return 搜影响行数
     * @author Pengap
     * @date 2021/7/8
     */
    int updateStatusAndReleaseIdByPackageId(@Param("status") Integer status, @Param("releaseId") Long releaseId, @Param("packageId") String packageId, @Param("userId") Long userId);

    /**
     * 根据小组件包Id或空间站Id查询小组件包列表信息
     *
     * @param packageId 小组件包Id
     * @param spaceId 空间站Id
     * @param language 指定返回语言
     * @return 小组件包信息
     * @author Pengap
     * @date 2021/7/12
     */
    List<WidgetPackageInfoVo> selectWidgetPackageInfoByPackageIdOrSpaceId(@Param("packageId") String packageId, @Param("spaceId") String spaceId, @Param("language") String language);

    /**
     * 获取模版组件包列表
     *
     * @param language  指定返回语言
     * @return 模版组件集合
     * @author Pengap
     * @date 2021/9/16 13:30:14
     */
    List<WidgetTemplatePackageInfo> selectWidgetTemplatePackageList(@Param("language") String language);

    /**
     * 查询小组件归属空间站
     *
     * @param packageId 组件Id
     * @return 小组件拥有者信息
     * @author Pengap
     * @date 2021/9/28 16:01:03
     */
    WidgetSpaceByDTO selectWidgetSpaceBy(@Param("packageId") String packageId);

    /**
     * 查询最新的小组件顺序
     *
     * @param releaseType   小组件类型
     * @param spaceId       空间站Id
     * @return 最新的顺序
     * @author Pengap
     * @date 2021/9/28 20:19:21
     */
    int selectMaxWidgetSort(@Param("releaseType") Integer releaseType, @Param("spaceId") String spaceId);

    /**
     * 查询官方或模版小组件顺序
     *
     * @param packageId 空间站Id
     * @return 最新的顺序
     * @author Pengap
     * @date 2021/9/28 20:19:21
     */
    Integer selectGlobalWidgetSort(@Param("packageId") String packageId);

    /**
     * 批量更新全局小组件和小组件模版配置
     *
     * @param globalWidgetInfo 请求对象
     * @return 影响行数
     * @author Pengap
     * @date 2021/9/30 12:59:02
     */
    int singleUpdateGlobalAndTemplateConfig(@Param("globalWidgetInfo") GlobalWidgetInfo globalWidgetInfo);

    /**
     * 根据签发全局Id存档数据统计
     *
     * @return int
     * @author Pengap
     * @date 2022/3/8 21:29:39
     */
    int countByIssuedIdArchive(@Param("dstId") String dstId, @Param("recotdId") String recotdId);

    /**
     * 根据审核结果存档数据统计
     *
     * @return int
     * @author Pengap
     * @date 2022/3/8 21:29:39
     */
    int countByAuditSubmitResultArchive(@Param("dstId") String dstId, @Param("recotdId") String recotdId);

    /**
     * 根据父级小程序Id，submitVersion
     *
     * @param fatherWidgetId 父级小程序Id
     * @param version        版本号
     * @return 待审核小程序包
     * @author Pengap
     * @date 2022/3/16 10:58:47
     */
    WidgetPackageEntity selectByFatherWidgetIdAndVersion(@Param("fatherWidgetId") String fatherWidgetId, @Param("version") String version);

}
