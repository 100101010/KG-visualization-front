<template>
  <div >
  <div id="select">
    <button type="button" id="button1" @click="show1()" class="btn btn-success">bridge</button>
    <button type="button" id="button2" @click="show2()" class="btn btn-default">cause</button>
    <button type="button" id="button3" @click="show3()" class="btn btn-default">conclusion</button>
    <button type="button" id="button4" @click="show4()" class="btn btn-default">disease</button>
    <button type="button" id="button5" @click="show5()" class="btn btn-default">fine_structure</button>
    <button type="button" id="button6" @click="show6()" class="btn btn-default">last</button>
    <button type="button" id="button7" @click="show7()" class="btn btn-default">location</button>
    <button type="button" id="button8" @click="show8()" class="btn btn-default">structure</button>
    <button type="button" id="button9" @click="show9()" class="btn btn-default">technical_state</button>
    <button type="button" id="button10" @click="show10()"  class="btn btn-default">type</button>
  </div>
    <div class="text-center">
    <form class="form-signin">
      <div class="bridgeShow" v-show="show[0]">
        <input type="text" v-model.number="bridge.bId"  class="form-control" placeholder="桥梁Id" >
      <input type="text" v-model="bridge.bSpan" class="form-control" placeholder="桥梁跨径" >
      <input type="text" v-model="bridge.CSta"  class="form-control" placeholder="桥梁中心桩号" >
        <input type="text" v-model="bridge.bName"  class="form-control" placeholder="桥梁名称" >
        <input type="text" v-model="bridge.bCDate"  class="form-control" placeholder="桥梁建成时间" >
        <input type="text" v-model="bridge.bCen"  class="form-control" placeholder="检测单位" >
        <input type="text" v-model="bridge.CRoad"  class="form-control" placeholder="服役路线">
        <input type="text" v-model="bridge.bSCom"  class="form-control" placeholder="桥梁跨径组合">
        <input type="text" v-model="bridge.bWide"  class="form-control" placeholder="桥梁宽度" >
        <input type="text" v-model="bridge.bLen"  class="form-control" placeholder="桥梁长度" >
        <input type="text" v-model="bridge.bMUnit"  class="form-control" placeholder="桥梁管理单位" >
      </div>

      <div class="causeShow" v-show="show[1]">
        <input type="text" v-model.number="cause.cId"  class="form-control" placeholder="病害原因Id" >
        <input type="text" v-model="cause.cName"  class="form-control" placeholder="病害原因名" >
        <input type="text" v-model="cause.cDesc"  class="form-control" placeholder="病害原因描述" >
      </div>

      <div class="conclusionShow" v-show="show[2]">
        <input type="text" v-model.number="conclusion.bCId"  class="form-control" placeholder="检测结论Id" >
        <input type="text" v-model="conclusion.bCName"  class="form-control" placeholder="检测结论名" >
        <input type="text" v-model="conclusion.bCValue"  class="form-control" placeholder="检测结论值" >
      </div>

      <div class="diseaseShow" v-show="show[3]">
        <input type="text" v-model.number="disease.bDId"  class="form-control" placeholder="病害Id" >
        <input type="text" v-model="disease.bDName"  class="form-control" placeholder="病害名" >
      </div>

      <div class="fine_structureShow" v-show="show[4]">
        <input type="text" v-model.number="fine_structure.bsId"  class="form-control" placeholder="细粒度桥梁结构Id" >
        <input type="text" v-model="fine_structure.bsName"  class="form-control" placeholder="细粒度桥梁结构名" >
      </div>

<!--      未完全实现-->
      <div class="lastShow" v-show="show[5]">
        <input type="text" v-model.number="last.lId"  class="form-control" placeholder="Id" >
        <input type="text" v-model="last.name"  class="form-control" placeholder="名称" >
        <input type="text" v-model="last.value"  class="form-control" placeholder="值" >
      </div>

      <div class="locationShow" v-show="show[6]">
        <input type="text" v-model.number="location.bSLId"  class="form-control" placeholder="结构位置Id" >
        <input type="text" v-model="location.bSLName"  class="form-control" placeholder="结构位置名" >
      </div>

      <div class="structureShow" v-show="show[7]">
        <input type="text" v-model.number="structure.bSId"  class="form-control" placeholder="桥梁结构Id" >
        <input type="text" v-model="structure.bSName"  class="form-control" placeholder="桥梁结构名" >
        <input type="text" v-model="structure.bSMat"  class="form-control" placeholder="桥梁结构材料" >
        <input type="text" v-model="structure.bSType"  class="form-control" placeholder="桥梁结构形式" >
        <input type="text" v-model="structure.CNum"  class="form-control" placeholder="桥梁结构数量" >
      </div>

      <div class="technical_stateShow" v-show="show[8]">
        <input type="text" v-model.number="technical_state.tId"  class="form-control" placeholder="技术状况Id" >
        <input type="text" v-model="technical_state.tName"  class="form-control" placeholder="技术状况名" >
        <input type="text" v-model="technical_state.tValue"  class="form-control" placeholder="技术状况值" >
        <input type="text" v-model="technical_state.tBase"  class="form-control" placeholder="技术状况评定标准" >
      </div>

      <div class="typeShow" v-show="show[9]">
        <input type="text" v-model.number="type.bDTId"  class="form-control" placeholder="病害类型Id" >
        <input type="text" v-model="type.bDTName"  class="form-control" placeholder="病害类型名" >
      </div>

      <button class="btn btn-block btn-primary" id="button" @click.prevent="addNotes()">添加</button>
    </form>
  </div>

    <div id="toastShow" class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; left: 0; top: 0;">
      <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
        <div class="toast-header">
          <img src="../assets/bell.svg" class="rounded mr-2" alt="">
          <strong class="mr-auto">Message</strong>
        </div>
        <div class="toast-body">
          {{toastMessage}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: "AddNotes",
  data() {
    return {
      show:[true, false,false,false,false,false,false,false,false,false],
      bridge:{},
      cause:{},
      conclusion:{},
      disease: {},
      fine_structure: {},
      last:{},
      location:{},
      structure: {},
      technical_state: {},
      type:{},
      nodeType:'bridge',
      toastMessage:'添加成功'
    }
  },
  mounted() {
    let _this = this;
    let ids = ['bridge', 'cause', 'conclusion', 'disease', 'fine_structure', 'last', 'location', 'structure', 'technical_state', 'type']
    let buttons = document.getElementsByTagName('button');
    for (let i = 0; i < 10; i++) {
      buttons[i].onclick = function () {
        for (let j = 0; j < 10; j++) {
          buttons[j].className = 'btn btn-default'
          _this.show[j] = false
          _this.show[i] = true
        }
        this.className = 'btn btn-success'
        console.log(_this.show)
      }
    }

    let bridgeShow = document.getElementsByClassName('bridgeShow')[0]
    let inputs = bridgeShow.getElementsByTagName('input')
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].required = true
    }
  },
  methods:{
    addNotes(){
      let _this = this
      switch (_this.nodeType) {
        case 'bridge':
          if (Object.keys(_this.bridge).length !== 11) return; else break;
        case 'cause':
          if (Object.keys(_this.cause).length !== 3) return; else break ;
        case 'conclusion':
          if (Object.keys(_this.conclusion).length !== 3) return; else break ;
        case 'disease':
          if (Object.keys(_this.disease).length !== 2) return; else break ;
        case 'fine_structure':
          if (Object.keys(_this.fine_structure).length !== 2) return; else break ;
        case 'last':
          if (Object.keys(_this.last).length !== 3) return;  else break;
        case 'location':
          if (Object.keys(_this.location).length !== 2) return;  else break;
        case 'strcuture':
          if (Object.keys(_this.structure).length !== 5) return;  else break;
        case 'technical_state':
          if (Object.keys(_this.technical_state).length !== 4) return;  else break;
        case 'type':
          if (Object.keys(_this.type).length !== 2) return;  else break;
      }
      let tempJson = {
        'bridge':_this.bridge,
        'cause':_this.cause,
        'conclusion':_this.conclusion,
        'disease':_this.disease,
        'fine_structure':_this.fine_structure,
        'last':_this.last,
        'location':_this.location,
        'structure':_this.structure,
        'technical_state':_this.technical_state,
        'type':_this.type
      }

      $.ajax({
        type:'post',
        // async:false,
        // contentType: "application/json;charset=UTF-8",
        url : "/api/addNode/"+_this.nodeType+'/',
        data :{'message': JSON.stringify(tempJson[_this.nodeType])},
        success:function (result) {
          _this.bridge = {}
          _this.cause = {}
          _this.conclusion = {}
          _this.disease = {}
          _this.fine_structure = {}
          _this.last = {}
          _this.location = {}
          _this.structure = {}
          _this.technical_state = {}
          _this.type = {}
          console.log(result);
          _this.toastMessage = '添加成功'
          $('.toast').toast('show')
        },
        error:function () {
          _this.toastMessage = '发生未知错误'
          $('.toast').toast('show')
        }
      })


        // console.log(_this.bridge)
      //   _this.axios.post('/addNode/'+_this.nodeType+"/",{
      //     params:{
      //       'message':tempJson[_this.nodeType]
      //     }
      //   }).then(function (response) {
      //     _this.bridge = {}
      //     _this.cause = {}
      //     _this.conclusion = {}
      //     _this.disease = {}
      //     _this.fine_structure = {}
      //     _this.last = {}
      //     _this.location = {}
      //     _this.structure = {}
      //     _this.technical_state = {}
      //     _this.type = {}
      //     console.log(response)
      //   }).catch(function (error) {
      //     console.log(error)
      //   })
    },

    setRequired(classNmae){
      let allInputs = document.getElementsByTagName('input')
      for (let i = 0; i < allInputs.length; i++) {
        allInputs[i].required = false
      }
      let bridgeShow = document.getElementsByClassName(classNmae)[0]
      let inputs = bridgeShow.getElementsByTagName('input')
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].required = true
      }
    },

    show1(){
      this.show = [true, false,false,false,false,false,false,false,false,false]
      this.nodeType = 'bridge'
      this.setRequired('bridgeShow')
    },
    show2(){
      this.show = [false, true,false,false,false,false,false,false,false,false]
      this.nodeType = 'cause'
      this.setRequired('causeShow')
    },
    show3(){
      this.show = [false,false,true, false,false,false,false,false,false,false]
      this.nodeType = 'conclusion'
      this.setRequired('conclusionShow')
    },
    show4(){
      this.show = [false,false,false,true, false,false,false,false,false,false]
      this.nodeType = 'disease'
      this.setRequired('diseaseShow')
    },
    show5(){
      this.show = [false,false,false,false,true, false,false,false,false,false]
      this.nodeType = 'fine_structure'
      this.setRequired('fine_structureShow')
    },
    show6(){
      this.show = [false,false,false,false,false,true, false,false,false,false]
      this.nodeType = 'last'
      this.setRequired('lastShow')
    },
    show7(){
      this.show = [false,false,false,false,false,false,true, false,false,false]
      this.nodeType = 'location'
      this.setRequired('locationShow')
    },
    show8(){
      this.show = [false,false,false,false,false,false,false,true, false,false]
      this.nodeType = 'structure'
      this.setRequired('structureShow')
    },
    show9(){
      this.show = [false,false,false,false,false,false,false,false,true, false]
      this.nodeType = 'technical_state'
      this.setRequired('technical_stateShow')
    },
    show10(){
      this.show = [false,false,false,false,false,false,false,false,false,true]
      this.nodeType = 'type'
      this.setRequired('typeShow')
    },
  }
}
</script>

<style scoped>
#select {
  margin-top: 0px;
}
#button{
  margin-top: 9px;
}
#inputText{
  width: 450px;
  position: absolute;
  margin-top: -50px;
  margin-left: -50px;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
.form-signin {
  width: 100%;
  max-width: 700px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
