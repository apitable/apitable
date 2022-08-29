package com.vikadata.api.enums.labs;

import java.util.Objects;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

import static com.vikadata.api.enums.labs.LabsApplicantTypeEnum.SPACE_LEVEL_FEATURE;
import static com.vikadata.api.enums.labs.LabsApplicantTypeEnum.UNKNOWN_LEVEL_FEATURE;
import static com.vikadata.api.enums.labs.LabsApplicantTypeEnum.USER_LEVEL_FEATURE;

/**
 * <p>
 * 实验性功能标识 枚举类
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/22 16:37:18
 */
@AllArgsConstructor
@Getter
public enum LabsFeatureEnum {

    /**
     * 渲染优化
     * */
    RENDER_PROMPT("render_prompt", USER_LEVEL_FEATURE),

    /**
     * 正常渲染
     * */
    RENDER_NORMAL("render_normal", USER_LEVEL_FEATURE),

    /**
     * 异步计算
     * */
    ASYNC_COMPUTE("async_compute", USER_LEVEL_FEATURE),

    /**
     * 机器人
     * */
    ROBOT("robot", SPACE_LEVEL_FEATURE, "/help/manual-vika-robot"),

    /**
     * 小组件中心
     * */
    WIDGET_CENTER("widget_center", SPACE_LEVEL_FEATURE, "/help/intro-widget-center"),

    /**
     * 视图手动保存
     * */
    VIEW_MANUAL_SAVE("view_manual_save", SPACE_LEVEL_FEATURE),

    /**
     * 未知实验性功能类型
     * */
    UNKNOWN_LAB_FEATURE("unknown_lab_feature", UNKNOWN_LEVEL_FEATURE);

    /**
     * 实验室功能名称 - 必选
     * */
    private final String featureName;
    /**
     * 申请内测功能类型 - 必选
     * */
    private final LabsApplicantTypeEnum applicantType;
    /**
     * 通知跳转卡片的URL - 可选
     * */
    private String toastUrl;

    LabsFeatureEnum(String featureName, LabsApplicantTypeEnum applicantType) {
        this.featureName = featureName;
        this.applicantType = applicantType;
    }

    public static String ofFeatureKey(String featureKey) {
        for (LabsFeatureEnum featureEnum : LabsFeatureEnum.values()) {
            if (featureEnum.name().equalsIgnoreCase(featureKey)) {
                return featureEnum.getFeatureName();
            }
        }
        return UNKNOWN_LAB_FEATURE.getFeatureName();
    }

    public static LabsFeatureEnum ofLabsFeature(String featureName) {
        if (StrUtil.isBlank(featureName)) {
            return UNKNOWN_LAB_FEATURE;
        }
        for (LabsFeatureEnum featureEnum : LabsFeatureEnum.values()) {
            if (Objects.equals(featureName, featureEnum.getFeatureName()) ||
            Objects.equals(featureName, featureEnum.name())) {
                return featureEnum;
            }
        }
        return UNKNOWN_LAB_FEATURE;
    }
}
