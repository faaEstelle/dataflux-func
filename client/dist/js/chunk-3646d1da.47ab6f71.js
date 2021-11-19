(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3646d1da"],{"313e":function(t,e,i){t.exports=i("310f")(735)},"57ef":function(t,e,i){},6402:function(t,e,i){"use strict";i.r(e);var r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{name:"fade"}},[t.$store.state.isLoaded?i("el-container",{attrs:{direction:"vertical"}},[i("el-header",{attrs:{height:"60px"}},[i("h1",[t._v("\n        系统指标\n        "),i("div",{staticClass:"header-control"},[i("el-button",{attrs:{type:"primary",plain:"",size:"small",disabled:t.isRefreshing},on:{click:t.updateChart}},[t.isRefreshing?i("i",{staticClass:"fa fa-fw fa-circle-o-notch fa-spin"}):i("i",{staticClass:"fa fa-fw fa-refresh"}),t._v("\n            刷新\n          ")])],1)])]),t._v(" "),i("el-main",[i("el-divider",{attrs:{"content-position":"left"}},[i("h1",[t._v("Server")])]),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"serverCPUPercent"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"serverMemoryRSS"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"serverMemoryHeapTotal"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"serverMemoryHeapUsed"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"serverMemoryHeapExternal"}}),t._v(" "),i("el-divider",{attrs:{"content-position":"left"}},[i("h1",[t._v("Worker")])]),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"workerCPUPercent"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"workerMemoryPSS"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"funcCallCount"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"workerQueueLength"}}),t._v(" "),i("el-divider",{attrs:{"content-position":"left"}},[i("h1",[t._v("Database/Cache")])]),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"dbDiskUsed"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"cacheDBMemoryUsed"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"cacheDBKeyUsed"}}),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"cacheDBKeyCountByPrefix"}}),t._v(" "),i("el-divider",{attrs:{"content-position":"left"}},[i("h1",[t._v("API")])]),t._v(" "),i("div",{staticClass:"chart",attrs:{id:"matchedRouteCount"}})],1)],1):t._e()],1)},a=[],s=i("1da1"),n=(i("130f"),i("d3b7"),i("159b"),i("4e82"),i("fb6a"),i("b0c0"),i("ddb0"),i("96cf"),i("313e")),o=i.n(n),c={name:"SysStats",components:{},watch:{$route:{immediate:!0,handler:function(t,e){var i=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,i.loadData();case 2:case"end":return t.stop()}}),t)})))()}},"$store.getters.uiColorSchema":function(t,e){var i=this.T.getEchartTextStyle(),r=this.T.getEchartSplitLineStyle();for(var a in this.charts){var s=this.charts[a];s.setOption({textStyle:i,title:{textStyle:i},xAxis:{splitLine:{lineStyle:r}},yAxis:{splitLine:{lineStyle:r}}})}},"$store.state.uiLocale":function(){var t=this;setImmediate((function(){t.updateChart()}))}},methods:{loadData:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.$store.commit("updateLoadStatus",!0);case 1:case"end":return e.stop()}}),e)})))()},genSeries:function(t,e){var i=[];for(var r in t){var a={name:r,data:t[r],showSymbol:!1};switch(this.T.isNothing(e.seriesOptions)||Object.assign(a,e.seriesOptions),a.type){case"bar":a.label=a.label||{},a.label.normal=a.label.normal||{show:!0,position:"right"};break;case"pie":a.label=a.label||{},a.label.formatter=a.label.formatter||"{b}: {c} ({d}%)";break}a.data.forEach((function(t){switch(e.dataConvert){case"xyTranspose":t.reverse();break}})),i.push(a)}return i.sort((function(t,i){var r=t.data.slice(-1)[0],a=i.data.slice(-1)[0];return"xyTranspose"===e.dataConvert?a[0]-r[0]:a[1]-r[1]})),i},resizeBarChart:function(t){var e=t.getOption().series,i=0;e.forEach((function(t){i=Math.max(i,t.data.length)}));var r=25*i*e.length+5*(e.length-1)+60+80;t.getDom().style.height="".concat(r,"px"),t.resize()},updateChart:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var i,r,a,s,n,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.isRefreshing=!0,e.next=3,t.T.callAPI_get("/api/v1/monitor/sys-stats/do/get");case 3:if(i=e.sent,i.ok){e.next=6;break}return e.abrupt("return");case 6:r=i.data,e.t0=regeneratorRuntime.keys(r);case 8:if((e.t1=e.t0()).done){e.next=39;break}if(a=e.t1.value,s=t.charts[a],s){e.next=13;break}return e.abrupt("continue",8);case 13:n=r[a],t.T.isNothing(n)?s.showLoading({text:t.$t("No Data"),fontSize:20,showSpinner:!1,textColor:"grey",maskColor:"white"}):s.hideLoading(),Array.isArray(n)&&(n={"":n}),o=null,e.t2=a,e.next="matchedRouteCount"===e.t2?21:"funcCallCount"===e.t2?23:"workerQueueLength"===e.t2?26:29;break;case 21:return o=t.genSeries(n,{dataConvert:"xyTranspose",seriesOptions:{type:"bar"}}),e.abrupt("break",31);case 23:return o=t.genSeries(n,{seriesOptions:{type:"line"}}),o.forEach((function(t){t.name=t.name+"(...)"})),e.abrupt("break",31);case 26:return o=t.genSeries(n,{seriesOptions:{type:"line"}}),o.forEach((function(t){t.name="#"+t.name})),e.abrupt("break",31);case 29:return o=t.genSeries(n,{seriesOptions:{type:"line"}}),e.abrupt("break",31);case 31:s.setOption({series:o}),e.t3=a,e.next="matchedRouteCount"===e.t3?35:37;break;case 35:return t.resizeBarChart(s),e.abrupt("break",37);case 37:e.next=8;break;case 39:setTimeout((function(){t.isRefreshing=!1}),1e3);case 41:case"end":return e.stop()}}),e)})))()},createTitleOpt:function(t){return{text:t,left:100,textStyle:this.T.getEchartTextStyle()}},createCommonTooltipOpt:function(){return{trigger:"axis",axisPointer:{animation:!1}}},createTSTooltipOpt:function(t){var e=this;return t=t||{},{trigger:"axis",axisPointer:{animation:!1},formatter:function(i){var r=e.T.jsonCopy(i);r.sort((function(t,e){var i=e.data[1]-t.data[1];return i>0?1:i<0?-1:e.seriesName<t.seriesName?1:-1}));var a=e.T.getDateTimeString(i[0].data[0]);a+="<br>",a+="<table>";for(var s=0;s<r.length;s++){if(s>=10){a+='<tr><td colspan="100%" align="right">只展示Top10</td></tr>';break}var n=r[s],o=t.unit||"";Array.isArray(o)&&(o=n.data[1]>1?o[0]:o[1]),a+="<tr>",a+='<td style="font-size: 12px">'+n.marker+"</td>",n.seriesName&&(a+='<td style="font-size: 12px">'+n.seriesName+"</td>",a+='<td style="font-size: 12px">:</td>'),a+='<td style="font-size: 12px" align="right">'+n.data[1]+"</td>",a+='<td style="font-size: 12px">'+o+"</td>",a+="</tr>"}return a+="</table>",a}}},createCommonGridOpt:function(){return{left:80,right:50,containLabel:!0}},createCountGridOpt:function(){return{left:50,right:"35%",containLabel:!0}},createTimeXAxisOpt:function(){var t=this;return{type:"time",offset:10,splitLine:{lineStyle:this.T.getEchartSplitLineStyle()},axisLabel:{formatter:function(e,i){return t.T.getDateTimeString(e,"YYYY-MM-DD HH:mm")}}}},createCountXAxisOpt:function(){return{type:"value",splitLine:{lineStyle:this.T.getEchartSplitLineStyle()},max:function(t){return Math.ceil(1.1*t.max)}}},createPercentYAxisOpt:function(){return{type:"value",offset:10,max:100,min:0,boundaryGap:["20%","20%"],splitLine:{lineStyle:this.T.getEchartSplitLineStyle()},axisLabel:{formatter:function(t,e){return t+"%"}}}},createVolumnYAxisOpt:function(t){return t=t||{},{type:"value",offset:10,min:0,max:t.max,splitLine:{lineStyle:this.T.getEchartSplitLineStyle()},axisLabel:{formatter:function(t,e){return t+" MB"}}}},createCateYAxisOpt:function(){return{type:"category",position:"right",offset:50,inverse:!0,axisLabel:{interval:0},splitLine:{lineStyle:this.T.getEchartSplitLineStyle()}}},createCountYAxisOpt:function(t){return t=t||{},{type:"value",offset:10,min:0,max:t.max,minInterval:1,splitLine:{lineStyle:this.T.getEchartSplitLineStyle()}}}},computed:{CHART_CONFIGS:function(){var t=this.T.getEchartTextStyle();return{serverCPUPercent:{textStyle:t,title:this.createTitleOpt("Server CPU 使用率"),tooltip:this.createTSTooltipOpt({unit:"%"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createPercentYAxisOpt()},serverMemoryRSS:{textStyle:t,title:this.createTitleOpt("Server 内存RSS"),tooltip:this.createTSTooltipOpt({unit:"MB"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createVolumnYAxisOpt()},serverMemoryHeapTotal:{textStyle:t,title:this.createTitleOpt("Server 内存Heap总量"),tooltip:this.createTSTooltipOpt({unit:"MB"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createVolumnYAxisOpt()},serverMemoryHeapUsed:{textStyle:t,title:this.createTitleOpt("Server 内存Heap用量"),tooltip:this.createTSTooltipOpt({unit:"MB"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createVolumnYAxisOpt()},serverMemoryHeapExternal:{textStyle:t,title:this.createTitleOpt("Server 内存Heap外部对象用量"),tooltip:this.createTSTooltipOpt({unit:"MB"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createVolumnYAxisOpt()},workerCPUPercent:{textStyle:t,title:this.createTitleOpt("Worker CPU 使用率"),tooltip:this.createTSTooltipOpt({unit:"%"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createPercentYAxisOpt()},workerMemoryPSS:{textStyle:t,title:this.createTitleOpt("Worker 内存PSS"),tooltip:this.createTSTooltipOpt({unit:"MB"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createVolumnYAxisOpt()},funcCallCount:{textStyle:t,title:this.createTitleOpt("函数调用次数"),tooltip:this.createTSTooltipOpt({unit:["Times","Time"]}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createCountYAxisOpt()},workerQueueLength:{textStyle:t,title:this.createTitleOpt("工作队列长度"),tooltip:this.createTSTooltipOpt({unit:["Tasks","Task"]}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createCountYAxisOpt({max:100})},dbDiskUsed:{textStyle:t,title:this.createTitleOpt("数据库磁盘用量"),tooltip:this.createTSTooltipOpt({unit:"MB"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createVolumnYAxisOpt()},cacheDBMemoryUsed:{textStyle:t,title:this.createTitleOpt("缓存数据库内存用量"),tooltip:this.createTSTooltipOpt({unit:"MB"}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createVolumnYAxisOpt()},cacheDBKeyUsed:{textStyle:t,title:this.createTitleOpt("缓存数据库Key数量"),tooltip:this.createTSTooltipOpt({unit:["Keys","Key"]}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createCountYAxisOpt()},cacheDBKeyCountByPrefix:{textStyle:t,title:this.createTitleOpt("缓存数据库Key数量（按前缀区分）"),tooltip:this.createTSTooltipOpt({unit:["Keys","Key"]}),grid:this.createCommonGridOpt(),xAxis:this.createTimeXAxisOpt(),yAxis:this.createCountYAxisOpt()},matchedRouteCount:{textStyle:t,title:this.createTitleOpt("接口访问次数（按路由区分）"),tooltip:this.createCommonTooltipOpt(),grid:this.createCountGridOpt(),xAxis:this.createCountXAxisOpt(),yAxis:this.createCateYAxisOpt()}}}},props:{},data:function(){return{isRefreshing:!1,charts:{},autoRefreshTimer:null}},mounted:function(){var t=this;setImmediate((function(){for(var e in t.CHART_CONFIGS)t.charts[e]=o.a.init(document.getElementById(e)),t.charts[e].setOption(t.CHART_CONFIGS[e]);t.updateChart(),t.autoRefreshTimer=setInterval((function(){t.updateChart()}),3e4)})),window.vmc=this},beforeDestroy:function(){for(var t in this.autoRefreshTimer&&clearInterval(this.autoRefreshTimer),this.charts){var e=this.charts[t];e&&e.dispose()}}},l=c,p=(i("f106"),i("2877")),h=Object(p["a"])(l,r,a,!1,null,"dde37bb8",null);e["default"]=h.exports},f106:function(t,e,i){"use strict";i("57ef")}}]);