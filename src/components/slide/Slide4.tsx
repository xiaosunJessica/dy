import React from 'react';
import SlideList from './SlideList';
import SlideItem from './SlideItem';
import { recommendedVideo } from '@/api/video'
interface Props {
  // props types
}

const Slide4: React.FC<Props> = ({}) => {
  return (
    <SlideItem>
      <SlideList
        active={true}
        uniqueId='home'
        api={recommendedVideo} />
    </SlideItem>
  );
};

export default Slide4;