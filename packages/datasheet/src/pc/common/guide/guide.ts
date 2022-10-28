/*
 * Service for bootstrapping systems
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-19 12:40:19
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-19 14:07:59
 */
import { Api, ConfigConstant, ScreenWidth, Strings, t } from '@apitable/core';
import { Step as IStep } from '@apitable/core/src/config/system_config.interface';
import parser from 'html-react-parser';
// import { Message } from 'pc/components/common';
import { startActions, TriggerCommands } from 'pc/common/apphook/trigger_commands';
import {
  destroyBreath, destroyContactUs, destroyModal, destroyNotice, destroyQuestionnaire, destroySlideout, IGuideBreathOptions, IGuideContactUsOptions,
  IGuideModalOptions, IGuideNoticeOptions, IGuideSlideOutProps, IQuestionnaireProps, IShowPopoverOptions, showBreath, showContactUs, showModal,
  showNotice, showPopover, showQuestionnaire, showSlideout
} from 'pc/common/guide/ui';
import { store } from 'pc/store';
import { getInitializationData } from 'pc/utils/env';
import { isMobile } from 'react-device-detect';
import { destroyPrivacyModal, IPrivacyModalProps, showPrivacyModal } from './ui/privacy_modal';
import { destroyTaskList, IGuideTaskListProps, showTaskList } from './ui/task_list';
import { addWizardNumberAndApiRun } from './utils';

/**
 * Newbie Guide Service Class
 *
 * @export
 * @class Guide
 */
export class Guide {
  static showUiFromConfig(stepInfo: IStep): void {
    const state = store.getState();
    const hooks = state.hooks;
    const user = state.user;
    const {
      uiType, uiConfig, uiConfigId, prev, nextId, next, skipId, skip, onClose: closeActions, onTarget: targetActions,
      onSkip: skipActions, onNext: nextActions, onPlay: playActions, onPrev: prevActions, backdrop
    } = stepInfo;
    const _uiConfig = (uiConfigId && Strings[uiConfigId] && uiType !== 'notice') ? t(Strings[uiConfigId]) : uiConfig;
    const _next = (nextId && Strings[nextId]) ? t(Strings[nextId]) : next;
    const _skip = (skipId && Strings[skipId]) ? t(Strings[skipId]) : skip;
    const uiInfo = JSON.parse(_uiConfig);
    const onSkip = () => { hooks.config && skipActions && startActions(hooks.config, skipActions); };
    const onNext = () => { hooks.config && nextActions && startActions(hooks.config, nextActions); };
    const onPrev = () => { hooks.config && prevActions && startActions(hooks.config, prevActions); };
    const onClose = () => { hooks.config && closeActions && startActions(hooks.config, closeActions); };
    const onTarget = () => { hooks.config && targetActions && startActions(hooks.config, targetActions); };
    const onPlay = () => { hooks.config && playActions && startActions(hooks.config, playActions); };
    const buttonConfig = { prev, next: _next, skip: _skip, onPrev, onNext, onSkip };

    switch (uiType) {
      case 'notice': {
        this.showNotice({
          ...uiInfo,
          children: uiInfo.children ? parser(uiInfo.children) : undefined,
          readMoreTxt: _next,
          onClose() {
            onClose();
            // Depending on whether the wizard of the "History Update Button" on the vikaby menu has been accessed
            // If not, and you are not mobile, open the vikaby menu and execute the corresponding wizard.
            const curWizards = user.info ? { ...user.info.wizards } : {};
            const isPc = window.innerWidth > ScreenWidth.md;
            const VIKABY_UPDATE_LOGS_HISTORY = ConfigConstant.WizardIdConstant.VIKABY_UPDATE_LOGS_HISTORY;
            if (!curWizards.hasOwnProperty(VIKABY_UPDATE_LOGS_HISTORY) && isPc) {
              TriggerCommands.open_vikaby({ defaultExpandMenu: true, visible: true });
              TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.VIKABY_UPDATE_LOGS_HISTORY);
            }
          },
        });
        break;
      }
      case 'privacyModal': {
        this.showPrivacyModal({
          ...uiInfo,
          children: uiInfo.children ? parser(uiInfo.children) : undefined,
          onClose,
        });
        break;
      }
      case 'modal': {
        this.showModal({
          ...uiInfo,
          children: uiInfo.children ? parser(uiInfo.children) : undefined,
          onClose,
          onPlay,
          autoPlay: uiInfo.autoPlay,
        });
        break;
      }
      case 'popover': {
        this.showPopover({
          ...uiInfo,
          children: uiInfo.children ? parser(uiInfo.children) : undefined,
          buttonConfig,
          onTarget,
          backdrop,
        });
        break;
      }
      case 'breath': {
        this.showBreath({
          ...uiInfo,
          onTarget,
          backdrop,
        });
        break;
      }
      case 'slideout': {
        this.showSlideout({
          ...uiInfo,
          buttonConfig,
        });
        break;
      }
      case 'questionnaire': {
        // Newcomer guide pop-ups - Questionnaire
        this.showQuestionnaire({
          ...uiInfo,
          onClose: () => {
            onClose();
            addWizardNumberAndApiRun(hooks.curGuideWizardId);
          },
          children: uiInfo.children ? parser(uiInfo.children) : undefined,
          onSubmit: answers => {
            localStorage.setItem('vika_guide_start', 'questionnaire');
            addWizardNumberAndApiRun(hooks.curGuideWizardId);
            const env = getInitializationData().env;
            const submitData = {
              userId: user.info?.uuid,
              nickName: user.info?.nickName,
              env,
              ...answers,
            };

            // TODO：Here the Message is hidden pending subsequent interaction optimisation
            Api.submitQuestionnaire(submitData);
            // .then(res => {
            //   const { msg } = res.data;
            //   Message.success({ content: msg === 'success' ? t(Strings.submit_questionnaire_success) : msg });
            // });
          },
          onNext,
        });
        break;
      }
      case 'customQuestionnaire': {
        this.showCustomQuestionnaire('e0cb5f411286a4c0');
        break;
      }
      case 'afterSignNPS': {
        this.showCustomQuestionnaire('ff8d129b2e37c77c');
        break;
      }
      case 'taskList': {
        this.showTaskList({
          ...uiInfo
        });
        break;
      }
      case 'contactUs': {
        this.showContactUs({
          // ...config,
          uiInfo,
          onClose,
          confirmText: _next,
        });
        break;
      }
    }
  }

  static destroyUi(uiType) {
    switch (uiType) {
      case 'notice': {
        destroyNotice();
        break;
      }
      case 'privacyModal': {
        destroyPrivacyModal();
        break;
      }
      case 'modal': {
        destroyModal();
        break;
      }
      case 'questionnaire': {
        destroyQuestionnaire();
        break;
      }
      case 'popover': {
        showPopover({ hidden: true });
        break;
      }
      case 'breath': {
        destroyBreath();
        break;
      }
      case 'slideout': {
        destroySlideout();
        break;
      }
      case 'taskList': {
        destroyTaskList();
        break;
      }
      case 'contactUs': {
        destroyContactUs();
        break;
      }
    }
  }

  static showQuestionnaire(props: IQuestionnaireProps) {
    showQuestionnaire(props);
  }

  static showTaskList(props: IGuideTaskListProps) {
    showTaskList(props);
  }

  static showSlideout(props: IGuideSlideOutProps) {
    showSlideout(props);
  }

  static showNotice(props: IGuideNoticeOptions) {
    showNotice(props);
  }

  static showPrivacyModal(props: IPrivacyModalProps) {
    showPrivacyModal(props);
  }

  static showPopover(props: IShowPopoverOptions) {
    showPopover(props);
  }

  static showModal(props: IGuideModalOptions) {
    showModal(props);
  }

  static showBreath(props: IGuideBreathOptions) {
    showBreath(props);
  }

  /* nps Documentation of requirements：https://vikadata.feishu.cn/docs/doccnWmDDh29H89CdKMSYOiHRaf */
  static showCustomQuestionnaire(npsId: string) {
    if (isMobile) {
      // No questionnaires are displayed on mobile
      return;
    }
    (function(a, b, c, d) {
      a['npsmeter'] = a['npsmeter'] || function() {
        (a['npsmeter'].q = a['npsmeter'].q || []).push(arguments);
      };
      a['_npsSettings'] = { npsid: npsId, npssv: '1.01' };
      const e = b.getElementsByTagName('head')[0];
      const f = b.createElement('script');
      f.async = 1 as any as boolean;
      f.src = c + d + a['_npsSettings'].npssv + '&npsid=' + a['_npsSettings'].npsid;
      e.appendChild(f);
    })(window, document, 'https://static.npsmeter.cn/npsmeter', '.js?sv=');

    const initData = getInitializationData();
    window['npsmeter']({
      key: npsId,
      user_id: initData.userInfo?.userId, // Replace with user id
      user_name: initData.userInfo?.nickName, // Replace with username
    });

    setTimeout(() => {
      window['npsmeter']?.open();
    }, 5000);
  }

  static showContactUs(props: IGuideContactUsOptions) {
    showContactUs(props);
  }
}

