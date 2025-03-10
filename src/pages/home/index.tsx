import React, { useState } from 'react';
import SlideHorizontal from '@/components/slide/SlideHorizontal';
import SlideItem from '@/components/slide/SlideItem';
import Slide4 from '@/components/slide/Slide4';
import IndicatorHome from './IndicatorHome';
import styles from './index.module.less'
interface Props {
  // props types
}

const ComponentName: React.FC<Props> = ({}) => {
  const [navIndex, setNavIndex] = useState<number>(0);
  const onChange = (val: number) => {
    setNavIndex(val)
  }
  return (
    <div className={styles['test-slide-wrapper']} id="home-index">
      <SlideHorizontal
        name="first"
        onChangeIndex={() => {}}
        index={0}>
        <SlideItem>
          {/* tabs 导航 */}
          <IndicatorHome
            index={navIndex}
            name="second"
            onChangeNavIndex={setNavIndex} />

          {/* tabs导航的内容，根据navIndex展示对应的内容，采用SlideHorizontal支持滑动切换tabs */}
          <SlideHorizontal
            name="second"
            index={navIndex}
            cls={styles['first-horizontal-item']}
            onChangeIndex={onChange}>
            <Slide4></Slide4>
            <SlideItem>2</SlideItem>
            <SlideItem>3</SlideItem>
            <SlideItem>4</SlideItem>
          </SlideHorizontal>
        </SlideItem>
      </SlideHorizontal>
    </div>
  );
};

export default ComponentName;