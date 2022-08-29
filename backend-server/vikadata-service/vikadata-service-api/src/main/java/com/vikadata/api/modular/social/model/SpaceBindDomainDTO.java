package com.vikadata.api.modular.social.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间绑定域名DTO
 * </p>
 *
 * @author Pengap
 * @date 2021/8/26 14:39:25
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class SpaceBindDomainDTO {

    /**
     * 空间站Id
     */
    private String spaceId;

    /**
     * 域名
     */
    private String domainName;

    /**
     * 状态
     */
    private Integer status;

}
