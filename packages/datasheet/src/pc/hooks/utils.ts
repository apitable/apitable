import { StatusCode, Strings, t } from '@vikadata/core';
import { Modal } from 'pc/components/common/modal/modal';
import { openSliderVerificationModal } from 'pc/components/common/slider_verification';

export const secondStepVerify = (code: number) => {
  if (code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
    openSliderVerificationModal();
  } else if (code === StatusCode.PHONE_VALIDATION) {
    Modal.confirm({
      title: t(Strings.warning),
      content: t(Strings.status_code_phone_validation),
      onOk: () => {
        window['nvc'].reset();
      },
      type: 'warning',
      okText: t(Strings.got_it),
      cancelButtonProps: {
        style: { display: 'none' },
      },
    });
    return true;
  }
  return false;
};
