package com.vikadata.api.model.vo.labs;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Users apply for experimental functions
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Users apply for experimental functions")
public class LabsApplicantFeatureVo {

    /**
     * Function level, space level or user level
     * */
    @ApiModelProperty(value = "Function level, user level or space level", dataType = "java.lang.String", example = "USER_FEATURE", position = 1)
    private String applicantType;

    /**
     * The unique identifier of the applicant, which is the user ID or the space ID
     * */
    @ApiModelProperty(value = "Pilot function applicant ID, which can be user ID or space ID", dataType = "java.lang.String", example = "spc6e2CeZLBFN|1432899742704123905", position = 2)
    private String applicant;

    /**
     * Experimental function identification
     * */
    @ApiModelProperty(value = "Experimental function identification", dataType = "java.lang.String", example = "RENDER_PROMPT|ASYNC_COMPUTE|ROBOT", position = 3)
    private String featureKey;

    /**
     * Experimental functional status
     * */
    @ApiModelProperty(value = "Experimental functional status", dataType = "java.lang.String", example = "static(User cannot operate)|review(Need to apply for internal test)|normal(User self switch)", position = 4)
    private String type;

    /**
     * URL address of magic form for applying for internal test function
     * */
    @ApiModelProperty(value = "URL address of application for internal test function form", dataType = "java.lang.String", example = "https://integration.vika.ltd/xxx/yyy", position = 5)
    private String url;
}
