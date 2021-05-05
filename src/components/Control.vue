<template>
  <div>
    <button onclick="" class="btn btn-primary" id="revise" data-target="#exampleModal" data-toggle="modal"
            :disabled="ifRevise">revise
    </button>
    <router-link to="/addNotes">
      <button class="btn btn-success" id="addNotesAndLinks">addNodes</button>
    </router-link>
<!--    <button class="btn btn-success" id="addLinks">addLinks</button>-->

    <button @click="showAndDeal()" class="btn btn-success" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
      {{showAddLinks}}
    </button>
    <div class="collapse" id="collapseExample">
      <div  class="card card-body">
        <div class="row">
          <div class="col">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <img @click="withdraw(1)" src="../assets/x-lg.svg" alt="撤销">
                </div>
              </div>
              <input class="form-control" id="inlineFormInputGroup" type="text" :value="relationshipHead" readonly="readonly">
            </div>
          </div>
          <div class="col">
            <select v-model="relationshipAdd" class="form-control">
              <option>none</option>
              <option>has_cause</option>
              <option>has_conclusion</option>
              <option>has_disease</option>
              <option>has_entity</option>
              <option>has_last</option>
              <option>has_location1</option>
              <option>has_number</option>
              <option>has_technical</option>
            </select>
          </div>
          <div class="col">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <img @click="withdraw(2)" src="../assets/x-lg.svg" alt="撤销">
                </div>
              </div>
              <input class="form-control" :value="relationshipTail" type="text" readonly="readonly">
            </div>
          </div>
            <button class="btn btn-success" id="addButton" @click="dealAdd()" type="button">添加</button>
        </div>
      </div>

    </div>

    <div class="detail-panel">
      <select v-model="headNodeType" class="form-control" id="headEntityType">
        <option>none</option>
        <option>bridge</option>
        <option>cause</option>
        <option>conclusion</option>
        <option>disease</option>
        <option>fine_structure</option>
        <option>last</option>
        <option>location</option>
        <option>structure</option>
        <option>technical_state</option>
        <option>type</option>
      </select>
      <select v-model="headSearchProperty" class="form-control">
        <option v-for="k in nodeOption[headNodeType]">{{ k }}</option>
      </select>
      <input v-if="headSearchProperty==='bSpan'" type="text" v-model="bridge.bSpan" class="form-control" placeholder="桥梁跨径">
      <input v-if="headSearchProperty==='CSta'" type="text" v-model="bridge.CSta" class="form-control" placeholder="桥梁中心桩号">
      <input v-if="headSearchProperty==='bName'" type="text" v-model="bridge.bName" class="form-control" placeholder="桥梁名称">
      <input v-if="headSearchProperty==='bCDate'" type="text" v-model="bridge.bCDate" class="form-control" placeholder="桥梁建成时间">
      <input v-if="headSearchProperty==='bCen'" type="text" v-model="bridge.bCen" class="form-control" placeholder="检测单位">
      <input v-if="headSearchProperty==='bRoad'" type="text" v-model="bridge.bRoad" class="form-control" placeholder="服役路线">
      <input v-if="headSearchProperty==='bSCom'" type="text" v-model="bridge.bSCom" class="form-control" placeholder="桥梁跨径组合">
      <input v-if="headSearchProperty==='bWide'" type="text" v-model="bridge.bWide" class="form-control" placeholder="桥梁宽度">
      <input v-if="headSearchProperty==='bId'" type="text" v-model.number="bridge.bId" class="form-control" placeholder="桥梁Id">
      <input v-if="headSearchProperty==='bLen'" type="text" v-model="bridge.bLen" class="form-control" placeholder="桥梁长度">
      <input v-if="headSearchProperty==='bMUnit'" type="text" v-model="bridge.bMUnit" class="form-control" placeholder="桥梁管理单位">


      <input v-if="headSearchProperty==='cId'" type="text" v-model.number="cause.cId" class="form-control" placeholder="病害原因Id">
      <input v-if="headSearchProperty==='cName'" type="text" v-model="cause.cName" class="form-control" placeholder="病害原因名">
      <input v-if="headSearchProperty==='cDesc'" type="text" v-model="cause.cDesc" class="form-control" placeholder="病害原因描述">


      <input v-if="headSearchProperty==='bCId'" type="text" v-model.number="conclusion.bCId" class="form-control" placeholder="检测结论Id">
      <input v-if="headSearchProperty==='bCName'" type="text" v-model="conclusion.bCName" class="form-control" placeholder="检测结论名">
      <input v-if="headSearchProperty==='bCValue'" type="text" v-model="conclusion.bCValue" class="form-control" placeholder="检测结论值">


      <input v-if="headSearchProperty==='bDId'" type="text" v-model.number="disease.bDId" class="form-control" placeholder="病害Id">
      <input v-if="headSearchProperty==='bDName'" type="text" v-model="disease.bDName" class="form-control" placeholder="病害名">


      <input v-if="headSearchProperty==='bsId'" type="text" v-model.number="fine_structure.bsId" class="form-control" placeholder="细粒度桥梁结构Id">
      <input v-if="headSearchProperty==='bsName'" type="text" v-model="fine_structure.bsName" class="form-control" placeholder="细粒度桥梁结构名">


      <!--      &lt;!&ndash;      未完全实现&ndash;&gt;-->
      <input v-if="headSearchProperty==='LId'" type="text" v-model.number="last.lId" class="form-control" placeholder="Id">
      <input v-if="headSearchProperty==='name'" type="text" v-model="last.name" class="form-control" placeholder="名称">
      <input v-if="headSearchProperty==='value'" type="text" v-model="last.value" class="form-control" placeholder="值">


      <input v-if="headSearchProperty==='bSLId'" type="text" v-model.number="location.bSLId" class="form-control" placeholder="结构位置Id">
      <input v-if="headSearchProperty==='bSLName'" type="text" v-model="location.bSLName" class="form-control" placeholder="结构位置名">


      <input v-if="headSearchProperty==='bSId'" type="text" v-model.number="structure.bSId" class="form-control" placeholder="桥梁结构Id">
      <input v-if="headSearchProperty==='bSName'" type="text" v-model="structure.bSName" class="form-control" placeholder="桥梁结构名">
      <input v-if="headSearchProperty==='bSMat'" type="text" v-model="structure.bSMat" class="form-control" placeholder="桥梁结构材料">
      <input v-if="headSearchProperty==='bSType'" type="text" v-model="structure.bSType" class="form-control" placeholder="桥梁结构形式">
      <input v-if="headSearchProperty==='CNum'" type="text" v-model="structure.CNum" class="form-control" placeholder="桥梁结构数量">


      <input v-if="headSearchProperty==='tId'" type="text" v-model.number="technical_state.tId" class="form-control" placeholder="技术状况Id">
      <input v-if="headSearchProperty==='tName'" type="text" v-model="technical_state.tName" class="form-control" placeholder="技术状况名">
      <input v-if="headSearchProperty==='tValue'" type="text" v-model="technical_state.tValue" class="form-control" placeholder="技术状况值">
      <input v-if="headSearchProperty==='tBase'" type="text" v-model="technical_state.tBase" class="form-control" placeholder="技术状况评定标准">


      <input v-if="headSearchProperty==='bDTId'" type="text" v-model.number="type.bDTId" class="form-control" placeholder="病害类型Id">
      <input v-if="headSearchProperty==='bDTName'" type="text" v-model="type.bDTName" class="form-control" placeholder="病害类型名">

      <select v-model="relationshipType" class="form-control" id="relationType">
        <option>none</option>
        <option>has_cause</option>
        <option>has_conclusion</option>
        <option>has_disease</option>
        <option>has_entity</option>
        <option>has_last</option>
        <option>has_location1</option>
        <option>has_number</option>
        <option>has_technical</option>
      </select>
      <select v-model="tailNodeType" class="form-control" id="tailEntityType">
        <option>none</option>
        <option>bridge</option>
        <option>cause</option>
        <option>conclusion</option>
        <option>disease</option>
        <option>fine_structure</option>
        <option>last</option>
        <option>location</option>
        <option>structure</option>
        <option>technical_state</option>
        <option>type</option>
      </select>

      <select v-model="tailSearchProperty" class="form-control">
        <option v-for="k in nodeOption[tailNodeType]">{{ k }}</option>
      </select>

      <input v-if="tailSearchProperty==='bSpan'" type="text" v-model="tailbridge.bSpan" class="form-control" placeholder="桥梁跨径">
      <input v-if="tailSearchProperty==='CSta'" type="text" v-model="tailbridge.CSta" class="form-control" placeholder="桥梁中心桩号">
      <input v-if="tailSearchProperty==='bName'" type="text" v-model="tailbridge.bName" class="form-control" placeholder="桥梁名称">
      <input v-if="tailSearchProperty==='bCDate'" type="text" v-model="tailbridge.bCDate" class="form-control" placeholder="桥梁建成时间">
      <input v-if="tailSearchProperty==='bCen'" type="text" v-model="tailbridge.bCen" class="form-control" placeholder="检测单位">
      <input v-if="tailSearchProperty==='bRoad'" type="text" v-model="tailbridge.bRoad" class="form-control" placeholder="服役路线">
      <input v-if="tailSearchProperty==='bSCom'" type="text" v-model="tailbridge.bSCom" class="form-control" placeholder="桥梁跨径组合">
      <input v-if="tailSearchProperty==='bWide'" type="text" v-model="tailbridge.bWide" class="form-control" placeholder="桥梁宽度">
      <input v-if="tailSearchProperty==='bId'" type="text" v-model.number="tailbridge.bId" class="form-control" placeholder="桥梁Id">
      <input v-if="tailSearchProperty==='bLen'" type="text" v-model="tailbridge.bLen" class="form-control" placeholder="桥梁长度">
      <input v-if="tailSearchProperty==='bMUnit'" type="text" v-model="tailbridge.bMUnit" class="form-control" placeholder="桥梁管理单位">


      <input v-if="tailSearchProperty==='cId'" type="text" v-model.number="tailcause.cId" class="form-control" placeholder="病害原因Id">
      <input v-if="tailSearchProperty==='cName'" type="text" v-model="tailcause.cName" class="form-control" placeholder="病害原因名">
      <input v-if="tailSearchProperty==='cDesc'" type="text" v-model="tailcause.cDesc" class="form-control" placeholder="病害原因描述">


      <input v-if="tailSearchProperty==='bCId'" type="text" v-model.number="tailconclusion.bCId" class="form-control" placeholder="检测结论Id">
      <input v-if="tailSearchProperty==='bCName'" type="text" v-model="tailconclusion.bCName" class="form-control" placeholder="检测结论名">
      <input v-if="tailSearchProperty==='bCValue'" type="text" v-model="tailconclusion.bCValue" class="form-control" placeholder="检测结论值">


      <input v-if="tailSearchProperty==='bDId'" type="text" v-model.number="taildisease.bDId" class="form-control" placeholder="病害Id">
      <input v-if="tailSearchProperty==='bDName'" type="text" v-model="taildisease.bDName" class="form-control" placeholder="病害名">


      <input v-if="tailSearchProperty==='bsId'" type="text" v-model.number="tailfine_tailstructure.bsId" class="form-control" placeholder="细粒度桥梁结构Id">
      <input v-if="tailSearchProperty==='bsName'" type="text" v-model="tailfine_tailstructure.bsName" class="form-control" placeholder="细粒度桥梁结构名">


      <!--      &lt;!&ndash;      未完全实现&ndash;&gt;-->
      <input v-if="tailSearchProperty==='LId'" type="text" v-model.number="taillast.lId" class="form-control" placeholder="Id">
      <input v-if="tailSearchProperty==='name'" type="text" v-model="taillast.name" class="form-control" placeholder="名称">
      <input v-if="tailSearchProperty==='value'" type="text" v-model="taillast.value" class="form-control" placeholder="值">


      <input v-if="tailSearchProperty==='bSLId'" type="text" v-model.number="tailloaction.bSLId" class="form-control" placeholder="结构位置Id">
      <input v-if="tailSearchProperty==='bSLName'" type="text" v-model="tailloaction.bSLName" class="form-control" placeholder="结构位置名">


      <input v-if="tailSearchProperty==='bSId'" type="text" v-model.number="tailstructure.bSId" class="form-control" placeholder="桥梁结构Id">
      <input v-if="tailSearchProperty==='bSName'" type="text" v-model="tailstructure.bSName" class="form-control" placeholder="桥梁结构名">
      <input v-if="tailSearchProperty==='bSMat'" type="text" v-model="tailstructure.bSMat" class="form-control" placeholder="桥梁结构材料">
      <input v-if="tailSearchProperty==='bSType'" type="text" v-model="tailstructure.bSType" class="form-control" placeholder="桥梁结构形式">
      <input v-if="tailSearchProperty==='CNum'" type="text" v-model="tailstructure.CNum" class="form-control" placeholder="桥梁结构数量">


      <input v-if="tailSearchProperty==='tId'" type="text" v-model.number="tailtechnical_state.tId" class="form-control" placeholder="技术状况Id">
      <input v-if="tailSearchProperty==='tName'" type="text" v-model="tailtechnical_state.tName" class="form-control" placeholder="技术状况名">
      <input v-if="tailSearchProperty==='tValue'" type="text" v-model="tailtechnical_state.tValue" class="form-control" placeholder="技术状况值">
      <input v-if="tailSearchProperty==='tBase'" type="text" v-model="tailtechnical_state.tBase" class="form-control" placeholder="技术状况评定标准">


      <input v-if="tailSearchProperty==='bDTId'" type="text" v-model.number="tailtype.bDTId" class="form-control" placeholder="病害类型Id">
      <input v-if="tailSearchProperty==='bDTName'" type="text" v-model="tailtype.bDTName" class="form-control" placeholder="病害类型名">

      <button id="searchButton" @click="searchNodeAndLinks()" class="btn btn-primary">Search</button>
    </div>


    <div class="modal fade" v-show="showModal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">修改节点信息</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>

              <div class="input-group mb-3" v-for="(v,k) in currentNode"
                   v-if="k!=='x' && k!=='id' && k!=='index'  && k!=='nodeType' && k!=='y' && k!=='vx' && k!=='vy' && k!=='fy' && k!=='fx' && k!=='fixed'">
                <div class="input-group-prepend">
                                    <span class="input-group-text kuandu" id="inputGroup-sizing-sm">
                                      {{ k }}</span>
                </div>
                <input :placeholder="v" aria-label="Sizing example input" id="kuandulll"
                       aria-describedby="inputGroup-sizing-sm">
              </div>

            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" @click="show(currentNode.id)">修改</button>
          </div>
        </div>
      </div>
    </div>

    <div id="toastShow" class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; left: 250px; top: 40px;">
      <div id="liveToast1" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
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
  name: "Control",
  data() {
    return {
      relationshipAdd:'none',
      showAddLinks:'showAddLinks',
      flag:1,
      relationshipHead:'',
      relationshipTail:'',
      headSearchProperty: '',
      tailSearchProperty: '',
      ifRevise: true,
      currentNode: {},
      currentNodeType: "",
      showModal: false,
      message: [],
      relationshipType:'none',
      headNodeType: 'none',
      tailNodeType:'none',
      nodeOption: {
        bridge: ['bSpan', 'CSta', 'bName', 'bCDate', 'bCen', 'bRoad', 'bSCom',
          'bWide', 'bId', 'bLen', 'bMUnit'],
        cause: ['cName', 'cDesc', 'cId'],
        conclusion: ['bCId', 'bCValue', 'bCName'],
        disease: ['bDId', 'bDName'],
        fine_structure: ['bsName', 'bsId'],
        last: ['name', 'value', 'lId'],
        location: ['bSLId', 'bSLName'],
        structure: ['bSId', 'bSMat', 'CNum', 'bSName', 'bSType'],
        technical_state: ['tName', 'tValue', 'tId', 'tBase'],
        type: ['bDTId', 'bDTName'],
        none: []
      },
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
      tailbridge:{},
      tailcause:{},
      tailconclusion:{},
      taildisease: {},
      tailfine_structure: {},
      taillast:{},
      taillocation:{},
      tailstructure: {},
      tailtechnical_state: {},
      tailtype:{},
      toastMessage:'修改成功',
      headNodeId:-1,
      tailNodeId:-1,
    }
  },

  mounted() {
    this.showModal = true;
  },

  watch:{
    'currentNode':{
      handler:function () {
        // console.log(this.currentNode.id)
        if (this.flag%2===0){
          // 如果添加关系框打开
          if (this.relationshipHead === '请选择头节点'){
            this.headNodeId = this.currentNode.id
            this.relationshipHead = '头节点Id：'+this.currentNode.id
          }
          else if(this.relationshipTail === '请选择尾节点'){
            this.tailNodeId = this.currentNode.id
            this.relationshipTail = '尾节点Id：'+this.currentNode.id
          }
        }
      }
    }
  },
  methods: {

    dealAdd(){
      let _this = this
      if(_this.relationshipHead === '请选择头节点'){
        alert('请选择头节点')
        return
      }
      if (_this.relationshipAdd === 'none'){
        alert('请选择关系')
        return;
      }
      if (_this.relationshipTail === '请选择尾节点'){
        alert('请选择尾节点')
        return;
      }
      _this.axios.get('addRelationship/', {
        params: {
          'headNodeId': _this.headNodeId,
          'relationshipAdd':_this.relationshipAdd,
          'tailNodeId':_this.tailNodeId,
        }
      }).then(function (response) {
        if (response.status === 200){
          _this.relationshipHead = '请选择头节点'
          _this.relationshipTail = '请选择尾节点'
          _this.relationshipAdd = 'none'
          _this.toastMessage = '添加成功'
          $('#liveToast1').toast('show')
        }
      }).catch(function (error) {
        _this.toastMessage = '发生未知错误'
        $('#liveToast1').toast('show')
        console.log(error)
      })
    },

    showAndDeal(){
      this.flag += 1;
      if(this.flag %2 === 0){
        this.relationshipHead = '请选择头节点'
        this.relationshipTail = '请选择尾节点'
        this.showAddLinks = 'hideAddlinks'
      }else{
        this.showAddLinks = 'showAddlinks'
      }
    },
    withdraw(index){
      if(index === 1){
        this.relationshipHead = '请选择头节点'
      }else{
        this.relationshipTail = '请选择尾节点'
      }
    },

    searchNodeAndLinks() {
      let _this = this
      if (_this.headNodeType === 'none' && _this.relationshipType === 'none' && _this.tailNodeType === 'none'){
        alert('请输入至少一个搜索信息')
        return
      }

      let tempHeadJson = {
        'bridge':_this.bridge,
        'cause':_this.cause,
        'conclusion':_this.conclusion,
        'disease':_this.disease,
        'fine_structure':_this.fine_structure,
        'last':_this.last,
        'location':_this.location,
        'structure':_this.structure,
        'technical_state':_this.technical_state,
        'type':_this.type,
        'none':{}
      }

      let tempTailJson = {
        'bridge':_this.tailbridge,
        'cause':_this.tailcause,
        'conclusion':_this.tailconclusion,
        'disease':_this.taildisease,
        'fine_structure':_this.tailfine_structure,
        'last':_this.taillast,
        'location':_this.taillocation,
        'structure':_this.tailstructure,
        'technical_state':_this.tailtechnical_state,
        'type':_this.tailtype,
        'none':{}
      }

      _this.axios.get('searchAll/', {
        params: {
          'headNodeType': _this.headNodeType,
          'headNode':tempHeadJson[_this.headNodeType],
          'relationshipType':_this.relationshipType,
          'tailNodeType':_this.tailNodeType,
          'tailNode':tempTailJson[_this.tailNodeType]
        }
      }).then(function (response) {
        if (response.status === 200){
          if(response.data === 'None'){
            _this.toastMessage = '无匹配结果'
            $('#liveToast1').toast('show')
          }
          else{
            _this.$emit('update',response.data)
          }
        }
      }).catch(function (error) {
        _this.toastMessage = '发生未知错误'
        $('#liveToast1').toast('show')
        console.log(error)
      })

    },

    cancelHd() {
      this.showModal = false;
    },
    sureHd() {
      this.showModal = false;
    },
    show(id) {
      let _this = this;
      console.log(id)
      $('#exampleModal').modal('hide')
      let inputs = document.getElementsByClassName('modal-body')[0].getElementsByTagName('input')
      for (let i = 0; i < inputs.length; i++) {
        this.message[i] = inputs[i].value
      }
      this.axios.get('reviseNode/' + this.currentNode.id, {
        params: {
          'message': this.message.toString()
        }
      }).then(function (response) {
        _this.toastMessage = '修改成功'
        $('.toast').toast('show')
        console.log(response)
      }).catch(function (error) {
        _this.toastMessage = '发生未知错误'
        $('.toast').toast('show')
        console.log(error)
      })
      this.message = []
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.kuandu {
  width: 90px;
}

#addButton{
  height: 38px;
}

#kuandulll {
  width: 370px;
}

#searchButton {
  margin-top: 5px;
}

#collapseExample{
  /*display: block;*/
  /*margin-top: 10px;*/
  width: 800px;
  /*height: 150px;*/
  /*text-align: center;*/
  margin: 0 auto;
  border-radius: 4px;
  border: 1px solid #A4A4A4;
}

.detail-panel {
  position: fixed;
  left: 0px;
  top: 40px;
  /*border-radius: 4px;*/
  border: 1px solid black;
  width: 200px;
}

.detail-panel:hover {
  -webkit-box-shadow: #ccc 0px 10px 10px;
  -moz-box-shadow: #ccc 0px 10px 10px;
  box-shadow: #ccc 0px 10px 10px;
}
</style>
