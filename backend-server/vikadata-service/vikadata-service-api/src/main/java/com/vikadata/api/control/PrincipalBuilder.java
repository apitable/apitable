package com.vikadata.api.control;

/**
 * 资源控制凭证构造器
 * @author Shawn Deng
 * @date 2021-03-18 11:18:27
 */
public class PrincipalBuilder {

    public static Principal unitId(Long unitId) {
        return new UnitId(unitId);
    }

    public static Principal memberId(Long memberId) {
        return new MemberId(memberId);
    }

    public static Principal teamId(Long teamId) {
        return new TeamId(teamId);
    }

    public static Principal tagId(Long tagId) {
        return new TagId(tagId);
    }

    public interface Principal {

        Long getPrincipal();

        PrincipalType getPrincipalType();
    }

    private static abstract class AbstractPrincipal implements Principal {

        private final Long principal;

        public AbstractPrincipal(Long principal) {
            this.principal = principal;
        }

        @Override
        public Long getPrincipal() {
            return this.principal;
        }
    }

    public static class UnitId extends AbstractPrincipal {

        public UnitId(Long unitId) {
            super(unitId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.UNIT_ID;
        }
    }

    public static class MemberId extends AbstractPrincipal {

        public MemberId(Long memberId) {
            super(memberId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.MEMBER_ID;
        }
    }

    public static class TeamId extends AbstractPrincipal {

        public TeamId(Long teamId) {
            super(teamId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.TEAM_ID;
        }
    }

    public static class TagId extends AbstractPrincipal {

        public TagId(Long tagId) {
            super(tagId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.TAG_ID;
        }
    }
}
