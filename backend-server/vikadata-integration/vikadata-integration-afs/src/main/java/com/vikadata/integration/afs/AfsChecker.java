package com.vikadata.integration.afs;

/**
 * <p>
 * 人机验证服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/2/6
 */
public interface AfsChecker {

	/**
	 * 阿里云盾无痕验证
	 *
	 * @param data         前端获取getNVCVal函数的值
	 * @param scoreJsonStr "后端调用风控返回结果"与"客户端执行操作"之间的映射关系
	 * @return 风控返回结果
	 * @author Chambers
	 * @date 2020/2/6
	 */
	String noTraceCheck(String data, String scoreJsonStr);
}
