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

package com.apitable.base.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.asset.vo.AssetsAuditVo;
import com.apitable.asset.mapper.AssetAuditMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class AssetAuditMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    AssetAuditMapper assetAuditMapper;

    @Test
    @Sql("/sql/asset-audit-data.sql")
    public void testGetArtificialAssetsAuditList() {
        IPage<AssetsAuditVo> artificialAssetsAuditList = assetAuditMapper.getArtificialAssetsAuditList(new Page<>());
        assertThat(artificialAssetsAuditList).isNotNull();
        assertThat(artificialAssetsAuditList.getSize()).isEqualTo(5L);
    }

}
