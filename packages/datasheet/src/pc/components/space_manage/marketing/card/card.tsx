import { Button, Typography } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import * as React from 'react';
import { useContext, useState } from 'react';
import { MarketingContext } from '../context';
import { AppStatus, IStoreApp } from '../interface';
import style from '../style.module.less';
import { AppModal } from './app_modal';

interface ICard extends IStoreApp {
  openStatus: AppStatus;
}

export const Card: React.FC<ICard> = props => {
  const { openStatus, logoUrl, name, intro } = props;
  const { onSetRefresh } = useContext(MarketingContext);
  const [modalVisible, setModalVisible] = useState(false);

  const isOpen = openStatus === AppStatus.Open;
  const btnText = isOpen ? 'social_open_card_btn_text'
    : 'marketplace_integration_btncard_appsbtntext_read_more';

  const handleRefresh = () => {
    onSetRefresh((val) => !val);
  };

  return (
    <>
      <div className={style.card}>
        <div className={style.top}>
          <div className={style.icon}>
            <img src={logoUrl} width={46} height={46} alt={''} />
          </div>
          <Typography variant='h6'>
            {name}
          </Typography>
        </div>

        <div className={style.middle}>
          <p>{intro}</p>
        </div>

        <div className={style.bottom}>
          <Button
            style={{ fontSize: 12 }}
            color='primary'
            variant={isOpen ? 'jelly' : undefined}
            block
            onClick={() => {
              setModalVisible(true);
            }}
            size='small'
          >
            <span>{t(Strings[btnText])}</span>
          </Button>
        </div>
      </div>

      {modalVisible && <AppModal onRefresh={handleRefresh} onClose={() => setModalVisible(false)} {...props} />}
    </>
  );
};
