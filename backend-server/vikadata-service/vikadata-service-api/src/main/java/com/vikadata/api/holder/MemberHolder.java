package com.vikadata.api.holder;

/**
 * <p>
 * 当前请求的所在空间的成员ID的临时保存容器
 * 说明：
 * 当OPEN_UP_FLAG标识在ThreadLocal里为true
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 16:10
 */
public class MemberHolder {

	private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();
	private static final ThreadLocal<Long> MEMBER_HOLDER = new ThreadLocal<>();

	/**
	 * 初始化
	 */
	public static void init() {
		OPEN_UP_FLAG.set(true);
	}

	/**
	 * 这个方法如果OPEN_UP_FLAG标识没开启，则会set失效
	 *
	 * @param memberId 成员ID
	 * @author Shawn Deng
	 * @date 2019/10/29 16:10
	 */
	public static void set(Long memberId) {
		Boolean openUpFlag = OPEN_UP_FLAG.get();
		if (openUpFlag != null && openUpFlag.equals(true)) {
			MEMBER_HOLDER.set(memberId);
		}
	}

	/**
	 * 这个方法如果OPEN_UP_FLAG标识没开启，则会get值为null
	 *
	 * @return memberId
	 * @author Shawn Deng
	 * @date 2019/10/29 16:11
	 */
	public static Long get() {
		Boolean openUpFlag = OPEN_UP_FLAG.get();
		if (openUpFlag == null || openUpFlag.equals(false)) {
			return null;
		} else {
			return MEMBER_HOLDER.get();
		}
	}

	/**
	 * 删除临时保存的用户
	 *
	 * @author Shawn Deng
	 * @date 2019/10/29 16:11
	 */
	public static void remove() {
		OPEN_UP_FLAG.remove();
		MEMBER_HOLDER.remove();
	}
}
