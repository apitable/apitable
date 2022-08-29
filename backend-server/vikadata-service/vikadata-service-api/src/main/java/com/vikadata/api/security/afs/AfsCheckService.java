package com.vikadata.api.security.afs;

/**
 * <p>
 * 阿里云盾人机验证接口
 * </p>
 *
 * @author Chambers
 * @date 2020/2/6
 */
public interface AfsCheckService {

	/**
	 * 无痕验证
	 *
	 * @param data 前端获取getNVCVal函数的值
	 * @author Chambers
	 * @date 2020/2/6
	 */
	void noTraceCheck(String data);
}
