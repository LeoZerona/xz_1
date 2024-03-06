import { defineStore } from "pinia";
type stageType = {
  name: string,
  text: string
}
type dataType = {
  label: string,
  stage: stageType[]
}
export const stageData = defineStore('stage', {
  state: ()=>{
    return {
      ppbsStageInfo: {},  // 偏旁部首的关卡信息
    }
  },
  getters: {
    // getPpbsStageInfo: (state)=>{
    //   return state.ppbsStageInfo
    // }
  },
  actions: {
    setPpbsStageInfo(newValue: dataType, state: any){
      this.ppbsStageInfo = newValue
    }
  }
})
