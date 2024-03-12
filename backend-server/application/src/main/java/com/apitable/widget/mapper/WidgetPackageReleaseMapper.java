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

import com.apitable.widget.dto.LastSubmitWidgetVersionDTO;
import com.apitable.widget.entity.WidgetPackageReleaseEntity;
import com.apitable.widget.ro.WidgetStoreListRo;
import com.apitable.widget.vo.WidgetReleaseListVo;
import com.apitable.widget.vo.WidgetStoreListInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * widget package release mapper.
 */
public interface WidgetPackageReleaseMapper extends BaseMapper<WidgetPackageReleaseEntity> {

    /**
     * query whether the published version sha exists.
     *
     * @param releaseSha    release version sha
     * @param releaseStatus release status
     * @return release version data id
     */
    Long selectReleaseShaToId(@Param("releaseSha") String releaseSha,
                              @Param("releaseStatus") Integer releaseStatus);

    /**
     * query release version list.
     *
     * @param page      page object
     * @param packageId widget package ids
     * @return page result
     */
    IPage<WidgetReleaseListVo> selectReleasePage(Page<WidgetReleaseListVo> page,
                                                 @Param("packageId") String packageId);

    /**
     * query the list of applets to be reviewed.
     *
     * @param condition condition
     * @return list to be reviewed
     */
    List<WidgetStoreListInfo> selectWaitReviewWidgetList(
        @Param("condition") WidgetStoreListRo condition);

    /**
     * Query the last submitted applet version information according to the parent widget ID.
     *
     * @param fatherWidgetId fatherWidgetId
     * @return LastSubmitWidgetVersionDTO
     */
    LastSubmitWidgetVersionDTO selectLastWidgetVersionInfoByFatherWidgetId(
        @Param("fatherWidgetId") String fatherWidgetId);

    /**
     * query by father widget id and status.
     *
     * @param fatherWidgetId father widget id
     * @param version        version
     * @return pending approval widget version
     */
    WidgetPackageReleaseEntity selectByFatherWidgetIdAndVersion(
        @Param("fatherWidgetId") String fatherWidgetId, @Param("version") String version);

}
