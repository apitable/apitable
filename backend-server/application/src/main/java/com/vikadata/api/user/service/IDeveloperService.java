package com.vikadata.api.user.service;

public interface IDeveloperService {

    /**
     * check whether the user has been configured
     *
     * @param userId user id
     * @return true | false
     */
    boolean checkHasCreate(Long userId);

    /**
     * get api key
     * @param userId user id
     * @return api key
     */
    String getApiKeyByUserId(Long userId);

    /**
     * validate api key
     *
     * @param apiKey access token
     * @return true | false
     */
    boolean validateApiKey(String apiKey);

    /**
     * create api key
     *
     * @param userId user id
     * @return API KEY
     */
    String createApiKey(Long userId);

    /**
     * refresh api key
     *
     * @param userId user id
     * @return new api api
     */
    String refreshApiKey(Long userId);
}
