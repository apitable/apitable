package com.vikadata.scheduler.space.mapper.vcode;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * V码系统-V码表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/9/29
 */
public interface VCodeMapper {

    /**
     * 获取需要修改的 V码
     *
     * @return vCodes
     * @author Chambers
     * @date 2020/9/29
     */
    List<String> selectNotUsedCode();

    /**
     * 修改剩余可使用次数
     *
     * @param vCodes V码列表
     * @author Chambers
     * @date 2020/9/29
     */
    void updateRetainTimesByCode(@Param("list") List<String> vCodes);
}
