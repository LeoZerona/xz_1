import{E as h,_ as f}from"./_plugin-vue_export-helper-DvM9P7hw.js";import{d as v,u as g,r as i,a as y,o as b,c as k,b as e,e as d,w,v as S,f as x,g as n,h as C,F as B,i as r,p as I,j as V}from"./index-BXoWoU05.js";const N="/assets/home_video-B3w0AnxT.mp4",T="/assets/home_music-DQ8c5XVt.mp3",c=o=>(I("data-v-7416ec87"),o=o(),V(),o),E=c(()=>e("source",{src:N,type:"video/mp4"},null,-1)),D=c(()=>e("source",{src:T,type:"audio/mp3"},null,-1)),F=r('<div class="circle" data-v-7416ec87></div><div class="triangle" data-v-7416ec87><div class="top" data-v-7416ec87></div><div class="bottom" data-v-7416ec87></div><div class="right" data-v-7416ec87></div></div>',2),Y=[F],j={class:"start-area"},A=c(()=>e("div",{class:"left-line"},[e("div",{class:"left-top-line"}),e("div",{class:"left-bottom-line"})],-1)),P={class:"middle-content"},Q=r('<div class="graph" data-v-7416ec87><div class="left-top" data-v-7416ec87></div><div class="right-top" data-v-7416ec87></div><div class="left-bottom" data-v-7416ec87></div><div class="right-bottom" data-v-7416ec87></div></div>',1),R=c(()=>e("div",{class:"right-line"},[e("div",{class:"right-top-line"}),e("div",{class:"right-bottom-line"})],-1)),X=v({name:"home"}),q=v({...X,setup(o){const p=g(),t=i(null),s=i(null),a=i(!0);function l(){console.log("暂停：",t,s),a.value=!a.value,t.value&&s.value&&(a.value?(t.value.play(),s.value.play()):(t.value.pause(),s.value.pause()))}function _(){p.push({path:"/topic_bank"})}return(z,G)=>{const u=y("Top"),m=h;return b(),k(B,null,[e("video",{ref_key:"video",ref:t,class:"video",autoplay:"",loop:"",muted:"",onClick:l},[E,d(" Your browser does not support the video tag. ")],512),e("audio",{ref_key:"music",ref:s,autoplay:"",loop:""},[D,d(" Your browser does not support the audio element. ")],512),w(e("div",{class:"playBtn",onClick:l},Y,512),[[S,!x(a)]]),e("div",j,[A,e("div",P,[Q,e("div",{class:"btn",onClick:_},[n(m,{class:"icon"},{default:C(()=>[n(u)]),_:1}),d(" 开始学习 ")])]),R])],64)}}}),K=f(q,[["__scopeId","data-v-7416ec87"]]);export{K as default};
