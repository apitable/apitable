package com.vikadata.integration.afs;

/**
 * <p>
 * Man machine verification service interface
 * </p>
 *
 */
public interface AfsChecker {

    /**
     * Alibaba Cloud Shield Traceless Verification
     *
     * @param data         The front end obtains the value of the getNVCVal function
     * @param scoreJsonStr Mapping between "Back end call risk control return result" and "Client execution operation"
     * @return Risk control return result
     */
	String noTraceCheck(String data, String scoreJsonStr);

}
