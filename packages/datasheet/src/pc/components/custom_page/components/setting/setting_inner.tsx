import { useAtom } from 'jotai';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { P, match } from 'ts-pattern';
import { Button, LinkButton, Message, TextInput, ThemeName, Typography, useThemeColors } from '@apitable/components';
import { StoreActions, Strings, t } from '@apitable/core';
import { useCatalogTreeRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { getConfig } from '../../config/config';
import { CustomPageAtom } from '../../store/custon_page_desc_atom';
import { convertBilibiliUrl, convertFigmaUrl, convertYoutubeUrl } from '../../utils/convert-url';

function isValidUrl(url: string) {
  try {
    const newURL = new URL(url);
    return newURL.protocol === 'http:' || newURL.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

interface ISettingInnerProps {
  onClose: () => void;
  isMobile?: boolean;
}

const Icon = ({ item, size = 36 }) => {
  const themeName = useAppSelector((state) => state.theme);
  const isLight = themeName === ThemeName.Light;

  return (
    <>
      {match(item.icon)
        .with({ dark: P.string, light: P.string }, () => {
          return isLight ? (
            <img src={item.icon.light} alt="" width={size} height={size} />
          ) : (
            <img src={item.icon.dark} alt="" width={size} height={size} />
          );
        })
        .with(P.string, () => <img src={item.icon} alt="" width={size} height={size} />)
        .otherwise(() => {
          return React.createElement(item.icon, { size: size });
        })}
    </>
  );
};

export const SettingInner: React.FC<ISettingInnerProps> = ({ onClose, isMobile }) => {
  const colors = useThemeColors();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeConfig = getConfig()[activeTabIndex];
  const { customPageId } = useAppSelector((state) => state.pageParams);

  const [embedPage, setEmbedPage] = useAtom(CustomPageAtom);
  const { updateNodeReq } = useCatalogTreeRequest();
  const dispatch = useDispatch();

  const checkInputValue = (val: string) => {
    if (!isValidUrl(val)) {
      return t(Strings.embed_page_url_invalid);
    }
    return true;
  };

  const onSubmit = async ({ url }) => {
    try {
      const data = await updateNodeReq(customPageId!, {
        embedPage: {
          url,
        },
      });
      setEmbedPage((pre) => ({
        ...pre,
        url: data?.extra ? JSON.parse(data?.extra).embedPage.url : '',
      }));
      dispatch(StoreActions.updateTreeNodesMap(customPageId!, { extra: JSON.stringify({ embedPage: { url } }) }));
      Message.success({
        content: t(Strings.embed_success),
      });
      onClose();
    } catch (error) {
      Message.error({
        content: error.message,
      });
      return;
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<{ url: string }>({ mode: 'onChange', defaultValues: { url: embedPage?.url } });

  const isDisabledSubmit = useMemo(() => {
    if (!isValid) {
      return true;
    }
    if (!isDirty) {
      return true;
    }
    return false;
  }, [isDirty, isValid]);

  const onPaster = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // 阻止默认的粘贴行为
    e.preventDefault();

    // 获取粘贴的内容
    const pastedData = e.clipboardData.getData('text');

    if (!isValidUrl(pastedData)) {
      document.execCommand('insertText', false, pastedData);
      return;
    }

    if (
      pastedData.includes('youtube') &&
      (activeConfig.name === t(Strings.embed_link_youtube) || activeConfig.name === t(Strings.embed_link_default))
    ) {
      document.execCommand('insertText', false, convertYoutubeUrl(pastedData));
      return;
    }

    if (pastedData.includes('figma') && (activeConfig.name === t(Strings.embed_link_figma) || activeConfig.name === t(Strings.embed_link_default))) {
      document.execCommand('insertText', false, convertFigmaUrl(pastedData));
      return;
    }

    if (
      pastedData.includes('bilibili') &&
      (activeConfig.name === t(Strings.embed_link_bilibili) || activeConfig.name === t(Strings.embed_link_default))
    ) {
      document.execCommand('insertText', false, convertBilibiliUrl(pastedData));
      return;
    }

    document.execCommand('insertText', false, pastedData);
  };

  return (
    <div className="vk-text-white vk-rounded-lg vk-h-full vk-relative" style={{ backgroundColor: colors.bgCommonDefault }}>
      <Typography variant="body4" color={colors.textCommonTertiary}>
        {t(Strings.embed_page_function_desc, { edition: getEnvVariables().IS_AITABLE ? 'AITable' : t(Strings.vikadata) })}
      </Typography>
      <div className="vk-grid vk-mt-4 vk-gap-2 vk-grid-cols-5">
        {getConfig().map((item, index) => {
          return (
            <div
              className="vk-flex vk-flex-col	vk-h-[86px] vk-justify-around vk-items-center vk-py-[10px]  vk-rounded vk-cursor-pointer vk-border-2 hover:vk-bg-bgCommonHigh"
              style={{
                border: `1px solid ${colors.borderCommonDefault}`,
                borderColor: activeTabIndex === index ? colors.primaryColor : colors.borderCommonDefault,
              }}
              key={item.name}
              onClick={() => setActiveTabIndex(index)}
            >
              <Icon item={item} />
              <Typography variant="body4" color={colors.textCommonTertiary}>
                {item.name}
              </Typography>
            </div>
          );
        })}
      </div>
      <Typography variant="body4" color={colors.textCommonTertiary} className={'!vk-mt-2'}>
        {activeConfig.desc}
        <LinkButton href={activeConfig.linkUrl} className={'!vk-text-[12px] [&>span]:vk-text-[12px] !vk-inline'} target={'_blank'} rel="noreferrer">
          {activeConfig.linkText}
        </LinkButton>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="vk-mt-6">
          <div className={'vk-flex vk-mb-1 vk-items-center vk-space-x-1'}>
            <Icon item={activeConfig} size={16} />
            <Typography variant="h7" color={colors.textCommonPrimary} className={''}>
              {activeConfig.tip}
            </Typography>
          </div>

          <Controller
            name="url"
            rules={{ validate: checkInputValue }}
            control={control}
            render={({ field }) => <TextInput block {...field} onPaste={onPaster} />}
          />
          {errors.url && (
            <Typography variant="body4" color={colors.textDangerDefault} className={'!vk-mt-1'}>
              {errors.url.message}
            </Typography>
          )}
        </div>
        {isMobile ? (
          <div className={'vk-absolute vk-bottom-0 vk-w-full'}>
            <Button color="primary" type="submit" disabled={isDisabledSubmit} block>
              {t(Strings.save)}
            </Button>
          </div>
        ) : (
          <div className="vk-flex vk-justify-end vk-mt-4 vk-space-x-2">
            <Button onClick={onClose}>{t(Strings.robot_return)}</Button>
            <Button color="primary" type="submit" disabled={isDisabledSubmit}>
              {t(Strings.save)}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
