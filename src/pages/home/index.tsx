import React from 'react';
import SlideHorizontal from '@/components/slide/SlideHorizontal';
import SlideItem from '@/components/slide/SlideItem';
import styles from './index.module.less'
interface Props {
  // props types
}

const ComponentName: React.FC<Props> = ({}) => {
  return (
    <div className={styles['test-slide-wrapper']} id="home-index">
      <SlideHorizontal>
        <SlideItem>
          123
        </SlideItem>
      </SlideHorizontal>
    </div>
  );
};

export default ComponentName;