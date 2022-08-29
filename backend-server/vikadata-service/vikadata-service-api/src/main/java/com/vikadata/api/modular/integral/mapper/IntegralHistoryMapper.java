package com.vikadata.api.modular.integral.mapper;

import java.util.Collection;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.vo.integral.IntegralRecordVO;
import com.vikadata.entity.IntegralHistoryEntity;

/**
 * <p>
 * 积分历史记录 Mapper
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 11:21
 */
public interface IntegralHistoryMapper extends BaseMapper<IntegralHistoryEntity> {

    /**
     * 查找用户最大积分值
     *
     * @param userId 用户ID
     * @return 积分值
     * @author Shawn Deng
     * @date 2020/9/16 15:00
     */
    Integer selectTotalIntegralValueByUserId(@Param("userId") Long userId);

    /**
     * 分页查询积分变更记录
     *
     * @param page   分页请求对象
     * @param userId 用户ID
     * @return 积分变更记录分页结果集
     * @author Shawn Deng
     * @date 2020/9/16 16:08
     */
    IPage<IntegralRecordVO> selectPageByUserId(Page<IntegralRecordVO> page, @Param("userId") Long userId);

    /**
     * 查询指定用户、存在指定键值对的数量
     *
     * @param userId 用户ID
     * @param key    参数key
     * @param val    参数value
     * @return count
     * @author Chambers
     * @date 2020/12/1
     */
    @InterceptorIgnore(illegalSql = "true")
    Integer selectCountByUserIdAndKeyValue(@Param("userId") Long userId, @Param("key") String key, @Param("val") Object val);

    /**
     * 修改参数体
     *
     * @param id        记录ID
     * @param parameter 参数体
     * @return 执行成功条数
     * @author Shawn Deng
     * @date 2020/9/18 17:49
     */
    int updateParameterById(@Param("id") Long id, @Param("parameter") String parameter);

    /**
     * 获取用户参加活动次数
     *
     * @param userId        操作用户
     * @param actionCode    积分动作标识
     * @return 参与次数
     * @author Pengap
     * @date 2021/10/21 10:33:05
     */
    Integer selectCountByUserIdAndActionCode(@Param("userId") Long userId, @Param("actionCode") String actionCode);

    /**
     * 获取用户参加活动次数
     *
     * @param userId        操作用户
     * @param actionCodes    积分动作标识
     * @return 参与次数
     * @author Pengap
     * @date 2021/10/21 10:33:05
     */
    Integer selectCountByUserIdAndActionCodes(@Param("userId") Long userId, @Param("actionCodes") Collection<String> actionCodes);
}
