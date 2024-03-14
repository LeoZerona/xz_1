<template>
  <!-- 答题区 -->
  <el-card class="answer-card">
    <div class="learn-card">
      <div class="title">选择以下正确的选项</div>
      <el-progress
        class="progress-bar"
        :percentage="percentage"
        :text-inside="true"
        :stroke-width="20"
        :color="customColors"
        :format="format"
      />
      <div class="characters">{{ topic.answer }}</div>
      <div class="search" @click="searchCharacter">
        <el-icon><Search /></el-icon>
      </div>
      <!-- 选择题 -->
      <!-- style="display: none;" -->
      <div class="options" v-show="topic.type === 'select'">
        <el-button
          v-for="(item, index) in topic.options"
          :key="index"
          class="option"
          @click="judge(item)"
          >{{ item }}</el-button
        >
      </div>
      <!-- 填空题 -->
      <!-- style="display: none;" -->
      <div class="fill_blank">
        <el-input
          class="input_box"
          v-model="blankAnswer"
          placeholder="请输入对应答案"
          clearable
        />
        <el-button
          type="primary"
          class="btn"
          style="color: aliceblue"
          @click="judge(blankAnswer)"
          >确定</el-button
        >
      </div>
    </div>
    <!-- 答题提示 -->
    <el-card class="err-tip" v-if="correct !== null" :style="tipStyle.style">
      <div class="head">
        <el-icon class="icon">
          <component :is="tipStyle.icon"></component>
        </el-icon>
        <div class="text">{{ tipStyle.head.text }}</div>
      </div>
      <div class="content">
        <div class="tip">参考答案：</div>
        <div class="answer">
          <span class="answer-xiaozhuan">{{ topic.answer }}</span>
          <span class="answer-jianti">（{{ topic.answer }}）</span>
        </div>
        <el-button
          :type="correct ? 'success' : 'danger'"
          class="btn"
          @click="next"
          >知道了</el-button
        >
      </div>
    </el-card>
  </el-card>
  <!-- 搜词区 -->
  <el-card class="search-card"></el-card>
  <name-slot-dialog :dialogFlog="endDialog" title="完成">
    <template #content>
      <div>恭喜你完成本次学习！</div>
    </template>
    <template #foot>
      <el-button @click="endDialog = false">取消</el-button>
      <el-button type="primary" @click="backHome">确认</el-button>
    </template>
  </name-slot-dialog>
</template>

<script lang="ts" setup name="unitCard">
import { unitData } from "@/store/unit.ts";
import { storeToRefs } from "pinia";
import func from "../../vue-temp/vue-editor-bridge";
const unit = unitData();
const { endDialog } = storeToRefs(unit);
interface TopicType {
  index: number;
  count: number;
  type: string;
  answer: string;
  options: Array<string>;
}
const router = useRouter();
const { topic } = defineProps({
  topic: {
    type: Object as PropType<TopicType>,
    required: true,
    // 如果需要默认值可以在这里添加 default: () => ({ /* 默认对象 */ })
  },
});
const emit = defineEmits(["next"]);
const format = (percentage: number) =>
  percentage === 100 ? "Full" : `${topic.index}/${topic.count}`;
const customColors = [
  { color: "#9DD3A8", percentage: 20 },
  { color: "#F7D794", percentage: 40 },
  { color: "#FFAB91", percentage: 60 },
  { color: "#6A82FB", percentage: 80 },
  { color: "#78E08F", percentage: 100 },
];
const correct: Ref<boolean | null> = ref(null);
const blankAnswer: Ref<string> = ref("");
const tipStyle = reactive({
  icon: "CircleCheckFilled",
  style: {
    color: "#92d436",
  },
  head: {
    text: "太棒了！",
  },
});
const percentage: Ref<number> = ref(0);
onMounted(() => {});
// 监听correct
watchEffect(() => {
  console.log("correct changed:", correct.value);
  if (correct.value) {
    tipStyle.icon = "CircleCheckFilled";
    tipStyle.style = {
      color: "#92d436",
    };
    tipStyle.head.text = "太棒了！";
  } else {
    tipStyle.icon = "CircleCloseFilled";
    tipStyle.style = {
      color: "#d74746",
    };
    tipStyle.head.text = "可惜";
  }
});
function initData() {
  correct.value = null;
  blankAnswer.value = "";
}
function judge(select: string) {
  topic.answer === select ? (correct.value = true) : (correct.value = false);
}
function next() {
  console.log("啥玩意啊草？", topic);

  initData();
  percentage.value = Math.floor((topic.index / topic.count) * 100);
  console.log("啥玩意？", percentage.value);

  // 赋值进度条
  topic.index === topic.count - 1 ? (endDialog.value = true) : emit("next");
}
function backHome() {
  endDialog.value = false;
  // 使用replace进行路由跳转
  router.replace({ path: "/home" }).catch((err: any) => {
    // 处理错误（如果有的话），但通常情况下，重复导航到相同路由会报错。
    if (err.name !== "NavigationDuplicated") {
      console.error("路由跳转路径相同！", err);
    }
  });
}
function searchCharacter(){
  console.log('文字检索');
  
}
</script>

<style lang="scss" scoped>
.answer-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 550px;

  .learn-card {
    .title {
      font-size: 20px;
      font-weight: 700;
    }

    .progress-bar {
      margin-top: 10px;
    }

    .characters {
      margin-top: 30px;
      font-size: 50px;
      text-align: center;
      font-family: "FangZhengXiaoZhuan";
    }

    .search {
      position: absolute;
      top: 16%;
      right: 0;
      width: 30px;
      height: 15px;
      padding: 5px;
      cursor: pointer;
      border: 1px solid #c1c1c1;
      color: #c1c1c1;
      border-radius: 14px 0px 0px 14px;
      border-right: 0px;
    }
    .search:hover {
      color: #40a9ff;
      border: 1px solid #40a9ff;
      border-right: 0px;
    }

    .options {
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      .option {
        height: 64px;
        font-size: 20px;
        margin-top: 25px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      }
    }

    .options > *:first-child {
      margin-left: 12px;
    }

    .fill_blank {
      margin-top: 50px;

      .input_box {
        margin-top: 15px;
        height: 50px;
        line-height: 50px;
      }
    }
  }

  .err-tip {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;

    .head {
      display: flex;
      height: 30px;
      line-height: 30px;

      .icon {
        font-size: 30px;
        margin-top: 2px;
      }

      .text {
        font-size: 30px;
        margin-left: 10px;
      }
    }

    .content {
      margin-top: 10px;

      .tip {
        font-size: 18px;
        font-weight: 600;
      }

      .answer {
        margin-top: 10px;
        font-size: 20px;

        .answer-xiaozhuan {
          font-family: "FangZhengXiaoZhuan";
        }
      }
    }
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    color: #191b26;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
    box-shadow: inset 2px -5px 4px rgba(0, 0, 0, 0.2);
  }

  .btn:focus {
    color: rgba($color: #191b26, $alpha: 0.5);
  }
}
</style>
