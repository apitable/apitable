package com.vikadata.social.dingtalk;

import com.vikadata.social.dingtalk.api.CorpAppOperations;
import com.vikadata.social.dingtalk.api.IsvAppOperations;
import com.vikadata.social.dingtalk.api.MobileAppOperations;
import com.vikadata.social.dingtalk.api.ServiceCorpAppOperations;

public interface DingTalk {

    /**
     * mobile access interface
     * @return MobileAppOperations
     */
    MobileAppOperations mobileAppOperations();

    /**
     * Internal application interface
     * @return CorpAppOperations
     */
    CorpAppOperations corpAppOperations();

    /**
     * Authorized internal application interfaces developed by third-party companies
     * @return Authorized internal application operations developed by isv companies
     */
    ServiceCorpAppOperations serviceCorpAppOperations();

    /**
     * isv market application interface
     */
    IsvAppOperations isvAppOperations();
}
