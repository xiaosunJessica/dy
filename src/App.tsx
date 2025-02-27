import React, { useEffect } from 'react';
import Home from '@/pages/home'
import './App.css';
import '@/assets/less/index.less'

function App() {
 const resetVhAndPx = ()  => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    //document.documentElement.style.fontSize = document.documentElement.clientWidth / 375 + 'px'
  }

  useEffect(() => {
    resetVhAndPx()
    // 监听resize事件 视图大小发生变化就重新计算1vh的值
    window.addEventListener('resize', () => {
      // location.href = BASE_URL + '/'
      resetVhAndPx()
    })
  })
  return (
    <div id="app">
      <Home />
    </div>
  );
}

export default App;
