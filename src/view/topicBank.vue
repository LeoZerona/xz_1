<template>
  <navigation></navigation>
  <div class="contain">
    <div class="left">
      <part
        v-for="item in textInfo.part"
        :key="item.name"
        :data="item.content"
        :id="item.name"
      ></part>
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
      <div class="btn" @click="searchBoxShow">
        <el-icon><Search /></el-icon>
      </div>
    </div>
  </div>
  <name-slot-dialog :dialogFlog="unitInfoDialogFlog" class="unit-dialog">
    <template #header> 单元详情 </template>
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

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="learnStart">开始学习</el-button>
        <el-button
          type="primary"
          @click="overviewDialogValue.dialogVisiable = true"
          >内容概览</el-button
        >
        <el-button @click="unitInfoDialogFlog = false">退出</el-button>
      </div>
    </template>
  </name-slot-dialog>
  <name-slot-dialog
    :dialogFlog="overviewDialogValue.dialogVisiable"
    :dialogConfig="overviewSearchDialogConfig"
    :beforeCloseFn="dialogClose"
    class="learn-content-dialog"
  >
    <template #header> 内容概览 </template>
    <template #content>
      <div class="overview">
        单元概览：
        {{ unitInfo.characters.join("、") }}
      </div>
      <div class="search-tool">
        <el-input
          v-model="overviewDialogValue.searchKey"
          :placeholder="overviewDialogValue.searchInputTip"
          :maxlength="overviewDialogValue.searchKeyLength"
          show-word-limit
          class="input-box"
        />
        <el-select
          class="model-sel"
          @change="overviewModelChange"
          v-model="overviewDialogValue.displayMode"
          :placeholder="overviewDialogValue.modelTip"
        >
          <el-option
            v-for="item in overviewDialogValue.displayModeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-scrollbar max-height="350px">
        <div
          v-for="(item, index) in overviewDialogValue.charactersList"
          :key="index"
          class="character-unit"
        >
          <div
            class="xz"
            :style="
              overviewDialogValue.displayMode === 'coverXz' && !item.show
                ? { backgroundColor: '#e6e9f3', cursor: 'pointer' }
                : {}
            "
            @click="switchShow(index)"
          >
            {{
              overviewDialogValue.displayMode === "coverXz" && !item.show
                ? " "
                : item.characters
            }}
          </div>
          <div
            class="answer"
            :style="
              overviewDialogValue.displayMode === 'coverJt' && !item.show
                ? { cursor: 'pointer' }
                : {}
            "
            @click="switchShow(index)"
          >
            <span class="ft">
              {{
                overviewDialogValue.displayMode === "coverJt" && !item.show
                  ? " "
                  : item.characters
              }}
            </span>
            <span>
              {{
                overviewDialogValue.displayMode === "coverJt" && !item.show
                  ? " "
                  : "->"
              }}
            </span>
            <span class="jt" @click="switchShow(index)">
              {{
                overviewDialogValue.displayMode === "coverJt" && !item.show
                  ? ""
                  : item.characters
              }}
            </span>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </name-slot-dialog>
  <!-- 字典查询抽屉 -->
  <dictionary-drawer
    :visible="searchValue.searchDrawerFlog"
    :drawer-config="drawerConfig"
    @close="searchDrawerBeforeClose"
  />
</template>

<script setup lang="ts" name="home">
import _ from "lodash";
import { textInfo } from "@/static/text_res";
import { unitInfoHomeData, learnInfoHomeData } from "@/store/home";
import { storeToRefs } from "pinia";
import { Search } from "@element-plus/icons-vue";
import DictionaryDrawer from "@/components/common/DictionaryDrawer.vue";
interface PartType {
  name: string;
}
interface partElementType {
  position: number | undefined;
}
interface searchValueType {
  searchKey: string;
  searchTip: string;
  searchDrawerFlog: boolean;
}
type drawerConfigType = {
  size: string | number;
  direction: "rtl" | "ltr" | "ttb" | "btt" | undefined;
  closeOnClickModal: boolean;
  closeOnPressEscape: boolean;
  showClose: boolean;
};
type selOptionItemType = {
  label: string;
  value: string;
};
type overviewDialogValueType = {
  dialogVisiable: boolean;
  searchKeyLength: number;
  searchKey: string;
  searchInputTip: string;
  modelTip: string;
  displayModeOptions: Array<selOptionItemType>;
  displayMode: string;
  charactersList: Array<any>;
  charactersListClone: Array<any>;
};
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
const searchValue: Ref<searchValueType> = ref({
  // 搜索所需的变量数据
  searchKey: "",
  searchTip: "请输入文字查询小篆",
  searchDrawerFlog: false,
});
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('scroll', debouncedHandleScroll);
});

const drawerConfig = computed<drawerConfigType>(() => ({
  size: isMobile.value ? "85%" : "30%",
  direction: "rtl",
  closeOnClickModal: true,
  closeOnPressEscape: false,
  showClose: false,
}));
const overviewDialogValue: Ref<overviewDialogValueType> = ref({
  dialogVisiable: false,
  searchKeyLength: 5,
  searchKey: "",
  searchInputTip: "请输入关键字查询",
  modelTip: "遮挡模式",
  displayModeOptions: [
    {
      label: "不遮挡",
      value: "noCover",
    },
    {
      label: "遮挡小篆体",
      value: "coverXz",
    },
    {
      label: "遮挡简体",
      value: "coverJt",
    },
  ],
  displayMode: "",
  charactersList: [],
  charactersListClone: [],
});
const overviewSearchDialogConfig = computed(() => ({
  width: isMobile.value ? "90%" : 500, // 弹窗宽度
  appendToBody: true, // Dialog 自身是否插入至 body 元素上。
  closeOnClickModal: true, // 是否支持点击空白处关闭弹窗
  closeOnPressEscape: true, // 是否支持通过按下ESC关闭弹窗
  showClose: true, // 是否显示关闭按钮
}));
onMounted(() => {});
/** 搜索抽屉面板是否显示 */
watchEffect(() => {
  !searchValue.value.searchDrawerFlog ? (searchValue.value.searchKey = "") : "";
});
/** 内容预览小窗赋值 */
watchEffect(() => {
  if (unitInfo.value.characters) {
    overviewDialogValue.value.charactersList = [];
    // 内容概览下方内容数据初始化
    unitInfo.value.characters.forEach((item: string) => {
      const obj = {
        index: overviewDialogValue.value.charactersList.length,
        characters: item,
        show: false,
      };
      overviewDialogValue.value.charactersList.push(obj);
    });
    overviewDialogValue.value.charactersListClone = JSON.parse(
      JSON.stringify(overviewDialogValue.value.charactersList)
    );
  }
});

//
// watch(overviewDialogValue.value.searchKey, () => {
//   if (
//     unitInfo.value.charactersList &&
//     unitInfo.value.charactersList.length > 0
//   ) {
//     overviewDialogValue.value.characters =
//       unitInfo.value.charactersListClone.filter((itme: any) => {
//         return itme.characters.includes(overviewDialogValue.value.searchKey);
//       });
//   }
// }); // 内容概览上方搜索框
watchEffect(() => {
  if (
    unitInfo.value.charactersList &&
    unitInfo.value.charactersList.length > 0
  ) {
    overviewDialogValue.value.characters =
      unitInfo.value.charactersListClone.filter((itme: any) => {
        return itme.characters.includes(overviewDialogValue.value.searchKey);
      });
  }
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
function searchBoxShow() {
  searchValue.value.searchDrawerFlog = true;
}
/** 关闭单元详情的方法 */
function dialogClose() {
  overviewDialogValue.value.dialogVisiable = false;
}
/** 右侧搜索抽屉关闭方法 */
function searchDrawerBeforeClose() {
  searchValue.value.searchDrawerFlog = false;
}
/** 概览窗口显示模式切换 */
function overviewModelChange(value: string) {
  overviewDialogValue.value.displayMode = value;
  overviewDialogValue.value.charactersList.forEach((item: any) => {
    item.show = false;
  });
}
/** 切换显示模式 */
function switchShow(index: number) {
  overviewDialogValue.value.charactersList[index].show =
    !overviewDialogValue.value.charactersList[index].show;
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
.learn-content-dialog {
  .overview {
    font-size: 15px;
    margin-bottom: 10px;
  }
  .search-tool {
    display: flex;
    margin: 10px 0;
    .input-box {
      width: 350px;
      margin-right: 10px;
    }
    .model-sel {
      width: 100px;
    }
  }
  .character-unit {
    margin-bottom: 15px;
    .xz {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      margin-bottom: 10px;
      font-family: "FangZhengXiaoZhuan";
      font-size: 60px;
    }
    .answer {
      border-radius: 10px;
      padding-left: 10px;
      background-color: #e6e9f3;
      font-size: 30px;
      width: 97%;
      height: 30px;
      .ft {
        font-family: "HanYiKaiTiFan";
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .contain {
    flex-direction: column;
    padding-bottom: 80px; // 为固定按钮留出空间

    .left {
      width: 100%;
      margin: 1% 0 0 0;
      padding: 0 10px;

      .step-bar {
        position: relative;
        top: auto;
        left: auto;
        height: auto;
        max-width: 100%;
        margin: 20px 0;
        padding: 10px;
        background-color: #f5f6f7;
        border-radius: 8px;

        :deep(.el-steps) {
          flex-direction: row;
          overflow-x: auto;
          padding-bottom: 10px;
          -webkit-overflow-scrolling: touch;
        }

        :deep(.el-step) {
          flex-shrink: 0;
          min-width: 80px;
        }

        :deep(.el-step__title) {
          font-size: 12px;
          padding-right: 8px;
        }

        .icon-top {
          position: fixed;
          bottom: 20px;
          right: 20px;
          top: auto;
          left: auto;
          z-index: 100;
          width: 40px;
          height: 40px;
          font-size: 20px;
          padding: 8px;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }

    .right {
      width: 100%;
      margin: 10px 0;

      .btn {
        position: fixed;
        bottom: 70px;
        right: 20px;
        top: auto;
        z-index: 100;
        width: 50px;
        height: 50px;
        padding: 12px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #409eff;
        color: #fff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        border: none;

        &:hover {
          background-color: #66b1ff;
          box-shadow: 0 6px 16px rgba(64, 158, 255, 0.5);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }

  .unit-dialog {
    :deep(.el-dialog) {
      width: 90% !important;
      max-width: 450px !important;
    }

    .content {
      .name {
        font-size: 18px;
      }

      .learn-content {
        font-size: 14px;
      }

      .num {
        font-size: 14px;
      }
    }
  }

  .learn-content-dialog {
    :deep(.el-dialog) {
      width: 90% !important;
      max-width: 450px !important;
      margin: 5vh auto !important;
    }

    .overview {
      font-size: 14px;
      word-break: break-all;
      line-height: 1.6;
    }

    .search-tool {
      flex-direction: column;
      gap: 10px;

      .input-box {
        width: 100%;
        margin-right: 0;
        margin-bottom: 0;
      }

      .model-sel {
        width: 100%;
      }
    }

    :deep(.el-scrollbar) {
      max-height: 300px !important;
    }

    .character-unit {
      margin-bottom: 12px;

      .xz {
        width: 50px;
        height: 50px;
        font-size: 50px;
        margin-bottom: 8px;
      }

      .answer {
        font-size: 24px;
        padding: 8px;
        width: 100%;
      }
    }
  }
}

@media (max-width: 480px) {
  .contain {
    padding-bottom: 70px;

    .left {
      padding: 0 5px;

      .step-bar {
        margin: 15px 0;
        padding: 8px;

        :deep(.el-step) {
          min-width: 70px;
        }

        :deep(.el-step__title) {
          font-size: 11px;
          padding-right: 5px;
        }

        .icon-top {
          bottom: 15px;
          right: 15px;
          width: 36px;
          height: 36px;
          font-size: 18px;
          padding: 6px;
        }
      }
    }

    .right {
      .btn {
        bottom: 60px;
        right: 15px;
        width: 45px;
        height: 45px;
        padding: 10px;
        font-size: 18px;
      }
    }
  }

  .unit-dialog {
    :deep(.el-dialog) {
      width: 95% !important;
    }

    .content {
      .name {
        font-size: 16px;
      }

      .learn-content {
        font-size: 13px;
      }

      .num {
        font-size: 13px;
      }

      :deep(.el-radio-group) {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
  }

  .learn-content-dialog {
    :deep(.el-dialog) {
      width: 95% !important;
    }

    .overview {
      font-size: 13px;
    }

    .character-unit {
      .xz {
        width: 40px;
        height: 40px;
        font-size: 40px;
      }

      .answer {
        font-size: 20px;
        height: 25px;
      }
    }
  }
}
</style>
