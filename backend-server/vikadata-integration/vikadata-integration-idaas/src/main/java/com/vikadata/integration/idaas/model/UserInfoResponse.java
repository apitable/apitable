package com.vikadata.integration.idaas.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Get user information
 * </p>
 *
 */
@Setter
@Getter
public class UserInfoResponse {

    /**
     * user unique ID
     */
    @JsonProperty("user_id")
    private String userId;

    /**
     * user's name
     */
    @JsonProperty("sub")
    private String sub;

    /**
     * user display name in idaas
     */
    @JsonProperty("name")
    private String name;

    /**
     * user's email in idaas
     */
    @JsonProperty("email")
    private String email;

    /**
     * user's phone number in idaas
     */
    @JsonProperty("phone_number")
    private String phoneNumber;

}
