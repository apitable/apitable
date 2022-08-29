import { showGradesChecklist, upgradeSeats, upgradeCapacity, showRenewal } from './checkout_session';
import { showBannerAlert } from 'pc/components/notification/banner_alert';
export const Economy = () => {
  return (
    <div style={{ display:'flex' }}>
      <button onClick={showGradesChecklist}>grads</button>
      <button onClick={upgradeSeats}>upgradeSeats</button>
      <button onClick={upgradeCapacity}>Capacity</button>
      <button onClick={showRenewal}>showRenewal</button>
      <button onClick={showRenewal}>showRenewal</button>
      <button onClick={() => showBannerAlert({
        content: 'showBannerAlert ',
        btnText: '沙欣',
        closable: true,
      })}>showBannerAlert</button>
    </div>
  );
};