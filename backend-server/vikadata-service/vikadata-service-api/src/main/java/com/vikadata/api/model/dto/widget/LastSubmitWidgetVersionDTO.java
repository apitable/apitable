package com.vikadata.api.model.dto.widget;

import lombok.Data;

/**
 * <p>
 * 最后提交小程序版本信息
 * </p>
 *
 * @author Pengap
 * @date 2022/3/9 23:25:11
 */
@Data
public class LastSubmitWidgetVersionDTO {

    // 小程序包记录Id
    private Long lastPackageId;

    // 小程序发行版本记录Id
    private Long lastPackageReleaseId;

    // 小程序授权空间记录Id
    private Long lastPackageAuthSpaceId;

}
