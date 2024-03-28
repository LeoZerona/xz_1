<template>
  <!-- <characters-big-look></characters-big-look> -->
  <!-- 学习结束之后的弹窗 -->
  <name-slot-dialog :dialogFlog="true" :dialogConfig="dialogConfig">
    <template #header>恭喜你！完成答题</template>
    <template #content>
      <div id="chart" style="width: 666px; height: 270px"></div>
      <el-tabs type="border-card" class="topic-border">
        <el-tab-pane label="全部">
          <div class="topic" style="color: #ff4343">
            <div class="xz">简</div>
            |
            <div class="ft">简</div>
            |
            <div class="jt">简</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="正确">Config</el-tab-pane>
        <el-tab-pane label="错题">Role</el-tab-pane>
      </el-tabs>
    </template>
    <template #footer>
      <el-button>再学一遍</el-button>
      <el-button>错题重练</el-button>
      <el-button>回到目录</el-button>
    </template>
  </name-slot-dialog>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
const dialogConfig: Ref<any> = ref({
  width: 700, // 弹窗宽度
  appendToBody: true, // Dialog 自身是否插入至 body 元素上。
  closeOnClickModal: true, // 是否支持点击空白处关闭弹窗
  closeOnPressEscape: true, // 是否支持通过按下ESC关闭弹窗
  showClose: true, // 是否显示关闭按钮
});

let color = ["#409eff", "#ff4343"];
let names = ["正确", "错误"];
let data1 = [13, 12];
let list = [];
let total = 0;
for (let i in data1) {
  total += data1[i];
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

const option: any = {
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

onMounted(() => {
  nextTick(() => {
    const chartDom = document.getElementById("chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      option && myChart.setOption(option);
    } else {
      console.error('找不到 ID 为 "chart" 的元素');
    }
  });
});
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
    .xz,
    .ft,
    .jt {
      margin: 0 5px;
      font-weight: 700;
    }
    .xz {
      font-family: "FangZhengXiaoZhuan";
    }
    .ft {
      font-family: "HanYiKaiTiFan";
    }
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
</style>
