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

import { getEnvVariables } from 'pc/utils/env';
import { Block } from '../components';
import { ILayoutProps } from '../interface';
import { useCards } from './cards';

import styles from './style.module.less';

export const Xs = (props: ILayoutProps) => {
  const {
    AdCard,
    AutomationCard,
    CapacityCard,
    ApiCard,
    FileCard,
    RecordCard,
    MemberCard,
    ViewsCard,
    OthersCard,
    InfoCard,
    LevelCard,
    CreditCard,
    CreditCostCard,
  } = useCards(props);

  return (
    <div className={styles.lg}>
      <Block isWrap vertical style={{ overflow: 'hidden' }}>
        <Block flex={43}>
          <InfoCard minHeight={476} />
        </Block>
        <Block flex={16}>
          <LevelCard minHeight={200} />
        </Block>
        <Block flex={16}>
          <MemberCard minHeight={200} />
        </Block>
        <Block flex={27}>
          <CapacityCard />
        </Block>
        <Block flex={27}>
          <FileCard />
        </Block>
        <Block flex={27}>
          <CreditCard minHeight={372} />
        </Block>
        <Block flex={27}>
          <CreditCostCard minHeight={372} />
        </Block>
        <Block flex={27}>
          <AutomationCard minHeight={372} />
        </Block>
        <Block flex={27}>
          <RecordCard />
        </Block>
        <Block flex={27}>
          <ApiCard />
        </Block>
        <Block flex={27}>
          <ViewsCard />
        </Block>
        <Block flex={27}>
          <OthersCard />
        </Block>
        {!getEnvVariables().IS_APITABLE && (
          <Block flex={27}>
            <AdCard />
          </Block>
        )}
      </Block>
    </div>
  );
};
