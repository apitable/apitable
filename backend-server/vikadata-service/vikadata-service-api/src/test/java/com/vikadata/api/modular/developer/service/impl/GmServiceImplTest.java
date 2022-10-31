package com.vikadata.api.modular.developer.service.impl;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enums.space.SpaceCertification;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.space.model.vo.SpaceSubscribeVo;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.integration.vika.model.UserContactInfo;

import static com.vikadata.api.enums.exception.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.SpaceException.NOT_SPACE_ADMIN;
import static com.vikadata.api.enums.exception.SpaceException.NO_ALLOW_OPERATE;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_ALREADY_CERTIFIED;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_EXIST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

public class GmServiceImplTest extends AbstractIntegrationTest {

    @Test()
    public void testSocialSpaceSubscription() {
        String spaceId = IdWorker.get32UUID();
        SocialTenantBindEntity socialTenantBindEntity = SocialTenantBindEntity.builder().tenantId("testtenant").spaceId(spaceId).build();
        iSocialTenantBindService.save(socialTenantBindEntity);
        assertThatCode(() -> iGmService.spaceCertification(spaceId, "",
                SpaceCertification.BASIC)).as(NO_ALLOW_OPERATE.getMessage()).isInstanceOf(BusinessException.class);

    }

    @Test()
    public void testSpaceHasSubscribed() {
        String spaceId = IdWorker.get32UUID();
        String uuid = IdWorker.get32UUID();
        Long userId = prepareUserData(uuid);
        prepareSpaceData(spaceId);
        prepareSpaceSubscriptionData(spaceId, userId);
        assertThatCode(() -> iGmService.spaceCertification(spaceId, uuid,
                SpaceCertification.BASIC)).as(SPACE_ALREADY_CERTIFIED.getMessage()).isInstanceOf(BusinessException.class);

    }

    @Test()
    public void testSpaceSubscribedUserNotExists() {
        assertThatCode(() -> iGmService.spaceCertification("", "",
                SpaceCertification.BASIC)).as(USER_NOT_EXIST.getMessage()).isInstanceOf(BusinessException.class);
    }

    @Test()
    public void testSpaceSubscribedMemberNotExists() {
        String spaceId = IdWorker.get32UUID();
        String uuid = IdWorker.get32UUID();
        prepareUserData(uuid);
        assertThatCode(() -> iGmService.spaceCertification(spaceId, uuid,
                SpaceCertification.BASIC)).as(MEMBER_NOT_IN_SPACE.getMessage()).isInstanceOf(BusinessException.class);
    }

    @Test()
    public void testSpaceSubscribedMemberNotAdmin() {
        String spaceId = IdWorker.get32UUID();
        String uuid = IdWorker.get32UUID();
        Long userId = prepareUserData(uuid);
        prepareSpaceMemberData(spaceId, userId);
        assertThatCode(() -> iGmService.spaceCertification(spaceId, uuid,
                SpaceCertification.BASIC)).as(NOT_SPACE_ADMIN.getMessage()).isInstanceOf(BusinessException.class);
    }

    @Test()
    public void testSpaceSubscriptionSuccessFeature() {
        String spaceId = IdWorker.get32UUID();
        String uuid = IdWorker.get32UUID();
        Long userId = prepareUserData(uuid);
        Long memberId = prepareSpaceMemberData(spaceId, userId);
        prepareSpaceDataWithOwner(spaceId, memberId);
        iGmService.spaceCertification(spaceId, uuid, SpaceCertification.BASIC);
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        assertThat(SpaceCertification.BASIC.getLevel()).isEqualTo(feature.getCertification());
    }

    @Test()
    public void testSpaceSubscriptionSuccessCapacity() {
        String spaceId = IdWorker.get32UUID();
        String uuid = IdWorker.get32UUID();
        Long userId = prepareUserData(uuid);
        Long memberId = prepareSpaceMemberData(spaceId, userId);
        prepareSpaceDataWithOwner(spaceId, memberId);
        SpaceSubscribeVo beforeSubscribe = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        iGmService.spaceCertification(spaceId, uuid, SpaceCertification.BASIC);
        SpaceSubscribeVo afterSubscribe = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        assertThat(5 * 1024 * 1024 * 1024L).isEqualTo(afterSubscribe.getMaxCapacitySizeInBytes() - beforeSubscribe.getMaxCapacitySizeInBytes());
    }

    @Test
    public void testGetUserPhoneAndEmailByUserIdThatUserIsExist(){
        // init user
        UserEntity user = UserEntity.builder().uuid("1").code("+86").mobilePhone("12312312312")
                .email("test@vikadata.com").build();
        iUserService.save(user);
        UserContactInfo userContactInfo = new UserContactInfo();
        userContactInfo.setRecordId("1");
        userContactInfo.setUuid("1");
        List<UserContactInfo> userContactInfos = CollUtil.newArrayList(userContactInfo);
        iGmService.getUserPhoneAndEmailByUserId(userContactInfos);
        assertThat(userContactInfos.get(0).getCode()).isEqualTo("+86");
        assertThat(userContactInfos.get(0).getMobilePhone()).isEqualTo("12312312312");
        assertThat(userContactInfos.get(0).getEmail()).isEqualTo("test@vikadata.com");
    }

    @Test
    public void testGetUserPhoneAndEmailByUserIdThatUserIsNotBindMobilePhone(){
        // init user
        UserEntity user = UserEntity.builder().uuid("1").email("test@vikadata.com").build();
        iUserService.save(user);
        UserContactInfo userContactInfo = new UserContactInfo();
        userContactInfo.setRecordId("1");
        userContactInfo.setUuid("1");
        List<UserContactInfo> userContactInfos = CollUtil.newArrayList(userContactInfo);
        iGmService.getUserPhoneAndEmailByUserId(userContactInfos);
        assertThat(userContactInfos.get(0).getCode()).isEqualTo("USER NOT BIND PHONE");
        assertThat(userContactInfos.get(0).getMobilePhone()).isEqualTo("USER NOT BIND PHONE");
        assertThat(userContactInfos.get(0).getEmail()).isEqualTo("test@vikadata.com");
    }

    @Test
    public void testGetUserPhoneAndEmailByUserIdThatUserIsNotBindEmail(){
        // init user
        UserEntity user = UserEntity.builder().uuid("1").code("+86").mobilePhone("12312312312").build();
        iUserService.save(user);
        UserContactInfo userContactInfo = new UserContactInfo();
        userContactInfo.setRecordId("1");
        userContactInfo.setUuid("1");
        List<UserContactInfo> userContactInfos = CollUtil.newArrayList(userContactInfo);
        iGmService.getUserPhoneAndEmailByUserId(userContactInfos);
        assertThat(userContactInfos.get(0).getCode()).isEqualTo("+86");
        assertThat(userContactInfos.get(0).getMobilePhone()).isEqualTo("12312312312");
        assertThat(userContactInfos.get(0).getEmail()).isEqualTo("USER NOT BIND EMAIL");
    }

    @Test
    public void testGetUserPhoneAndEmailByUserIdThatUserIsNotExist(){
        // init user
        UserEntity user = UserEntity.builder().id(1L).build();
        iUserService.save(user);
        UserContactInfo userContactInfo = new UserContactInfo();
        userContactInfo.setRecordId("1");
        userContactInfo.setUuid("1");
        List<UserContactInfo> userContactInfos = CollUtil.newArrayList(userContactInfo);
        iGmService.getUserPhoneAndEmailByUserId(userContactInfos);
        assertThat(userContactInfos.get(0).getCode()).isEqualTo("USER NOT BIND PHONE");
        assertThat(userContactInfos.get(0).getMobilePhone()).isEqualTo("USER NOT BIND PHONE");
        assertThat(userContactInfos.get(0).getEmail()).isEqualTo("USER NOT BIND EMAIL");
    }

    private void prepareSpaceSubscriptionData(String spaceId, Long userId) {
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().certification(SpaceCertification.BASIC.getLevel()).build();
        iSpaceService.switchSpacePros(userId, spaceId, feature);
    }

    private Long prepareUserData(String uuid) {
        // initialize user
        UserEntity userEntity = UserEntity.builder().id(IdWorker.getId()).uuid(uuid).build();
        iUserService.save(userEntity);
        return userEntity.getId();
    }


    private void prepareSpaceData(String spaceId) {
        // initialize spatial information
        SpaceEntity spaceEntity = SpaceEntity.builder().spaceId(spaceId).name("测试空间站").build();
        iSpaceService.save(spaceEntity);
    }

    private Long prepareSpaceMemberData(String spaceId, Long userId) {
        // initialize member information
        MemberEntity memberEntity = MemberEntity.builder().userId(userId).spaceId(spaceId).build();
        iMemberService.save(memberEntity);
        return memberEntity.getId();
    }

    private void prepareSpaceDataWithOwner(String spaceId, Long memberId) {
        // initialize spatial information
        SpaceEntity spaceEntity = SpaceEntity.builder().spaceId(spaceId).name("测试空间站").owner(memberId).build();
        iSpaceService.save(spaceEntity);
    }
}
