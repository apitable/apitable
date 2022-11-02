package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SpaceInviteRecordEntity;
import org.apache.ibatis.annotations.Param;

import java.util.Collection;
import java.util.List;

public interface SpaceInviteRecordMapper extends BaseMapper<SpaceInviteRecordEntity> {

    /**
     * All the specified invitation email links in the spaces have expired
     *
     * @param spaceIds space ids
     * @param email    email
     * @return affected rows
     */
    int expireBySpaceIdAndEmail(@Param("spaceIds") List<String> spaceIds, @Param("email") String email);

    /**
     * All the specified invitation email links in the space have expired
     *
     * @param spaceId space id
     * @param emails  emails
     * @return affected rows
     */
    int expireBySpaceIdAndEmails(@Param("spaceId") String spaceId, @Param("emails") Collection<String> emails);

    /**
     * @param inviteToken invite unique token
     * @return invite records
     */
    SpaceInviteRecordEntity selectByInviteToken(@Param("inviteToken") String inviteToken);


}
