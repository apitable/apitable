import { useCards } from './cards';
import { Block } from '../components';
import { ILayoutProps } from '../interface';

import styles from './style.module.less';

export const Lg = (props: ILayoutProps) => {

  const {
    AdCard,
    CapacityCard,
    ApiCard,
    FileCard,
    RecordCard,
    MemberCard,
    ViewsCard,
    OthersCard,
    InfoCard,
    LevelCard,
  } = useCards(props);

  return <div className={styles.lg} style={{ height: '100%' }}>
    <Block isWrap vertical style={{ maxWidth: '25%' }}>
      <Block flex={43}>
        <InfoCard minHeight={494} />
      </Block>
      <Block flex={27}>
        <AdCard minHeight={372} />
      </Block>
    </Block>
    <Block isWrap vertical>
      <Block flex={16}>
        <LevelCard minHeight={176} />
      </Block>
      <Block flex={27}>
        <CapacityCard />
      </Block>
      <Block flex={27}>
        <ApiCard minHeight={372} />
      </Block>
    </Block>
    <Block isWrap vertical flex={2}>
      <Block flex={16}>
        <MemberCard minHeight={176} />
      </Block>
      <Block isWrap flex={54}>
        <Block isWrap vertical>
          <Block>
            <FileCard />
          </Block>
          <Block>
            <ViewsCard />
          </Block>
        </Block>
        <Block isWrap vertical>
          <Block>
            <RecordCard />
          </Block>
          <Block >
            <OthersCard minHeight={372} />
          </Block>
        </Block>
      </Block>
    </Block>
  </div>;
};
