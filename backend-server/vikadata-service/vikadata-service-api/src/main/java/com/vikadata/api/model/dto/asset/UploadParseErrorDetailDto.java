package com.vikadata.api.model.dto.asset;

import lombok.Data;

/**
 * <p>
 * 通讯录模板解析详细
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/16 11:46
 */
@Data
public class UploadParseErrorDetailDto {

    private String row;

    private String errorMsg;
}
