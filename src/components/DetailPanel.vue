<template>
  <div class="panel panel-primary detail-panel" shadow="hover">
    <div class="panel-heading heading"><h5>节点信息</h5></div>
    <hr />
    <div v-show="ifShow">
      <table class="table1">
        <th>Name</th><th>Value</th>
        <tr v-for="(v,k) in currentNode">
          <td v-if="k!=='x' && k!=='index' && k!=='y' && k!=='vx' && k!=='vy' && k!=='fy' && k!=='fx' && k!=='fixed'"
          >  <small>{{k}}</small>
          </td>
          <td v-if="k!=='x' && k!=='y' && k!=='index' && k!=='vx' && k!=='vy' && k!=='fy' && k!=='fx' && k!=='fixed'"
          > <small>{{v}}</small>
          </td>
        </tr>
      </table>
      <select v-model="currentType" class="form-control">
        <option v-for="(type,i) in relationshipTypes">{{type}}</option>
      </select>
      <button id="buttons" @click="onSubmit" class="btn btn-primary">查询关系</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailPanel",
  data() {
    return {
      ifShow:false,
      currentNode:{},
      currentType:'',
      relationshipTypes: ['has_cause', "has_conclusion", "has_disease", "has_entity", 'has_last', 'has_location1', 'has_number', 'has_technical'],
    }
  },
  props:{

  },
  methods:{
    onSubmit(){
      let _this = this

      if(this.currentType === ""){
        this.$message.error('未选择任何类型');
        return
      }
      else{
        this.axios.get("showRelations/"+_this.currentNode.id+"/"+_this.currentType)
          .then(function (response) {
            if(response.status === 200) {
              _this.$emit('update',response.data, _this.currentNode,_this.currentType)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      console.log(this.currentType)
    }
  }
}
</script>

<style scoped>
.table1{
  border-collapse: separate;
  border-spacing: 7px 1px;
}
.detail-panel{
  position: fixed;
  right: 20px;
  top: 40px;
  /*border-radius: 4px;*/
  border:1px solid black;
  width: 200px;
  /*cursor: pointer;*/
}
.heading{
  position: relative;
  right: 25px;
  top: 10px;
}
.detail-info{
  width: 50%;
  text-align: left;
  font-size: 12px;
  font-weight: bolder;
}
.detail-panel:hover{
  -webkit-box-shadow: #ccc 0px 10px 10px;
  -moz-box-shadow: #ccc 0px 10px 10px;
  box-shadow: #ccc 0px 10px 10px;
}
#buttons{
  margin-top: 5px;
}
.type-select{
  margin-top: 25px;
  height: 20px;
}
</style>
