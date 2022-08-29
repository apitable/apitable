package com.vikadata.api.modular.user.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.cache.bean.AccountLinkDto;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.entity.UserLinkEntity;

/**
 * <p>
 * 基础-帐号关联表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2020-02-22
 */
public interface UserLinkMapper extends BaseMapper<UserLinkEntity> {

    /**
     * 查询用户ID
     *
     * @param unionId unionId
     * @param type    关联类型
     * @return userId
     * @author Chambers
     * @date 2020/8/11
     */
    Long selectUserIdByUnionIdAndType(@Param("unionId") String unionId, @Param("type") Integer type);

    /**
     * 查询 unionId
     *
     * @param userId 用户ID
     * @param type   关联类型
     * @return unionId
     * @author Chambers
     * @date 2020/8/26
     */
    String selectUnionIdByUserIdAndType(@Param("userId") Long userId, @Param("type") Integer type);

    /**
     * 更新微信关联的昵称和union_id
     *
     * @param nickName nickName
     * @param unionId  unionId
     * @param openId   openId
     * @return 修改数
     * @author Chambers
     * @date 2020/2/25
     */
    int updateNickNameAndUnionIdByOpenId(@Param("nickName") String nickName, @Param("unionId") String unionId, @Param("openId") String openId, @Param("type") Integer type);

    /**
     * 获取帐号关联第三方信息
     *
     * @param userId 用户ID
     * @return UserLinkVo
     * @author Chambers
     * @date 2020/2/28
     */
    List<AccountLinkDto> selectVoByUserId(@Param("userId") Long userId);

    /**
     * 解除帐号关联第三方绑定
     *
     * @param userId 用户ID
     * @param type   第三方类型
     * @return 删除数
     * @author Chambers
     * @date 2020/3/5
     */
    int deleteByUserIdAndType(@Param("userId") Long userId, @Param("type") Integer type);

    /**
     * 解除帐号关联第三方绑定
     *
     * @param userId 用户ID
     * @return 删除数
     */
    int deleteByUserId(@Param("userId") Long userId);

    /**
     * 批量删除记录
     *
     * @param unionIds 第三方平台用户标识
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2020/12/15 10:16
     */
    int deleteByUnionIds(@Param("unionIds") List<String> unionIds);

    /**
     * 根据unionId和openId获取维格用户ID
     *
     * @param unionId 第三方平台用户唯一标识
     * @param openId 第三方平台用户标识
     * @param type 第三方平台类型
     * @return 用户ID
     * @author zoe zheng
     * @date 2021/5/17 2:40 下午
     */
    Long selectUserIdByUnionIdAndOpenIdAndType(@Param("unionId") String unionId, @Param("openId") String openId,
            @Param("type") LinkType type);

    /**
     * 根据openId批量删除
     *
     * @param openIds 开放应用内的唯一标识
     * @param type 第三方类型
     * @return 删除数量
     * @author zoe zheng
     * @date 2021/5/20 5:05 下午
     */
    int deleteByOpenIds(@Param("openIds") List<String> openIds, @Param("type") int type);
}
