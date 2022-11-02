package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 上传员工模板请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/21 20:27
 */
@Data
@ApiModel("上传员工模板请求参数")
public class UploadMemberTemplateRo {

    @NotNull(message = "导入文件不能为空")
    @ApiModelProperty(value = "导入文件", position = 2, required = true)
    private MultipartFile file;

    @ApiModelProperty(value = "密码登录人机验证，前端获取getNVCVal函数的值（未登录状态下会进行人机验证）", example = "FutureIsComing", position = 3)
    private String data;
}
