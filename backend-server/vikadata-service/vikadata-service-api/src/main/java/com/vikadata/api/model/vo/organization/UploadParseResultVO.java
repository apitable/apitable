package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 模板解析结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("模板解析结果视图")
public class UploadParseResultVO {

    @ApiModelProperty(value = "解析总数", example = "100", position = 1)
    private Integer rowCount;

    @ApiModelProperty(value = "解析成功条数", example = "198", position = 2)
    private Integer successCount;

    @ApiModelProperty(value = "解析失败条数", example = "2", position = 3)
    private Integer errorCount;

    private List<ParseErrorRecordVO> errorList;
}
