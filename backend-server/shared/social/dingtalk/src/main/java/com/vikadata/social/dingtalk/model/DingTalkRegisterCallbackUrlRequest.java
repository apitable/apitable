package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Register DingTalk callback url
 */
@Getter
@Setter
@ToString
public class DingTalkRegisterCallbackUrlRequest {

    /**
     * The url for receiving the event callback must be a url address accessible from the public network.
     */
    private String url;

    /**
     * Data encryption key. Used for encryption of callback data, the length is fixed at 43 characters,
     * selected from a-z, A-Z, 0-9, a total of 62 characters, you can randomly generate,
     * ISV (service provider) recommends using the Encoding AES Key filled in when registering the kit.
     */
    private String aesKey;

    /**
     * The token required for encryption and decryption can be filled in randomly, and the length is greater than or equal to 6 characters and less than 64 characters.
     */
    private String token;

    /**
     * The registered event type, please refer to the event list for details.
     */
    private List<String> callBackTag;
}
