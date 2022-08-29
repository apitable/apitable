package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * <p>
 * isv--钉钉搭基本信息
 * </p>
 * @author zoe zheng
 * @date 2021/10/8 20:04
 */
@Data
public class DingTalkDaDTO {

    private Integer dingTalkDaStatus;

    private String dingTalkSuiteKey;

    private String dingTalkCorpId;
}
