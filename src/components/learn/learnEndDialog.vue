<template>
  <!-- <characters-big-look></characters-big-look> -->
  <!-- 学习结束之后的弹窗 -->
  <name-slot-dialog
    :dialogFlog="endDialog"
    :dialogConfig="dialogConfig"
    :beforeCloseFn="dialogClose"
  >
    <template #header>恭喜你！完成答题</template>
    <template #content>
      <div id="chart" style="width: 666px; height: 270px"></div>
      <el-tabs type="border-card" class="topic-border">
        <el-tab-pane
          v-for="(item, index) in panels"
          :key="index"
          :label="item.label"
        >
          <el-scrollbar height="200px">
            <div
              v-for="(obj, index) in topicListObj[item.arrName]"
              :key="index"
              class="topic"
              @click="lookBig(getCharacter(item, obj, index))"
              :style="textColor(item, obj)"
            >
              <character-display
                :character="getCharacter(item, obj, index)"
                size="medium"
              />
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <!--  -->
      </el-tabs>
    </template>
    <template #footer>
      <el-button @click="learnAgain">再学一遍</el-button>
      <el-button @click="errReLearn">错题重练</el-button>
      <el-button @click="backCatalog">回到目录</el-button>
    </template>
  </name-slot-dialog>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { storeToRefs } from "pinia";
import CharacterDisplay from "@/components/common/CharacterDisplay.vue";
// 选择的单元信息
import { unitInfoHomeData } from "@/store/home";
const unitInfoHome = unitInfoHomeData();
const { unitInfo } = storeToRefs(unitInfoHome);
// 在单元学习中产生的学习信息
import { unitData } from "@/store/unit";
const unit = unitData();
const { endDialog, errorTopics } = storeToRefs(unit);

const router = useRouter();
const emit = defineEmits(["showBigCharactersPanel"]); // 调用父组件方法
const dialogConfig: Ref<any> = ref({
  width: 700, // 弹窗宽度
  appendToBody: true, // Dialog 自身是否插入至 body 元素上。
  closeOnClickModal: false, // 是否支持点击空白处关闭弹窗
  closeOnPressEscape: false, // 是否支持通过按下ESC关闭弹窗
  showClose: true, // 是否显示关闭按钮
});
const topicListObj = reactive({
  all: [],
  correct: [],
  error: [],
});
const panels = [
  {
    label: "全部",
    arrName: "all", // 与topicListObj中的数组对应
  },
  {
    label: "正确",
    arrName: "correct", // 与topicListObj中的数组对应
  },
  {
    label: "错误",
    arrName: "error", // 与topicListObj中的数组对应
  },
];
let myChartInstance: echarts.ECharts | null = null;

onMounted(() => {});

// 监听 endDialog 的变化
watch(endDialog, (newVal: boolean) => {
  if (newVal) {
    topicListObj.error = [...errorTopics.value.errIndexs];
    topicListObj.all = new Array(unitInfo.value.characters.length)
      .fill(0)
      .map((val, index) => (topicListObj.error.includes(index) ? 1 : 0)); // 赋值全部数组值，错题为1，正确为0
    
    topicListObj.correct = Array.from(
      { length: unitInfo.value.characters.length },
      (_, index) => index
    );
    topicListObj.correct = topicListObj.correct.filter(
      (item: number) => !topicListObj.error.includes(item)
    );
    
    nextTick(() => {
      const chartDom = document.getElementById("chart");
      if (chartDom) {
        data1[0] = topicListObj.correct.length;
        data1[1] = topicListObj.error.length;
        constructChat();
        
        // 如果图表实例已存在，先销毁
        if (myChartInstance) {
          myChartInstance.dispose();
        }
        
        myChartInstance = echarts.init(chartDom);
        if (option && Object.keys(option).length > 0) {
          myChartInstance.setOption(option);
        }
      }
    });
  }
});

onBeforeUnmount(() => {
  // 清理图表实例
  if (myChartInstance) {
    myChartInstance.dispose();
    myChartInstance = null;
  }
});

function getCharacter(item: any, obj: any, index: number): string {
  if (item.arrName === "all") {
    return unitInfo.value.characters[index];
  } else {
    return unitInfo.value.characters[obj];
  }
}

function textColor(item: any, flag: number) {
  const style = { color: "#67C23A" };
  switch (item.arrName) {
    case "all":
      flag ? (style.color = "#F56C6C") : ""; // 当flag为1时，表示当前题目答错了
      break;
    case "correct":
      style.color = "#67C23A";
      break;
    case "error":
      style.color = "#F56C6C";
      break;
  }
  return style;
}
const color = ["#409eff", "#ff4343"];
const data1 = reactive([0, 0]);
let option: any = {};

function constructChat() {
  // 重置变量
  const list: Array<any> = [];
  let total = 0;
  
  // 计算总数
  for (let i = 0; i < data1.length; i++) {
    total += data1[i];
  }
  
  if (total === 0) {
    option = {};
    return; // 如果没有数据，不构建图表
  }

  let placeHolderStyle = {
    normal: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      color: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(0, 0, 0, 0)",
      borderWidth: 0,
    },
  };

  let rich = {
    white: {
      align: "center",
      padding: [3, 0],
    },
  };

  for (let i in data1) {
    list.push(
      {
        value: data1[i],
        itemStyle: {
          normal: {
            borderWidth: 5,
            borderColor: color[i],
            color: color[i],
          },
        },
      },
      {
        value: total / 40,
        name: "",
        itemStyle: placeHolderStyle,
      }
    );
  }

  let func = (params: any) => {
    let percent = ((params.value / total) * 100).toFixed(1);
    let name = params.name.replace(/\n/g, "");
    if (params.name !== "") {
      return name + "\n{white|" + percent + "%}";
    } else {
      return "";
    }
  };

  let correctPercent = ((data1[0] / total) * 100).toFixed(1) + "%";
  let wrongPercent = ((data1[1] / total) * 100).toFixed(1) + "%";

  option = {
    tooltip: {
      show: true,
      position: function (point, params, dom, rect, size) {
        // 根据饼图的位置进行判断tooltip显示在左侧还是右侧
        var x = point[0];
        if (x < size.viewSize[0] / 2) {
          return [point[0] - dom.offsetWidth - 10, point[1]];
        } else {
          return [point[0] + 10, point[1]];
        }
      },
      formatter: function (params) {
        if (
          params.seriesType === "pie" &&
          params.seriesIndex === 0 &&
          params.dataIndex === 0
        ) {
          return "正确率：" + correctPercent + "<br>" + "正确数：" + data1[0];
        } else if (params.seriesType === "pie" && params.dataIndex === 2) {
          return "错误率：" + wrongPercent + "<br>" + "错误数：" + data1[1];
        } else {
          return "";
        }
      },
      axisPointer: {
        type: "shadow",
      },
      extraCssText: "box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      textStyle: {
        color: "#333",
        fontSize: 12,
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "",
        type: "pie",
        clockWise: false,
        startAngle: "90",
        center: ["50%", "50%"],
        radius: ["50%", "51%"],
        hoverAnimation: false,
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
          },
        },
        data: list,
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx: any) {
          return idx * 50;
        },
        emphasis: {
          // 设置鼠标移上去的放大效果
          scale: true,
        },
      },
      {
        name: "",
        type: "pie",
        center: ["50%", "48%"], // 调整位置
        radius: ["20%", "20%"],
        itemStyle: {
          color: "transparant",
        },
        startAngle: "90",
        data: [
          {
            value: data1[0],
            name: "",
            label: {
              normal: {
                show: true,
                formatter: "{c|" + correctPercent + "}",
                rich: {
                  c: {
                    color: color[0],
                    fontSize: 30,
                    fontWeight: "bold",
                  },
                },
                textStyle: {
                  fontSize: 30,
                  fontWeight: "bold",
                },
                position: "center",
              },
            },
          },
        ],
      },
      {
        name: "",
        type: "pie",
        center: ["50%", "60%"],
        radius: ["20%", "20%"],
        itemStyle: {
          color: "transparant",
        },
        startAngle: "90",
        data: [
          {
            value: data1[0],
            name: "",
            label: {
              normal: {
                show: true,
                formatter: "{c|" + data1[0] + "} {g|/} {d|" + data1[1] + "}",
                rich: {
                  c: {
                    color: color[0],
                    fontSize: 20,
                    fontWeight: "bold",
                  },
                  g: {
                    color: "#00FF00", // 绿色
                    fontSize: 20,
                    fontWeight: "bold",
                  },
                  d: {
                    color: color[1],
                    fontSize: 20,
                    fontWeight: "bold",
                  },
                },
                position: "center",
              },
            },
          },
        ],
      },
    ],
  };
}
function lookBig(characters: string) {
  emit("showBigCharactersPanel", characters);
}
function learnAgain() {
  errorTopics.value.relearn = false;
  errorTopics.value.errIndexs = [];
  endDialog.value = false; // 关闭学习结束弹窗
  router.replace("./unit_learn");
}
function errReLearn() {
  errorTopics.value.relearn = true;
  endDialog.value = false; // 关闭学习结束弹窗
  router.replace("./unit_learn");
}
function dialogClose() {
  endDialog.value = false; // 关闭学习结束弹窗
  router.replace("./topic_bank");
}
function backCatalog() {
  endDialog.value = false; // 关闭学习结束弹窗
  router.replace("./topic_bank");
}
</script>

<style scoped lang="scss">
.topic-border {
  .topic {
    display: flex;
    font-size: 25px;
    background-color: #e6e9f3;
    border-radius: 15px;
    padding: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明灰色背景 */
  z-index: 9999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    max-width: 500px !important;
    margin: 5vh auto !important;
  }

  #chart {
    width: 100% !important;
    height: 200px !important;
  }

  .topic-border {
    :deep(.el-tabs__content) {
      padding: 10px;
    }

    .topic {
      font-size: 20px;
      padding: 8px;
      margin-bottom: 8px;
    }
  }
}

@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 3vh auto !important;
  }

  #chart {
    height: 180px !important;
  }

  .topic-border {
    .topic {
      font-size: 18px;
      padding: 6px;
      margin-bottom: 6px;
    }
  }

  :deep(.el-button) {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
