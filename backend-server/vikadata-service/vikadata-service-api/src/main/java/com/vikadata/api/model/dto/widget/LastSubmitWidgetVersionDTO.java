package com.vikadata.api.model.dto.widget;

import lombok.Data;

@Data
public class LastSubmitWidgetVersionDTO {

    private Long lastPackageId;

    private Long lastPackageReleaseId;

    private Long lastPackageAuthSpaceId;
}
