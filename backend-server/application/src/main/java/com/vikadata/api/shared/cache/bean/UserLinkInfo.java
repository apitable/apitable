package com.vikadata.api.shared.cache.bean;

import java.util.List;

import lombok.Data;

/**
 * <p>
 * user link info
 * </p>
 *
 * @author Chambers
 */
@Data
public class UserLinkInfo {

    private String apiKey;

    private List<AccountLinkDto> accountLinkList;

    private String wizards;

    private String inviteCode;
}
