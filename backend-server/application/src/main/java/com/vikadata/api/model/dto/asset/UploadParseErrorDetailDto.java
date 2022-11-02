package com.vikadata.api.model.dto.asset;

import lombok.Data;

@Data
public class UploadParseErrorDetailDto {

    private String row;

    private String errorMsg;
}
