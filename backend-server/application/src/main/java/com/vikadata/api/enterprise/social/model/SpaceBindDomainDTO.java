package com.vikadata.api.enterprise.social.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Space bound domain name DTO
 * </p>
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class SpaceBindDomainDTO {

    /**
     * Space Id
     */
    private String spaceId;

    /**
     * Domain name
     */
    private String domainName;

    /**
     * State
     */
    private Integer status;

}
