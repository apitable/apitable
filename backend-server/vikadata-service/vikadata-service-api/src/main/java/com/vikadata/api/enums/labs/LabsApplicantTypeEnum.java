package com.vikadata.api.enums.labs;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Objects;

/**
 * <p>
 * 实验性功能申请者类型
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/22 15:15:44
 */
@Getter
@AllArgsConstructor
public enum LabsApplicantTypeEnum {

    /**
     * 用户级别功能
     * */
    USER_LEVEL_FEATURE("user_feature", 0),

    /**
     * 空间站级别功能
     * */
    SPACE_LEVEL_FEATURE("space_feature", 1),

    /**
     * 未知级别功能
     * */
    UNKNOWN_LEVEL_FEATURE("unknown_level_feature", -1);

    private final String applicantTypeName;

    private final Integer code;

    public static LabsApplicantTypeEnum ofApplicantType(Integer code) {
        for (LabsApplicantTypeEnum applicantTypeEnum : LabsApplicantTypeEnum.values()) {
            if (Objects.equals(applicantTypeEnum.getCode(), code)) {
                return applicantTypeEnum;
            }
        }
        return UNKNOWN_LEVEL_FEATURE;
    }

    public static LabsApplicantTypeEnum ofApplicantType(String applicantTypeName) {
        if (StrUtil.isBlank(applicantTypeName)) {
            return UNKNOWN_LEVEL_FEATURE;
        }
        for (LabsApplicantTypeEnum applicantTypeEnum : LabsApplicantTypeEnum.values()) {
            if (StrUtil.equals(applicantTypeName, applicantTypeEnum.getApplicantTypeName())) {
                return applicantTypeEnum;
            }
        }
        return UNKNOWN_LEVEL_FEATURE;
    }
}
