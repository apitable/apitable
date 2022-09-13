package com.vikadata.api.modular.user.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.modular.space.model.InviteUserInfo;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.cursor.Cursor;

import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.define.dtos.UserInPausedDto;
import com.vikadata.entity.UserEntity;

/**
 * <p>
 * 用户表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-16
 */
public interface UserMapper extends BaseMapper<UserEntity> {

    /**
     * 根据ID查询用户名称
     *
     * @param userId ID主键
     * @return 用户名称
     * @author Shawn Deng
     * @date 2020/3/30 20:22
     */
    String selectUserNameById(@Param("userId") Long userId);

    /**
     * 查询邮箱
     *
     * @param userId 用户ID
     * @return email
     * @author Chambers
     * @date 2020/9/25
     */
    String selectEmailById(@Param("userId") Long userId);

    /**
     * 通过手机号码获取用户ID
     *
     * @param mobilePhone 手机号码
     * @return 用户ID
     */
    Long selectIdByMobile(@Param("mobilePhone") String mobilePhone);

    /**
     * 通过邮箱地址获取用户ID
     *
     * @param email 邮箱地址
     * @return 用户ID
     */
    Long selectIdByEmail(@Param("email") String email);

    /**
     * 通过手机号码获取用户
     *
     * @param mobilePhone 手机号码
     * @return 用户ID
     */
    UserEntity selectByMobile(@Param("mobilePhone") String mobilePhone);

    /**
     * 通过手机号码批量查询用户
     *
     * @param mobilePhones  手机号码列表
     * @return UserEntities
     * @author Chambers
     * @date 2022/6/27
     */
    List<UserEntity> selectByMobilePhoneIn(@Param("mobilePhones") Collection<String> mobilePhones);

    /**
     * 根据邮箱地址查询用户
     *
     * @param email 邮箱地址
     * @return 用户
     * @author Shawn Deng
     * @date 2019/12/27 16:12
     */
    UserEntity selectByEmail(@Param("email") String email);

    /**
     * 根据邮箱地址查询数量
     *
     * @param email 邮箱
     * @return count
     * @author Chambers
     * @date 2020/8/28
     */
    Integer selectCountByEmail(@Param("email") String email);

    /**
     * 根据邮箱地址，批量查询用户
     *
     * @param emails 邮箱列表
     * @return entities
     * @author Chambers
     * @date 2020/7/24
     */
    List<UserEntity> selectByEmails(@Param("emails") Collection<String> emails);

    /**
     * 根据uuid查询userId
     *
     * @param uuid 外部系统ID
     * @return 用户的ID
     * @author zoe zheng
     * @date 2020/6/8 12:22 下午
     */
    Long selectIdByUuid(@Param("uuid") String uuid);

    /**
     * 根据uuid查询userId
     *
     * @param uuidList users的uuid列
     * @return 用户的ID
     * @author zoe zheng
     * @date 2020/6/8 12:22 下午
     */
    List<Long> selectIdByUuidList(@Param("uuidList") List<String> uuidList);

    /**
     * 根据userId查询uuid
     *
     * @param id 表ID
     * @return uuid
     * @author zoe zheng
     * @date 2020/6/8 12:47 下午
     */
    String selectUuidById(@Param("id") Long id);

    /**
     * 根据用户ID查询
     *
     * @param userIds 用户ID
     * @return List<UserEntity>
     * @author zoe zheng
     * @date 2020/10/13 11:51 上午
     */
    List<UserEntity> selectByIds(@Param("userIds") List<Long> userIds);

    /**
     * query userEntity by uuid
     *
     * @param uuids user's uuid
     * @return List<UserEntity>
     * @author liuzijing
     * @date 2022/9/8
     */
    List<UserEntity> selectByUuIds(@Param("uuids") List<String> uuids);

    /**
     * todo 希望添加created_at为索引，然后数据量多的时候根据时间进行分区
     * 游标查询当前时间的所有用户ID
     *
     * @param ignoreDelete 忽略删除
     * @return Cursor<Long>
     * @author zoe zheng
     * @date 2021/3/5 6:51 下午
     */
    @InterceptorIgnore(illegalSql = "true")
    Cursor<Long> selectAllUserIdByIgnoreDelete(@Param("ignoreDelete") boolean ignoreDelete);

    /**
     * 修改用户手机号
     *
     * @param userId        用户Id
     * @return 影响行数
     * @author Pengap
     * @date 2021/10/20 20:06:19
     */
    int resetMobileByUserId(@Param("userId") Long userId);

    /**
     * 修改用户邮箱
     *
     * @param userId        用户Id
     * @return 影响行数
     * @author Pengap
     * @date 2021/10/20 20:06:19
     */
    int resetEmailByUserId(@Param("userId") Long userId);

    /**
     * 重置用户信息
     * 重置字段：code、mobile、email、is_deleted
     *
     * @param userId 用户ID
     * @return 受影响记录行数
     * */
    int resetUserById(@Param("userId") Long userId);

    /**
     * 批量查询成员邮箱
     *
     * @param userIds 用户ID集合
     * @return 邮件地址列表
     * @author Pengap
     * @date 2021/11/9 17:18:33
     */
    List<String> selectEmailByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * <p>
     *     根据邮件查询用户id和设置的语言。<br/>
     *     方法使用IN批量查询，数据过多时注意分批查找。<br/>
     *     若locale为空，将设置为defaultLocale。<br/>
     *     <strong>
     *         注意：sql语句IFNULL带有方言性，即项目连接非mysql数据库可能出错。
     *     </strong>
     * </p>
     *
     * @param defaultLocale 默认的语言
     * @param emails 查找的email列表
     * @return email、id、locale列表
     * @author wuyitao
     * @date 2022/01/25
     */
    List<UserLangDTO> selectLocaleInEmailsWithDefaultLocale(@Param("defaultLocale") String defaultLocale, @Param("emails") List<String> emails);

    /**
     * 根据邮件查询用户id和设置的语言。<br/>
     *
     * @param email 查找的email
     * @return email、id、locale
     * @author wuyitao
     * @date 2022/01/21
     */
    UserLangDTO selectLocaleByEmail(@Param("email") String email);

    /**
     * <p>
     *     根据邮件查询用户id和设置的语言。<br/>
     *     若locale为空，将设置为defaultLocale。<br/>
     *     <strong>
     *         注意：sql语句IFNULL带有方言性，即项目连接非mysql数据库可能出错。
     *     </strong>
     * </p>
     *
     * @param defaultLocale 默认的语言
     * @param email 查找的email
     * @return email、id、locale
     * @author wuyitao
     * @date 2022/01/25
     */
    UserLangDTO selectLocaleByEmailWithDefaultLocale(@Param("defaultLocale") String defaultLocale, @Param("email") String email);

    /**
     * 根据userId查询用户语言
     *
     * @param ids userId
     * @return List<UserLangDTO>
     * @author zoe zheng
     * @date 2022/2/24 11:46
     */
    List<UserLangDTO> selectLocaleAndEmailByIds(@Param("ids") List<Long> ids);

    /**
     * 批量获取冷静期账号信息
     * @param userIds 用户Id集合
     * @return UserInPausedDto List
     */
    List<UserInPausedDto> selectPausedUsers(@Param("ids") List<Long> userIds);

    /**
     * 根据用户Id获取邀请用户信息
     *
     * @param userId 用户ID
     * @return inviteUserInfo 邀请用户信息
     * @author liuzijing
     * @date 2022/8/23
     */
    InviteUserInfo selectInviteUserInfoByUserId(@Param("userId") Long userId);
}
