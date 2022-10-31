package com.vikadata.api.modular.developer.service;

public interface IDeveloperService {

    /**
     * check whether the user has been configured
     *
     * @param userId user id
     * @return true | false
     */
    boolean checkHasCreate(Long userId);

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
