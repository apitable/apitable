package com.vikadata.api.enums.labs;

import java.util.Objects;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 实验性功能类型枚举
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/22 14:57:57
 */
@Getter
@AllArgsConstructor
public enum LabsFeatureTypeEnum {

    /**
     * 未知实验性功能类型
     * */
    UNKNOWN_LABS_FEATURE_TYPE(null, 0),

    /**
     * 静态实验性功能，不允许用户操作
     * */
    STATIC("static", 1),

    /**
     * 可申请内测的实验性功能
     * */
    REVIEW("review", 2),

    /**
     * 可由申请内测用户自行开启关闭的功能
     * */
    NORMAL("normal", 3),

    /**
     * 可由内测用户自行开启但需要靠数据库持久化状态
     * */
    NORMAL_PERSIST("normal_persist", 4),

    /**
     * 全局开放级别功能
     */
    GLOBAL("global",5);

    private String featureKey;

    private Integer type;

    public static LabsFeatureTypeEnum ofLabsFeatureType(String featureTypeName) {
        if (StrUtil.isBlank(featureTypeName)) {
            return UNKNOWN_LABS_FEATURE_TYPE;
        }
        for (LabsFeatureTypeEnum featureEnum : LabsFeatureTypeEnum.values()) {
            if (featureTypeName.equalsIgnoreCase(featureEnum.getFeatureKey())) {
                return featureEnum;
            }
        }
        return UNKNOWN_LABS_FEATURE_TYPE;
    }

    public static LabsFeatureTypeEnum ofLabsFeatureType(Integer typeCode) {
        if (Objects.isNull(typeCode) || typeCode == 0) {
            return UNKNOWN_LABS_FEATURE_TYPE;
        }
        for (LabsFeatureTypeEnum featureEnum : LabsFeatureTypeEnum.values()) {
            if (Objects.equals(typeCode, featureEnum.getType())) {
                return featureEnum;
            }
        }
        return UNKNOWN_LABS_FEATURE_TYPE;
    }
}
