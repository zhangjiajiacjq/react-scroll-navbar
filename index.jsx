import { useEffect, useState } from "react";

function getMinLevel(titleList) {
  let min = 100
  for (let i=0; i<titleList.length; i++) {
    if (titleList[i].level < min) {
      min = titleList[i].level
    }
  }

  return min
}

function getYoffset(key) {
  //计算y坐标
  const element = document.getElementById(key)
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null){
    actualTop += (current.offsetTop+current.clientTop);
    current = current.offsetParent;
  }

  return actualTop
}

const scrollToAnchor = (offsetTop, behavior) => {
    window.scrollTo({
         top: offsetTop,
         behavior: behavior,
    });
  }

function Navbar(props) {
  // 获取参数
  const offset = props.offset || 0            // 偏移量
  const oldTitleList = props.titleList         // 导航列表数据
  const setUrlHash = props.setUrlHash || false // 是否修改页面hash值
  const height = props.height || window.outerHeight*0.8  // 高度
  const behavior = props.behavior || 'smooth' // 滚动行为
  const fontMaxSize = props.fontMaxSize || 16 // 最大的字体大小
  const fontSizeRate = props.fontSizeRate || 1 // 字体递减比例

  const titleList = []
  for (let i=0; i<oldTitleList.length; i++) {
    document.getElementById(oldTitleList[i].key) && titleList.push(oldTitleList[i])
  } 

  const [activeKey, setActiveKey] = useState('')
  const [hoverKey, sethoverKey] = useState('')

  for (let i=0; i<titleList.length; i++) {
    titleList[i].offsetTop = getYoffset(titleList[i].key)
  }

  const minLevel = getMinLevel(titleList)

  const getItem = (title, minLevel) => {
    const realLevel = title.level - minLevel

    const style = {
      marginBottom: '6px',
      cursor: 'pointer', 
    }

    const fontStyle = {
      marginLeft: 10+realLevel*15+'px',
      fontSize: (fontMaxSize-realLevel*fontSizeRate)+'px', 
    }

    if (title.key === activeKey) {
      style.backgroundColor = '#F0F8FF'
      fontStyle.color = '#007FFF'
    }

    if (title.key ===  hoverKey) {
      style.backgroundColor = '#F5F5F5'
    }
    
    return <p
        key={title.key} 
        style={style}
        onClick={()=>scrollToAnchor(title.offsetTop-offset, behavior)}
        onMouseOver={() => sethoverKey(title.key)}
        onMouseLeave={() => sethoverKey('')}
        >
          <font style={fontStyle}>{title.title[0]}</font>
        </p>
  }

  const handleScroll = (e) => {
    const scrollTop = document.documentElement.scrollTop

    if (titleList.length === 0) {
      return
    }
    
    let active = ''
    for (let i=0; i<titleList.length; i++) {
      if ((titleList[i].offsetTop - offset -5) >= scrollTop) {
        break
      }
      active = titleList[i].key
    }

    setActiveKey(active)

    if (setUrlHash) {
      window.location.hash = '#_' + active
    }
  }

  window.addEventListener('scroll', handleScroll)

  useEffect(()=> {
    const hash = window.location.hash
    console.log(hash)
    const hashArr = hash.split('#_')
    if (hashArr[1] && document.getElementById(hashArr[1])) {
      const hashOffset = getYoffset(hashArr[1])
      scrollToAnchor(hashOffset-offset, behavior)
    }
  }, [])

  return (
    <div style={{height: height, whiteSpace: 'nowrap', overflow: 'auto'}}>
     {
       titleList.map(item => {
         return getItem(item, minLevel)
       })
     }
    </div>
  )
}

export default Navbar