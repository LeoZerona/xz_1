import { defineStore } from "pinia";
export const unitData = defineStore("unit", {
  state: () => {
    return {
      endDialog: false, // 结束学习弹窗显示的标志
      errorTopics: {
        relearn: false, // 学习结束后，是否为错题重学的标志
        errIndexs: [], // 错字的index标志
      },
    };
  },
  actions: {
    setErrorTopicErrIndexs(newValue: number[]) {
      this.errorTopics.errIndexs = newValue;
    },
  },
});
