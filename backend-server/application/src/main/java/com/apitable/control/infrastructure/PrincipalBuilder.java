/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.control.infrastructure;

/**
 * Control Principal Builder.
 *
 * @author Shawn Deng
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

    public static Principal roleId(Long roleId) {
        return new RoleId(roleId);
    }

    /**
     * principal type.
     */
    public interface Principal {

        Long getPrincipal();

        PrincipalType getPrincipalType();
    }

    /**
     * abstract principal.
     */
    private abstract static class AbstractPrincipal implements Principal {

        private final Long principal;

        public AbstractPrincipal(Long principal) {
            this.principal = principal;
        }

        @Override
        public Long getPrincipal() {
            return this.principal;
        }
    }

    /**
     * unit principal.
     */
    public static class UnitId extends AbstractPrincipal {

        public UnitId(Long unitId) {
            super(unitId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.UNIT_ID;
        }
    }

    /**
     * member principal.
     */
    public static class MemberId extends AbstractPrincipal {

        public MemberId(Long memberId) {
            super(memberId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.MEMBER_ID;
        }
    }

    /**
     * team principal.
     */
    public static class TeamId extends AbstractPrincipal {

        public TeamId(Long teamId) {
            super(teamId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.TEAM_ID;
        }
    }

    /**
     * role principal.
     */
    public static class RoleId extends AbstractPrincipal {

        public RoleId(Long roleId) {
            super(roleId);
        }

        @Override
        public PrincipalType getPrincipalType() {
            return PrincipalType.ROLE_ID;
        }
    }
}
