package com.vikadata.api.holder;

/**
 * <p>
 * Temporary container for the currently member id
 * @author Shawn Deng
 */
public class MemberHolder {

	private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();
	private static final ThreadLocal<Long> MEMBER_HOLDER = new ThreadLocal<>();

	public static void init() {
		OPEN_UP_FLAG.set(true);
	}

	public static void set(Long memberId) {
		Boolean openUpFlag = OPEN_UP_FLAG.get();
		if (openUpFlag != null && openUpFlag.equals(true)) {
			MEMBER_HOLDER.set(memberId);
		}
	}

	public static Long get() {
		Boolean openUpFlag = OPEN_UP_FLAG.get();
		if (openUpFlag == null || openUpFlag.equals(false)) {
			return null;
		} else {
			return MEMBER_HOLDER.get();
		}
	}

	public static void remove() {
		OPEN_UP_FLAG.remove();
		MEMBER_HOLDER.remove();
	}
}
