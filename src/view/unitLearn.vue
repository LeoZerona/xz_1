<template>
  <!-- 单元学习页面 -->
  <el-icon class="icon" @click="goBack"><Back /></el-icon>
  <learn-card :topic="topic" @next="nextTopic"></learn-card>
  <!-- 答题结束时显示的弹窗 -->
  <learn-end-dialog></learn-end-dialog>
  <!-- <characters-big-look></characters-big-look> -->
</template>

<script lang="ts" setup name="unitLearn">
// 定义一个接口来描述learnConfig.value的结构
interface LearnConfigType {
  model: "select" | "write" | "mix";
}
interface ModelType {
  types: Array<string>;
  options: Array<Array<string>>;
}
interface UnitInfoType {
  characters: Array<string>;
  model: ModelType;
}
interface TopicType {
  index: number;
  count: number;
  type: string;
  answer: string;
  options: Array<string>;
}
// errorTopics
import { unitInfoHomeData, learnInfoHomeData } from "@/store/home";
import { unitData } from "@/store/unit";
import { storeToRefs } from "pinia";
const router = useRouter();
const unitInfoHome = unitInfoHomeData(); // 在home页中的unit数据
const learnInfoHome = learnInfoHomeData(); // 在home页中的学习信息数据
const unitDataUnit = unitData(); // 在单元页的单元数据
const { unitInfo } = storeToRefs(unitInfoHome);
const { learnConfig } = storeToRefs(learnInfoHome) as {
  learnConfig: Ref<LearnConfigType>;
};
const { endDialog, errorTopics } = storeToRefs(unitDataUnit); // 当前状态是否为错题重学
const unitInfoClone: Ref<UnitInfoType> = ref({
  characters: [], // 需要学习的文字数组
  model: {
    types: [],
    options: [],
  }, // 每道题的类型
});
const topic: Ref<TopicType> = ref({
  index: 0, // 当前题目对应的题号，例：1、2、3...
  count: 0, // 本次学习的题目的数量
  type: "", // 当前题目的类型
  answer: "", // 当前题目对应的答案
  options: [], // 若当前题类型为选择，则需要对该属性赋值
});
onMounted(() => {
  initData();
});
function initData() {
  unitInfoClone.value.characters = JSON.parse(
    JSON.stringify(unitInfo.value.characters)
  ); // 获取选择单元的数据
  unitInfoClone.value.model = {
    types: [],
    options: [],
  };
  errorTopics.value.errIndexs = []; // 初始化错题下标数组
  initQuestionData(); // 设置每道题的类型，若类型为选择题则再设置选项
  // 判断此时是否为错题重
  // console.log("是否为错题重学！", errorTopics.value);
  // 非错题重学
  if (!errorTopics.value.relearn) {
    topic.value.count = unitInfoClone.value.characters.length;
    nextTopic(0);
  } else {
    topic.value.count = errorTopics.value.errIndexs.length;
    nextTopic(errorTopics.value.errIndexs[0]);
  }
}
// 构造题目数据
function initQuestionData() {
  switch (learnConfig.value.model) {
    case "select":
      for (let i = 0; i < unitInfoClone.value.characters.length; i++) {
        unitInfoClone.value.model.types.push("select");
        const option = getUniqueRandomCharacters(
          unitInfoClone.value.characters,
          3
        );
        option.splice(
          Math.floor(Math.random() * (option.length + 1)),
          0,
          unitInfoClone.value.characters[i]
        );
        unitInfoClone.value.model.options.push(option);
      }
      break;
    case "write":
      unitInfoClone.value.model.types = new Array(
        unitInfoClone.value.characters.length
      ).fill("write");
      break;
    case "mix":
      for (let i = 0; i < unitInfoClone.value.characters.length; i++) {
        const type = Math.random() < 0.5 ? "select" : "write";
        unitInfoClone.value.model.types.push(type);
        if (type === "select") {
          const option = getUniqueRandomCharacters(
            unitInfoClone.value.characters,
            3
          );
          option.splice(
            Math.floor(Math.random() * (option.length + 1)),
            0,
            unitInfoClone.value.characters[i]
          );
          unitInfoClone.value.model.options.push(option);
        } else {
          unitInfoClone.value.model.options.push([]);
        }
      }
      break;
  }
}
// 定义一个函数来获取不重复的随机字符
function getUniqueRandomCharacters(sourceArray: Array<string>, count: number) {
  const uniqueCharacters = new Set(); // 使用Set来存储唯一的字符
  while (uniqueCharacters.size < count) {
    // 循环直到集合中的元素数量达到需要的数量
    const randomIndex = Math.floor(Math.random() * sourceArray.length); // 随机选择一个索引
    const character = sourceArray[randomIndex]; // 获取对应的字符
    uniqueCharacters.add(character); // 添加到Set中，如果已经存在，则不会重复添加
  }
  return Array.from(uniqueCharacters) as Array<string>; // 将Set转换为数组并返回
}
/**
 * 下一道题目
 */
function nextTopic(index: number) {
  // endDialog.value = topic.value.index === topic.value.count; // 判断这道题是不是最后一题
  endDialog.value = topic.value.index === 3; // 判断这道题是不是最后一题
  if (!endDialog.value) {
    topic.value.answer = unitInfoClone.value.characters[index];
    topic.value.type = unitInfoClone.value.model.types[index];
    topic.value.answer = unitInfoClone.value.characters[index];
    topic.value.options = unitInfoClone.value.model.options[index];
  }
}
/**
 * 返回上一级
 */
function goBack() {
  router.push("/topic_bank");
}
</script>

<style lang="scss" scoped>
.icon {
  font-size: 25px;
  margin: 12px;
  cursor: pointer;
}
</style>
