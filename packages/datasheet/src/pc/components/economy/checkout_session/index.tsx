// export * from './grades_checklist';
// export * from './renewal';
// export * from './seats';
// export * from './capacity';
import { PayingModalHeader } from '../stateless_ui';
import { CheckoutSessionConfig, CheckoutSessionType } from './config';
import { showPayingModalBase } from '../components/paying_modal/paying_modal';

export const showCheckoutSession = ({ uiType }) => {
  const { modalHeaderTitle, modalHeaderMessage, modalHeaderBg, Main, themeColor, contentRight } = CheckoutSessionConfig[uiType];
  let onCancel: null | ((e?: any) => void)= null;
  onCancel = showPayingModalBase({
    header: (<PayingModalHeader title={modalHeaderTitle} subTitle={modalHeaderMessage} backgroundImage={ modalHeaderBg }/>),
    main: (<Main onCancel={() => { onCancel && onCancel(); }} themeColor={themeColor} contentRight={contentRight}/>),
    footer: null,
  });
};

export const showGradesChecklist = () => showCheckoutSession({ uiType: CheckoutSessionType.GradesChecklist });
export const upgradeSeats= () => showCheckoutSession({ uiType: CheckoutSessionType.Seats });
export const upgradeCapacity= () => showCheckoutSession({ uiType: CheckoutSessionType.Capacity });
export const showRenewal = () => showCheckoutSession({ uiType: CheckoutSessionType.Renewal });