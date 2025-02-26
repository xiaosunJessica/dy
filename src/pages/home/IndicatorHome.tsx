import React,  { Dispatch, SetStateAction }  from 'react';
import styles from './IndicatorHome.module.less'
import { Icon } from '@iconify-icon/react';
import Tabs from '@/components/tabs'
interface Props {
  // props types
 index: number,
 onChangeNavIndex: Dispatch<SetStateAction<number>>;
}

const IndicatorHome: React.FC<Props> = ({
  index,
  onChangeNavIndex
}) => {
  return (
    <div className={styles['indicator-home']}>
      <div className={styles['toolbar']}>
       <Icon
        icon="tabler:menu-deep"
        className="search"
        style={{ transform: 'rotateY(180deg)' }}
        />
        <Tabs
          index={index}
          onChangeIndex={onChangeNavIndex}
          tabTexts={['热点','长视频', '关注', '经验', '推荐']} />
        <Icon
          icon="ion:search"
          className="search"
        />
      </div>
    </div>
  );
};

export default IndicatorHome;