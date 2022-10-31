package com.vikadata.api.cache.bean;

import java.io.Serializable;
import java.util.Set;

import lombok.Data;

/**
 * <p>
 * user in space cache
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class UserSpaceDto implements Serializable {

    private static final long serialVersionUID = 33013620700630558L;

    private Long userId;

    private String spaceId;

    private String spaceName;

    private String spaceLogo;

    private Long memberId;

    private String memberName;

    private Long unitId;

    private boolean isMainAdmin;

    private boolean isAdmin;

    private boolean isDel;

    private Set<String> resourceCodes;

    private Set<String> resourceGroupCodes;

    private Boolean isNameModified;

    private Boolean isMemberNameModified;
}
