<template>
  <el-card class="box-card">
    <div class="select-card">
      <div class="title">选择以下正确的选项</div>
      <el-progress class="progress-bar" :percentage="50" :text-inside="true" :stroke-width="20" :color="customColors"
        :format="format" />
      <div class="characters">{{ answer }}</div>
      <div class="options">
        <el-button v-for="(item, index) in options" :key="index" class="option" @click="judge(item)">{{ item
        }}</el-button>
      </div>
    </div>
    <!-- 答题提示 -->
    <el-card class="err-tip" v-if="correct !== null" :style="tipStyle.style">
      <div class="head">
        <el-icon  class="icon">
          <component :is="tipStyle.icon"></component>
        </el-icon>
        <div class="text">{{ tipStyle.head.text }}</div>
      </div>
      <div class="content">
        <div class="tip">参考答案：</div>
        <div class="answer">
          <span class="answer-xiaozhuan">{{ answer }}</span>
          <span class="answer-jianti">（{{ answer }}）</span>
        </div>
        <el-button :type=" correct ? 'success':'danger'" class="know" @click="next">知道了</el-button>
      </div>
    </el-card>
  </el-card>
</template>
<script lang="ts" setup name="unitCard">
const { answer } = defineProps({
  answer: {
    type: String,
    default: () => ('文')
  },
  options: {
    type: Array<string>,
    default: () => (['文', '字', '小', '转'])
  }
})

const format = (percentage: number) => (percentage === 100 ? 'Full' : '5/25')
const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]
const correct:Ref<boolean | null> = ref(null)
const tipStyle = reactive({
  icon: 'CircleCheckFilled',
  style: {
    color: '#92d436'
  },
  head:{
    text: '太棒了！'
  }
})
// 监听correct
watchEffect(() => {
  console.log('correct changed:', correct.value);
  if(correct.value){
    tipStyle.icon = 'CircleCheckFilled'
    tipStyle.style = {
      color: '#92d436'
    }
    tipStyle.head.text = '太棒了！'
  }else{
    tipStyle.icon = 'CircleCloseFilled'
    tipStyle.style = {
      color: '#d74746'
    }
    tipStyle.head.text = '可惜'
  }
})
function initData(){  
  correct.value = null
}
function judge(select: string) {
  answer === select ? correct.value = true : correct.value = false;
}
function next(){
  console.log('下一题！');
  initData()  // 初始化所有的值,使父组件更新值
}
</script>
<style lang="scss" scoped>
.box-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20%;

  .select-card {
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
      font-family: 'FangZhengXiaoZhuan';
    }

    .options {
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      .option {
        height: 64px;
        font-size: 20px;
        margin-top: 20px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      }
    }

    .options>*:first-child {
      margin-left: 12px;
    }
  }

  .err-tip {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    .head{
      display: flex;
      height: 30px;
      line-height: 30px;
      .icon{
        font-size: 30px; 
        margin-top: 2px;
      }
      .text{
        font-size: 30px;
        margin-left: 10px;
      }
    }
    .content{
      margin-top: 10px;
      .tip{
        font-size: 18px;
        font-weight: 600;
      }
      .answer{
        margin-top: 10px;
        font-size: 20px;
        .answer-xiaozhuan{
          font-family: 'FangZhengXiaoZhuan';
        }
      }
      .know{
        margin-top: 10px;
        width: 100%;
        height: 50px;
        color: #191b26;
        font-size: 16px;
        font-weight: 600;
        border-radius: 10px;
        box-shadow: inset 2px -5px 4px rgba(0, 0, 0, 0.2);
      }
      .know:focus{
      color: rgba($color: #191b26, $alpha: .5);
      }
    }
  }
}

.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-front {
  background-color: #f56c6c;
}

.flip-card-back {
  background-color: #1989fa;
  transform: rotateY(180deg);
}
</style>