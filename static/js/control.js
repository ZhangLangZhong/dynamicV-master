function ControlChart() {
    // var obj = {
    //     // '修改所有点': false,
    //     // // '节点尺寸': 2,
    //     // // '节点边线': "#fffaf0",
    //     // // '节点填充': "#FFFFFF",
    //     // // '节点透明度': 0.9,
    //     // '修改所有边': false,
    //     // '边宽度': 1,
    //     // '边填充': "#FFFFFF",
    //     // '边透明度': 0.7,
    //     // '连续属性': 1,
    //     // '离散属性': 2,
    //     // '边编号': "",
    //     // '标签类别': "编号",
    //     // '标签显示': false,
    //     // '标签填充': INIT_LABEL_COLOR,
    //     // '标签尺寸': INIT_LABEL_SIZE,
    //     // '标签透明度': INIT_LABEL_OPACITY,
    //     // '布局': '增量式布局',
    //     // "增量式布局": false,
    //     // '原图显示': false,
    //     // '主视图截图': function () {
    //     //     if ($("#header").attr("Capture") !== "Ready") alert("插件未安装!");
    //     // },
    //     // '自定义截图': function () {
    //     //     if ($("#header").attr("Capture") !== "Ready") alert("插件未安装!");
    //     // },
    //     // '保存筛选数据': function () {
    //     //     Export.saveAsJson(now_layout.saveShowedData());
    //     // },
    //     // '上传文件': function () {
    //     //     $("#uploadFile").click();
    //     // }
    // };
    // /*默认初始化布局*/
    // now_layout_type = 'force';
    // now_layout = new ForceChart();
    // console.log(77777)
    //最先运行这个

    // var obj = {
    //     'age': '未选择',
    //     'degree':'未选择'
    // };
    //
    // var gui = new dat.gui.GUI();
    //
    // var age_choice = gui.add(obj,'age',[0,1,2,3]);
    // var degree_choice = gui.add(obj,'age',[0,1,2,3])
    //
    // age_choice.onchange(function (value){
    //     switch (value){
    //         case 0:
    //             age_number = 0;
    //             break;
    //         case 1:
    //             age_number = 1;
    //             break;
    //         case 2:
    //             age_number = 2;
    //             break;
    //         case 3:
    //             age_number = 3;
    //             break;
    //     }
    //
    // })
    //
    //
    // document.getElementById('control').appendChild(gui.domElement);




    now_layout_type = 'incremental';
    now_layout = new IncrementalLayout();
    now_layout.init();
     // d3.select('#clear_brush').style('display', 'none');
    // var layout_text = gui.add(obj,'布局', ['增量式布局', '捆图布局', '随机布局', '椭圆布局', 'graphopt布局', '多元尺度布局', '网格布局', '大图布局', '分布式递归布局', '层次化布局', '环状RT树布局', '力导向布局'])
    //
    // layout_text.onChange(function (value){
    //     clearMainChart();
    //     control_chart.initParameters();
    //     d3.select('#clear_brush').style('display', 'block');
    //     now_layout_type = 'incremental';
    //     now_layout = new IncrementalLayout();
    //     now_layout.init();
    //     d3.select('#clear_brush').style('display', 'none');
    // })
    // now_layout_type = 'incremental';
    // now_layout = new IncrementalLayout();
    // now_layout.init();
    // d3.select('#clear_brush').style('display', 'none');
    //UI的一个库
    // var gui = new dat.gui.GUI();
    //增加点
    // var f1 = gui.addFolder('节点');
    // var node_all = f1.add(obj, '修改所有点').listen();
    // var node_stroke = f1.addColor(obj, '节点边线');
    // var node_size = f1.add(obj, '节点尺寸').min(2).max(10).step(0.1);
    // var node_color = f1.addColor(obj, '节点填充');
    // var node_opacity = f1.add(obj, '节点透明度').min(0).max(1).step(0.05);
    // /*节点信息监听*/
    // node_all.onFinishChange(function (value) {
    //     NODE_ALL = !NODE_ALL
    // });
    // node_stroke.onFinishChange(function (value) {
    //     now_layout.setNodeStroke(value);
    // });
    // node_size.onFinishChange(function (value) {
    //     now_layout.setNodeSize(value);
    // });
    // node_color.onFinishChange(function (value) {
    //     now_layout.setNodeColor(value);
    // });
    // node_opacity.onFinishChange(function (value) {
    //     now_layout.setNodeOpacity(value);
    // });
    //增加边
    // var f2 = gui.addFolder('边');
    // // var edge_all = f2.add(obj, '修改所有边').listen();
    // // var edge_width = f2.add(obj, '边宽度').min(1).max(4).step(0.1);
    // // var edge_color = f2.addColor(obj, '边填充');
    // // var edge_opacity = f2.add(obj, '边透明度').min(0).max(1).step(0.05);
    // // var edge_id = f2.add(obj, '边编号');
    // // var edge_continuous = f2.add(obj, '连续属性');
    // // var edge_discrete = f2.add(obj, '离散属性');
    // /*禁止用户更改*/
    // // edge_continuous.__input.disabled = true;
    // // edge_discrete.__input.disabled = true;
    // // edge_id.__input.disabled = true;
    // // /*边信息监听*/
    // // edge_all.onFinishChange(function (value) {
    // //     EDGE_ALL = !EDGE_ALL
    // // });
    // // edge_width.onFinishChange(function (value) {
    // //     now_layout.setEdgeWidth(value);
    // // });
    // // edge_color.onFinishChange(function (value) {
    // //     now_layout.setEdgeColor(value);
    // // });
    // // edge_opacity.onFinishChange(function (value) {
    // //     now_layout.setEdgeOpacity(value);
    // // });
    //
    // var f3 = gui.addFolder('标签');
    // var label_show = f3.add(obj, '标签显示').listen();
    // var all_show = f3.add(obj, '原图显示').listen();
    // var label_type = f3.add(obj, '标签类别', ['编号', '端口', '连续属性', '离散属性', '度', '度中心性', '接近中心性', '介数中心性', '特征向量中心性', '聚类系数']).listen();
    // var label_size = f3.add(obj, '标签尺寸').min(5).max(18).step(1);
    // var label_color = f3.addColor(obj, '标签填充');
    // var label_opacity = f3.add(obj, '标签透明度').min(0).max(1).step(0.05);
    // /*标签信息监听*/
    // label_type.onFinishChange(function (value) {
    //     now_layout.setLabelType(value);
    // });
    // label_show.onFinishChange(function (value) {
    //     now_layout.setLabelShow(value);
    // });
    // label_size.onFinishChange(function (value) {
    //     now_layout.setLabelSize(value);
    // });
    // label_color.onFinishChange(function (value) {
    //     now_layout.setLabelColor(value);
    // });
    // label_opacity.onFinishChange(function (value) {
    //     now_layout.setLabelOpacity(value);
    // });
    // all_show.onFinishChange(function () {
    //     SHOW_ALL = !SHOW_ALL
    //     now_layout.setLevel()
    // })
    // var layout_text = gui.add(obj, '布局', ['力导向布局', '捆图布局', '随机布局', '椭圆布局', 'graphopt布局', '多元尺度布局', '网格布局', '大图布局', '分布式递归布局', '层次化布局', '环状RT树布局', '增量式布局']);
    //
    // /*布局信息监听*/
    // layout_text.onChange(function (value) {
    //     console.log(value)
    //     clearMainChart();
    //     // control_chart.initParameters();
    //     d3.select('#clear_brush').style('display', 'block');
    //     switch (value) {
    //         case '力导向布局':
    //             now_layout_type = 'force';
    //             now_layout = new ForceChart();
    //             break;
    //         case '捆图布局':
    //             now_layout_type = 'bundle';
    //             now_layout = new BundleChart();
    //             break;
    //         case '随机布局':
    //             now_layout_type = 'random';
    //             now_layout = new BackChart();
    //             break;
    //         case '椭圆布局':
    //             now_layout_type = 'circle';
    //             now_layout = new BackChart();
    //             break;
    //         case 'graphopt布局':
    //             now_layout_type = 'graphopt';
    //             now_layout = new BackChart();
    //             break;
    //         case '多元尺度布局':
    //             now_layout_type = 'mds';
    //             now_layout = new BackChart();
    //             break;
    //         case '网格布局':
    //             now_layout_type = 'grid';
    //             now_layout = new BackChart();
    //             break;
    //         case '大图布局':
    //             now_layout_type = 'lgl';
    //             now_layout = new BackChart();
    //             break;
    //         case '分布式递归布局':
    //             now_layout_type = 'drl';
    //             now_layout = new BackChart();
    //             break;
    //         case '层次化布局':
    //             now_layout_type = 'sugiyama';
    //             now_layout = new BackChart();
    //             break;
    //         case '环状RT树布局':
    //             now_layout_type = 'rt_circular';
    //             now_layout = new BackChart();
    //             break;
    //         case '增量式布局':
    //             now_layout_type = 'incremental';
    //             now_layout = new IncrementalLayout();
    //             now_layout.init();
    //             d3.select('#clear_brush').style('display', 'none');
    //             break;
    //         default:
    //             break;
    //     }
    // });
    // var f4 = gui.addFolder('工具');
    // f4.add(obj, '主视图截图');
    // f4.add(obj, '自定义截图');
    // f4.add(obj, '保存筛选数据');
    // f4.add(obj, '上传文件');
    // f1.open();
    // f2.open();
    // f3.open();
    // f4.open();
    //
    // document.getElementById('control').appendChild(gui.domElement);
    //
    // var clearMainChart = function () {
    //     // console.log(document.getElementById("main").innerHTML)
    //     document.getElementById("main").innerHTML = "";
    // };
    // ControlChart.prototype.handleFile = function (file, value) {
    //     if (value === "") return false;
    //     var file_name = file[0].name;
    //     // console.log(file_name)
    //     if (!file_name || !(file_name.endsWith(".json"))) {
    //         alert("请上传文件格式为.json的文本文件。");
    //         //重置当前input的默认值，防止该文件无法再次上传
    //         $("#uploadFile").val("").change();
    //         return false;
    //     }
    //     var file_data = new FormData();
    //     file_data.append("upload", $("#uploadFile")[0].files[0]);
    //     // loading...
    //
    //     $("#loading").css("display", "block");
    //     $("#over").css("display", "block");
    //     $.ajax({
    //         type: "post",
    //         url: "/upload_file",
    //         data: file_data,
    //         processData: false,
    //         contentType: false,
    //         async: true,
    //         success: function (d1) {
    //             if (d1 !== "error") {
    //                 $.ajax({
    //                     url: "/upload_file/layout",
    //                     type: "get",
    //                     dataType: "json",
    //                     data: {'layout_type': now_layout_type, 'file_path': d1},
    //                     async: true,
    //                     contentType: "application/json",
    //                     success: function (d2) {
    //                         $("#loading").css("display", "none");
    //                         $("#over").css("display", "none");
    //                         now_layout.updateFromOthers(d2);
    //                     }
    //                 })
    //             }
    //             else {
    //                 alert("上传文件失败，请重新上传！");
    //             }
    //         },
    //         Error: function () {
    //             console.log("error");
    //         }
    //     });
    //     $("#uploadFile").val("").change();
    // };
    // ControlChart.prototype.initParameters = function (d) {
    //     //listen和onChange同时使用，导致input无法输入，setValue可以解决。
    //     label_size.setValue(INIT_LABEL_SIZE);
    //     label_color.setValue(INIT_LABEL_COLOR);
    //     label_opacity.setValue(INIT_LABEL_OPACITY);
    //     obj.标签显示 = false;
    //     obj.标签类别 = "编号";
    //     obj.修改所有点 = false;
    //     obj.修改所有边 = false;
    //     obj.原图显示 = false;
    //     SHOW_ALL = false;
    //     NODE_ALL = false;
    //     EDGE_ALL = false;
    // };
    // ControlChart.prototype.updateNode = function (d) {
    //     node_stroke.setValue(d.stroke);
    //     node_size.setValue(d.size);
    //     node_color.setValue(d.color);
    //     node_opacity.setValue(d.opacity);
    // };
    // ControlChart.prototype.updateLink = function (d) {
    //     edge_width.setValue(d.weight);
    //     edge_color.setValue(d.color);
    //     edge_opacity.setValue(d.opacity);
    //     edge_discrete.setValue(d.discrete);
    //     edge_continuous.setValue(d.continuous);
    //     edge_id.setValue(d.id);
    // }
}

// var NODE_ALL = false;
// var EDGE_ALL = false;
// var SHOW_ALL = false;
// var now_layout;
// var now_layout_type = "";
// var OVER_COLOR = "#8A2BE2";
// var TARGET_COLOR = "#FF4500";
// var SOURCE_COLOR = "#00FF7F";
// var REGION_OPACITY = 1;
// var CLICK_SELECT_COLOR = "#00FFFF";
// var NODE_STROKE_WIDTH = 1;
//
// var INIT_LABEL_SIZE = 8;
// var INIT_LABEL_OPACITY = 1;
// var INIT_LABEL_COLOR = "#FFFAFA";
// var INIT_NODE_LABEL_LINK_OPACITY = 0.7;
// var INIT_NODE_LABEL_LINK_WIDTH = 1;
// var INIT_NODE_LABEL_LINE_COLOR = "#FFD700";
// var MINI_NODE_COLOR = "#C4C9CF";
// var MINI_NODE_OPACITY = 0.9;
// var MINI_NODE_SIZE = 1;
// var MINI_LINK_COLOR = "#808080";
// var MINI_LINK_OPACITY = 0.7;
// var MINI_LINK_WIDTH = 0.5;
// var LOW_MAIN_OPACITY = 0.2;
var SCALE_EXTENT = [0.5, 7];
var control_chart = new ControlChart();
var age_number
var degree_number