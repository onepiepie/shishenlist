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
    this.props.Changelevel(props);
    // console.log(props)
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
      audioplay: true
    }
    this.audio = React.createRef();
  }

  componentDidMount() {
    axios.get("/api02/get_hero_story?heroid=" + this.props.heroid).then((response) => {
      this.setState({
        story: response.data
      })
    }).catch((error) => {
      console.log(error);
    })
  }

  componentDidUpdate(prevprops,prevstate) {
    if (this.props !== prevprops) {
      axios.get("/api02/get_hero_story?heroid=" + this.props.heroid).then((response) => {
        this.setState({
          story: response.data
        })
      }).catch((error) => {
        console.log(error);
      })
    } else {
      return
    }
  }

  Changestory(e) {
    this.setState({
      activity: e
    })
    console.log(e);
  }

  Audioplay(e) {
    console.log(e);
    const audio = this.audio.current;
    if (e){
      audio.currentTime=0
      audio.play()
    } else {
      audio.pause();
    }
    this.setState({
      audioplay: !e
    })
  }

  render() {
    const story_choose_text = ["一","二","三","四","五","六","七"]
    const story = this.state.story;
    const audioplay = this.state.audioplay;
    const activity = this.state.activity;
    return (
      <React.Fragment>
      {story.length === 0 ? null :
      <div className="story">
        <div className="title">
          01/传记
        </div>
        <div className="content">
          <div className="choose">
            <div className="voice" onClick={this.Audioplay.bind(this, audioplay)}>
              <div className="cv">cv:{story.data.cv}</div>
              <div className="mp3">
                <img src={!audioplay ? require("./assets/pause.png").default : require("./assets/play.png").default} alt=""/>
                <audio ref={this.audio} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/mp3/"+this.props.heroid+".mp3?v=5"}>您的浏览器不支持音频播放。</audio>
              </div>
            </div>
            {story.data.story.map((item, index) => {
              return (
              <div className={activity !== (index+1) ? "story_choose" : "story_choose choosen"} key={story_choose_text[index]} onClick={this.Changestory.bind(this, index+1)}>
                {"传记" + story_choose_text[index]}
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
      attr_awake_before: [],
      attr_awake_after: [],
    }
  }

  componentDidMount() {
    axios.get("/api02/get_hero_attr?heroid="+ this.props.heroid+"&awake=0&level=1&star=2").then((response) => {
      this.setState({
        attr_awake_before: response.data.data
      })
    }).catch((error) => {
      console.log(error);
    })

    if (this.props.level !== "SP" && this.props.level !== "N" ){
      axios.get("/api02/get_hero_attr?heroid="+ this.props.heroid+"&awake=1&level=1&star=2").then((response) => {
        this.setState({
          attr_awake_after: response.data.data
        })
      }).catch((error) => {
        console.log(error);
      })
    } else {
      this.setState({
        attr_awake_after: ["SP or N can't awake!"]
      })
    }
  }

  componentDidUpdate(prevprops,prevstate) {
    /** 第一个参数是上一次的props，第二个参数是上一次的state */
    if (this.props !== prevprops) {
      axios.get("/api02/get_hero_attr?heroid="+ this.props.heroid+"&awake=0&level=1&star=2").then((response) => {
        this.setState({
          attr_awake_before: response.data.data
        })
      }).catch((error) => {
        console.log(error);
      })
  
      if (this.props.level !== "SP" && this.props.level !== "N" ){
        axios.get("/api02/get_hero_attr?heroid="+ this.props.heroid+"&awake=1&level=1&star=2").then((response) => {
          this.setState({
            attr_awake_after: response.data.data
          })
        }).catch((error) => {
          console.log(error);
        })
      } else {
        this.setState({
          attr_awake_after: ["SP can't awake!"]
        })
      }
    }
  }

  render() {
    const attr_awake_before = this.state.attr_awake_before;
    const attr_awake_after = this.state.attr_awake_after;
    const attr_level = ["D", "C", "B", "A", "S", "SS"]
    return (
      <React.Fragment>
        {attr_awake_before.length !== 0 && attr_awake_after.length !== 0 ? 
          <div className="heroattrinfo">
            <div className="title">
              02/情报
            </div>
            <div className="content">
              <div className="attr_name">
                <div className="not_visible awake_text">觉醒前</div>
                <img className="not_visible" src={"https://yys.res.netease.com/pc/zt/20161108171335/data/before_awake/"+this.props.heroid+".jpg?v4"} alt=""/>
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
                <img src={"https://yys.res.netease.com/pc/zt/20161108171335/data/before_awake/"+this.props.heroid+".jpg?v4"} alt=""/>
                <p>
                  <span className={attr_level[attr_awake_before.score.attack]}>{attr_level[attr_awake_before.score.attack]}</span>
                  <span>{"(" + Math.round(attr_awake_before.attack) + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_before.score.maxHp]}>{attr_level[attr_awake_before.score.maxHp]}</span>
                  <span>{"(" + Math.round(attr_awake_before.maxHp) + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_before.score.defense]}>{attr_level[attr_awake_before.score.defense]}</span>
                  <span>{"(" + Math.round(attr_awake_before.defense) + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_before.score.speed]}>{attr_level[attr_awake_before.score.speed]}</span>
                  <span>{"(" + attr_awake_before.speed + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_before.score.critRate]}>{attr_level[attr_awake_before.score.critRate]}</span>
                  <span>{"(" + attr_awake_before.critRate * 100 + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + (attr_awake_before.critPower * 100 + 100) + "%)" }</span>
                </p>
                <p>
                  <span>{"(" + attr_awake_before.debuffResist + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + attr_awake_before.debuffEnhance + "%)"}</span>
                </p>
              </div>
              {attr_awake_after.length !== 1 ?
              <div className="awake_after">
                <div className="awake_text">觉醒后</div>
                <img src={"https://yys.res.netease.com/pc/zt/20161108171335/data/after_awake/"+this.props.heroid+".jpg?v5"} alt=""/>
                <p>
                  <span className={attr_level[attr_awake_after.score.attack]}>{attr_level[attr_awake_after.score.attack]}</span>
                  <span>{"(" + Math.round(attr_awake_after.attack) + ")"}</span>
                  <span>{"(+" + Math.round(attr_awake_after.attack - attr_awake_before.attack) + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_after.score.maxHp]}>{attr_level[attr_awake_after.score.maxHp]}</span>
                  <span>{"(" + Math.round(attr_awake_after.maxHp) + ")"}</span>
                  <span>{"(+" + Math.round(attr_awake_after.maxHp - attr_awake_before.maxHp) + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_after.score.defense]}>{attr_level[attr_awake_after.score.defense]}</span>
                  <span>{"(" + Math.round(attr_awake_after.defense) + ")"}</span>
                  <span>{"(+" + Math.round(attr_awake_after.defense - attr_awake_before.defense) + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_after.score.speed]}>{attr_level[attr_awake_after.score.speed]}</span>
                  <span>{"(" + attr_awake_after.speed + ")"}</span>
                  <span>{"(+" + Math.round(attr_awake_after.speed - attr_awake_before.speed) + ")"}</span>
                </p>
                <p>
                  <span className={attr_level[attr_awake_after.score.critRate]}>{attr_level[attr_awake_after.score.critRate]}</span>
                  <span>{"(" + attr_awake_after.critRate * 100 + "%)"}</span>
                  <span>{"(+" + (Math.round(attr_awake_after.critRate *100 - attr_awake_before.critRate * 100)) + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + (attr_awake_after.critPower * 100 + 100) + "%)" }</span>
                  <span>{"(+" + (Math.round(attr_awake_after.critPower *100 - attr_awake_before.critPower * 100)) + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + attr_awake_after.debuffResist + "%)"}</span>
                  <span>{"(+" + (Math.round(attr_awake_after.debuffResist *100 - attr_awake_before.debuffResist * 100)) + "%)"}</span>
                </p>
                <p>
                  <span>{"(" + attr_awake_after.debuffEnhance + "%)"}</span>
                  <span>{"(+" + (Math.round(attr_awake_after.debuffEnhance *100 - attr_awake_before.debuffEnhance * 100)) + "%)"}</span>
                </p>
              </div>  
              :
              <div className="noawake">
                <div className="not_visible">觉醒后</div>
                <img className="not_visible" src={"https://yys.res.netease.com/pc/zt/20161108171335/data/before_awake/"+this.props.heroid+".jpg?v4"} alt=""/>
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
      heroinfo: [],
      heroidlist: [],
      heroidchoose: false,
      activity: "全部",
      len: 0,
      bigchoose: [true, false, false],
      skin_choose: 1
    }
    this.oldScrollTop = 0;
    this.imgonload = this.imgonload.bind(this);
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
    axios.get("/api/pc/zt/20161108171335/js/app/all_shishen.json?v70").then((response) => {
      this.setState({
        heroidlist: response.data
      });
      /* 调用api获得数据后加载图片 */
      this.imgonload(750);
    }).catch((error) => {
      console.log(error);
    })
  }
  
  Changelevel(e) {
    console.log(e)
    this.setState({
      activity: e
    })
    this.imgonload(20000);
  }

  bigchoose(e) {
    const bigchoose = e;
    const heroinfo = this.state.heroinfo;
    const skin_choose = this.state.skin_choose;
    if (heroinfo[3]===undefined) {
      console.log("没有皮")
      return
    }
    if (heroinfo[3] !== undefined && heroinfo[3] !== null && heroinfo[3].length >= 2) {
      if (skin_choose === heroinfo[3].length) {
        this.setState({
          skin_choose: 1
        })
      } else {
        this.setState({
          skin_choose: skin_choose + 1
        })
      }
    }
    this.setState({
      bigchoose: bigchoose
    })
  }

  heroid(e) {
    this.setState({
      heroidchoose: true,
      heroinfo: e
    })
  }

  return(e) {
    this.setState({
      heroidchoose: false
    });
  }

  /* 图片懒加载 */
  imgonload(top) {
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
      this.imgonload(top);
      this.oldScrollTop = e.target.scrollTop;
      /* 如果上拉，因为已经加载过图片了，不操作 */
    } else if (e.target.scrollTop - this.oldScrollTop < 0) {
      return;
    }
    else {
      this.debounce(this.imgonload, top);
    }
  }

  nexthero(e){
    const heroidlist_item = this.state.heroidlist[e+1];
    const info = [heroidlist_item.id,heroidlist_item.name,heroidlist_item.level,heroidlist_item.skin,e+1];
    this.setState({
      heroinfo: info,
      bigchoose: [true, false, false],
    })
  }

  prevhero(e){
    const heroidlist_item = this.state.heroidlist[e-1];
    const info = [heroidlist_item.id,heroidlist_item.name,heroidlist_item.level,heroidlist_item.skin,e-1];
    this.setState({
      heroinfo: info,
      bigchoose: [true, false, false],
    })
  }

  render() {
    const heroinfo = this.state.heroinfo;
    const heroidlist = this.state.heroidlist;
    const heroidchoose = this.state.heroidchoose;
    const activity = this.state.activity;
    const skin_choose = this.state.skin_choose;
    const bigchoose = this.state.bigchoose;
    const shishen_big_beforeAwake = "https://yys.res.netease.com/pc/zt/20161108171335/data/shishen_big_beforeAwake/"+heroinfo[0]+".png?v6"
    const shishen_big_afterAwake = "https://yys.res.netease.com/pc/zt/20161108171335/data/shishen_big_afterAwake/"+heroinfo[0]+".png?v6"
    return (
      <div className="showall">
        {!heroidchoose ? 
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
              <HeroChoose level="全部" activity={activity} Changelevel={this.Changelevel.bind(this)}/>
              <HeroChoose level="联动" activity={activity} Changelevel={this.Changelevel.bind(this)}/>
              <HeroChoose level="SP" activity={activity} Changelevel={this.Changelevel.bind(this)}/>
              <HeroChoose level="SSR" activity={activity} Changelevel={this.Changelevel.bind(this)}/>
              <HeroChoose level="SR" activity={activity} Changelevel={this.Changelevel.bind(this)}/>
              <HeroChoose level="R" activity={activity} Changelevel={this.Changelevel.bind(this)}/>
              <HeroChoose level="N" activity={activity} Changelevel={this.Changelevel.bind(this)}/>
            </div>
          </div>
          <div className="content" onScroll={this.onScroll.bind(this)}>
            {heroidlist.map((item, index) => {
              const info = [item.id,item.name,item.level,item.skin,index];
              return (
                <div className={activity === item.level ? "hero_info" : 
                               (activity === "联动" && item.interactive === true) ? "hero_info" :
                               (activity === "全部") ? "hero_info" : "hide"} key={item.id + item.name}
                     onClick={this.heroid.bind(this, info)}>
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
              <div className="name">{heroinfo[1]}</div>
              <div className="level">{heroinfo[2]}</div>             
            </div>
            {(heroinfo[3] !== undefined && heroinfo[3] !== null) ? 
            <div className={(heroinfo[3] !== undefined && !bigchoose[2]) ? "info hide" : "info"}>
              <div className="skin_name">{heroinfo[3][skin_choose-1].name}</div> 
            </div>
            : null}
            <div className="shishen_big_beforeAwake">
              {bigchoose[0] ? 
              <img src={shishen_big_beforeAwake} alt=""/>
              :
              (bigchoose[1]) ?
              <img src={shishen_big_afterAwake} alt=""/>
              :
              (bigchoose[2]) && heroinfo[3] !== null ?
              heroinfo[3].map((item, index) => {
                return (
                  skin_choose === (index+1) ? 
                  <img key={item.name} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/shishen_skin/"+heroinfo[0]+"-"+skin_choose+".png"} alt=""/>
                  : null
                )
              }):null}
              <div className="big_choose">
                {bigchoose[0] ? 
                  <img src={require("./assets/chushi_click.png").default} alt=""/>
                : 
                  <img onClick={this.bigchoose.bind(this, [true, false, false])} src={require("./assets/chushi_noclick.png").default} alt=""/>
                }
                {bigchoose[1] ? 
                  <img src={require("./assets/juexing_click.png").default} alt=""/>
                : 
                  <img onClick={heroinfo[2]!=="SP" ? this.bigchoose.bind(this, [false, true, false]) : null} src={require("./assets/juexing_noclick.png").default} alt=""/>
                }
                {bigchoose[2] ? 
                  <img onClick={this.bigchoose.bind(this, [false, false, true])} src={require("./assets/pifu_click.png").default} alt=""/>
                : 
                  <img onClick={heroinfo[3]!==undefined && heroinfo[3]!==null ?this.bigchoose.bind(this, [false, false, true]) : null} src={require("./assets/pifu_noclick.png").default} alt=""/>
                }
              </div>
            </div>
          </div>
        </div>
          <Story heroid={heroinfo[0]}/>
          <Attr heroid={heroinfo[0]} level={heroinfo[2]}/>
          <div className="allhero">
            <div className="return" onClick={this.return.bind(this)}>返回式神录</div>
          </div>
          <div className="changebtn">
            {heroinfo[4] !== 0 ?
            <div className="prevbtn">
              <img onClick={this.prevhero.bind(this, heroinfo[4])} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/mark_btn/"+(heroidlist[heroinfo[4]-1].id)+".png?v5"} alt=""/>
              <div className="btn_text">
                {heroidlist[heroinfo[4]-1].name}
                <br></br>上一个
              </div>
            </div>
              : null}
            {heroinfo[4] !== heroidlist.length-1 ?
            <div className="nextbtn">
              <img onClick={this.nexthero.bind(this, heroinfo[4])} src={"https://yys.res.netease.com/pc/zt/20161108171335/data/mark_btn/"+(heroidlist[heroinfo[4]+1].id)+".png?v5"} alt=""/>
              <div className="btn_text">
                {heroidlist[heroinfo[4]+1].name}
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
