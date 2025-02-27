import React from 'react';
import SlideList from './SlideList';
import { recommendedVideo } from '@/api/video'
interface Props {
  // props types
}

const Slide4: React.FC<Props> = ({}) => {
  return (
    <SlideList
      active={true}
      uniqueId='home'
      api={recommendedVideo} />
  );
};

export default Slide4;