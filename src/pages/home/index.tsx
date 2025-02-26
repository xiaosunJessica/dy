import React, { useState } from 'react';
import SlideHorizontal from '@/components/slide/SlideHorizontal';
import SlideItem from '@/components/slide/SlideItem';
import IndicatorHome from './IndicatorHome';
import styles from './index.module.less'
interface Props {
  // props types
}

const ComponentName: React.FC<Props> = ({}) => {
  const [navIndex, setNavIndex] = useState<number>(4);
  return (
    <div className={styles['test-slide-wrapper']} id="home-index">
      <SlideHorizontal>
        <SlideItem>
          <IndicatorHome
            index={navIndex}
            onChangeNavIndex={setNavIndex} />
        </SlideItem>
      </SlideHorizontal>
    </div>
  );
};

export default ComponentName;