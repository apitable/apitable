package com.vikadata.api.enterprise.widget.dto;

import lombok.Data;

@Data
public class LastSubmitWidgetVersionDTO {

    private Long lastPackageId;

    private Long lastPackageReleaseId;

    private Long lastPackageAuthSpaceId;
}
