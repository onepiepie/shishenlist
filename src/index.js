import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

class HeroChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    };
  }
  
  onClick(props){
    this.props.changeLevel(props);
  }

  render() {
    return(
      <div className={this.props.level === this.props.activity ? "herochoose highlight" : "herochoose"} onClick={this.onClick.bind(this, this.props.level)}>
        {this.props.level}
      </div>
    )
  }
}

class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story: [],
      play: false,
      activity: 1,
      audioPlay: true
    }
    this.audio = React.createRef();
  }

  componentDidMount() {
    axios.get("https://yys.clmystes.tech:3300/api/get_hero_story?heroid=" + this.props.heroId).then((response) => {
      this.setState({
        story: response.data
      })
    }).catch((error) => {

    })
  }

  componentDidUpdate(prevprops,prevstate) {
    if (this.props !== prevprops) {
      axios.get("https://yys.clmystes.tech:3300/api/get_hero_story?heroid=" + this.props.heroId).then((response) => {
        this.setState({
          story: response.data
        })
      }).catch((error) => {

      })
    }
  }

  Changestory(e) {
    this.setState({
      activity: e
    })
  }

  audioPlay(e) {
    const audio = this.audio.current;
    if (e){
      audio.currentTime=0
      audio.play()
    } else {
      audio.pause();
    }
    this.setState({
      audioPlay: !e
    })
  }

  render() {
    const storyChooseText = ["一","二","三","四","五","六","七"]
    const story = this.state.story === null ? [] : this.state.story;
    const audioPlay = this.state.audioPlay;
    const activity = this.state.activity;
    return (
      <React.Fragment>
      {story.length === 0 ? 
      <div>
        加载传记中~
      </div>
      :
      JSON.stringify(story.data) === "{}" ?
      <div>
        该式神没有传记呢！
      </div>
      :
      <div className="story">
        <div className="title">
          01/传记
        </div>
        <div className="content">
          <div className="choose">
            <div className="voice" onClick={this.audioPlay.bind(this, audioPlay)}>
              <div className="cv">cv:{story.data.cv}</div>
              <div className="mp3">
                <img src={!audioPlay ? require("./assets/pause.png").default : require("./assets/play.png").default} alt=""/>
                <audio ref={this.audio} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/mp3/"+this.props.heroId+".mp3?v=5"}>您的浏览器不支持音频播放。</audio>
              </div>
            </div>
            {story.data.story.map((item, index) => {
              return (
              <div className={activity !== (index+1) ? "story_choose" : "story_choose choosen"} key={storyChooseText[index]} onClick={this.Changestory.bind(this, index+1)}>
                {"传记" + storyChooseText[index]}
              </div>)
            })}
          </div>
          <div className="text">
            {story.data.story.map((item, index) => {
              return (
                (index+1) !== activity ? null :
                <div className="story_text" key={index}>{item}</div>
              )
            })}
          </div>
        </div>
      </div>}
      </React.Fragment>
    )
  }
}

class Attr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attrAwakeBefore: [],
      attrAwakeAfter: [],
    }
  }

  componentDidMount() {
    axios.get("https://yys.clmystes.tech:3300/api/get_hero_attr?heroid="+ this.props.heroId+"&awake=0&level=1&star=2").then((response) => {
      this.setState({
        attrAwakeBefore: response.data.data
      })
    }).catch((error) => {

    })
    if (this.props.level !== "SP" && this.props.level !== "N" && this.props.heroId !== "402"){
      axios.get("https://yys.clmystes.tech:3300/api/get_hero_attr?heroid="+ this.props.heroId+"&awake=1&level=1&star=2").then((response) => {
        this.setState({
          attrAwakeAfter: response.data.data
        })
      }).catch((error) => {

      })
    } else {
      this.setState({
        attrAwakeAfter: ["SP or N can't awake!"]
      })
    }
  }

  componentDidUpdate(prevprops,prevstate) {
    /** 第一个参数是上一次的props，第二个参数是上一次的state */
    if (this.props !== prevprops) {
      axios.get("https://yys.clmystes.tech:3300/api/get_hero_attr?heroid="+ this.props.heroId+"&awake=0&level=1&star=2").then((response) => {
        this.setState({
          attrAwakeBefore: response.data.data
        })
      }).catch((error) => {

      })
  
      if (this.props.level !== "SP" && this.props.level !== "N" && this.props.heroId !== "402"){
        axios.get("https://yys.clmystes.tech:3300/api/get_hero_attr?heroid="+ this.props.heroId+"&awake=1&level=1&star=2").then((response) => {
          this.setState({
            attrAwakeAfter: response.data.data
          })
        }).catch((error) => {

        })
      } else {
        this.setState({
          attrAwakeAfter: ["SP or N can't awake!"]
        })
      }
    }
  }

  render() {
    const attrAwakeBefore = this.state.attrAwakeBefore;
    const attrAwakeAfter = this.state.attrAwakeAfter;
    const attrLevel = ["D", "C", "B", "A", "S", "SS"]
    return (
      <React.Fragment>
        {attrAwakeBefore.length !== 0 && attrAwakeAfter.length !== 0 ? 
          <div className="heroattrinfo">
            <div className="title">
              02/情报
            </div>
            <div className="content">
              <div className="attr_name">
                <div className="not_visible awake_text">觉醒前</div>
                <img className="not_visible" src={"https://yys.res.netease.com/pc/zt/20161108171335/data/before_awake/"+this.props.heroId+".jpg?v4"} alt=""/>
                <p>攻击</p>
                <p>生命</p>
                <p>防御</p>
                <p>速度</p>
                <p>暴击</p>
                <p>暴击伤害</p>
                <p>效果命中</p>
                <p>效果抵抗</p>
              </div>
              <div className="awake_before">
                <div className="awake_text">觉醒前</div>
                <img src={"https://yys.res.netease.com/pc/zt/20161108171335/data/before_awake/"+this.props.heroId+".jpg?v4"} alt=""/>
                <p>
                  <span className={attrLevel[attrAwakeBefore.score.attack]}>{attrLevel[attrAwakeBefore.score.attack]}</span>
                  <span>{"(" + Math.round(attrAwakeBefore.attack) + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeBefore.score.maxHp]}>{attrLevel[attrAwakeBefore.score.maxHp]}</span>
                  <span>{"(" + Math.round(attrAwakeBefore.maxHp) + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeBefore.score.defense]}>{attrLevel[attrAwakeBefore.score.defense]}</span>
                  <span>{"(" + Math.round(attrAwakeBefore.defense) + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeBefore.score.speed]}>{attrLevel[attrAwakeBefore.score.speed]}</span>
                  <span>{"(" + attrAwakeBefore.speed + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeBefore.score.critRate]}>{attrLevel[attrAwakeBefore.score.critRate]}</span>
                  <span>{"(" + attrAwakeBefore.critRate * 100 + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + (attrAwakeBefore.critPower * 100 + 100) + "%)" }</span>
                </p>
                <p>
                  <span>{"(" + attrAwakeBefore.debuffResist + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + attrAwakeBefore.debuffEnhance + "%)"}</span>
                </p>
              </div>
              {attrAwakeAfter.length !== 1 ?
              <div className="awake_after">
                <div className="awake_text">觉醒后</div>
                <img src={"https://yys.res.netease.com/pc/zt/20161108171335/data/after_awake/"+this.props.heroId+".jpg?v5"} alt=""/>
                <p>
                  <span className={attrLevel[attrAwakeAfter.score.attack]}>{attrLevel[attrAwakeAfter.score.attack]}</span>
                  <span>{"(" + Math.round(attrAwakeAfter.attack) + ")"}</span>
                  <span>{"(+" + Math.round(attrAwakeAfter.attack - attrAwakeBefore.attack) + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeAfter.score.maxHp]}>{attrLevel[attrAwakeAfter.score.maxHp]}</span>
                  <span>{"(" + Math.round(attrAwakeAfter.maxHp) + ")"}</span>
                  <span>{"(+" + Math.round(attrAwakeAfter.maxHp - attrAwakeBefore.maxHp) + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeAfter.score.defense]}>{attrLevel[attrAwakeAfter.score.defense]}</span>
                  <span>{"(" + Math.round(attrAwakeAfter.defense) + ")"}</span>
                  <span>{"(+" + Math.round(attrAwakeAfter.defense - attrAwakeBefore.defense) + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeAfter.score.speed]}>{attrLevel[attrAwakeAfter.score.speed]}</span>
                  <span>{"(" + attrAwakeAfter.speed + ")"}</span>
                  <span>{"(+" + Math.round(attrAwakeAfter.speed - attrAwakeBefore.speed) + ")"}</span>
                </p>
                <p>
                  <span className={attrLevel[attrAwakeAfter.score.critRate]}>{attrLevel[attrAwakeAfter.score.critRate]}</span>
                  <span>{"(" + attrAwakeAfter.critRate * 100 + "%)"}</span>
                  <span>{"(+" + (Math.round(attrAwakeAfter.critRate *100 - attrAwakeBefore.critRate * 100)) + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + (attrAwakeAfter.critPower * 100 + 100) + "%)" }</span>
                  <span>{"(+" + (Math.round(attrAwakeAfter.critPower *100 - attrAwakeBefore.critPower * 100)) + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + attrAwakeAfter.debuffResist + "%)"}</span>
                  <span>{"(+" + (Math.round(attrAwakeAfter.debuffResist *100 - attrAwakeBefore.debuffResist * 100)) + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + attrAwakeAfter.debuffEnhance + "%)"}</span>
                  <span>{"(+" + (Math.round(attrAwakeAfter.debuffEnhance *100 - attrAwakeBefore.debuffEnhance * 100)) + "%)"}</span>
                </p>
              </div>  
              :
              <div className="noawake">
                <div className="not_visible">觉醒后</div>
                <img className="not_visible" src={"https://yys.res.netease.com/pc/zt/20161108171335/data/before_awake/"+this.props.heroId+".jpg?v4"} alt=""/>
                <p>该式神不能觉醒</p>
              </div>}
            </div>
          </div>
        : null}
      </React.Fragment>
    )
  }
}

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heroInfo: [],
      heroIdList: [],
      heroIdChoose: false,
      activity: "全部",
      len: 0,
      bigChoose: [true, false, false],
      skinChoose: 1
    }
    this.oldScrollTop = 0;
    this.imgOnLoad = this.imgOnLoad.bind(this);
  }

  componentDidMount() {
    (function (doc,win) {
      var htmlEle=doc.documentElement;
      var reload="orientationchange" in window ? "orientationchange":"resize";
      function setFontsize () {
          //每次通过屏幕转动或者重新设置宽高的时候获取屏幕宽度
          var clientWidth=htmlEle.clientWidth;
          if(clientWidth===960) return;
          if(!clientWidth) return;
          //设置html标签的fontsize大小
          htmlEle.style.fontSize=20*(clientWidth/1920)+"px";
      }; 
      win.addEventListener(reload,setFontsize, false);
      doc.addEventListener("DOMContentLoaded",setFontsize,false);
      })(document,window);

    /** 调用api接口获取数据 */
    axios.get("https://yys.clmystes.tech:3300/api02/pc/zt/20161108171335/js/app/all_shishen.json?v70").then((response) => {
      this.setState({
        heroIdList: response.data
      });
      /* 调用api获得数据后加载图片 */
      this.imgOnLoad(750);
    }).catch((error) => {

    })
  }
  
  changeLevel(e) {
    this.setState({
      activity: e
    })
    this.imgOnLoad(20000);
  }

  bigChoose(e) {
    const bigChoose = e;
    const heroInfo = this.state.heroInfo;
    const skinChoose = this.state.skinChoose;
    if (heroInfo[3] === undefined) {
      return
    }
    if (heroInfo[3] !== undefined && heroInfo[3] !== null && heroInfo[3].length >= 2) {
      if (skinChoose === heroInfo[3].length) {
        this.setState({
          skinChoose: 1
        })
      } else {
        this.setState({
          skinChoose: skinChoose + 1
        })
      }
    }
    this.setState({
      bigChoose: bigChoose
    })
  }

  heroId(e) {
    this.setState({
      heroIdChoose: true,
      heroInfo: e
    })
  }

  return(e) {
    this.setState({
      heroIdChoose: false
    });
  }

  /* 图片懒加载 */
  imgOnLoad(top) {
    const len = this.state.len;
    let temp = 0;
    /* 获取所有要设置懒加载的图片标签 */
    let img = document.getElementsByClassName("img_lazy");
    /* 进行img标签的src的更改 */
    for (let i = len; i < img.length; i++) {
      if(img[i].offsetTop <= top){
        img[i].src = "https://yys.res.netease.com/pc/zt/20161108171335/data/shishen/" + img[i].id + ".png";
        temp = i;
      }
    }
    this.setState({
      len: temp
    })
  }
  
  /* 函数防抖 用户停止操作之后触发*/
  debounce(fn, top) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      fn(top);
    }, 300);
  }

  onScroll(e) {
    /* top为 已经滚动的高度 */
    let top = e.target.scrollTop + e.target.clientHeight;
    /* 将滚动条下拉距离大于200px则自动加载，但小于500则防抖加载*/
    if (e.target.scrollTop - this.oldScrollTop > 200) {
      this.imgOnLoad(top);
      this.oldScrollTop = e.target.scrollTop;
      /* 如果上拉，因为已经加载过图片了，不操作 */
    } else if (e.target.scrollTop - this.oldScrollTop < 0) {
      return;
    }
    else {
      this.debounce(this.imgOnLoad, top);
    }
  }

  nextHero(e){
    const heroIdListItem = this.state.heroIdList[e+1];
    const info = [heroIdListItem.id,heroIdListItem.name,heroIdListItem.level,heroIdListItem.skin,e+1];
    this.setState({
      heroInfo: info,
      bigChoose: [true, false, false],
    })
  }

  prevHero(e){
    const heroIdListItem = this.state.heroIdList[e-1];
    const info = [heroIdListItem.id,heroIdListItem.name,heroIdListItem.level,heroIdListItem.skin,e-1];
    this.setState({
      heroInfo: info,
      bigChoose: [true, false, false],
    })
  }

  render() {
    const heroInfo = this.state.heroInfo;
    const heroIdList = this.state.heroIdList;
    const heroIdChoose = this.state.heroIdChoose;
    const activity = this.state.activity;
    const skinChoose = this.state.skinChoose;
    const bigChoose = this.state.bigChoose;
    const ShishenBigBeforeAwake = "https://yys.res.netease.com/pc/zt/20161108171335/data/shishen_big_beforeAwake/"+heroInfo[0]+".png?v6"
    const ShishenBigAfterAwake = "https://yys.res.netease.com/pc/zt/20161108171335/data/shishen_big_afterAwake/"+heroInfo[0]+".png?v6"
    return (
      <div className="showall">
        {!heroIdChoose ? 
        <div className="listindex">
          <div className="left">
            <div className="logo">
              <div className="a_logo">
                <img src={require("./assets/yys_logo.webp").default} alt=""/>
              </div>
              <div className="name_logo">
                <img src={require("./assets/name_logo.png").default} alt=""/>
              </div>
            </div>
            <div className="levelchoose">
              <HeroChoose level="全部" activity={activity} changeLevel={this.changeLevel.bind(this)}/>
              <HeroChoose level="联动" activity={activity} changeLevel={this.changeLevel.bind(this)}/>
              <HeroChoose level="SP" activity={activity} changeLevel={this.changeLevel.bind(this)}/>
              <HeroChoose level="SSR" activity={activity} changeLevel={this.changeLevel.bind(this)}/>
              <HeroChoose level="SR" activity={activity} changeLevel={this.changeLevel.bind(this)}/>
              <HeroChoose level="R" activity={activity} changeLevel={this.changeLevel.bind(this)}/>
              <HeroChoose level="N" activity={activity} changeLevel={this.changeLevel.bind(this)}/>
            </div>
          </div>
          <div className="content" onScroll={this.onScroll.bind(this)}>
            {heroIdList.map((item, index) => {
              const info = [item.id,item.name,item.level,item.skin,index];
              return (
                <div className={activity === item.level ? "hero_info" : 
                               (activity === "联动" && item.interactive === true) ? "hero_info" :
                               (activity === "全部") ? "hero_info" : "hide"} key={item.id + item.name}
                     onClick={this.heroId.bind(this, info)}>
                  <img className="img_lazy" id={item.id} src={require("./assets/loading.png").default} alt=""/>
                  <div className="hero_name">{item.name}</div>
                </div>
              )
            })}
          </div>
        </div>
        :  
        <>
          <div className="topbar">
          {/** 最左边的信息，logo */}
          <div className="left">
            <div className="dark"></div>
            <div className="logo">
              <a href="https://yys.163.com/index.html">
                <img src={require("./assets/yys_logo.webp").default} alt=""/>
              </a>
              <div className="name_logo">
                <img src={require("./assets/name_logo.png").default} alt=""/>
              </div>
            </div>
          </div>
          {/** ---------中间的式神图片，名字，阶级-，皮肤切换------------ */}
          <div className="content">
            <div className="info">
              <div className="name">{heroInfo[1]}</div>
              <div className="level">{heroInfo[2]}</div>             
            </div>
            {(heroInfo[3] !== undefined && heroInfo[3] !== null) ? 
            <div className={(heroInfo[3] !== undefined && !bigChoose[2]) ? "info hide" : "info"}>
              <div className="skin_name">{heroInfo[3][skinChoose-1].name}</div> 
            </div>
            : null}
            <div className="shishen_big_beforeAwake">
              {bigChoose[0] ? 
              <img src={ShishenBigBeforeAwake} alt=""/>
              :
              (bigChoose[1]) ?
              <img src={ShishenBigAfterAwake} alt=""/>
              :
              (bigChoose[2]) && heroInfo[3] !== null ?
              heroInfo[3].map((item, index) => {
                return (
                  skinChoose === (index+1) ? 
                  <img key={item.name} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/shishen_skin/"+heroInfo[0]+"-"+skinChoose+".png"} alt=""/>
                  : null
                )
              }):null}
              <div className="big_choose">
                {bigChoose[0] ? 
                  <img src={require("./assets/chushi_click.png").default} alt=""/>
                : 
                  <img onClick={this.bigChoose.bind(this, [true, false, false])} src={require("./assets/chushi_noclick.png").default} alt=""/>
                }
                {bigChoose[1] ? 
                  <img src={require("./assets/juexing_click.png").default} alt=""/>
                : 
                  <img onClick={(heroInfo[2]!=="SP" && heroInfo[2]!== "N" && heroInfo[0]!=="402") ? this.bigChoose.bind(this, [false, true, false]) : null} src={require("./assets/juexing_noclick.png").default} alt=""/>
                }
                {bigChoose[2] ? 
                  <img onClick={this.bigChoose.bind(this, [false, false, true])} src={require("./assets/pifu_click.png").default} alt=""/>
                : 
                  <img onClick={heroInfo[3]!==undefined && heroInfo[3]!==null ?this.bigChoose.bind(this, [false, false, true]) : null} src={require("./assets/pifu_noclick.png").default} alt=""/>
                }
              </div>
            </div>
          </div>
        </div>
          <Story heroId={heroInfo[0]}/>
          <Attr heroId={heroInfo[0]} level={heroInfo[2]}/>
          <div className="allhero">
            <div className="return" onClick={this.return.bind(this)}>返回式神录</div>
          </div>
          <div className="changebtn">
            {heroInfo[4] !== 0 ?
            <div className="prevbtn">
              <img onClick={this.prevHero.bind(this, heroInfo[4])} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/mark_btn/"+(heroIdList[heroInfo[4]-1].id)+".png?v5"} alt=""/>
              <div className="btn_text">
                {heroIdList[heroInfo[4]-1].name}
                <br></br>上一个
              </div>
            </div>
              : null}
            {heroInfo[4] !== heroIdList.length-1 ?
            <div className="nextbtn">
              <img onClick={this.nextHero.bind(this, heroInfo[4])} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/mark_btn/"+(heroIdList[heroInfo[4]+1].id)+".png?v5"} alt=""/>
              <div className="btn_text">
                {heroIdList[heroInfo[4]+1].name}
                <br></br>下一个
              </div>
            </div>
            : null}
          </div>
        </>
        }
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <TopBar />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
