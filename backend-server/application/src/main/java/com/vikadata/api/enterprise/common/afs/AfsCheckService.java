package com.vikadata.api.enterprise.common.afs;

/**
 * <p>
 * Alibaba Cloud Shield Human-Machine Authentication Interface
 * </p>
 *
 * @author Chambers
 */
public interface AfsCheckService {

    boolean getEnabledStatus();

    /**
     * incognito verification
     *
     * @param data The front end gets the value of the get NVC Val function
     */
    void noTraceCheck(String data);
}
