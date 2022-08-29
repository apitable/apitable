import { FC } from 'react';
import { WecomFilled } from '@vikadata/icons';
import styles from './style.module.less';
import { wecomLogin, wecomQuickLogin } from '../other_login';
import { Strings, t } from '@vikadata/core';
import { useSelector } from 'react-redux';
import { useQuery } from 'pc/hooks';

export const WecomLoginBtn: FC = () => {
  const isWecomDomain = useSelector(state => state.space.envs?.weComEnv?.enabled);
  const query = useQuery();
  return (
    <button className={styles.wecomLoginBtn} onClick={() => {
      isWecomDomain ? wecomLogin() : wecomQuickLogin('snsapi_base', query.get('reference'));
    }}>
      <WecomFilled size={20}/>
      <span>{isWecomDomain ? t(Strings.wecom_login_btn_text) : t(Strings.wecom_login)}</span>
    </button>
  );
};