package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.widget.LastSubmitWidgetVersionDTO;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetReleaseListVo;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;
import com.vikadata.entity.WidgetPackageReleaseEntity;

/**
 * <p>
 * 工作台-组件发布历史 Mapper 接口
 * </p>
 *
 * @author Pengap
 * @date 2021/7/9
 */
public interface WidgetPackageReleaseMapper extends BaseMapper<WidgetPackageReleaseEntity> {

    /**
     * 查询发布版本SHA是否存在
     *
     * @param releaseSha 发布版本SHA
     * @param releaseStatus 发布状态
     * @return 发布版本数据Id
     * @author Pengap
     * @date 2021/7/9
     */
    Long selectReleaseShaToId(@Param("releaseSha") String releaseSha, @Param("releaseStatus") Integer releaseStatus);

    /**
     * 分页查询
     *
     * @param page      分页请求对象
     * @param packageId 小组件包Id
     * @return 分页结果集
     * @author Pengap
     * @date 2021/7/9
     */
    IPage<WidgetReleaseListVo> selectReleasePage(Page<WidgetReleaseListVo> page, @Param("packageId") String packageId);

    /**
     * 查询待审核列表
     *
     * @param condition 条件
     * @return 待审核列表
     * @author Pengap
     * @date 2022/3/9 02:58:44
     */
    List<WidgetStoreListInfo> selectWaitReviewWidgetList(@Param("condition") WidgetStoreListRo condition);

    /**
     * 根据父级小程序ID查询最后提交小程序版本信息
     *
     * @param fatherWidgetId 父级小程序Id
     * @return LastSubmitWidgetVersionDTO
     * @author Pengap
     * @date 2022/3/9 23:31:50
     */
    LastSubmitWidgetVersionDTO selectLastWidgetVersionInfoByFatherWidgetId(@Param("fatherWidgetId") String fatherWidgetId);

    /**
     * 根据父级小程序Id，submitVersion
     *
     * @param fatherWidgetId 父级小程序Id
     * @param version        版本号
     * @return 待审核小程序版本
     * @author Pengap
     * @date 2022/3/16 10:58:47
     */
    WidgetPackageReleaseEntity selectByFatherWidgetIdAndVersion(@Param("fatherWidgetId") String fatherWidgetId, @Param("version") String version);

}
