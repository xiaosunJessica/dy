import React, {ReactNode} from 'react';
import './SlideHorizontal.module.less'
interface Props {
  // props types
  children: ReactNode
}

const SlideItem: React.FC<Props> = ({children}) => {
  return (
    <div className='slide-item'>
      {children}
    </div>
  );
};

export default SlideItem;