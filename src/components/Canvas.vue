<template>
  <div>
    <checkbox @update="renderGraph"></checkbox>
    <control @update="renderGraph" ref="control" ></control>
    <div id="graph">
    </div>
    <div id="toastShow" class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; left: 250px; top: 40px;">
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
    <detail-panel ref="detailPanel" @update="getQueryResult"></detail-panel>
  </div>
</template>

<script>

import * as d3 from 'd3'
import DetailPanel from "./DetailPanel";
import Control from "./Control";
import Checkbox from "./Checkbox";
import $ from 'jquery'

export default {
  name: "Canvas",
  components: {DetailPanel,Control,Checkbox},
  data() {
    return {
      svgArea: null,
      links: [],
      nodes: [],
      nodesName: [],
      linksName: [],
      simulation: null,
      scale: 1,
      toastMessage:'删除成功',
      width: 800,
      height: 500,
      colorList: ['#FD7623', '#3388B1', '#D82952', '#F3D737', '#409071', '#D64E52'],
      testGraph: {
        "nodes": [],
        "links": []
      }
    }
  },
  created() {
    // this.bindCheckboxEvent()
    this.getGraphData()
  },
  methods: {
    getGraphData() {
      let _this = this
      this.axios.get('bridge/').then(function (response) {
        console.log(response.data)
        _this.renderGraph(response.data)
      }).catch(function (error) {
        console.log(error)
      })
    },

    renderGraph(my_data) {
      let _this = this;
      // _this.$refs.detailPanel.ifShow = false
      let links = my_data.links; //经过力学仿真后，links里面的source和target节点会引用对应的nodes对象
      let nodes = my_data.nodes;

      //关系分组
      _this.setLinkGroup(links);

      //点击节点后弹出的灰色圆圈以及图标的定义，分为三组【1.删除、2.联系、3.解除位置锁定】
      let [removePath, remove_rect1, remove_rect2, remove_line1, remove_line2, remove_line3] = [null];
      let [unlockPath, unlock_path1, unlock_rect1, unlock_line1] = [null];
      let [hidePath, hide_path1, hide_path2, hide_path3, hide_path4, hide_circle1, hide_line1] = [null];
      let rightArc = d3.arc().outerRadius(60).innerRadius(30).startAngle(0).endAngle(1.85);
      let leftArc = d3.arc().outerRadius(60).innerRadius(30).startAngle(4.5).endAngle(6.23);
      let bottomArc = d3.arc().outerRadius(60).innerRadius(30).startAngle(1.9).endAngle(4.45);

      var simulation = null;
      var zoom = null;
      var svg = null;
      var edges_line = null;
      var edges_text = null;
      var circle_g = null;
      var circle = null;
      var text = null;

      d3.select("#graph").html('');

      simulation = d3.forceSimulation(nodes) //启动力学仿真    //force之后返回的依然是forceSimulation对象
        .force("charge", d3.forceManyBody()) //添加力学仿真模型
        .force("links", d3.forceLink(links).id(d => d.id).distance(150))
        .force("center", d3.forceCenter(800 / 2, 600 / 2))
        .force("collision", d3.forceCollide(30))

      // simulation.force("links").links(links).distance(150); //设置弹簧力模型参数，连线数组和连线长度
      simulation.force("charge").strength(-20); //顶点的电荷数。该参数决定是排斥还是吸引，数值越小越互相排斥


      console.log(links)
      console.log(nodes)

      zoom = d3.zoom() //创建一个放缩对象
        .scaleExtent([.4, 2])
        .on("zoom", zoomed);

      //配置画板svg属性
      svg = d3.select("#graph").append("svg")
        .attr("pointer-event", "all")
        .attr("preserveAspectRatio", "xMidYMid meet") //自适应容器大小
        .attr("viewPort", "0 0 800 600")
        .attr("viewBox", "0 0 800 600")
        .call(zoom);

      //设置连接线
      edges_line = svg.append("g").selectAll(".edgepath")
        .data(links) //此时的links属性已经经过力学仿真进行了相关数据修改
        .enter()
        .append("path")
        .attr("marker-end", function (d, i) {
          return getMarkerArrow(i);
        }) //根据箭头标记的id号标记箭头
        .style("stroke", '#9aaabf')
        .style("stroke-width", 1) //线条粗细
        .style("fill-opacity", 0)
        .style("cursor", "pointer")
        .attr("id", function (d, i) {
          return 'edgepath' + i;
        })
        .on("mouseover", function (d) {
          return getStrokeWidth(d);
        })
        .on("mouseout", function () {
          edges_line.style("stroke-width", 1)
        })
        .on('click', (d, i) => {
          deleteLine(d, i);
        });

      //设置连接线上的文字
      edges_text = svg.append("g").selectAll(".edgetext")
        .data(links)
        .enter()
        .append("text")
        .style("pointer-events", "none")
        .attr("class", "linetext")
        .attr('text-anchor', "middle")
        .attr("fill-opacity", 1)
        .style("cursor", "pointer")
        .attr('class', 'edgelabel')
        .attr('id', function (d, i) {
          return 'edgepath' + i;
        })
        .attr('dx', 50)
        .attr('dy', 0)
        .attr('fill', '#9aaabf');

      //设置线条上的文字
      edges_text.append('textPath')
        .attr('xlink:href', function (d, i) {
          return '#edgepath' + i
        })
        .attr("pointer-events", "none").attr("font-size", 9)
        .text(function (d) {
          return d.relationship;
        });

      circle_g = svg.selectAll("circle")
        .data(nodes) //使用仿真后的nodes数据
        .enter()
        .append("g")
        .attr("class", function (node, i) {
          return "g_circle_" + i;
        }) //标记circle的父节点
        .style("cursor", "pointer")
        .call(drag()) //将当前选中的元素传到drag函数中，使顶点可以被拖动
        .on("click", (node, i) => {
          if (d3.event.defaultPrevented) return; //阻止click事件和拖拽事件冲突
          circleClick(node, i, this);
        })
        .on('dblclick', (node) => {
          if (d3.event.defaultPrevented) return;
          // showNodeInfo(node, this);
          _this.$refs.detailPanel.currentNode= node
          _this.$refs.detailPanel.ifShow = true
          _this.$refs.control.ifRevise = false
          _this.$refs.control.currentNode = node
          _this.$refs.control.currentNodeType = node.nodeType

          // showCircleBorderOuterArc(node, i);
        });

      svg.on("dblclick.zoom", null); //取消svg和圆圈的双击放大事件（d3中默认开启7个事件，关闭防止与上面的双击事件冲突）
      // circle_g.on("dblclick.zoom", null);

      //圆圈
      circle = circle_g.append("circle")
        .style("stroke-width", "2px")
        .attr("r", 25) //设置圆圈半径
        .style("fill", function (node) {
          return getCircleColor(node);
        });

      text = circle_g.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") //在圆圈中加上数据
        .style('fill', "#FFFFFF")
        .attr('x', function (d) {
          appendCircleText(d, this);
        });

      //圆圈的提示文字
      circle.append("svg:title").text(function (node) {
        switch (node.nodeType) {
          case 'bridge':
            return node.bName;
          case 'cause':
            return node.cName;
          case 'conclusion':
            return node.bCName;
          case 'disease':
            return node.bDName;
          case 'fine_structure':
            return node.bsName;
          case 'last':
            return node.name;
          case 'location':
            return node.bSLName;
          case 'strcuture':
            return node.bSName;
          case 'technical_state':
            return node.tName;
          case 'type':
            return node.bDTName;
        }
      });
      text.append("svg:title").text(function (node) {
        switch (node.nodeType) {
          case 'bridge':
            return node.bName;
          case 'cause':
            return node.cName;
          case 'conclusion':
            return node.bCName;
          case 'disease':
            return node.bDName;
          case 'fine_structure':
            return node.bsName;
          case 'last':
            return node.name;
          case 'location':
            return node.bSLName;
          case 'strcuture':
            return node.bSName;
          case 'technical_state':
            return node.tName;
          case 'type':
            return node.bDTName;
        }
      });

      function zoomed() { //svg下的g标签移动大小
        svg.selectAll("g").attr("transform", d3.event.transform);
      }


      function getMarkerArrow(i) {
        svg.append("defs").append("marker") //箭头
          .attr("id", "arrow" + i)
          .attr("markerUnits", "strokeWidth") //设置为strokeWidth箭头会随着线的粗细发生变化
          .attr("markerUnits", "userSpaceOnUse")
          .attr("markerWidth", 10) //标识的大小
          .attr("markerHeight", 10)
          .attr("viewBox", "0 -4 12 15") //坐标系的区域
          .attr("refX", 0) //箭头坐标
          .attr("refY", 0)
          .attr("orient", 'auto') //绘制方向，可设定为：auto（自动确认方向）和 角度值
          .append("svg:path")
          .attr("stroke-width", 1) //箭头宽度
          .attr("d", "M0,-5L10,0L0,5") //箭头的路径
          .attr('fill', 'rgba(0,0,0, 0.4)'); //箭头颜色
        return "url(#arrow" + i + ")";
      }

      function getStrokeWidth(d) {
        edges_line.style("stroke-width", function (edge) {
          return edge.relationshipId === d.relationshipId ? 3 : 1;
        });
      }

      function drag() { //拖拽函数
        return d3.drag().on("start", function (d) {
          if (!d3.event.active) {
            simulation.alphaTarget(0.05).restart(); //   设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
          }
          d3.event.sourceEvent.stopPropagation(); //取消默认事件
          d.fixed = true; //拖拽开始后设定被拖拽对象为固定
          d.fx = d.x; //通过设置fx值来固定节点位置  https://github.com/xswei/d3-force/blob/master/README.md#simulation_nodes
          d.fy = d.y;
        })
          .on("drag", function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on("end", function (d) {
            if (!d3.event.active) {
              simulation.alphaTarget(0.05);
            }
            d.fx = d.x; //设置为null则取消固定
            d.fy = d.y;
          });
      }

      function circleClick(node, i, _this) {
        //获取当前节点是否包含圆环
        let existedRing = svg.select('.g_circle_' + i).selectAll('.g_circle_path');
        //清除上个节点的圆圈以及图标
        svg.selectAll('.g_circle_path').remove();
        svg.selectAll('.remove_a').remove();
        svg.selectAll('.hide_a').remove();
        svg.selectAll('.unlock_a').remove();
        removePath = null;
        unlockPath = null;
        hidePath = null;
        if (existedRing && existedRing["_groups"][0].length === 0) {
          //showCircleBorderOuterArc(node, i);
          //绘制灰色可点击圆圈，分为三部分分别绘制
          showRemove(node, i, _this);
          showUnlock(node, i, _this);
          showHide(node, i, _this);
        }
      }

      function getCircleColor(node) {
        let color = {
          'bridge': "#FF9D00",
          'cause': "#C477E9",
          'conclusion': '#67CAF4',
          'disease': '#BCDD73',
          'fine_structure': '#DD1E9E',
          'last': '#DDBA9E',
          'location': '#6ca5dd',
          'structure': '#50DD87',
          'technical_state': '#DF0101',
          'type': '#0B1907',
        }; //圆圈背景色
        return color[node.nodeType];
      }

      function appendCircleText(d, _this) {
        let circleText = '';
        if (d.nodeType === 'bridge')
          circleText = d.bName;
        else if (d.nodeType === 'cause')
          circleText = d.cName;
        else if (d.nodeType === 'conclusion')
          circleText = d.bCName;
        else if (d.nodeType === 'disease')
          circleText = d.bDName;
        else if (d.nodeType === 'fine_structure')
          circleText = d.bsName;
        else if (d.nodeType === 'last')
          circleText = d.name;
        else if (d.nodeType === 'location')
          circleText = d.bSLName;
        else if (d.nodeType === 'structure')
          circleText = d.bSName;
        else if (d.nodeType === 'technical_state')
          circleText = d.tName;
        else
          circleText = d.bDTName;

        //如果小于四个字符，不换行
        if (circleText && circleText.length > 4) {
          circleText = circleText.substring(0, 4) + "...";
          d3.select(_this).text(function () {
            return '';
          });
        }
        d3.select(_this).append('tspan').attr('x', 0).attr('y', 0).attr("font-size", 12)
          .text(function () {
            return circleText;
          });
      }

      function deleteLine(d, i) {
        alert('delete this ' + d + ',' + d.relationshipId);
        d3.event.stopPropagation();
        _this.axios.get("deleteRe/"+d.relationshipId+'/')
          .then(function (response) {
            if(response.status === 200) {
              edges_line.attr('d', function (relation) {
                if (relation.relationshipId === d.relationshipId) {
                  d3.select(this).remove();
                }
              });
              _this.toastMessage = '删除成功'
              $('.toast').toast('show')
            }
          })
          .catch(function (error) {
            _this.toastMessage = '发生未知错误'
            $('.toast').toast('show')
            console.log(error)
          })
      }

      function tick() {
        //每个一小段时间此函数会被调用，用以绘图。alpha值越小表示力学仿真布局越合理，为了减少不必要的渲染，同时加快画面展示流畅度
        //设置满足一定阈值时，才渲染图形
        if (simulation.alpha() > 0.1) return; // 足够稳定时，才渲染一次.此阈值的设定要大于等于drag函数里面的alphaTarget值。

        circle.attr("transform", transform1); //圆圈
        text.attr("transform", transform2); //顶点文字
        edges_line.attr('d', function (d) {
          //绘制自己指向自己的路径
          // if (d.relation.isSelf) { return getNodeSelfPath(d) }
          // //绘制两个节点之间的路径
          return _this.getNodesLine(d); //曲线路径
        });

        // if(circleBorderOuterArcObj !== null) {
        //   circleBorderOuterArcObj.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
        // }

        //绘制节点删除功能半圆环
        if (removePath !== null) {
          removePath.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")"
          });

          let r1 = null;
          remove_rect1.attr('d', function (d) {
            r1 = d;
          })
            .attr("x", r1.x + 33 + 6.75).attr("y", r1.y - 36 + 9.75).attr("width", 5).attr("height", 3).attr("rx", 1.5).attr("ry", 1.5);

          let r2 = null;
          remove_rect2.attr('d', function (d) {
            r2 = d;
          })
            .attr("x", r2.x + 30 + 6.75).attr("y", r2.y - 33 + 9.75).attr("width", 12).attr("height", 14).attr("rx", 1.5).attr("ry", 1.5);

          let l1 = null;
          remove_line1.attr('d', function (d) {
            l1 = d;
          })
            .attr("x1", l1.x + 28 + 6.75).attr("y1", l1.y - 33 + 9.75).attr("x2", l1.x + 45 + 6.75).attr("y2", l1.y - 33 + 9.75);

          let l2 = null;
          remove_line2.attr('d', function (d) {
            l2 = d;
          })
            .attr("x1", l2.x + 34 + 6.75).attr("y1", l2.y - 30 + 9.75).attr("x2", l2.x + 34 + 6.75).attr("y2", l2.y - 23 + 9.75);

          let l3 = null;
          remove_line3.attr('d', function (d) {
            l3 = d;
          })
            .attr("x1", l3.x + 38 + 6.75).attr("y1", l3.y - 30 + 9.75).attr("x2", l3.x + 38 + 6.75).attr("y2", l3.y - 23 + 9.75);
        }

        //绘制解除节点位置锁定半圆环
        if (unlockPath !== null) {
          unlockPath.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")"
          });
          unlock_path1.attr("transform", function (d) {
            return "translate(" + (d.x - 45) + "," + (d.y - 23) + ")"
          });

          let r1 = null;
          unlock_rect1.attr('d', function (d) {
            r1 = d;
          })
            .attr("x", r1.x - 52 + 6.75).attr("y", r1.y - 30 + 9.75).attr("width", 15).attr("height", 12).attr("rx", 1.5).attr("ry", 1.5);

          let l1 = null;
          unlock_line1.attr('d', function (d) {
            l1 = d;
          })
            .attr("x1", l1.x - 52 + 15).attr("y1", l1.y - 30 + 15).attr("x2", l1.x - 52 + 15).attr("y2", l1.y - 30 + 18);
        }

        //绘制隐藏节点和关系半圆环
        if (hidePath !== null) {
          hidePath.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")"
          });

          hide_path1
            .attr("d", function (d) {
              return "M" + (d.x - 13) + "," + (d.y + 42) + "A15,15,0,0,1" + (d.x + 13) + "," + (d.y + 42)
            });
          hide_path2
            .attr("d", function (d) {
              return "M" + (d.x - 12 + 10.4) + "," + (d.y + 34 + 10.937) + "A" + 3.749 + "," + 3.749 + ",0,1,1," + (d.x - 12 + 15.338) + "," + (d.y + 33 + 9)
            });
          hide_path3
            .attr("d", function (d) {
              return "M" + (d.x - 12) + "," + (d.y + 42) + "A20,20,0,0,0" + (d.x - 4) + "," + (d.y + 47)
            });
          hide_path4
            .attr("d", function (d) {
              return "M" + (d.x + 11) + "," + (d.y + 44) + "A20,20,0,0,0" + (d.x + 13) + "," + (d.y + 42)
            });

          let c1 = null;
          hide_circle1.attr('d', function (d) {
            c1 = d;
          })
            .attr("cx", c1.x - 12 + 17.15).attr("cy", c1.y + 33 + 17.25).attr("r", 6);

          let l1 = null;
          hide_line1.attr('d', function (d) {
            l1 = d;
          })
            .attr("x1", l1.x - 12 + 14.15).attr("y1", l1.y + 33 + 17.25).attr("x2", l1.x - 12 + 20.15).attr("y2", l1.y + 33 + 17.25);

        }

      }

      simulation.on("tick", tick); //指时间间隔，隔一段时间刷新一次画面

      //设置圆圈和文字的坐标
      function transform1(d) {
        //设置节点固定 初始全部固定，拖动节点后会固定当前节点
        if (d.fixed !== undefined && d.fixed === false) {
          d.fx = null;
          d.fy = null;
        } else {
          d.fx = d.x;
          d.fy = d.y;
        }
        return "translate(" + d.x + "," + d.y + ")";
      }

      function transform2(d) {
        return "translate(" + (d.x) + "," + d.y + ")";
      }


      function showRemove(node, i, _this) {
        removePath = d3.select('.g_circle_' + i).append("path").attr('class', 'g_circle_path')
          .attr("transform", "translate(" + node.x + "," + node.y + ")").attr("d", rightArc)
          .attr("fill", "rgb(210, 213, 218)")
          .style("cursor", "pointer")
          .on("click", () => {
            removeNodeAndPath(node, _this);
          })
          .on("mouseover", function () {
            removePath.attr("fill", "rgb(185, 185, 185)")
          })
          .on("mouseout", function () {
            removePath.attr("fill", "rgb(210, 213, 218)")
          });

        d3.select('.g_circle_' + i).append("g").attr("class", "remove_a")
          .attr("transform", "translate(" + (node.x + 33) + "," + (node.y - 24) + ") scale(0.7)")
          .append("defs").append("style")
          .text(".remove_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}");

        removePath.append("title").attr("class", "remove_a").text("Remove");
        remove_rect1 = d3.select('.g_circle_' + i).append("rect").attr("class", "remove_a").attr("x", node.x + 33 + 6.75).attr("y", node.y - 36 + 9.75)
          .attr("width", 5).attr("height", 3).attr("rx", 1.5).attr("ry", 1.5);
        remove_rect2 = d3.select('.g_circle_' + i).append("rect").attr("class", "remove_a").attr("x", node.x + 30 + 6.75).attr("y", node.y - 33 + 9.75)
          .attr("width", 12).attr("height", 14).attr("rx", 1.5).attr("ry", 1.5);
        remove_line1 = d3.select('.g_circle_' + i).append("line").attr("class", "remove_a").attr("x1", node.x + 28 + 6.75).attr("y1", node.y - 33 + 9.75).attr("x2", node.x + 45 + 6.75).attr("y2", node.y - 33 + 9.75);
        remove_line2 = d3.select('.g_circle_' + i).append("line").attr("class", "remove_a").attr("x1", node.x + 34 + 6.75).attr("y1", node.y - 30 + 9.75).attr("x2", node.x + 34 + 6.75).attr("y2", node.y - 23 + 9.75);
        remove_line3 = d3.select('.g_circle_' + i).append("line").attr("class", "remove_a").attr("x1", node.x + 38 + 6.75).attr("y1", node.y - 30 + 9.75).attr("x2", node.x + 38 + 6.75).attr("y2", node.y - 23 + 9.75);

        d3.selectAll(".remove_a").on("click", () => {
          removeNodeAndPath(node, _this);
        })
      }

      function showHide(node, i) {
        hidePath = d3.select('.g_circle_' + i).append("path").attr('class', 'g_circle_path')
          .attr("transform", "translate(" + node.x + "," + node.y + ")").attr("d", bottomArc)
          .attr("fill", "rgb(210, 213, 218)")
          .style("cursor", "pointer")
          .on("click", function () {
            hideNodeAndLinks(node)
          })
          .on("mouseover", function () {
            hidePath.attr("fill", "rgb(185, 185, 185)")
          })
          .on("mouseout", function () {
            hidePath.attr("fill", "rgb(210, 213, 218)")
          });

        d3.select('.g_circle_' + i).append("g").attr("class", "hide_a")
          .attr("transform", "translate(" + (node.x - 8) + "," + (node.y + 38) + ") scale(0.7)")
          .append("defs").append("style")
          .text(".hide_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}");

        hidePath.append("title").attr("class", "hide_a").text("Hide");

        hide_path1 = d3.select('.g_circle_' + i).append("path").attr("class", "hide_a")
          .attr("d", function (d) {
            return "M" + (d.x - 13) + "," + (d.y + 42) + "A15,15,0,0,1" + (d.x + 13) + "," + (d.y + 42)
          });
        hide_path2 = d3.select('.g_circle_' + i).append("path").attr("class", "hide_a")
          .attr("d", function (d) {
            return "M" + (d.x - 12 + 10.4) + "," + (d.y + 34 + 10.937) + "A" + 3.749 + "," + 3.749 + ",0,1,1," + (d.x - 12 + 15.338) + "," + (d.y + 33 + 9)
          });
        hide_path3 = d3.select('.g_circle_' + i).append("path").attr("class", "hide_a")
          .attr("d", function (d) {
            return "M" + (d.x - 12) + "," + (d.y + 42) + "A20,20,0,0,0" + (d.x - 4) + "," + (d.y + 47)
          });
        hide_path4 = d3.select('.g_circle_' + i).append("path").attr("class", "hide_a")
          .attr("d", function (d) {
            return "M" + (d.x + 11) + "," + (d.y + 44) + "A20,20,0,0,0" + (d.x + 13) + "," + (d.y + 42)
          });
        hide_circle1 = d3.select('.g_circle_' + i).append("circle").attr("class", "hide_a").attr("cx", node.x - 12 + 17.15).attr("cy", node.y + 33 + 17.25).attr("r", 6);
        hide_line1 = d3.select('.g_circle_' + i).append("line").attr("class", "hide_a").attr("x1", node.x - 12 + 14.15).attr("y1", node.y + 33 + 17.25).attr("x2", node.x - 12 + 20.15).attr("y2", node.y + 33 + 17.25);
        d3.selectAll(".hide_a").on("click", (d) => {
          hideNodeAndLinks(d);
        })
      }

      function showUnlock(node, i) {
        unlockPath = d3.select('.g_circle_' + i).append("path").attr('class', 'g_circle_path')
          .attr("transform", "translate(" + node.x + "," + node.y + ")").attr("d", leftArc)
          .attr("fill", "rgb(210, 213, 218)").style("cursor", "pointer")
          .on("click", function (d) {
            unlockNodeFixed(d, this);
          })
          .on("mouseover", function () {
            unlockPath.attr("fill", "rgb(185, 185, 185)")
          })
          .on("mouseout", function () {
            unlockPath.attr("fill", "rgb(210, 213, 218)")
          });

        d3.select('.g_circle_' + i).append("g").attr("class", "unlock_a")
          .attr("transform", "translate(" + (node.x - 52) + "," + (node.y - 30) + ") scale(0.7)")
          .append("defs").append("style")
          .text(".unlock_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}");

        unlockPath.append("title").attr("class", "unlock_a").text("Unlock");
        unlock_path1 = d3.select('.g_circle_' + i).append("path").attr("class", "unlock_a")
          .attr("transform", "translate(" + (node.x - 45) + "," + (node.y - 23) + ")")
          .attr("d", d3.arc().outerRadius(5.3).innerRadius(5).startAngle(-1.8).endAngle(1.8))
          .attr("fill", "#FFFFFF");
        unlock_rect1 = d3.select('.g_circle_' + i).append("rect").attr("class", "unlock_a").attr("x", node.x - 52 + 6.75).attr("y", node.y - 30 + 9.75)
          .attr("width", 15).attr("height", 12).attr("rx", 1.5).attr("ry", 1.5);
        unlock_line1 = d3.select('.g_circle_' + i).append("line").attr("class", "unlock_a").attr("x1", node.x - 52 + 15).attr("y1", node.y - 30 + 15).attr("x2", node.x - 52 + 15).attr("y2", node.y - 30 + 18);

        d3.selectAll(".unlock_a").on("click", (d) => {
          unlockNodeFixed(d, this);
        })

      }

      function hideNodeAndLinks(node) {
        // d3.event.stopPropagation();
        circle_g.attr('node', function (n) {
          if (n.id === node.id) {
            d3.select(this).remove();
          }
        });
        edges_line.attr('d', function (d) {
          if (d.source.id === node.id || d.target.id === node.id) {
            d3.select(this).remove();
          }
        });
      }

      function removeNodeAndPath(node, _this) {
        _this.axios.get("deleteNL/"+node.id+'/')
          .then(function (response) {
            if(response.status === 200) {
              hideNodeAndLinks(node)
              _this.toastMessage = '删除成功'
              $('.toast').toast('show')
            }
          })
          .catch(function (error) {
            _this.toastMessage = '发生未知错误'
            $('.toast').toast('show')
            console.log(error)
          })
        // // alert('delete this ' + node.id + ',' + _this);

      }

      function showNodeInfo(node, _this) {
        window.console.log(node);
        window.console.log(_this);

      }

      function unlockNodeFixed(d, _this) {
        d3.event.stopPropagation();
        d.fixed = false; //解除节点位置锁定
        //清除上个节点的圆圈以及图标
        svg.selectAll('.g_circle_path').remove();
        svg.selectAll('.remove_a').remove();
        svg.selectAll('.hide_a').remove();
        svg.selectAll('.unlock_a').remove();
        removePath = null;
        unlockPath = null;
        hidePath = null;
      }

    },

    setLinkGroup (links) {
      let _this = this
      let linkGroup = {}
      //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组
      let linkmap = {}
      for (let i = 0; i < links.length; i++) {
        let key = links[i].source < links[i].target ? links[i].source + ':' + links[i].target : links[i].target + ':' + links[i].source
        if (!linkmap.hasOwnProperty(key)) {
          linkmap[key] = 0
        }
        linkmap[key] += 1
        if (!linkGroup.hasOwnProperty(key)) {
          linkGroup[key] = []
        }
        linkGroup[key].push(links[i])
      }
      //为每一条连接线分配size属性，同时对每一组连接线进行编号
      for (let i = 0; i < links.length; i++) {
        let key = links[i].source < links[i].target ? links[i].source + ':' + links[i].target : links[i].target + ':' + links[i].source
        links[i].size = linkmap[key]
        //同一组的关系进行编号
        let group = linkGroup[key]
        //给节点分配编号
        _this.setLinkNumber(group)
      }

    },

    getNodesLine (d) {

      d.sourceRadius = 26
      d.targetRadius = 31
      let tan = Math.abs((d.target.y - d.source.y) / (d.target.x - d.source.x)) //圆心连线tan值
      let x1 = d.target.x - d.source.x > 0 ? Math.sqrt(d.sourceRadius * d.sourceRadius / (tan * tan + 1)) + d.source.x :
        d.source.x - Math.sqrt(d.sourceRadius * d.sourceRadius / (tan * tan + 1)) //起点x坐标
      let y1 = d.target.y - d.source.y > 0 ? Math.sqrt(d.sourceRadius * d.sourceRadius * tan * tan / (tan * tan + 1)) + d.source.y :
        d.source.y - Math.sqrt(d.sourceRadius * d.sourceRadius * tan * tan / (tan * tan + 1)) //起点y坐标
      let x2 = d.target.x - d.source.x > 0 ? d.target.x - Math.sqrt(d.targetRadius * d.targetRadius / (1 + tan * tan)) :
        d.target.x + Math.sqrt(d.targetRadius * d.targetRadius / (1 + tan * tan)) //终点x坐标
      let y2 = d.target.y - d.source.y > 0 ? d.target.y - Math.sqrt(d.targetRadius * d.targetRadius * tan * tan / (1 + tan * tan)) :
        d.target.y + Math.sqrt(d.targetRadius * d.targetRadius * tan * tan / (1 + tan * tan)) //终点y坐标
      if (d.target.x - d.source.x === 0 || tan === 0) { //斜率无穷大的情况或为0时
        y1 = d.target.y - d.source.y > 0 ? d.source.y + d.sourceRadius : d.source.y - d.sourceRadius
        y2 = d.target.y - d.source.y > 0 ? d.target.y - d.targetRadius : d.target.y + d.targetRadius
      }
      if (d.linknum === 0) { //设置编号为0的连接线为直线，其他连接线会均分在两边
        d.x_start = x1
        d.y_start = y1
        d.x_end = x2
        d.y_end = y2
        return 'M' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2
      }
      let a = d.sourceRadius > d.targetRadius ? d.targetRadius * d.linknum / 3 : d.sourceRadius * d.linknum / 3
      let xm = d.target.x - d.source.x > 0 ? d.source.x + Math.sqrt((d.sourceRadius * d.sourceRadius - a * a) / (1 + tan * tan)) :
        d.source.x - Math.sqrt((d.sourceRadius * d.sourceRadius - a * a) / (1 + tan * tan))
      let ym = d.target.y - d.source.y > 0 ? d.source.y + Math.sqrt((d.sourceRadius * d.sourceRadius - a * a) * tan * tan / (1 + tan * tan)) :
        d.source.y - Math.sqrt((d.sourceRadius * d.sourceRadius - a * a) * tan * tan / (1 + tan * tan))
      let xn = d.target.x - d.source.x > 0 ? d.target.x - Math.sqrt((d.targetRadius * d.targetRadius - a * a) / (1 + tan * tan)) :
        d.target.x + Math.sqrt((d.targetRadius * d.targetRadius - a * a) / (1 + tan * tan))
      let yn = d.target.y - d.source.y > 0 ? d.target.y - Math.sqrt((d.targetRadius * d.targetRadius - a * a) * tan * tan / (1 + tan * tan)) :
        d.target.y + Math.sqrt((d.targetRadius * d.targetRadius - a * a) * tan * tan / (1 + tan * tan))
      if (d.target.x - d.source.x === 0 || tan === 0) { //斜率无穷大或为0时
        ym = d.target.y - d.source.y > 0 ? d.source.y + Math.sqrt(d.sourceRadius * d.sourceRadius - a * a) : d.source.y - Math.sqrt(d.sourceRadius * d.sourceRadius - a * a)
        yn = d.target.y - d.source.y > 0 ? d.target.y - Math.sqrt(d.targetRadius * d.targetRadius - a * a) : d.target.y + Math.sqrt(d.targetRadius * d.targetRadius - a * a)
      }

      let k = (x1 - x2) / (y2 - y1) //连线垂线的斜率
      let dx = Math.sqrt(a * a / (1 + k * k)) //相对垂点x轴距离
      let dy = Math.sqrt(a * a * k * k / (1 + k * k)) //相对垂点y轴距离
      if ((y2 - y1) === 0) {
        dx = 0
        dy = Math.sqrt(a * a)
      }
      let xs, ys, xt, yt
      if (a > 0) {
        xs = k > 0 ? xm - dx : xm + dx
        ys = ym - dy
        xt = k > 0 ? xn - dx : xn + dx
        yt = yn - dy
      } else {
        xs = k > 0 ? xm + dx : xm - dx
        ys = ym + dy
        xt = k > 0 ? xn + dx : xn - dx
        yt = yn + dy
      }

      //记录连线起始和终止坐标，用于定位线上文字
      d.x_start = xs
      d.y_start = ys
      d.x_end = xt
      d.y_end = yt

      //return 'M' + xs + ' ' + ys + "L" +  + xt + ' ' + yt;//绘制直线
      let NodesDistance = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2))
      let rad = 200
      if (300 >= NodesDistance && NodesDistance > 150) {
        rad = 300
      } else if (450 >= NodesDistance && NodesDistance > 300) {
        rad = 400
      } else if (600 >= NodesDistance && NodesDistance > 450) {
        rad = 500
      } else if (750 >= NodesDistance && NodesDistance > 600) {
        rad = 600
      } else if (900 >= NodesDistance && NodesDistance > 750) {
        rad = 700
      } else if (1050 >= NodesDistance && NodesDistance > 900) {
        rad = 800
      } else if (1200 >= NodesDistance && NodesDistance > 1050) {
        rad = 900
      }

      if (d.source.x < d.target.x) { //绘制曲线
        if (d.linknum < 0) {
          return 'M' + xs + ',' + ys + 'A' + rad + ',' + rad + ' 0 0,0 ' + xt + ',' + yt
        } else {
          return 'M' + xs + ',' + ys + 'A' + rad + ',' + rad + ' 0 0,1 ' + xt + ',' + yt
        }
      } else {
        if (d.linknum < 0) {
          return 'M' + xs + ',' + ys + 'A' + rad + ',' + rad + ' 0 0,1 ' + xt + ',' + yt
        } else {
          return 'M' + xs + ',' + ys + 'A' + rad + ',' + rad + ' 0 0,0 ' + xt + ',' + yt
        }
      }
    },

    setLinkNumber (group) {
      if (group.length === 0) return
      if (group.length === 1) {
        group[0].linknum = 0
        return
      }
      let maxLinkNumber = group.length % 2 === 0 ? group.length / 2 : (group.length - 1) / 2
      if (group.length % 2 === 0) {
        let startLinkNum = -maxLinkNumber + 0.5
        for (let i = 0; i < group.length; i++) {
          group[i].linknum = startLinkNum++
        }
      } else {
        let startLinkNum = -maxLinkNumber
        for (let i = 0; i < group.length; i++) {
          group[i].linknum = startLinkNum++
        }
      }
    },

    getQueryResult(result, currentNode, currentType) {
      // for (var i = 0; i < result.length; i++) {//result:查询得到的节点组
      //   let flag = true
      //   for (var j = 0; j < this.testGraph.nodes.length; j++) {
      //     if (this.testGraph.nodes[j].id === result[i].id) {
      //       flag = false
      //     }
      //   }
      //   if (flag) {
      //     this.testGraph.nodes.push(result[i])
      //   } else {
      //     console.log("已存在的节点")
      //     console.log(result[i])
      //   }
      //   this.testGraph.links.push({
      //     "source": currentNode.name,
      //     "target": result[i].id,
      //     "value": 5,
      //     "relationship": currentType
      //   })
      // }
      //
      // for (var i = this.testGraph.links.length - 1; i >= 0; i--) {
      //   if (this.testGraph.links[i].source.id === currentNode.name && this.testGraph.links[i].relationship !== currentType) {
      //     let ifRemove = true;
      //     for (var k = 0; k < result.length; k++) {
      //       if (result[k].id === this.testGraph.links[i].target.id) {
      //         ifRemove = false
      //         console.log("不移除此节点" + result[k].id)
      //         break
      //       }
      //     }
      //     if (ifRemove) {
      //       console.log(this.testGraph.nodes)
      //       for (var j = this.testGraph.nodes.length - 1; j >= 0; j--) {
      //         console.log("移除此节点" + this.testGraph.links[i].target.id)
      //         if (this.testGraph.nodes[j].id === this.testGraph.links[i].target.id) {
      //           this.testGraph.nodes.splice(j, 1);
      //         }
      //       }
      //       console.log(this.testGraph.nodes)
      //     }
      //     this.testGraph.links.splice(i, 1)
      //   }
      // }
      // this.updateGraph(this.testGraph)
      console.log(result)
      this.renderGraph(result)
    }
  }
}
</script>
<style>
body {
  margin: 0px;
}

#graph {
  width: 800px;
  height: 600px;
  border: 1px solid #2c3e50;
  border-radius: 8px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  background: #E6E6FA repeating-linear-gradient(30deg,
  hsla(0, 0%, 100%, .1), hsla(0, 0%, 100%, .1) 15px,
  transparent 0, transparent 30px);
}

.detail-panel {
  position: fixed;
  right: 10px;
  top: 40px;
  border-radius: 4px;
  width: 250px;
  cursor: pointer;
}

.detail-info {
  width: 50%;
  text-align: left;
  font-size: 12px;
  font-weight: bolder;
}

.node:hover {
  stroke-width: 5;
}

.type-select {
  margin-top: 25px;
  height: 20px;
}

.submit-btn {
  width: 100%;
  height: 30px;
  background-color: #2aabd2;
  line-height: 0px;
  margin-top: 0px;
}
</style>
