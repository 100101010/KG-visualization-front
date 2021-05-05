<template>
<div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" id="bridge" @change="selectButton" v-model="selectNode"  value="bridge">bridge
    </label>
  </div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="cause">cause
    </label>
  </div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="conclusion">conclusion
    </label>
  </div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="disease">disease
    </label>
  </div>
  <div class="form-check form-check-inline disabled">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="fine_structure" >fine_structure
    </label>
  </div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="last">last
    </label>
  </div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="location">location
    </label>
  </div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="structure">structure
    </label>
  </div>
  <div class="form-check form-check-inline">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="technical_state">technical_state
    </label>
  </div>
  <div class="form-check form-check-inline disabled">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input" @change="selectButton" v-model="selectNode" value="type" >type
    </label>
  </div>

  </div>
</template>

<script>

export default {
  name: "Checkbox",
  data() {
    return{
      selectNode: ['bridge']
    }
  },
  mounted() {
    // console.log(document.getElementById('bridge'))
    document.getElementById('bridge').checked = true;
  },
  methods :{
    selectButton(){
      let _this = this
      _this.axios.get('showNodes/',{
        params:{
          'queryTitle':_this.selectNode.toString()
        }
      }).then(function (response) {
        if(response.status === 200) {
          _this.$emit('update',response.data)
        }
      }).catch(function (error) {
        console.log(error)
      })
        console.log(_this.selectNode)
    }
  }
}
</script>

<style scoped>
.form-check-label{
  color: #000000;
}
</style>
