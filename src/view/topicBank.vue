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
  <!-- 抽屉面板 -->
  <name-slot-drawer
    :drawer-config="drawerConfig"
    :drawer-visiable="searchValue.searchDrawerFlog"
    :before-close-fn="searchDrawerBeforeClose"
    class="search-drawer"
  >
    <template #header>
      <span>字典查询</span>
    </template>
    <template #content>
      <el-input
        v-model="searchValue.searchKey"
        maxlength="10"
        :placeholder="searchValue.searchTip"
        show-word-limit
        type="text"
        class="search-input"
      />
      <div class="search-result">
        <div class="result">
          简：
          <div class="jt">{{ searchValue.searchKey }}</div>
        </div>
        <div class="result">
          繁：
          <div class="ft">{{ searchValue.searchKey }}</div>
        </div>
        <div class="result">
          篆：
          <div class="xz">{{ searchValue.searchKey }}</div>
        </div>
      </div>
    </template>
  </name-slot-drawer>
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
const drawerConfig: Ref<drawerConfigType> = ref({
  size: "30%",
  direction: "rtl",
  closeOnClickModal: true,
  closeOnPressEscape: false,
  showClose: false,
});
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
const overviewSearchDialogConfig: Ref<any> = ref({
  width: 500, // 弹窗宽度
  appendToBody: true, // Dialog 自身是否插入至 body 元素上。
  closeOnClickModal: true, // 是否支持点击空白处关闭弹窗
  closeOnPressEscape: true, // 是否支持通过按下ESC关闭弹窗
  showClose: true, // 是否显示关闭按钮
});
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
function overviewModelChange(value: any) {
  console.log("遮挡模式切换：", value);
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
.search-drawer {
  .search-input {
    width: 360px;
  }
  .search-result {
    margin-top: 30px;
    .result {
      margin-top: 10px;
    }
    .jt,
    .ft,
    .xz {
      font-size: 50px;
      font-weight: 700;
      margin-top: 10px;
    }
    .ft {
      font-family: "HanYiKaiTiFan";
    }
    .xz {
      font-family: "FangZhengXiaoZhuan";
    }
  }
}
</style>
