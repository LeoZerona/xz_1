import { defineStore } from "pinia";
export const unitData = defineStore('unit', {
  state: ()=>{
    return {
      endDialog: false
    }
  }
})