package com.vikadata.api.security.afs;

/**
 * <p>
 * Alibaba Cloud Shield Human-Machine Authentication Interface
 * </p>
 *
 * @author Chambers
 */
public interface AfsCheckService {

	/**
	 * incognito verification
	 *
	 * @param data The front end gets the value of the get NVC Val function
	 */
	void noTraceCheck(String data);
}
