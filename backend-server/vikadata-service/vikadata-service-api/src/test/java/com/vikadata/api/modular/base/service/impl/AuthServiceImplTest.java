package com.vikadata.api.modular.base.service.impl;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.entity.SpaceEntity;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.EmailCodeType;
import com.vikadata.api.enums.action.LoginType;
import com.vikadata.api.enums.action.SmsCodeType;
import com.vikadata.api.model.ro.user.LoginRo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.security.CodeValidateScope;
import com.vikadata.api.security.ValidateCodeProcessor;
import com.vikadata.api.security.ValidateCodeProcessorManage;
import com.vikadata.api.security.ValidateCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatNoException;

/**
 * 授权服务测试
 * @author Shawn Deng
 * @date 2022-04-09 00:23:25
 */
public class AuthServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private SpaceMapper spaceMapper;

    @Test
    public void testLoginUsingPasswordWithMobilePhoneNotExist() {
        // 手机号不存在尝试登录，不自动注册
        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode("+86");
        loginRo.setUsername("13631619061");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithMobilePhoneWithoutPassword() {
        // 手机号但是密码错误尝试登录，不自动注册
        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode("+86");
        loginRo.setUsername("13631619061");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithMobilePhoneInputPasswordCorrect() {
        // 手机号和密码正确尝试登录
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setCode("+86");
        user.setMobilePhone("13631619061");
        user.setPassword(passwordEncoder.encode("qwer1234"));
        iUserService.save(user);

        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode("+86");
        loginRo.setUsername("13631619061");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingPassword(loginRo));
    }

    @Test
    public void testLoginUsingPasswordWithEmailNotExist() {
        // 手机号不存在尝试登录，不自动注册
        LoginRo loginRo = new LoginRo();
        loginRo.setUsername("dengguiheng@vikadat.com");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithEmailWithoutPassword() {
        // 手机号但是密码错误尝试登录，不自动注册
        LoginRo loginRo = new LoginRo();
        loginRo.setUsername("dengguiheng@vikadat.com");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithEmailInputPasswordCorrect() {
        // 手机号和密码正确尝试登录
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setEmail("dengguiheng@vikadat.com");
        user.setPassword(passwordEncoder.encode("qwer1234"));
        iUserService.save(user);

        LoginRo loginRo = new LoginRo();
        loginRo.setUsername("dengguiheng@vikadat.com");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingPassword(loginRo));
    }

    @Test
    public void testLoginUsingSmsCodeWithMobilePhoneNotExistAutoRegister() {
        String areaCode = "+86";
        String mobile = "13631619061";
        // 准备验证码
        String validCode = sendLoginSmsCode(areaCode, mobile);

        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode(areaCode);
        loginRo.setUsername(mobile);
        loginRo.setType(LoginType.SMS_CODE);
        loginRo.setCredential(validCode);
        loginRo.setSpaceId("spc123");

        AtomicReference<Long> userId = new AtomicReference<>();

        assertThatNoException().isThrownBy(() -> userId.set(iAuthService.loginUsingSmsCode(loginRo).getUserId()));

        checkUserHasSpace(userId.get());
    }

    @Test
    public void testLoginUsingSmsCodeWithMobilePhoneExistAutoLogin() {
        // 准备用户
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setCode("+86");
        user.setMobilePhone("13631619061");
        iUserService.save(user);

        String areaCode = "+86";
        String mobile = "13631619061";
        // 准备验证码
        String validCode = sendLoginSmsCode(areaCode, mobile);

        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode(areaCode);
        loginRo.setUsername(mobile);
        loginRo.setType(LoginType.SMS_CODE);
        loginRo.setCredential(validCode);

        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingSmsCode(loginRo));
    }

    @Test
    public void testLoginUsingEmailCodeWithEmailNotExistAutoRegister() {
        String email = "dengguiheng@vikadata.com";
        // 准备验证码
        String validCode = sendLoginEmailCode(email);

        LoginRo loginRo = new LoginRo();
        loginRo.setUsername(email);
        loginRo.setType(LoginType.EMAIL_CODE);
        loginRo.setCredential(validCode);
        loginRo.setSpaceId("spc123");

        AtomicReference<Long> userId = new AtomicReference<>();

        assertThatNoException().isThrownBy(() -> userId.set(iAuthService.loginUsingEmailCode(loginRo).getUserId()));

        checkUserHasSpace(userId.get());
    }

    @Test
    public void testLoginUsingEmailCodeWithEmailExistAutoLogin() {
        String email = "dengguiheng@vikadata.com";
        // 准备用户
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setEmail(email);
        iUserService.save(user);

        // 准备验证码
        String validCode = sendLoginEmailCode(email);

        LoginRo loginRo = new LoginRo();
        loginRo.setUsername(email);
        loginRo.setType(LoginType.EMAIL_CODE);
        loginRo.setCredential(validCode);

        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingEmailCode(loginRo));
    }

    @Test
    public void testCheckSpaceRewardCapacity(){
        // 第一条数据
        MemberDto firstMemberDto = new MemberDto();
        firstMemberDto.setId(123L);
        firstMemberDto.setSpaceId("spc123");
        firstMemberDto.setMemberName("firstUser");
        // 第二条数据
        MemberDto secondMemberDto = new MemberDto();
        secondMemberDto.setId(456L);
        secondMemberDto.setSpaceId("spc456");
        secondMemberDto.setMemberName("secondUSer");
        List<MemberDto> inactiveMembers = CollUtil.newArrayList(firstMemberDto, secondMemberDto);
        SpaceEntity space = SpaceEntity.builder()
            .id(IdWorker.getId())
            .spaceId("spc456")
            .name("测试空间")
            .build();
        spaceMapper.insert(space);
        // 匹配空间站，发放奖励
        iAuthService.checkSpaceRewardCapacity(inactiveMembers, "spc456");
        // 查询奖励记录
        Long number = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity("spc456");
        assertThat(number).isEqualTo(314572800);
    }

    private String sendLoginSmsCode(String areaCode, String mobile) {
        CodeValidateScope scope = CodeValidateScope.fromName(SmsCodeType.fromName(2).name());
        ValidateTarget target = ValidateTarget.create(mobile, areaCode);
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        return processor.createAndSend(target, scope, false);
    }

    private String sendLoginEmailCode(String email) {
        CodeValidateScope scope = CodeValidateScope.fromName(EmailCodeType.fromName(2).name());
        ValidateTarget target = ValidateTarget.create(email);
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        return processor.createAndSend(target, scope, false);
    }

    private void checkUserHasSpace(Long userId) {
        int count = iMemberService.getSpaceCountByUserId(userId);
        assertThat(count).isNotEqualTo(0).isGreaterThan(0);
        SessionContext.setUserId(userId);
        checkNewUseInfo(userId);
    }

    private void checkNewUseInfo(Long userId) {
        UserInfoVo userInfoVo = iUserService.getCurrentUserInfo(userId, null, false);
        assertThat(userInfoVo).isNotNull();
        assertThat(userInfoVo.getUserId()).isNotNull();
        assertThat(userInfoVo.getUuid()).isNotNull();
        assertThat(userInfoVo.getNickName()).isNotBlank();
        assertThat(userInfoVo.getAvatar()).isNotBlank();
        assertThat(userInfoVo.getSpaceId()).isNotBlank();
        assertThat(userInfoVo.getMemberId()).isNotNull();
        assertThat(userInfoVo.getMemberName()).isNotBlank();
        assertThat(userInfoVo.getUnitId()).isNotNull();
        assertThat(userInfoVo.getInviteCode()).isNotBlank();
        assertThat(userInfoVo.getIsNewComer()).isTrue();
        assertThat(userInfoVo.getIsNickNameModified()).isTrue();
        assertThat(userInfoVo.getIsMemberNameModified()).isTrue();
        assertThat(userInfoVo.getUsedInviteReward()).isFalse();
    }
}
