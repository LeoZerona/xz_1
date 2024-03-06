import { defineStore } from 'pinia'
// useMain  可以是 useUser、useCart 之类的名字 
// defineStore('main',{..}) 在devtools 就使用 main 这个名
export const unitInfoHomeData = defineStore('unitInfoHome', {
    // 相当于data
    state: () => {
        return {
            unitInfo: {},
            unitInfoDialogFlog: false
        }
    },
    // 相当于计算属性
    getters: {
        getunitInfo: (state) => {
            return state.unitInfo
        },
        getUnitInfoDialogFlog: (state) =>{
            return state.unitInfoDialogFlog
        }
    },
    // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
    actions: {
        setunitInfo(newValue: any){
            this.unitInfo = newValue
        },
        setUnitInfoDialogFlog(newValue: boolean){
            this.unitInfoDialogFlog = newValue
        }
    },
})
export const learnInfoHomeData = defineStore('learnInfoHome', {
    state: ()=>{
        return {
            learnConfig: {}
        }
    },
    getters:{
    },
    actions: {
        setLearnConfig(newValue: any){
            this.learnConfig = newValue
        }
    }
})