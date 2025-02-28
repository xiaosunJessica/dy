import React, { useRef, useState } from 'react';
import { _checkImgUrl } from '@/utils'
import styles from './BaseVideo.module.less'
interface Props {
  // props types
  item: any,
  isPlay: boolean,
}

const BaseVideo: React.FC<Props> = (props) => {
  const videoEl = useRef(null)
  const poster =  _checkImgUrl(props.item.video.poster ?? props.item.video.cover.url_list[0])
  const [state, setState] = useState({
    isMuted: (window as any).isMuted
  })
  return (
    <div className={styles['video-wrapper']} onClick={() => {console.log('test11111')}}>
      <video
        poster={poster}
        ref={videoEl}
        muted={state.isMuted}
        preload="true"
        loop
        x5-video-player-type="h5-page"
        x5-video-player-fullscreen="false"
        webkit-playsinline="true"
        x5-playsinline="true"
        playsInline={true}
        autoPlay={props.isPlay}
      >
        {
          props?.item?.video?.play_addr?.url_list.map((urlItem: any, index: number) => {
            return (
              <source
                key={index}
                src={urlItem}
                type="video/mp4"
              />
            )
          })
        }

        <p>您的浏览器不支持 video 标签。</p>
      </video>
    </div>
  );
};

export default BaseVideo;