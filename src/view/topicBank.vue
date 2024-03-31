<template>
  <navigation></navigation>
  <div class="contain">
    <div class="left">
      <!-- <part
        v-for="item in textInfo.part"
        :key="item.name"
        :data="item.content"
        :id="item.name"
      ></part> -->
      <name-slot-dialog
        title="单元详情"
        :dialogFlog="unitInfoDialogFlog"
        class="unit-dialog"
      >
        <template v-slot:content>
          <div class="content">
            <div class="name">{{ unitInfo.name }}</div>
            <div class="learn-content">
              本次学习内容：{{ unitInfo.characters.join("、") }}
            </div>
            <div class="num">数量：{{ unitInfo.characters.length }}</div>
            <span>模式选择：</span>
            <el-radio-group v-model="modeSel">
              <el-radio label="select">选择</el-radio>
              <el-radio label="write">填写</el-radio>
              <el-radio label="mix">混合</el-radio>
            </el-radio-group>
          </div>
        </template>

        <template v-slot:foot>
          <div class="dialog-footer">
            <el-button @click="unitInfoDialogFlog = false">退出</el-button>
            <el-button type="primary" @click="learnStart"> 开始学习 </el-button>
          </div>
        </template>
      </name-slot-dialog>
      <!-- 步骤条 -->
      <div class="step-bar" style="height: 300px; max-width: 600px">
        <el-steps direction="vertical" :active="partStage">
          <el-step
            class="step-bar-item"
            v-for="item in textInfo.part"
            :key="item.name"
            :title="item.label"
            @click="partLocation(item.name)"
          />
        </el-steps>
        <el-icon v-show="!isAtTop" class="icon-top" @click="backTop">
          <Upload />
        </el-icon>
      </div>
    </div>
    <div class="right">
      <div class="btn" @click="searchValue.searchDrawerFlog = true">
        <el-icon><Search /></el-icon>
      </div>
    </div>
  </div>
  <!-- 抽屉面板 -->
  <el-drawer
    v-model="searchValue.searchDrawerFlog"
    title="字典查字"
    :direction="direction"
    :before-close="handleClose"
    class="search-drawer"
  >
    <el-input
      v-model="searchValue.searchKey"
      style="width: 360px"
      :placeholder="searchValue.searchTip"
      :suffix-icon="Search"
      class="search-input"
    />
    <div class="search-result">
      <div class="result">
        简：
        <div class="jt"></div>
      </div>
      <div class="result">
        繁：
        <div class="ft"></div>
      </div>
      <div class="result">
        篆：
        <div class="xz"></div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="home">
import _ from "lodash";
import { textInfo } from "@/static/text_res";
import { unitInfoHomeData, learnInfoHomeData } from "@/store/home";
import { storeToRefs } from "pinia";
import { Search } from "@element-plus/icons-vue";
interface PartType {
  name: string;
}
interface partElementType {
  // elementEntity: HTMLElement | null;
  position: number | undefined;
}

const partElements: Array<partElementType> = Array.from(
  { length: textInfo.part.length },
  () => ({ position: 0 })
);
const unitInfoHome = unitInfoHomeData();
const learnInfoHome = learnInfoHomeData();
const { unitInfo, unitInfoDialogFlog } = storeToRefs(unitInfoHome);
const modeSel: Ref<string> = ref("select");
const router = useRouter();
const partStage: Ref<number> = ref(0);
const isAtTop: Ref<boolean> = ref(true);
const direction = ref<"rtl" | "ltr" | "ttb" | "btt" | undefined>("rtl");
const searchValue: Ref<any> = ref({
  searchKey: "",
  searchTip: "请输入文字查询小篆",
  searchDrawerFlog: false,
});
onMounted(() => {});
// 监听方法
watchEffect(() => {
  console.log("unitInfo changed:", unitInfoDialogFlog.value);
});
// 监听滚动条所在的区域，对左侧激活区域进行切换
const debouncedHandleScroll = _.throttle(() => {
  textInfo.part.forEach((item: PartType, index: number) => {
    const ele: HTMLElement | null = document.getElementById(item.name);
    partElements[index].position = ele?.offsetTop;
  });
  isAtTop.value = window.scrollY === 0;
  const scrollPosition = window.scrollY; // 初始位置
  for (let i = 0; i < partElements.length; i++) {
    const element = partElements[i];
    if (scrollPosition >= element.position! - 100) {
      partStage.value = i;
    }
  }
}, 300);
window.addEventListener("scroll", debouncedHandleScroll);
// 开始学习
function learnStart() {
  unitInfoHome.setUnitInfoDialogFlog(false);
  learnInfoHome.setLearnConfig({
    model: modeSel.value,
  });
  router.push({
    path: "/unit_learn",
  });
}
// 模块定位
function partLocation(name: string) {
  switch (name) {
    case "ppbs":
      partStage.value = 0;
      break;
    case "yjhz":
      partStage.value = 1;
      break;
    case "ejhz":
      partStage.value = 2;
      break;
  }
  const targetElement = document.getElementById(name);
  if (targetElement) {
    const start = window.pageYOffset; // 初始位置
    const end = targetElement.offsetTop; // 目标位置
    const distance = end - start; // 滚动距离
    const duration = 500; // 动画持续时间
    let startTime: number;
    function scrollToTarget(timestamp: number) {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // 计算进度
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; // 缓动函数
      const scrollPosition = start + distance * easeInOutCubic(progress);
      window.scrollTo(0, scrollPosition);
      if (
        (distance > 0 && scrollPosition < start + distance) ||
        (distance < 0 && scrollPosition > start + distance)
      ) {
        requestAnimationFrame(scrollToTarget); // 继续下一帧动画
      }
    }
    requestAnimationFrame(scrollToTarget); // 开始动画
  }
}
// 返回顶部
function backTop() {
  const start = window.scrollY; // 获取当前滚动条位置
  const duration = 500; // 动画持续时间，单位为毫秒
  let startTime: number = 0;
  function scrollStep(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const percentage = Math.min(progress / duration, 1); // 计算动画完成的百分比
    // 使用easeOutCubic缓动函数来计算当前动画的状态
    const easeOutCubic = (t: number) => --t * t * t + 1;
    const easePercentage = easeOutCubic(percentage);
    const position = start * (1 - easePercentage); // 根据缓动函数计算当前位置
    window.scrollTo(0, position); // 滚动到新位置
    if (progress < duration) {
      requestAnimationFrame(scrollStep); // 如果动画未完成，则继续执行
    } else {
      window.scrollTo(0, 0); // 确保最终滚动到页面顶部
    }
  }
  requestAnimationFrame(scrollStep); // 开始动画
}
</script>

<style lang="scss" scoped>
.contain {
  display: flex;
  .left {
    width: 55%;
    font-weight: 700;
    margin: 1.5% 0 0 15%;
    border-radius: 10px;

    .unit-dialog {
      .content {
        .name {
          margin-bottom: 10px;
        }

        .learn-content {
          margin-bottom: 10px;
        }
      }
    }

    .step-bar {
      position: fixed;
      top: 25%;
      left: 8%;

      :deep(.step-bar-item) {
        .el-step__head .is-text,
        .el-step__main .el-step__title {
          cursor: pointer;
        }

        .el-step__head.is-finish,
        .el-step__title.is-finish {
          color: #a8abb2;
          border-color: #a8abb2;
        }
      }

      .icon-top {
        position: absolute;
        top: 200%;
        left: 85%;
        cursor: pointer;
        font-size: 25px;
        color: #a8abb2;
        border: 1px solid #a8abb2;
        border-radius: 18px;
        padding: 5px;
      }

      .icon-top:hover {
        // border: 1px solid #fff;
        background-color: #fff;
      }
    }
  }
  .right {
    width: 29%;
    margin: 1.5% 0 0 1%;
    .btn {
      position: fixed;
      right: 0px;
      border: 1px solid #fff;
      font-size: 20px;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      background-color: #fff;
      outline: 2px solid rgba(242, 230, 231, 0.5);
    }
    .btn:hover {
      outline: 2px solid rgba(64, 158, 255, 0.5);
    }
  }
}
</style>
