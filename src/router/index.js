import Vue from 'vue'
import Router from 'vue-router'
import Canvas from "../components/Canvas";
import AddNotes from "../components/AddNotes";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'canvas',
      component: Canvas
    },
    {
      path:'/addNotes',
      name:'add',
      component:AddNotes
    }
  ]
})
