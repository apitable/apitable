/**
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

import { Modal } from 'antd';
import Image from 'next/image';
import * as React from 'react';
import { useContext } from 'react';
import { Button, Typography, useThemeColors, ThemeName } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { DATASHEET_VIEW_CONTAINER_ID } from 'pc/components/view/id';
import { useAppSelector } from 'pc/store/react-redux';
import OrgChartCreationLinkDark from 'static/icon/account/architecture_add_link_dark.png';
import OrgChartCreationLinkLight from 'static/icon/account/architecture_add_link_light.png';
import OrgChartCreationNoPermission from 'static/icon/account/org_chart_creation_no_permission.png';
import { FlowContext } from '../../context/flow_context';
import styles from './style.module.less';

interface ICreateFieldModalProps {
  onAdd: () => void;
}

export const CreateFieldModal: React.FC<React.PropsWithChildren<ICreateFieldModalProps>> = (props) => {
  const colors = useThemeColors();
  const { onAdd } = props;
  const {
    permissions: { manageable },
  } = useContext(FlowContext);
  const themeName = useAppSelector((state) => state.theme);
  const OrgChartCreationLink = themeName === ThemeName.Light ? OrgChartCreationLinkLight : OrgChartCreationLinkDark;

  return (
    <Modal
      visible
      title={null}
      closable={false}
      destroyOnClose
      footer={null}
      maskClosable
      width={368}
      centered
      getContainer={() => document.getElementById(DATASHEET_VIEW_CONTAINER_ID)!}
      zIndex={10}
      maskStyle={{ position: 'absolute', zIndex: 10 }}
      wrapClassName={styles.modalWrap}
    >
      <div className={styles.createFieldModal}>
        <div className={styles.banner}>
          <span className={styles.bannerImg}>
            <Image src={manageable ? OrgChartCreationLink : OrgChartCreationNoPermission} alt={'banner'} style={{ borderRadius: 4 }} />
          </span>
        </div>
        <Typography variant="h7" align={'center'}>
          {manageable ? t(Strings.org_chart_init_fields_title) : t(Strings.org_chart_init_fields_no_permission_title)}
        </Typography>
        <Typography variant="body4" className={styles.desc}>
          {manageable ? t(Strings.org_chart_init_fields_desc) : t(Strings.org_chart_init_fields_no_permission_desc)}
        </Typography>
        <Button
          color="primary"
          className={styles.createBtn}
          onClick={onAdd}
          size="middle"
          disabled={!manageable}
          prefixIcon={<AddOutlined size={16} color={colors.staticWhite0} />}
        >
          {t(Strings.org_chart_init_fields_button)}
        </Button>
      </div>
    </Modal>
  );
};
