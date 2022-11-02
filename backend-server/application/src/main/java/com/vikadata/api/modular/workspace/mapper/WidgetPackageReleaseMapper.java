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

public interface WidgetPackageReleaseMapper extends BaseMapper<WidgetPackageReleaseEntity> {

    /**
     * query whether the published version sha exists
     *
     * @param releaseSha release version sha
     * @param releaseStatus release status
     * @return release version data id
     */
    Long selectReleaseShaToId(@Param("releaseSha") String releaseSha, @Param("releaseStatus") Integer releaseStatus);

    /**
     * @param page      page object
     * @param packageId widget package ids
     * @return page result
     */
    IPage<WidgetReleaseListVo> selectReleasePage(Page<WidgetReleaseListVo> page, @Param("packageId") String packageId);

    /**
     * @param condition condition
     * @return list to be reviewed
     */
    List<WidgetStoreListInfo> selectWaitReviewWidgetList(@Param("condition") WidgetStoreListRo condition);

    /**
     * Query the last submitted applet version information according to the parent applet ID.
     *
     * @param fatherWidgetId fatherWidgetId
     * @return LastSubmitWidgetVersionDTO
     */
    LastSubmitWidgetVersionDTO selectLastWidgetVersionInfoByFatherWidgetId(@Param("fatherWidgetId") String fatherWidgetId);

    /**
     * @param fatherWidgetId father widget id
     * @param version        version
     * @return pending approval widget version
     */
    WidgetPackageReleaseEntity selectByFatherWidgetIdAndVersion(@Param("fatherWidgetId") String fatherWidgetId, @Param("version") String version);

}
