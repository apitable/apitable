package com.vikadata.api.model.vo.labs;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 用户申请实验性功能
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/22 10:16:55
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("用户申请实验性功能")
public class LabsApplicantFeatureVo {

    /**
     *功能所属级别，是空间站级别还是用户级别
     * */
    @ApiModelProperty(value = "功能所属级别，是用户级还是空间站级", dataType = "java.lang.String", example = "USER_FEATURE", position = 1)
    private String applicantType;

    /**
     * 申请人唯一标识，是用户ID还是空间站ID
     * */
    @ApiModelProperty(value = "实验性功能申请人ID，可以是userId或者spaceId", dataType = "java.lang.String", example = "spc6e2CeZLBFN|1432899742704123905", position = 2)
    private String applicant;

    /**
     * 实验性功能标识
     * */
    @ApiModelProperty(value = "实验性功能标识", dataType = "java.lang.String", example = "RENDER_PROMPT|ASYNC_COMPUTE|ROBOT", position = 3)
    private String featureKey;

    /**
     * 实验性功能状态
     * */
    @ApiModelProperty(value = "实验性功能状态", dataType = "java.lang.String", example = "static(用户无法操作)|review(需要申请内测)|normal(用户自行开关)", position = 4)
    private String type;

    /**
     * 申请内测功能的神奇表单URL地址
     * */
    @ApiModelProperty(value = "申请内测功能表单url地址", dataType = "java.lang.String", example = "https://integration.vika.ltd/xxx/yyy", position = 5)
    private String url;
}
