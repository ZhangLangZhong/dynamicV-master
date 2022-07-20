/**
 * Created by zhangLangzhong on 2022/7/19.
 */
function IncrementalLayout() {
    var riverSocial = []
    var width = $("#main").width();
    var height = $("#main").height();
    // var miniWidth = $("#minimap1").width();
    // var miniHeight = $("#minimap1").height();
    // var clusterWidth = $("#realMini1").width();
    // var clusterHeight = $("#realMini1").height();
    var startData = null;
    var preData = null;
    var nowData = null;
    var layoutNodes = [];
    var nodesIdArray = [];
    var nowDataCopy1 = []
    var layout;
    var run = true;
    var degreeNumber;
    var layoutNodeList = []
    var colorCata = []
    var clusterNode = [];
    var degreeSortCopy = [];
    var ageNumber;

    var hashSocial
    hashSocial = new HashTable()

    var nowLinkTest = {links:[],nodes:[]}
    var nowNodesTest = []
    var gpuDrawingData = []
    var hashPerLayoutNodes1
    hashPerLayoutNodes1 = new HashTable()

    var nowDataLayout = []
    var node_r = 50;
    var node_b;
    var node_distance;
    var mainNodes2Copy = [];
    var mainNodes3Copy = [];
    var miniLayoutCopy = []
    //点2触发
    // var miniLayout = []
    var miniLayout2 = []
    var timeNote = 1;
    var timeNote1 = 1;
    var nowlayoutEdges = [];

    var tmp_nodes = [];
    var index_of_nodes = [];
    var nodes = []

    var layoutNodesFinal = []
    var hashlayoutNodesID11
    hashlayoutNodesID11 = new HashTable()
    const width_mid = 895;
    const height_mid = 400;

    let HashFinalNodes = HashTable()

    let MAX_TABLE_LEN = 301;

    // console.log(1111)
    var a = d3.rgb(255,0,0);	//红色
    var b = d3.rgb(144,202,235);	//绿色
    var compute = d3.interpolate(a,b);
    var linear = d3.scale.linear()
        .domain([1,10])
        .range([0,1]);

    /**
     * 颜色集
     */
    // for (var i = 0;i < 200;i++) {
    //     function _g(color) {
    //
    //         if ((color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6)) {
    //             return color
    //         } else {
    //             return arguments.callee(color);
    //         }
    //     }
    //
    //     var getRandomColor = function () {
    //         return '#' + _g('');
    //     }
    //
    //     colorCata.unshift(getRandomColor())
    //
    // }

    // console.log(colorCata)

    IncrementalLayout.prototype.init = function () {
        // console.time(2222)
        // console.log(FormatDateTime(new Date('2015-4-23 16:45')))
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/brush_extent",
            async: false,
            data: {
                "layout_type": now_layout_type,
                "start": FormatDateTime(new Date('2015-4-23 16:45')),
                "end": FormatDateTime(new Date('2015-4-23 16:50'))
            },
            contentType: "application/json",
            success: function (initData) {
                // console.log(5555)
                // console.log(initData)

                // console.log()
                //link node {color: "#808080", continuous: "1", discrete: "38", id: "1", opacity: "0.57", …}
                // console.log(startData)
                startData = transform(initData);
                // console.log(startData)
                //进行source target的转换操作函数
                //输出的是source target    {source: "853", target: "550"} {source: "924", target: "643"}
                preData = startData;
                layout = new d3layout(startData, width, height);
                // console.log(layout)
                // console.log(99999)
                //不点都有
                // console.log(nodes)



                layout.draw();
                // console.log(layout.draw())
            },
            Error: function (error) {
                // console.log(999999999)
                console.log(error);
            }
        });
    };


    /**
     * FR算法
     */

    // IncrementalLayout.prototype.updateFromOthers = function (updateData,timeDate) {
    //
    //     var svg  = d3.select("#main")
    //     .append("svg")
    //     .attr("width",width)
    //     .attr("height",height);
    //
    //
    //     // if (run) {
    //     //     layoutNodes = countArray(startData);
    //     //     // console.log(layoutNodes)
    //     //     run = false;
    //     // }
    //
    //
    //     // var nowDataFr = transform(updateData);
    //
    //     // console.log(nowDataFr)
    //
    //
    //
    // }

    //比init更快
    // console.log(3333)
    IncrementalLayout.prototype.updateFromOthers = function (updateData,timeDate) {



        // console.log(timeDate)


        // console.time(2222)

        // console.time(333)
        // console.time(777)

        // console.log(startData)
        if (run) {
            layoutNodes = countArray(startData);
            // console.log(layoutNodes)
            run = false;
        }


        // console.log(layoutNodes)

        // console.log(updateData)

        layoutNodes.forEach(function (d){
            hashlayoutNodesID11.add(d.id,d)
        })
        // console.log(hashlayoutNodesID11.getValues())

        nowData = transform(updateData);

        // nowDataLayout = countArrayNow(nowData)
        // console.log(nowDataLayout)
        var nowDatanode = findNode(nowData);

        // nowDataLayout = countArrayNow(nowData,nowDatanode)
        // console.log(nowDataLayout)

        var preDatanode = findNode(preData);


        //就是nowdatanode的上一轮节点
        //"853" "550"
        var deleteNodeId, addNode; // deleteNode 删除节点
        deleteNodeId = difference(preDatanode, nowDatanode);

        var layoutSourTar = preData;


        //上一组的点
        // console.log(nowDatanode)
        //这一组的点
        addNode = difference(nowDatanode, preDatanode)

        // console.timeEnd(777)

        //柱状图
        // info_bar(addNode,deleteNodeId)


        // var preDataHash = new HashTable()
        // for (var i = 0;i<preData.length;i++){
        //     preDataHash.add(i,preData[i])
        // }

        // console.log(preDataHash.getValues())

        // console.log(preData)
        // console.log(nowData)


        //这一组比上一组多出来的点
        //35个点 "700"// 1: "657"// 2: "672"// 3: "752"// 4: "799"// 5: "866"
        preData = nowData;


        var miniLayoutMain = [];

        let mainNodes = [];
        let otherNodes = [];


        //把当前的节点复制一份
        var perLayoutNodes = [];
        // console.log(layoutNodes)

        //11ms


        // console.log(perLayoutNodes)
        //On
        // console.time(888)
        layoutNodes.forEach(function (d) {
            var dict = {
                'id': d.id,
                'age': d.age,
                'degree': d.degree,
                'links': [].concat(d.links),
                'x': d.x,
                'y': d.y,
                'subs': d.subs
            };
            perLayoutNodes.push(dict);
        });


        // console.log(perLayoutNodes)
        // console.log(preDatanode)
        var perNodes = Array.from(preDatanode);
        // console.log(perNodes)
        // "853"  "550" 这些点
        nodesIdArray = [].concat(perNodes);

        // console.log(nodesIdArray)

        // console.log(perNodes)

        var addNodes = [];
        var addEdges = [];
        var addAlreadyEdges = [];

        // console.log(layoutSourTar)
        //{source: "853", target: "550"}
        //把前一时刻节点对象转化为字符串，方便比较其是否包含特定对象
        // var layoutNodesStr = JSON.stringify(layoutSourTar);

        var push_time = 0;

        // console.timeEnd(888)
        // console.log(98989)
        // console.log(typeof nowData)

        // console.time()
        //
        // console.log(nowData)
        // // console.log(layoutSourTar)
        //
        // var nowDataHash = new HashTable()
        // nowData.forEach(function (d){
        //     nowDataHash.add(d.source,d)
        // })
        // console.log(nowDataHash.getValues())


        //var layoutSourTar = preData;  predata又是So Ta集
        // console.log(layoutSourTar)

        // console.time(999)

        var layoutSourSouHash = new HashTable();
        layoutSourTar.forEach(function (d) {
            layoutSourSouHash.add(d.source, d);
        });

        var layoutSourTarHash = new HashTable();
        layoutSourTar.forEach(function (d) {
            layoutSourTarHash.add(d.target, d);
        });

        var hashperPURENodes1 = new HashTable();
        perLayoutNodes.forEach(function (d){
            hashperPURENodes1.add(d.id,d.id)
        })

        // console.timeEnd(999)
        // console.log(hashperPURENodes1.getValues())

        // console.log(layoutSourTarHash.getValues())


        // console.log(nodesIdArray)
        // console.log(layoutNodesStr)
        // console.log(nodesIdArray)    纯点

        // console.time(7878)

        var nodesIdArrayHash = new HashTable();
        nodesIdArray.forEach(function (d) {
            nodesIdArrayHash.add(d, d);
        });


        // console.log(perLayoutNodes)
        // console.log(layoutSourTar)

        //老节点里面是包含0132的
        var preDataHash1 = new HashTable();
        layoutSourTar.forEach(function (d) {
            var value = [];
            value = d.source+d.target;
            // console.log(value)
            preDataHash1.add(value, d);
        });

        // console.timeEnd(7878)
        // console.timeEnd(999)

        // console.timeEnd(888)

        // var preDataStr = []
        // preDataStr = JSON.stringify(layoutSourTar)

        // console.timeEnd(777)

        // console.log(layoutSourTarHash.containsKey(0))
        // console.log(layoutSourSouHash.containsKey(132))


        //0132是第二帧才来的
        // console.time(555)
        nowData.forEach(function (d) {
            // console.log(d)

            // var str = []
            // str = JSON.stringify(d)

            var valueAdd = [];
            valueAdd = d.source + d.target;
            // console.log(valueAdd)


            var sourceId = d.source, targetId = d.target;
            push_time++;
            if (push_time == 1) {
                nowlayoutEdges = [];
            }
            nowlayoutEdges.push(d);
            // console.log(999999999)
            //如果过去的 so ta集的某一行 没有

            // console.log(preDataHash1.containsKey(valueAdd))

            // console.log(valueAdd)
            if (!preDataHash1.containsKey(valueAdd)) {

                // console.log(d)
                // console.log(va\lueAdd)

                // console.log(layoutSourTarHash.getValues())
                // console.log(layoutSourTarHash.containsKey(d.target))

                // if (layoutSourTarHash.containsKey(d.target) && layoutSourSouHash.containsKey(d.source)) {

                if (hashperPURENodes1.containsKey(d.target)&&hashperPURENodes1.containsKey(d.source)){
                    // console.log(d)
                    addAlreadyEdges.push(d);
                } else {
                    //昨天到这了
                    // if (nodesIdArray.includes(sourceId) && nodesIdArray.includes(targetId)){
                    if (hashperPURENodes1.containsKey(sourceId) || hashperPURENodes1.containsKey(targetId)) {
                        // console.log(d)
                        // addEdges.push(d)
                        //nowdata里面还有一个老节点的角在新节点里面的所以增加的是点
                        // console.log(d)
                        //两个存在的点之间进行连接构建
                        addNodes.push(d);
                    } else {
                        //新增的两个点都不在老节点里面的
                        // console.log(d)
                        //破案了！
                        addEdges.push(d);
                    }
                }
            }
        });

        // console.timeEnd(555)

        // console.log(addNode)


        // console.time()
        //On 37ms
        // nowData.forEach(function (d, index) {
        //     // console.log(d)
        //     //{source: "853", target: "550"}
        //     var sourceId = d.source, targetId = d.target;
        //     //对象字符串
        //     var d_str = JSON.stringify(d);
        //     // console.log(sourceId)
        //     // console.log(targetId)
        //     // nowlayoutEdges = []
        //     push_time++;
        //     if (push_time == 1){
        //         nowlayoutEdges = []
        //     }
        //     // var push_time = 0
        //     nowlayoutEdges.push(d)
        //     //和前面的layoutStr不是一模一样的情况就执行下面的 比如{source: '31', target: '36'} 只有一个没在大数组里面就执行下去
        //     if(!layoutNodesStr.includes(d_str)){
        //         //都不在 那就添加一条边
        //         // console.log(d)
        //         // console.time()
        //         if(nodesIdArray.includes(sourceId) && nodesIdArray.includes(targetId)){
        //             console.log(d)
        //             addEdges.push(d);
        //             // console.log(111)
        //         }else{
        //             addNodes.push(d);
        //             // console.log(222)
        //         }
        //     // console.timeEnd()
        //     }
        // });
        // console.timeEnd()
        // console.log(addEdges)
        // console.log(addNodes)
        // console.log(deleteNodes(layoutNodes, nowData))
        // console.log(layoutNodes)
        // console.log(perLayoutNodes)
        // console.log(layoutNodes)
        // console.log(deleteNodes(layoutNodes, nowData))


        // console.log(layoutNodes)
        // console.log(deleteNodes(layoutNodes, nowData))

        //通过这个函数删掉了原layout里面有 但是nowData里面没有的 点ID行
        //删了的点都是OK的 但是这里的layout没说新增进来的咋办 而且push进去的links已经有了新增的links索引了
        // console.time(555)

        layoutNodes = [].concat(deleteNodes(layoutNodes, nowData));


        var hashPerlayoutNodes = new HashTable()

        perLayoutNodes.forEach(function (d) {
            hashPerlayoutNodes.add(d.id, d)
        })

        // console.timeEnd(777)
        // console.timeEnd(555)
        // console.log(layoutNodes)

        // console.log(layoutNodes)
        // hashlayoutNodesID1.getValues() = [].concat()
        // console.timeEnd()
        // var aer = new AER(layoutNodes, addEdges, width, height);
        // aer.start();//添加边时，位置变化
        // var hashlayoutNodesID1 = new HashTable()
        //
        //
        // layoutNodes.forEach(function (d){
        //     // console.log(d.id)
        //     // console.log(d)
        //     hashlayoutNodesID1.add(d.id,d)
        // })
        //
        //
        // var hashPerlayoutNodes = new HashTable()
        //
        // perLayoutNodes.forEach(function (d){
        //     hashPerlayoutNodes.add(d.id,d)
        // })
        // var hashlayoutNodesID1 = new HashTable()
        //
        // layoutNodes.forEach(function (d){
        //     // console.log(d.id)
        //     // console.log(d)
        //     hashlayoutNodesID1.add(d.id,d)
        // })
        // // console.log(layoutNodes)
        // // console.log(hashlayoutNodesID1.getValues())
        //
        // var hashPerlayoutNodes = new HashTable()
        //
        // perLayoutNodes.forEach(function (d){
        //     hashPerlayoutNodes.add(d.id,d)
        // })


        // console.log(addNode)
        //49ms

        // console.log(layoutNodes)

        // var aer = new AER(layoutNodes, addEdges, width, height);
        // aer.start()

        // console.log(layoutNodes)

        // console.timeEnd()


        // console.timeEnd(777)


        // console.log(layoutNodes)

        // console.time(1111)
        //这里之前的算法耗时5ms左右
        // var ssbm = new SSBM(layoutNodes, addNodes, width, height);
        // ssbm.start();//初始化新增节点位置 17ms
        //之后的到gpu部分耗时9ms左右

        // console.timeEnd(1111)

        var hashlayoutNodesID1 = new HashTable()
        layoutNodes.forEach(function (d) {
            hashlayoutNodesID1.add(d.id, d)
        })


        // var addnodesArrayHash = new HashTable()
        //
		// addNodes.forEach(function (d){
		// 	addnodesArrayHash.add(d.source,d.source)
        //     addnodesArrayHash.add(d.target,d.target)
		// })


         // function arrCheck(arr) {
         //     var newArr = [];
         //     for (var i = 0; i < arr.length; i++) {
         //         var temp = arr[i];
         //         var count = 0;
         //         for (var j = 0; j < arr.length; j++) {
         //             if (arr[j] == temp) {
         //                 count++;
         //                 arr[j] = -1;
         //             }
         //         }
         //         if (temp != -1) {
         //             newArr.push(temp + ":" + count)
         //         }
         //     }
         //     return newArr;
         // }


        // console.log(arrCheck(addnodesArrayHash.getValues()))
        // 
        // console.log(addnodesArrayHash.getValues())


        addNodes.forEach(function (d){

            // console.log(d)

            var k = parseInt(Math.sqrt(width*height/layoutNodes.length)*3);
            // console.log(d)
            if (hashlayoutNodesID1.containsKey(d.source) || hashlayoutNodesID1.containsKey(d.target)){
                var subs = hashlayoutNodesID1.getSize() - 1;


                if (hashlayoutNodesID1.containsKey(d.source)){
                    var keyValue = {
                        'degree': 0,
                        'id': d.target,
                        'links': [],
                        'x': 0,
                        'y': 0,
                        'age': 1,
                        'subs': subs + 1
                    }
                    var x1 = Math.random(), y1 = Math.random();
                    var random_x = 4 * width / 5 - 100 * x1;
                    var random_x1 = width / 5 + 100 * x1;
                    var node_x = 0;
                    if (Math.random() >= 0.5) {
                        node_x = random_x
                    } else {
                        node_x = random_x1
                    }
                    var center_x = 0,center_y = 0
                    center_x += hashlayoutNodesID1.getValue(d.source).x
                    center_y += hashlayoutNodesID1.getValue(d.source).y

                    // keyValue.x = hashlayoutNodesID1.getValue(d.source).x + node_x*0.1;
                    // keyValue.y = hashlayoutNodesID1.getValue(d.source).y + 0.1*height * y1;

                    keyValue.x = center_x + 0.5*k*x1
                    keyValue.y = center_y + 0.5*k*y1

                    keyValue.links.push(d.source);
                    keyValue.degree++;
                    hashlayoutNodesID1.add(keyValue.id, keyValue)
                    var oriValue = hashlayoutNodesID1.getValue(d.source)
                    oriValue.links.push(d.target)
                    oriValue.degree++;
                    hashlayoutNodesID1.remove(d.source)
                    hashlayoutNodesID1.add(d.source, oriValue)
                }
                else {
                    var keyValue = {
                        'degree': 0,
                        'id': d.source,
                        'links': [],
                        'x': 0,
                        'y': 0,
                        'age': 1,
                        'subs': subs + 1
                    }
                    var x1 = Math.random(), y1 = Math.random();
                    var random_x = 4 * width / 5 - 100 * x1;
                    var random_x1 = width / 5 + 100 * x1;
                    var node_x = 0;
                    if (Math.random() >= 0.5) {
                        node_x = random_x
                    } else {
                        node_x = random_x1
                    }
                    var center_x = 0,center_y = 0
                    center_x += hashlayoutNodesID1.getValue(d.target).x
                    center_y += hashlayoutNodesID1.getValue(d.target).y

                    // keyValue.x = hashlayoutNodesID1.getValue(d.source).x + node_x*0.1;
                    // keyValue.y = hashlayoutNodesID1.getValue(d.source).y + 0.1*height * y1;

                    keyValue.x = center_x + 0.5*k*x1
                    keyValue.y = center_y + 0.5*k*y1




                    // keyValue.x =hashlayoutNodesID1.getValue(d.target).x + 0.1*node_x;
                    // keyValue.y =hashlayoutNodesID1.getValue(d.target).y + 0.1*height * y1;
                    keyValue.links.push(d.target);
                    keyValue.degree++;
                    // console.log(subs)
                    // console.log(keyValue)
                    hashlayoutNodesID1.add(keyValue.id, keyValue)
                    var oriValue = hashlayoutNodesID1.getValue(d.target)
                    oriValue.links.push(d.source)
                    oriValue.degree++;
                    hashlayoutNodesID1.remove(d.target)
                    hashlayoutNodesID1.add(d.target, oriValue)
                }
            }
        })




        // console.log(perLayoutNodes)


        // console.timeEnd(1111)

        // console.time()
        // var hashlayoutNodesID1 = new HashTable()
        // layoutNodes.forEach(function (d) {
        //     hashlayoutNodesID1.add(d.id, d)
        // })

        // console.log(hashlayoutNodesID1.getValue(447))
        // console.log(hashlayoutNodesID1.getValue(606))


        // var addAlreadyNode = []
        //
        // var addAlreadyNodes = []
        // addAlreadyEdges.forEach(function (d){
        //     addAlreadyNode.push(d.source)
        //     addAlreadyNode.push(d.target)
        // })
        //
        //
        // addAlreadyNode = this.unique(addAlreadyNode)
        //
        //
        // addAlreadyNode.forEach(function (d){
        //     var value = {id:hashlayoutNodesID1.getValue(d).id,'x':hashlayoutNodesID1.getValue(d).x,'y':hashlayoutNodesID1.getValue(d).y,'group':hashlayoutNodesID1.getValue(d).age}
        //     addAlreadyNodes.push(value)
        // })

        // console.log(addAlreadyEdges)
        // console.log(addAlreadyNodes)

        // console.log(hashlayoutNodesID1.getValue(132))

        // console.log(addAlreadyEdges)
        // console.log(hashlayoutNodesID1.getValue(189))


        /**
         * 游离边的新增
         */

        // console.log(addNode)

        addEdges.forEach(function (d) {
            // console.log(d)
            //增加的是点
            if (hashlayoutNodesID1.containsKey(d.source) || hashlayoutNodesID1.containsKey(d.target)) {
                var subs = hashlayoutNodesID1.getSize() - 1;

                // console.log(d)
                //如果是source存在 target就不存在了
                if (hashlayoutNodesID1.containsKey(d.source)) {
                    var keyValue = {
                        'degree': 0,
                        'id': d.target,
                        'links': [],
                        'x': 0,
                        'y': 0,
                        'age': 1,
                        'subs': subs + 1
                    }
                    var x1 = Math.random(), y1 = Math.random();
                    var random_x = 4 * width / 5 - 100 * x1;
                    var random_x1 = width / 5 + 100 * x1;
                    var node_x = 0;
                    if (Math.random() >= 0.5) {
                        node_x = random_x
                    } else {
                        node_x = random_x1
                    }
                    keyValue.x = node_x;
                    keyValue.y = height * y1;
                    keyValue.links.push(d.source);
                    keyValue.degree++;
                    hashlayoutNodesID1.add(keyValue.id, keyValue)
                    var oriValue = hashlayoutNodesID1.getValue(d.source)
                    oriValue.links.push(d.target)
                    oriValue.degree++;
                    hashlayoutNodesID1.remove(d.source)
                    hashlayoutNodesID1.add(d.source, oriValue)
                }
                else {
                    var keyValue = {
                        'degree': 0,
                        'id': d.source,
                        'links': [],
                        'x': 0,
                        'y': 0,
                        'age': 1,
                        'subs': subs + 1
                    }
                    var x1 = Math.random(), y1 = Math.random();
                    var random_x = 4 * width / 5 - 100 * x1;
                    var random_x1 = width / 5 + 100 * x1;
                    var node_x = 0;
                    if (Math.random() >= 0.5) {
                        node_x = random_x
                    } else {
                        node_x = random_x1
                    }
                    keyValue.x = node_x;
                    keyValue.y = height * y1;
                    keyValue.links.push(d.target);
                    keyValue.degree++;
                    // console.log(subs)
                    // console.log(keyValue)
                    hashlayoutNodesID1.add(keyValue.id, keyValue)
                    var oriValue = hashlayoutNodesID1.getValue(d.target)
                    oriValue.links.push(d.source)
                    oriValue.degree++;
                    hashlayoutNodesID1.remove(d.target)
                    hashlayoutNodesID1.add(d.target, oriValue)
                }
            }
            //与主干无关的边增加
            else {
                // console.log(d)
                var subs = hashlayoutNodesID1.getSize() - 1;
                // console.log(subs)
                // console.log(JSON.parse(d.target))
                // var keyValueSou =  {'degree': 1, 'id': d.source, 'links': [],'subs': Number(subs + 1),'age': 1, 'x': Number(node_x),  'y': Number((Math.random()*400+ 100)*(Math.random()*0.3+0.9))}
                // var keyValueSou = {'degree': 1, 'id': d.source, 'links': [], 'x':Number(0), 'y': Number(0),'age': 1, 'subs': Number(subs+1)}
                // var keyValueTar = {'degree': 1, 'id': d.target, 'links': d.source, 'x': 0, 'y': 0,'age': 1, 'subs': subs + 2}

                var layoutTemp = []
                hashlayoutNodesID1.getValues().forEach(function (item) {
                    layoutTemp.push(item)
                })
                // console.log(hashlayoutNodesID1.getValues())
                // console.log(layoutTemp)
                // layoutTemp.push(keyValueSou)

                var x1 = Math.random(), y1 = Math.random()
                var random_x = 4 * width / 5 - 100 * x1;
                var random_x1 = width / 5 + 100 * x1;
                var node_x = 0;
                if (Math.random() >= 0.5) {
                    node_x = random_x
                } else {
                    node_x = random_x1
                }
                var yNumber = Number((Math.random() * 400 + 100) * (Math.random() * 0.3 + 0.9))
                // var yNumber = parseInt(555)
                // console.log(isNaN(yNumber))

                var keyValueSou = {
                    'degree': 1,
                    'id': d.source,
                    'links': [].concat(d.target),
                    'subs': Number(subs + 1),
                    'age': 1,
                    'x': Number(node_x),
                    'y': yNumber
                }

                // console.log(keyValueSou)
                // console.log(keyValueSou.y)
                // if (keyValueSou) {
                hashlayoutNodesID1.add(d.source, keyValueSou)
                // console.log(hashlayoutNodesID1.getValues())
                // console.log(keyValueSou)

                var subsTar = hashlayoutNodesID1.getSize() - 1;
                // var keyValueTar = {'degree': 1, 'id': d.target, 'links': [],'subs': Number(subsTar + 1),'age': 1, 'x': Number(0),  'y': Number(0)}
                // console.log(subsTar)
                // layoutTemp.push(keyValueTar)
                // layoutTemp[subsTar + 1].x = Number(node_x * (Math.random()*0.3+0.9));
                // layoutTemp[subsTar + 1].y = Number((Math.random()*400 + 100)*(Math.random()*0.3+0.9));
                // layoutTemp[subsTar + 1].links = [].concat(d.source);

                var keyValueTar = {
                    'degree': 1,
                    'id': d.target,
                    'links': [].concat(d.source),
                    'subs': Number(subsTar + 1),
                    'age': 1,
                    'x': Number(node_x * (Math.random() * 0.4 + 0.8)),
                    'y': Number(yNumber * (Math.random() * 0.4 + 0.8))
                }

                // console.log(keyValueTar)
                // keyValueTar.x = node_x * (Math.random()*0.3+0.9)
                // keyValueTar.y =  Number(Math.random()*400 + 100)
                // // console.log(keyValueTar.y)
                // keyValueTar.links = []
                // keyValueTar.links = [].concat(d.source)
                // keyValueTar.subs = subsTar + 1
                // layoutTemp.push(keyValueTar)
                // console.log(keyValueTar)
                hashlayoutNodesID1.add(d.target, keyValueTar)
            }
        })


        layoutNodes = []

        // console.log(hashlayoutNodesID1.getValues())

        // console.time()







        hashlayoutNodesID1.getValues().forEach(function (d) {
            layoutNodes.push(d)
        })


        // var hashPerlayoutNodes = new HashTable()
        //
        // perLayoutNodes.forEach(function (d) {
        //     hashPerlayoutNodes.add(d.id, d)
        // })

        // console.log(hashlayoutNodesID1.getValues())


        // console.time(444)
        var age = new AGE(hashPerlayoutNodes, hashlayoutNodesID1, addNode);
        age.start();//设置年龄

        // console.timeEnd(444)

        var nowDatanodeCopy = []
        nowDatanode.forEach(function (d) {
            nowDatanodeCopy.push(d)
        })




        // console.log(nowDatanode)
        // console.log(layoutNodes[513])
        // console.log(nowData)
        // console.log(nowDatanodeCopy)
        // console.log(layoutNodesID)   //没有153这个点

        //找出 nowDatanode数组中有 但是layout里面没有的数
        // let c = []
        // nowDatanodeCopy.forEach(function (item){
        //     // console.log(item)
        //     if (!layoutNodesID.includes(item)&& nowDatanodeCopy.includes(item)){
        //
        //         c.push(item)
        //     }
        // })
        // console.log(c)

        // var res = {};
        // var maxnum = 0;
        // var max;
        //
        // function getRepeat(arr) {
        //     for (var i = 0; i < arr.length; i++) {
        //         if (!res[arr[i]]) {
        //             res[arr[i]] = 1;
        //         } else {
        //             res[arr[i]]++;
        //         }
        //     }
        //     ;
        //     var keys = Object.keys(res);
        //     // console.log(keys);
        //     for (var j = 0; j < keys.length; j++) {
        //         if (res[keys[j]] > maxnum) {
        //             maxnum = res[keys[j]];
        //             max = keys[j];
        //         }
        //     }
        //     return maxnum + max
        // }
        //
        // console.log(getRepeat(layoutNodesID));


        // var age = new AGE(perLayoutNodes, hashlayoutNodesID1.getValues(), addNode);
        // age.start();//设置年龄 3ms


        // console.log(layoutNodes)
        // console.log(hashlayoutNodesID1.getValues())


        // var repulsion = new RepulsionAll(layoutNodes, nowData, width, height);
        // repulsion.start();//计算排斥力等，移动位置

        // console.log(layoutNodes)

        // console.time()

        //0.5ms


        // console.timeEnd()
        /**
         * 实现不变节点位置不变算法
         */

        // console.log(hashlayoutNodesID1.getValues())

        hashlayoutNodesID1.getValues().forEach(function (d) {
            // console.log(d)
            if (hashPerlayoutNodes.containsKey(d.id)) {
                d.x = hashPerlayoutNodes.getValue(d.id).x;
                d.y = hashPerlayoutNodes.getValue(d.id).y;
            }
        })

        /**
         * 实现新增节点两边节点位置的算法
         * hashlayoutNodesID1.getValue(d)是小偷
         *  hashlayoutNodesID1.getValue(d).links是新增这个d的id的值
         *  hashlayoutNodesID1.getValue(linkIndex) 是父节点
         *
         */

            // console.time()
        var crime_gangAddCopy = []

        // hashlayoutNodesID1.getValues().forEach(function (d){
        //     // console.log(hashlayoutNodesID1.getValue(d.id).links.length)
        //     if (hashlayoutNodesID1.getValue(d.id).links.length != 1){
        //         for (i = 0;i < hashlayoutNodesID1.getValue(d.id).links.length;i++){
        //
        //             // console.log(hashlayoutNodesID1.containsKey(d.links[i]))
        //             if (!hashlayoutNodesID1.containsKey(d.links[i])){
        //
        //                 // console.log(d.links[i])
        //
        //                 // console.time()
        //
        //                 hashlayoutNodesID1.add(d.links[i],blankLinkAdd(d,d.links[i]))
        //
        //                 // console.timeEnd()
        //             }
        //         }
        //     }
        //     else {
        //         if (!hashlayoutNodesID1.containsKey(d.links)){
        //             // console.log(d.links)
        //             // console.log(d.links)
        //             // console.log(d)
        //             hashlayoutNodesID1.add(d.links,blankLinkAdd(d,d.links))
        //
        //             // layoutNodes.push(blankLinkAdd(d,d.links))
        //         }
        //     }
        // })


        hashPerLayoutNodes1 = hashPerlayoutNodes


        // console.time(333)
        // console.log(width)
        // console.log(height)
        addNode.forEach(function (d) {
            if (hashlayoutNodesID1.containsKey(d)) {
                if (hashlayoutNodesID1.getValue(d).links.length == 1) {

                    var linkIndex = hashlayoutNodesID1.getValue(d).links;
                    node_r = 50;
                    node_r = node_r + hashlayoutNodesID1.getValue(linkIndex).age * 8;
                    dis_x = hashlayoutNodesID1.getValue(linkIndex).x - hashlayoutNodesID1.getValue(d).x;
                    dis_y = hashlayoutNodesID1.getValue(linkIndex).y - hashlayoutNodesID1.getValue(d).y;
                    node_distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y)
                    node_b = node_r / ((hashlayoutNodesID1.getValue(linkIndex).age + hashlayoutNodesID1.getValue(linkIndex).degree))

                    // console.log((node_b / node_distance) * dis_x)
                    var distanceTest = []
                    if (hashlayoutNodesID1.getValue(linkIndex).x <= width / 2 && hashlayoutNodesID1.getValue(linkIndex).y < height / 2) {

                        if (hashlayoutNodesID1.getValue(d).x <= width / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x + (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).x = Math.abs(hashlayoutNodesID1.getValue(d).x - width)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x - (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        }

                        if (hashlayoutNodesID1.getValue(d).y < height / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y + (dis_y - (node_r / node_distance) * dis_y);
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).y = Math.abs(hashlayoutNodesID1.getValue(d).y - height)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y - (dis_y - (node_r / node_distance) * dis_y)
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        }

                        // distanceTest = Math.sqrt((hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)*(hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)+
                        //     (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y) * (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y))
                        // console.log(distanceTest)
                    }
                    else if (hashlayoutNodesID1.getValue(linkIndex).x > width / 2 && hashlayoutNodesID1.getValue(linkIndex).y < height / 2) {

                        if (hashlayoutNodesID1.getValue(d).x > width / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x + (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).x = Math.abs(hashlayoutNodesID1.getValue(d).x - width)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x - (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        }

                        if (hashlayoutNodesID1.getValue(d).y < height / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y + (dis_y - (node_r / node_distance) * dis_y);
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).y = Math.abs(hashlayoutNodesID1.getValue(d).y - height)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y - (dis_y - (node_r / node_distance) * dis_y)
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        }
                        // distanceTest = Math.sqrt((hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)*(hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)+
                        //     (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y) * (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y))
                        // console.log(distanceTest)

                    }
                    else if (hashlayoutNodesID1.getValue(linkIndex).x < width / 2 && hashlayoutNodesID1.getValue(linkIndex).y >= height / 2) {

                        if (hashlayoutNodesID1.getValue(d).x < width / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x + (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).x = Math.abs(hashlayoutNodesID1.getValue(d).x - width)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x - (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        }

                        if (hashlayoutNodesID1.getValue(d).y >= height / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y + (dis_y - (node_r / node_distance) * dis_y);
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).y = Math.abs(hashlayoutNodesID1.getValue(d).y - height)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y - (dis_y - (node_r / node_distance) * dis_y)
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        }
                        // distanceTest = Math.sqrt((hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)*(hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)+
                        //     (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y) * (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y))
                        // console.log(distanceTest)


                    }
                    else {
                        if (hashlayoutNodesID1.getValue(d).x > width / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x + (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).x = Math.abs(hashlayoutNodesID1.getValue(d).x - width)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).x = hashlayoutNodesID1.getValue(d).x - (dis_x - (node_r / node_distance) * dis_x)
                                hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x - (node_b / node_distance) * dis_x
                            }
                        }

                        if (hashlayoutNodesID1.getValue(d).y > height / 2) {
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y + (dis_y - (node_r / node_distance) * dis_y);
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        } else {
                            hashlayoutNodesID1.getValue(d).y = Math.abs(hashlayoutNodesID1.getValue(d).y - height)
                            if (node_r < node_distance) {
                                hashlayoutNodesID1.getValue(d).y = hashlayoutNodesID1.getValue(d).y - (dis_y - (node_r / node_distance) * dis_y)
                                hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y - (node_b / node_distance) * dis_y
                            }
                        }

                        // distanceTest = Math.sqrt((hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)*(hashlayoutNodesID1.getValue(d).x-hashlayoutNodesID1.getValue(linkIndex).x)+
                        //     (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y) * (hashlayoutNodesID1.getValue(d).y - hashlayoutNodesID1.getValue(linkIndex).y))
                        // console.log(distanceTest)

                    }

                } else {
                    //小偷
                    // console.log(hashlayoutNodesID1.getValue(d))
                    var crime_gangAdd = []
                    crime_gangAdd.push(hashlayoutNodesID1.getValue(d))
                    // console.log(hashlayoutNodesID1.getValue(d))
                    var linkIndexGroup = hashlayoutNodesID1.getValue(d).links;
                    // console.log(linkIndexGroup)
                    // console.log(hashlayoutNodesID1.getValue(d))
                    for (var i = 0; i < linkIndexGroup.length; i++) {
                        crime_gangAdd.push(hashlayoutNodesID1.getValue(linkIndexGroup[i]))
                    }
                    crime_gangAddCopy.push(crime_gangAdd)
                }
            }
        })

        // console.log(999)

        // console.log(crime_gangAddCopy)

        /**
         *  hashlayoutNodesID1.getValue(d)是小偷
         *  d[0]也是小偷
         *  d.length 是那个多边形的顶点数
         */

        // console.log(hashlayoutNodesID1.getValue(500))
        crime_gangAddCopy.forEach(function (d) {

            // console.log(d)
            var polyCenterAdd = getPolygonAreaCenter(d)
            dis_x = polyCenterAdd.xx - d[0].x;
            dis_y = polyCenterAdd.yy - d[0].y;

            node_r = 50;
            node_r = node_r + d[0].degree * 8;

            node_distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y);
            hashlayoutNodesID1.getValue(d[0].id).x = hashlayoutNodesID1.getValue(d[0].id).x + (dis_x - (node_r / node_distance) * dis_x);
            hashlayoutNodesID1.getValue(d[0].id).y = hashlayoutNodesID1.getValue(d[0].id).y + (dis_y - (node_r / node_distance) * dis_y);

            for (var i = 1; i < d.length; i++) {
                // console.log(d[i])
                dis_x = polyCenterAdd.xx - d[i].x
                dis_y = polyCenterAdd.yy - d[i].y

                node_b = node_r /(d[i].age + d[i].degree)
                node_distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y)

                hashlayoutNodesID1.getValue(d[i].id).x = hashlayoutNodesID1.getValue(d[i].id).x + (node_b / node_distance) * dis_x;
                hashlayoutNodesID1.getValue(d[i].id).y = hashlayoutNodesID1.getValue(d[i].id).y + (node_b / node_distance) * dis_y;
            }

        })


        // console.timeEnd()

        // console.timeEnd()

        //通缉令
        // for (var j = 0;j<addNode.length;j++) {
        //     //嫌疑人
        //     for (var i = 0; i < layoutNodes.length; i++) {
        //         //对比
        //         if (addNode[j] == layoutNodes[i].id ) {
        //             if (layoutNodes[i].links.length == 1) {
        //                 for (var h = 0; h < layoutNodes.length; h++) {
        //
        //                     //查看同伙是谁
        //                     if (layoutNodes[h].id == layoutNodes[i].links) {
        //                         /**
        //                          * 马仔“判刑”算法
        //                          * layoutNodes[h]是黑老大节点。layoutNodes[i]是小偷节点
        //                          * 版本1：小偷节点经纬度向老大节点靠近原坐标 + 0.618倍差距除以除以自身度（江湖地位）距离
        //                          *       老大节点向小偷节点靠近 0.2*差距除以自身 度 * 江湖等级 （age）的距离
        //                          */
        //                         // console.log(layoutNodes[h])
        //
        //                         node_r = 50
        //                         //面积绑定
        //                         node_r = node_r + layoutNodes[h].age*10;
        //                         // console.log(node_r)
        //
        //                         // console.log(layoutNodes[h].x)
        //                         // console.log(layoutNodes[i].x)
        //                         dis_x = layoutNodes[h].x - layoutNodes[i].x;
        //                         dis_y = layoutNodes[h].y - layoutNodes[i].y;
        //
        //                         node_distance = Math.sqrt(dis_x*dis_x + dis_y*dis_y)
        //                         node_b = node_r/((layoutNodes[h].age+layoutNodes[h].degree)*0.5)
        //                         // console.log((node_b / node_distance) * dis_x)
        //
        //                         if (layoutNodes[h].x <= width/2&&layoutNodes[h].y < height/2) {
        //
        //                             if (layoutNodes[i].x <= width/2){
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x + (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].x = Math.abs(layoutNodes[i].x - width)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x - (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }
        //
        //                             if (layoutNodes[i].y < height / 2) {
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y + (dis_y - (node_r / node_distance) * dis_y);
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].y = Math.abs(layoutNodes[i].y - height)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y - (dis_y - (node_r / node_distance) * dis_y)
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }
        //                         }
        //
        //                         else if (layoutNodes[h].x > width/2&&layoutNodes[h].y < height/2) {
        //
        //                             if (layoutNodes[i].x > width/2) {
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x + (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].x = Math.abs(layoutNodes[i].x - width)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x - (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }
        //
        //                             if (layoutNodes[i].y < height / 2){
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y + (dis_y - (node_r / node_distance) * dis_y);
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].y = Math.abs(layoutNodes[i].y - height)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y - (dis_y - (node_r / node_distance) * dis_y)
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }
        //                         }
        //
        //                         else if (layoutNodes[h].x < width/2&&layoutNodes[h].y >= height/2) {
        //
        //                             if (layoutNodes[i].x < width/2) {
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x + (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].x = Math.abs(layoutNodes[i].x - width)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x - (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }
        //
        //                             if (layoutNodes[i].y >= height / 2){
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y + (dis_y - (node_r / node_distance) * dis_y);
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].y = Math.abs(layoutNodes[i].y - height)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y - (dis_y - (node_r / node_distance) * dis_y)
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }
        //                         }
        //
        //                         else{
        //                             if (layoutNodes[i].x > width/2) {
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x + (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].x = Math.abs(layoutNodes[i].x - width)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].x = layoutNodes[i].x - (dis_x - (node_r / node_distance) * dis_x)
        //                                     layoutNodes[h].x = layoutNodes[h].x - (node_b / node_distance) * dis_x
        //                                 }
        //                             }
        //
        //                             if (layoutNodes[i].y > height / 2){
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y + (dis_y - (node_r / node_distance) * dis_y);
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }else {
        //                                 layoutNodes[i].y = Math.abs(layoutNodes[i].y - height)
        //                                 if (node_r < node_distance) {
        //                                     layoutNodes[i].y = layoutNodes[i].y - (dis_y - (node_r / node_distance) * dis_y)
        //                                     layoutNodes[h].y = layoutNodes[h].y - (node_b / node_distance) * dis_y
        //                                 }
        //                             }
        //
        //                         }
        //
        //
        //                         /**
        //                          * 新增节点(小偷)邻居位移算法
        //                          * layoutNode[q]为邻居节点
        //                          */
        //
        //                             //小偷的邻居
        //                             /**
        //                              * A11
        //                              * layoutNodes[q]邻居，layoutNodes[i]小偷
        //                              */
        //
        //                         break;
        //                     }
        //                 }
        //             }
        //
        //                 /**
        //                  * 帮派判刑算法
        //                  * layoutNodes[h]是黑老大节点（有n个）。layoutNodes[i]是小偷节点
        //                  * 版本一：笨办法
        //                  * 小弟先向大哥走，再向二哥走（同马仔算法一致）
        //                  * 版本二：先求n点的质心
        //                  * 然后处于这个质心域内的点向质心移动
        //                  *
        //                  */
        //
        //             //不止一个同伙：
        //             else {
        //                 var crime_gangAdd = []
        //                 crime_gangAdd.push(layoutNodes[i])
        //                 for (var k = 0; k < layoutNodes[i].links.length; k++) {
        //                     // console.log(layoutNodes[i].links[k])
        //
        //                     //知道同伙的id，在身份证系统中索引
        //                     //笨办法：
        //                     for (var h = 0; h < layoutNodes.length; h++) {
        //                         if (layoutNodes[h].id == layoutNodes[i].links[k]) {
        //
        //
        //                             // console.log(crime_gangAdd)
        //                             //版本二算法：
        //                             crime_gangAdd.push(layoutNodes[h])
        //
        //                             break;
        //
        //                         }
        //                     }
        //                 }
        //
        //                 var polyCenterAdd = getPolygonAreaCenter(crime_gangAdd)
        //
        //                 dis_x = polyCenterAdd.xx - layoutNodes[i].x;
        //                 dis_y = polyCenterAdd.yy - layoutNodes[i].y;
        //
        //                 node_r = 100;
        //                 node_r = node_r + layoutNodes[i].degree * 8;
        //                 // console.log(node_r)
        //
        //                 node_distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y);
        //
        //
        //                 layoutNodes[i].x = layoutNodes[i].x + (dis_x - (node_r / node_distance) * dis_x);
        //                 layoutNodes[i].y = layoutNodes[i].y + (dis_y - (node_r / node_distance) * dis_y);
        //
        //
        //                 /**
        //                  * 团伙中的小偷邻居
        //                  * A21
        //                  */
        //
        //
        //                 //让这些黑老大和质心节点去周旋
        //
        //                 for (var k = 0; k < layoutNodes[i].links.length; k++) {
        //                     for (var h = 0; h < layoutNodes.length; h++) {
        //                         // console.log(998998)
        //                         if (layoutNodes[h].id == layoutNodes[i].links[k]) {
        //
        //                             dis_x = polyCenterAdd.xx - layoutNodes[h].x;
        //                             dis_y = polyCenterAdd.yy - layoutNodes[h].y;
        //
        //                             // crime_x = dis_x * 0.25;
        //                             // crime_y = (crime_x * dis_y) / (dis_x + 0.001);
        //
        //                             node_b = node_r / (layoutNodes[h].age + layoutNodes[h].degree)
        //                             node_distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y);
        //
        //                             // console.log((node_b / node_distance) * dis_x)
        //
        //                             layoutNodes[h].x = layoutNodes[h].x + (node_b / node_distance) * dis_x;
        //                             layoutNodes[h].y = layoutNodes[h].y + (node_b / node_distance) * dis_y;
        //
        //                             /**
        //                              * 新增节点邻居位移算法
        //                              * layoutNode[q]为邻居节点
        //                              * A22
        //                              */
        //
        //
        //                             break;
        //                         }
        //                     }
        //                 }
        //                 break;
        //             }
        //         }
        //     }
        //
        // }

        /**
         * 节点删除算法改良版本
         *  hashPerlayoutNodes.getValue(d) 是被删除了的点的那一条信息
         *  hashPerlayoutNodes.getValue(linkIndex) 是被删除的链接点的一行信息
         *  linkIndex就是目标点的id值
         *
         */
            // console.time()、


        var crimeDeleteCopy = []
        var linkIndexCopy = []
        deleteNodeId.forEach(function (d) {
            if (hashPerlayoutNodes.containsKey(d)) {
                if (hashPerlayoutNodes.getValue(d).links.length == 1) {
                    var linkIndex = hashPerlayoutNodes.getValue(d).links;
                    // console.log(hashPerlayoutNodes.getValue(d))
                    // console.log(hashPerlayoutNodes.getValue(linkIndex))
                    // console.log()
                    // if (!hashPerlayoutNodes.getValue(linkIndex)){
                    //     hashPerlayoutNodes.add(hashPerlayoutNodes.getValue(d).links,blankLinkAdd(hashPerlayoutNodes.getValue(d),hashPerlayoutNodes.getValue(d).links))
                    // }
                    // console.log(hashPerlayoutNodes.getValue(d))
                    // console.log(hashPerlayoutNodes.getValue(linkIndex))
                    // console.log(hashPerlayoutNodes.getValue(d))
                    dis_xDel = hashPerlayoutNodes.getValue(linkIndex).x - hashPerlayoutNodes.getValue(d).x
                    dis_yDel = hashPerlayoutNodes.getValue(linkIndex).y - hashPerlayoutNodes.getValue(d).y
                    node_r = 50;
                    node_r = node_r + hashPerlayoutNodes.getValue(linkIndex).age * 8;
                    node_b = node_r / (hashPerlayoutNodes.getValue(linkIndex).age + hashPerlayoutNodes.getValue(linkIndex).degree)
                    node_distance = Math.sqrt(dis_xDel * dis_xDel + dis_yDel * dis_yDel)
                    if (node_b < node_distance && hashlayoutNodesID1.containsKey(linkIndex)) {
                        linkIndexCopy.push(linkIndex)
                        hashlayoutNodesID1.getValue(linkIndex).x = hashlayoutNodesID1.getValue(linkIndex).x + (node_b / node_distance) * dis_xDel * 0.05;
                        hashlayoutNodesID1.getValue(linkIndex).y = hashlayoutNodesID1.getValue(linkIndex).y + (node_b / node_distance) * dis_yDel * 0.05;
                    }
                } else {
                    var crime_gangDel = []
                    // console.log(hashPerlayoutNodes.getValue(d))
                    crime_gangDel.push(hashPerlayoutNodes.getValue(d))
                    var linkIndexGroupDel = hashPerlayoutNodes.getValue(d).links
                    // console.log(linkIndexGroupDel)
                    for (var i = 0; i < linkIndexGroupDel.length; i++) {
                        // console.log(hashPerlayoutNodes.getValue(linkIndexGroupDel[i]))
                        // if (hashPerlayoutNodes.getValue(linkIndexGroupDel[i])) {
                        crime_gangDel.push(hashPerlayoutNodes.getValue(linkIndexGroupDel[i]))
                        // }else {
                        // console.log(hashPerlayoutNodes.getValue(d).id)
                        // console.log(hashPerlayoutNodes.getValue(d).links[i])
                        //     hashPerlayoutNodes.add(hashPerlayoutNodes.getValue(d).links[i],blankLinkAdd(hashPerlayoutNodes.getValue(d),hashPerlayoutNodes.getValue(d).links[i]))
                        //     crime_gangDel.push(hashPerlayoutNodes.getValue(linkIndexGroupDel[i]))
                        // }
                    }
                    crimeDeleteCopy.push(crime_gangDel)
                }
            }
        })

        // console.log(crimeDeleteCopy)


        crimeDeleteCopy.forEach(function (d) {
            // console.log(d)
            var polyCenterAdd = getPolygonAreaCenter(d)
            node_r = 100;
            node_r = node_r + d[0].degree * 8;
            node_distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y);

            for (var i = 1; i < d.length; i++) {
                dis_xDel = polyCenterAdd.xx - d[i].x
                dis_yDel = polyCenterAdd.yy - d[i].y

                node_b = node_r / (d[i].age + d[i].degree)
                node_distance = Math.sqrt(dis_xDel * dis_xDel + dis_yDel * dis_yDel)

                if (hashlayoutNodesID1.containsKey(d[i].id)) {
                    hashlayoutNodesID1.getValue(d[i].id).x = hashlayoutNodesID1.getValue(d[i].id).x - (node_r / node_distance) * dis_xDel * 0.1;
                    hashlayoutNodesID1.getValue(d[i].id).y = hashlayoutNodesID1.getValue(d[i].id).y - (node_r / node_distance) * dis_yDel * 0.1;
                }
            }
        })


        // console.timeEnd(333)

        // console.log(crimeDeleteCopy)
        // linkIndexCopy.forEach(function (d){
        //     // console.log(d)
        //     // hashlayoutNodesID1
        // })

        /**
         * 实现删除节点位置的算法
         * perlayoutNodes就是上一个step里面的节点
         * perLayoutNodes[j]是被删除点；perLayoutNodes[h]是元老点
         */

        // for (var i = 0;i<deleteNodeId.length;i++){
        //     for (var j = 0;j<perLayoutNodes.length;j++){
        //         if (deleteNodeId[i] == perLayoutNodes[j].id){
        //             // console.log(perLayoutNodes[j])
        //             // console.log(perLayoutNodes[j].links.length)
        //             /**
        //              * * D11 被删节点单点邻居
        //              * layoutNodes[r]为邻居，perlayoutNode[j]是小偷
        //              */
        //             // for (var r=0;r<perLayoutNodes.length;r++) {
        //             //     if (Math.abs(perLayoutNodes[r].x - perLayoutNodes[j].x) <= 0.005 * width && Math.abs(perLayoutNodes[r].y - perLayoutNodes[j].y) <= 0.005 * width) {
        //             //
        //             //         // console.log(perLayoutNodes[r])
        //             //
        //             //         dis_xNeib = perLayoutNodes[j].x - perLayoutNodes[r].x
        //             //         dis_yNeib = perLayoutNodes[j].y - perLayoutNodes[r].y
        //             //
        //             //         neib_x = dis_xNeib * 0.2 + 1
        //             //
        //             //         // console.log(neib_x)
        //             //
        //             //         neib_y = neib_x * dis_yNeib / (dis_xNeib + 0.001);
        //             //         // console.log(neib_y)
        //             //
        //             //         perLayoutNodes[r].x = perLayoutNodes[r].x + neib_x;
        //             //         perLayoutNodes[r].y = perLayoutNodes[r].y + neib_y;
        //             //
        //             //         //置换为layoutnode
        //             //         for (var t=0;t<layoutNodes.length;t++){
        //             //             if (perLayoutNodes[r].id == layoutNodes[t].id){
        //             //                 layoutNodes[t].x = perLayoutNodes[r].x
        //             //                 layoutNodes[t].y = perLayoutNodes[r].y
        //             //
        //             //                 //边界判断
        //             //                 if (Math.abs(layoutNodes[t].x - width*0.5) >= width*0.35) {
        //             //                     layoutNodes[t].x = Math.abs(layoutNodes[t].x - width_mid) / 2;
        //             //                 }
        //             //
        //             //                 if (Math.abs(layoutNodes[t].y - height*0.5) >= height*0.35) {
        //             //                     if (layoutNodes[t].y < 0) {
        //             //                         layoutNodes[t].y = Math.abs(layoutNodes[t].y / 1.5);
        //             //                     } else {
        //             //                         layoutNodes[t].y = layoutNodes[t].y / 1.5;
        //             //                     }
        //             //                 }
        //             //
        //             //                 break;
        //             //             }
        //             //
        //             //         }
        //             //         continue;
        //             //     }
        //             // }
        //             //单减debug成功
        //             //被删除节点只有一个连接节点
        //             if (perLayoutNodes[j].links.length == 1) {
        //                 for (var h = 0; h < perLayoutNodes.length; h++) {
        //                     // console.log(perLayoutNodes[h].id)
        //                     if (perLayoutNodes[h].id == perLayoutNodes[j].links) {
        //                         // console.log(perLayoutNodes[j])
        //                         /**
        //                          * 删点算法 版本一
        //                          * 往外弹，如果被删除点在元老点左边，则元老向右；在元老下，则元老向上
        //                          */
        //                         dis_xDel = perLayoutNodes[h].x - perLayoutNodes[j].x
        //                         dis_yDel = perLayoutNodes[h].y - perLayoutNodes[j].y
        //                         node_r = 50;
        //                         node_r = node_r + perLayoutNodes[h].age * 8;
        //                         node_b = node_r / (perLayoutNodes[h].age + perLayoutNodes[h].degree)
        //                         node_distance = Math.sqrt(dis_xDel * dis_xDel + dis_yDel * dis_yDel)
        //                         // crime_xDel = dis_xDel*0.25;
        //                         // crime_yDel = (crime_xDel * dis_yDel)/(dis_xDel + 0.001);
        //                         // if (perLayoutNodes[j].x < perLayoutNodes[h].x) {
        //                         //     // console.log(perLayoutNodes[j].x)
        //                         //     perLayoutNodes[h].x = perLayoutNodes[h].x + ((perLayoutNodes[j].x - perLayoutNodes[h].x) * 0.2) / ((perLayoutNodes[h].degree + 1) * (perLayoutNodes[h].age + 1))
        //                         //     // console.log(perLayoutNodes[h].x)
        //                         // } else {
        //                         //     perLayoutNodes[h].x = perLayoutNodes[h].x - ((perLayoutNodes[j].x - perLayoutNodes[h].x) * 0.2) / ((perLayoutNodes[h].degree + 1) * (perLayoutNodes[h].age + 1))
        //                         //
        //                         // }
        //                         // perLayoutNodes[h].x =
        //                         // console.log(perLayoutNodes[h].x)
        //                         // console.log(crime_yDel)
        //                         if (node_b < node_distance) {
        //                             perLayoutNodes[h].x = perLayoutNodes[h].x + (node_b / node_distance) * dis_x * 0.5;
        //                             perLayoutNodes[h].y = perLayoutNodes[h].y + (node_b / node_distance) * dis_y * 0.5;
        //                         }
        //
        //                         // console.log(perLayoutNodes[h].x)
        //                         // if (perLayoutNodes[j].y < perLayoutNodes[h].y) {
        //                         //     perLayoutNodes[h].y = perLayoutNodes[h].y + ((perLayoutNodes[j].y - perLayoutNodes[h].y) * 0.2) / ((perLayoutNodes[h].degree + 1) * (perLayoutNodes[h].age + 1))
        //                         // } else {
        //                         //     perLayoutNodes[h].y = perLayoutNodes[h].y - ((perLayoutNodes[j].y - perLayoutNodes[h].y) * 0.2) / ((perLayoutNodes[h].degree + 1) * (perLayoutNodes[h].age + 1))
        //                         // }
        //                         //把perlayout的数据放到layoutnode里面
        //                         //找perLayoutNodes[h]对应的layoutNodes里面的点。
        //                         for (var k = 0; k < layoutNodes.length; k++) {
        //                             if (perLayoutNodes[h].id == layoutNodes[k].id) {
        //                                 layoutNodes[k].x = perLayoutNodes[h].x;
        //                                 layoutNodes[k].y = perLayoutNodes[h].y;
        //                                 // console.log(layoutNodes[k])
        //                                 // console.log(layoutNodes[k].x)
        //                                 /**
        //                                  * 解决删点边际问题
        //                                  */
        //                                 //边界判断
        //                                 // if (Math.abs(layoutNodes[k].x - width*0.5) >= width*0.35) {
        //                                 //     layoutNodes[k].x = Math.abs(layoutNodes[k].x - width_mid) / 2;
        //                                 // }
        //                                 //
        //                                 // if (Math.abs(layoutNodes[k].y - height*0.5) >= height*0.35) {
        //                                 //     if (layoutNodes[k].y < 0) {
        //                                 //         layoutNodes[k].y = Math.abs(layoutNodes[k].y / 1.5);
        //                                 //     } else {
        //                                 //         layoutNodes[k].y = layoutNodes[k].y / 1.5;
        //                                 //     }
        //                                 // }
        //
        //                                 /**
        //                                  * D21
        //                                  */
        //
        //                                 // for (var w=0;w<layoutNodes.length;w++) {
        //                                 //     if (Math.abs(layoutNodes[w].x - perLayoutNodes[j].x) <= 0.002 * width && Math.abs(layoutNodes[w].y - perLayoutNodes[j].y) <= 0.002 * width) {
        //                                 //
        //                                 //         dis_xNeib = perLayoutNodes[j].x - layoutNodes[w].x
        //                                 //         dis_yNeib = perLayoutNodes[j].y - layoutNodes[w].y
        //                                 //
        //                                 //         neib_x = dis_xNeib * 0.2 + 1
        //                                 //
        //                                 //         // console.log(neib_x)
        //                                 //
        //                                 //         neib_y = neib_x * dis_yNeib / (dis_xNeib + 0.001);
        //                                 //         // console.log(neib_y)
        //                                 //
        //                                 //         layoutNodes[w].x = layoutNodes[w].x + neib_x;
        //                                 //         layoutNodes[w].y = layoutNodes[w].y + neib_y;
        //                                 //
        //                                 //         //边界判断
        //                                 //         if (Math.abs(layoutNodes[w].x - width*0.5) >= width*0.35) {
        //                                 //             layoutNodes[w].x = Math.abs(layoutNodes[w].x - width_mid) / 2;
        //                                 //         }
        //                                 //
        //                                 //         if (Math.abs(layoutNodes[w].y - height*0.5) >= height*0.35) {
        //                                 //             if (layoutNodes[w].y < 0) {
        //                                 //                 layoutNodes[w].y = Math.abs(layoutNodes[w].y / 1.5);
        //                                 //             } else {
        //                                 //                 layoutNodes[w].y = layoutNodes[w].y / 1.5;
        //                                 //             }
        //                                 //         }
        //                                 //
        //                                 //
        //                                 //
        //                                 //         continue;
        //                                 //     }
        //                                 // }
        //                                 break;
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //
        //
        //             /**
        //              * 多减算法
        //              */
        //             else {
        //                 var crime_gangDel = []
        //                 crime_gangDel.push(perLayoutNodes[j])
        //                 // var crime_exchange = []
        //                 // crime_gang = crime_exchange
        //                 // console.log(888888)
        //                 for (var k=0;k<perLayoutNodes[j].links.length;k++){
        //                     // console.log(typeof crime_gang)
        //                     // crime_gang = []
        //                     // console.log(perLayoutNodes[j])
        //                     // crime_exchange = Object.assign(crime_exchange,crime_gang);
        //                     // console.log(crime_exchange)
        //                     // console.log(crime_gang)
        //                     for (var h=0;h<layoutNodes.length;h++){
        //                         if (perLayoutNodes[h].id == perLayoutNodes[j].links[k]){
        //                             // console.log(perLayoutNodes[h])
        //                             // crime_gang.add(perLayoutNodes[h])
        //                             // console.log(crime_gang)
        //                             // console.log(typeof perLayoutNodes[h])
        //                             // crime_gang = Object.assign(crime_exchange,perLayoutNodes[h])
        //                             // console.log(crime_gang)
        //                             crime_gangDel.push(perLayoutNodes[h])
        //                             // console.log(crime_gang)
        //                             break;
        //                         }
        //                         // console.log(crime_gang)
        //                     }
        //
        //                 }
        //
        //                 /**
        //                  * 团伙算法
        //                  * 调用三角形质心算法来整
        //                  */
        //                     // console.log(99999)
        //                     // console.log(crime_gangDel)
        //
        //                 var polyCenter = getPolygonAreaCenter(crime_gangDel)
        //                 // console.log(polyCenter)
        //                 //    质心坐标GET NICE!!
        //
        //                 for (var k = 0;k<perLayoutNodes[j].links.length;k++){
        //                     // console.log(perLayoutNodes[j])
        //                     for (var h = 0;h<perLayoutNodes.length;h++){
        //
        //                         if (perLayoutNodes[h].id == perLayoutNodes[i].links[k]) {
        //                             node_r = 100;
        //                             node_r = node_r + perLayoutNodes[i].degree*8
        //
        //                             // console.log(88888)
        //                             dis_xDel =  polyCenter.xx - perLayoutNodes[h].x;
        //                             dis_yDel =  polyCenter.yy - perLayoutNodes[h].y;
        //
        //                             node_distance = Math.sqrt(dis_xDel*dis_xDel + dis_yDel*dis_yDel)
        //
        //
        //                             // crime_xDel = dis_xDel * 0.35;
        //                             // crime_yDel = (crime_xDel * dis_yDel) / (dis_xDel + 0.001);
        //
        //                             // console.log(perLayoutNodes[h].x)
        //
        //                             // console.log(crime_yDel)
        //                             perLayoutNodes[h].x = perLayoutNodes[h].x - (node_r/node_distance)*dis_xDel*0.2;
        //                             perLayoutNodes[h].y = perLayoutNodes[h].y - (node_r/node_distance)*dis_yDel*0.2;
        //
        //                             // console.log(perLayoutNodes[h].x)
        //
        //                             for (var m = 0;m<layoutNodes.length;m++){
        //                                 if (perLayoutNodes[h].id == layoutNodes[m].id){
        //                                     layoutNodes[m].x = perLayoutNodes[h].x
        //                                     layoutNodes[m].y = perLayoutNodes[h].y
        //
        //                                     // console.log(layoutNodes[m].x)
        //                                     // console.log(89898989)
        //                                     /**
        //                                     * D22
        //                                     */
        //                                     // for (var w=0;w<layoutNodes.length;w++) {
        //                                     //     if (Math.abs(layoutNodes[m].x - perLayoutNodes[j].x) <= 0.002 * width && Math.abs(layoutNodes[m].y - perLayoutNodes[j].y) <= 0.002 * width) {
        //                                     //
        //                                     //         dis_xNeib = perLayoutNodes[j].x - layoutNodes[m].x
        //                                     //         dis_yNeib = perLayoutNodes[j].y - layoutNodes[m].y
        //                                     //
        //                                     //         neib_x = dis_xNeib * 0.2 + 1
        //                                     //
        //                                     //         // console.log(neib_x)
        //                                     //
        //                                     //         neib_y = neib_x * dis_yNeib / (dis_xNeib + 0.001);
        //                                     //         // console.log(neib_y)
        //                                     //
        //                                     //         layoutNodes[m].x = layoutNodes[m].x + neib_x;
        //                                     //         layoutNodes[m].y = layoutNodes[m].y + neib_y;
        //                                     //
        //                                     //         continue;
        //                                     //     }
        //                                     // }
        //
        //                                     break;
        //                                 }
        //                             }
        //                             break;
        //                         }
        //                     }
        //                 }
        //             }
        //             break;
        //         }
        //     }
        // }

        /**
         * 边相连情况
         * 突然相连的边两个点 sourceArray 和 targetArray
         *
         */



        var sourceArray = [];
        var sourceLinkArray = [];
        var targetArray = [];
        var targetLinkArray = [];

        //破案了
        // addEdges.forEach(function (d){
        //     if (hashlayoutNodesID1.getValue(d.source)){
        //         sourceArray.push(hashlayoutNodesID1.getValue(d.source))
        //     }
        //     // else {
        //     //     hashlayoutNodesID1.add(d.source,blankLinkAdd(hashlayoutNodesID1.getValue(d.target),d.source))
        //     //     sourceArray.push(hashlayoutNodesID1.getValue(d.source))
        //     // }
        //
        //     if (hashlayoutNodesID1.getValue(d.source)){
        //         targetArray.push(hashlayoutNodesID1.getValue(d.target))
        //     }
        //
        //     // else {
        //     //     hashlayoutNodesID1.add(d.target,blankLinkAdd(hashlayoutNodesID1.getValue(d.source),d.target))
        //     //     sourceArray.push(hashlayoutNodesID1.getValue(d.target))
        //     // }
        //
        // })

        // console.time()

        // console.log(addAlreadyEdges)

        // sourceArray.push(addAlreadyEdges[i].source)

        // console.log(layoutNodes)
        // console.log(hashlayoutNodesID1.getValues())

        // var aer = new AER(hashlayoutNodesID1, addAlreadyEdges, width, height);
        // aer.start()

        // console.log(hashlayoutNodesID1.getValues())

        // console.log(addAlreadyEdges)

        // var tmp_nodes = []
        // tmp_nodes = function (nowData) {
        //     var result = [],
        //         hash = {};
        //     for (var i = 0, elem;
        //          (elem = nowData[i]) != null; i++) {
        //         if (!hash[elem]) {
        //             result.push(elem);
        //             hash[elem] = true;
        //         }
        //     }
        //     return result;
        //
        // }
        //
        //
        // var nodes11 = []
        // var index_of_nodes = d3.map()
        //
        // for (var i = 0;i !== tmp_nodes.length;++i){
        //     var node = {id:tmp_nodes[i]};
        //     nodes11.push(node)
        //     index_of_nodes.set(tmp_nodes[i],i)
        // }
        //
        // console.log(nodes11)

        // nowData.forEach(function (d){
        //     tmp_nodes.push(d.source)
        //     tmp_nodes.push(d.target)
        // })
        //
        // tmp_nodes = this.unique(tmp_nodes)
        // index_of_nodes = d3.map();
        //
        // tmp_nodes.sort(function compare(a,b){
        //     return a - b
        // });
        //
        // for (var i = 0;i !== tmp_nodes.length;++i){
        //     var node = {id:tmp_nodes[i]};
        //     nodes.push(node);
        //     index_of_nodes.set(tmp_nodes[i],i)
        // }

        // console.log(nodes)

        /**
         * 边变换
         */

        // var aer = new AER(hashlayoutNodesID1, addAlreadyEdges, width, height);
        // aer.start()



        // console.time()


        hashlayoutNodesID1.getValues().forEach(function (d){

            // console.log(d)
            var dict2 = {
                'id': d.id,
                'age': d.age,
                'degree': d.degree,
                'links': [].concat(d.links),
                'x': d.x,
                'y': d.y,
                'subs': d.subs
            };
             if (dict2.age > ageNumber&&dict2.degree > degreeNumber ){
                 // console.log(dict1.age)
                 // console.log(dict2)
                 mainNodes.push(dict2)
             }

        })

        var mainNodesID = []


        //0.4ms
        for (var q = 0;q<mainNodes.length;q++){
            mainNodesID.push(mainNodes[q].id)
        }

        hashlayoutNodesID1.getValues().forEach(function (d){
            if (mainNodesID.indexOf(hashlayoutNodesID1.getValue(d.id).id)== -1){
                otherNodes.push(hashlayoutNodesID1.getValue(d.id))
            }
        })
        // console.timeEnd()
        //
        //
        // console.time()


        /**
         * 注释代码1
         */

        for (var p = 0;p<layoutNodes.length;p++){
            if (mainNodesID.indexOf(layoutNodes[p].id) == -1){
                // console.log(layoutNodes[p].id)
                otherNodes.push(layoutNodes[p])
            }
        }

        // for (var p = 0;p<layoutNodes.length;p++){
        //     if (mainNodesID2.indexOf(layoutNodes[p].id) == -1){
        //         // console.log(layoutNodes[p].id)
        //         otherNodes2.push(layoutNodes[p])
        //     }
        // }
        // for (var p = 0;p<layoutNodes.length;p++){
        //     if (mainNodesID3.indexOf(layoutNodes[p].id) == -1){
        //         // console.log(layoutNodes[p].id)
        //         otherNodes3.push(layoutNodes[p])
        //     }
        // }
        //
        // otherNodes2Copy = otherNodes2;
        // otherNodes3Copy = otherNodes3;

        // layoutNodes.forEach(function (d){
        //      var dict1 = {
        //         'id': d.id,
        //         'age': d.age,
        //         'degree': d.degree,
        //         'links': [].concat(d.links),
        //         'x': d.x,
        //         'y': d.y,
        //         'subs': d.subs
        //     };
        //      miniLayout.push(dict1)
        // })
        //
        //
        // // 全部点
        // miniLayoutCopy = miniLayout;
        // // console.log(miniLayoutCopy)
        //
        // // 主干点
        // miniLayoutMainCopy = mainNodes;
        // // console.log(miniLayoutMainCopy)
        //
        // // 完全看年龄
        // miniLayoutMainCopy2 = mainNodes2;
        // mainNodes2Copy = mainNodes2;
        // // 完全看度
        // miniLayoutMainCopy3 = mainNodes3;
        // mainNodes3Copy = mainNodes3;
        // console.log(layoutNodes)

        var degreeSort = []

        // for (var i = 0;i<layoutNodes.length;i++){
        //     layoutNodes[i]['social'] = 0;
        //     degreeSort.push(layoutNodes[i].id + layoutNodes[i].degree)
        // }

        // console.log(hashlayoutNodesID1.getValues())



        // console.time(333)

        hashlayoutNodesID1.getValues().forEach(function (d){
            d = {
                'id': d.id,
                'age': d.age,
                'degree': d.degree,
                'links': [].concat(d.links),
                'x': d.x,
                'y': d.y,
                'subs': d.subs,
                'social': 0
            };
            hashlayoutNodesID1.remove(d.id)
            hashlayoutNodesID1.add(d.id,d)
        })


        hashSocial = hashlayoutNodesID1;

        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };

        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

        var linksTempSource = []
        var linksTempTarget = []


        // console.timeEnd()


        // console.time()

        /**
         * 去处附加边对社区分类的影响
         */
        addAlreadyEdges.forEach(function (d){
            // console.log(d)
            // console.log(hashSocial.getValue(d.source))
            // console.log(hashSocial.getValue(d.source).links)

            linksTempSource = hashSocial.getValue(d.source).links
            linksTempSource.remove(d.target)
            var valueSource = []

            valueSource = {
                'id': hashSocial.getValue(d.source).id,
                'age': hashSocial.getValue(d.source).age,
                'degree': hashSocial.getValue(d.source).degree - 1,
                'links': [].concat(linksTempSource),
                'x': hashSocial.getValue(d.source).x,
                'y': hashSocial.getValue(d.source).y,
                'subs': hashSocial.getValue(d.source).subs,
                'social': 0
            }

            linksTempTarget = hashSocial.getValue(d.target).links
            linksTempTarget.remove(d.source)

            var valueTarget = []
            valueTarget = {
                'id': hashSocial.getValue(d.target).id,
                'age': hashSocial.getValue(d.target).age,
                'degree': hashSocial.getValue(d.target).degree - 1,
                'links': [].concat(linksTempTarget),
                'x': hashSocial.getValue(d.target).x,
                'y': hashSocial.getValue(d.target).y,
                'subs': hashSocial.getValue(d.target).subs,
                'social': 0
            }

            hashSocial.remove(d.source)
            hashSocial.add(d.source,valueSource)
            hashSocial.remove(d.target)
            hashSocial.add(d.target,valueTarget)
        })


        // console.timeEnd()

        var k = 1;

        // console.log(hashlayoutNodesID1.getValues())
        // for (var i = 0;i<hashlayoutNodesID1.getSize();i++){
        //     console.log(hashlayoutNodesID1.getValue(i))
        //     // if (hashlayoutNodesID1.getValue(i))
        // }


        var degreeSort = []
        var linkArray = []

        var socialFinal = []
        degreeSort = hashSocial.getValues()

        degreeSort.sort(compareDegree('degree'))

        // console.log(degreeSort)

        // console.time()
        for (var i = 0;i<degreeSort.length;i ++){
            var socialArea = []
            if (degreeSort[i].social == 0){
                // degreeSort[i].social = k;
                hashSocial.getValue(degreeSort[i].id).social = k;
                socialArea.push(hashSocial.getValue(degreeSort[i].id))

                //排序里面从上到下的对象的边
                for (var j = 0;j < degreeSort[i].links.length;j++){

                    if (hashSocial.getValue(degreeSort[i].links[j]).social == 0){

                        hashSocial.getValue(degreeSort[i].links[j]).social = k;
                        socialArea.push(hashSocial.getValue(degreeSort[i].links[j]))

                        //这个是初始点的links
                        // console.log(hashlayoutNodesID1.getValue(degreeSort[i].links[j]))
                        //links的links    hashlayoutNodesID1.getValue(hashlayoutNodesID1.getValue(degreeSort[i].links[j]).id).links
                        // console.log(hashlayoutNodesID1.getValue(hashlayoutNodesID1.getValue(degreeSort[i].links[j]).id).links)


                        for (var h = 0;h < hashSocial.getValue(hashSocial.getValue(degreeSort[i].links[j]).id).links.length;h++){

                            var temp = []
                            temp = hashSocial.getValue(hashSocial.getValue(degreeSort[i].links[j]).id).links[h]
                            // if (hashSocial.getValue(temp).social == 0 && hashSocial.getValue(temp).degree < 15){
                             if (hashSocial.getValue(temp).social == 0){
                                hashSocial.getValue(temp).social = k;
                                socialArea.push(hashSocial.getValue(temp))
                            }else if (hashSocial.getValue(temp).social == 0 && hashSocial.getValue(temp).degree >= 10){
                                // console.log(hashSocial.getValue(temp))
                            }
                        }
                    }
                }
            socialFinal.push(socialArea)
            k++;
            }
            // k++;
        }

        // console.timeEnd()

        degreeSort = hashSocial.getValues()
        degreeSort.sort(compareDegree('social'))


        // console.log(socialFinal)

        // var socialArea = []
        // for (var i = 0;i < degreeSort[0].social;i++){
        //     if (degreeSort[i].social == i+1){
        //         socialArea.push(degreeSort[i])
        //     }
        // }
        //
        // console.log(socialArea)

        // console.log(hashlayoutNodesID1.getValues())

        // console.log(hashlayoutNodesID1.getValues())

        // degreeSort.sort(compareDegree('degree'))
        //
        //
        //
        //
        //
        // /**
        //  * 社区划分部分
        //  */
        // var k = 1;
        // //最大点的度 最大点degreeSort[i]
        //
        // // console.time()


        for (var i = 0;i < degreeSort.length;i++){
            if (degreeSort[i].social == 0){
                degreeSort[i].social = k;
                for (j = 0;j<degreeSort[i].links.length;j++){
                    // console.log(degreeSort[i].links[j])
                    ////最大点的link degreeSort[i].links[j]
                    for (var h = 0;h<degreeSort.length;h++){
                        //找到最大点link里面点的对象 degreeSort[h]
                        if (degreeSort[i].links[j] == degreeSort[h].id){

                            //degreeSort[h]就是hashlayoutNodesID1.getValue(degreeSort[i].links[j])
                            for (var q = 0;q<degreeSort[h].links.length;q++){
                                //二级节点 degreeSort[p]
                                for (var p = 0;p<degreeSort.length;p++){
                                    if (degreeSort[h].links[q] == degreeSort[p].id){
                                        if (degreeSort[p].social == 0){
                                            degreeSort[p].social = k;
                                        }
                                        break;
                                    }
                                }
                            }
                            if (degreeSort[h].social == 0){
                                degreeSort[h].social = k;
                            }
                            break;
                        }
                    }
                }
                k++;

            }
        }


        // // console.timeEnd()
        // clusterNode = degreeSort
        // clusterNode.sort(compareDegree('social'))
        // degreeSortCopy = degreeSort

        // console.log(degreeSort)
        // console.log(hashlayoutNodesID1.getValues())

        for (var i = 0; i < addAlreadyEdges.length; i++) {

            sourceArray.push(hashlayoutNodesID1.getValue(addAlreadyEdges[i].source))
            targetArray.push(hashlayoutNodesID1.getValue(addAlreadyEdges[i].target))

        }

        // console.log(sourceArray)
        // console.log(targetArray)


        // console.log(hashlayoutNodesID1.getValue())

        // hashlayoutNodesID1.getValues().forEach(function (d){
        //     console.log(d.degree)
        // })

        const DISNUMBER = 1.02
        //表示x的3次方
        // var aaa = Math.pow(1.02,30)
        // //
        // console.log(aaa)

        // console.log(aaa)

        // console.time()

        // console.timeEnd()

        /**
         * 版本一
         */

        // console.timeEnd(333)
        // console.time(555)
        // console.time(111)

        // for (var i = 0 ;i < sourceArray.length;i++) {
        //     // console.log(i)
        //     // console.log(hashlayoutNodesID1.getValue(addAlreadyEdges[i].source))
        //     // hashlayoutNodesID1.getValue(addAlreadyEdges[i].source)
        //     // if (hashlayoutNodesID1.getValue(addAlreadyEdges[i].source).degree == 1 || hashlayoutNodesID1.getValue(addAlreadyEdges[i].source).degree == 2)
        //     //新加入的一条边的点
        //     // console.log(hashlayoutNodesID1.getValue(addAlreadyEdges[i].source))
        //     //点的周围节点
        //     // console.log(hashlayoutNodesID1.getValue(addAlreadyEdges[i].source).links)
        //     var longDistance = 0
        //     //边的x轴长
        //     dis_edgeX = sourceArray[i].x - targetArray[i].x
        //     //边的y轴长
        //     dis_edgeY = sourceArray[i].y - targetArray[i].y
        //
        //     longDistance = Math.sqrt(dis_edgeX * dis_edgeX + dis_edgeY * dis_edgeY)
        //
        //     //895 social 26
        //     // console.log(sourceArray[i])
        //
        //     // var socialAll =
        //     //social 26的节点
        //     // console.log(socialFinal[sourceArray[i].social - 1])
        //
        //     // console.log((degreeSort[0].social/socialFinal[sourceArray[i].social - 1].length)*0.002*dis_edgeX)
        //
        //
        //     // console.log(socialFinal[sourceArray[i].social - 1])
        //     // console.log(socialFinal[targetArray[i].social - 1])
        //     // console.log(longDistance)
        //     // console.log(longDistance)
        //     // console.log(socialFinal)
        //     var trueDistance = []
        //     if (longDistance > 250) {
        //         //这个社区里面的所有点的 d
        //         //
        //         // var longdistanceX_disS = []
        //         // var longdistanceX_disT = []
        //         // var longdistanceY_disS = []
        //         // var longdistanceY_disT = []
        //         //
        //         // console.log(sourceArray[i])
        //         // console.log(targetArray[i])
        //         // console.log(targetArray[i].y)
        //         // console.log(socialFinal[sourceArray[i].social - 1])
        //         // console.log(socialFinal[targetArray[i].social - 1])
        //         // console.log(longDistance)
        //
        //
        //         // console.log(socialFinal[sourceArray[i].social - 1])
        //         for (var j = 0; j < socialFinal[sourceArray[i].social - 1].length; j++) {
        //             // console.log(socialFinal[sourceArray[i].social - 1].length)
        //             // trueDistance = longDistance * (1/Math.pow(DISNUMBER,socialFinal[sourceArray[i].social - 1].length+7))
        //             // console.log((1/Math.pow(DISNUMBER,socialFinal[sourceArray[i].social - 1].length+7)))
        //             // console.log(trueDistance)
        //
        //             x_arrow = dis_edgeX * (1/ ((Math.pow(DISNUMBER,socialFinal[sourceArray[i].social - 1].length+35)) * (Math.pow(DISNUMBER,socialFinal[sourceArray[i].social - 1].length+35))))
        //             // console.log(x_arrow)
        //
        //             // x_arrow = (Math.sqrt(longDistance) / socialFinal[sourceArray[i].social - 1].length) * 0.1*
        //             //     (Math.sqrt(socialFinal[sourceArray[i].social - 1].length + socialFinal[targetArray[i].social - 1].length)/13) * dis_edgeX
        //             // console.log(Math.sqrt(longDistance) / socialFinal[sourceArray[i].social - 1].length)
        //             // console.log((Math.sqrt(longDistance) / socialFinal[sourceArray[i].social - 1].length) * 0.15*
        //             //     (Math.sqrt(socialFinal[sourceArray[i].social - 1].length + socialFinal[targetArray[i].social - 1].length)/13))
        //
        //             y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
        //             hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).x =
        //                 hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).x - x_arrow
        //             hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).y =
        //                 hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).y - y_arrow
        //             //
        //             // longdistanceX_disS = hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).x
        //             // longdistanceY_disS = hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).y
        //         }
        //         for (var j = 0; j < socialFinal[targetArray[i].social - 1].length; j++) {
        //
        //             x_arrow = dis_edgeX * (1/ ((Math.pow(DISNUMBER,socialFinal[targetArray[i].social - 1].length+35)) * (Math.pow(DISNUMBER,socialFinal[targetArray[i].social - 1].length+35))))
        //
        //
        //             // x_arrow = Math.sqrt(longDistance) / socialFinal[targetArray[i].social - 1].length * 0.1*
        //             //     Math.sqrt(socialFinal[sourceArray[i].social - 1].length + socialFinal[targetArray[i].social - 1].length)/13 * dis_edgeX
        //
        //             // console.log(Math.sqrt(longDistance)  / socialFinal[targetArray[i].social - 1].length)
        //             // console.log(x_arrow)
        //
        //             y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
        //             // console.log(y_arrow)
        //             hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).x =
        //                 hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).x + x_arrow
        //             hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).y =
        //                 hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).y + y_arrow
        //             // longdistanceX_disT = hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).x
        //             // longdistanceY_disT = hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).y
        //         }
        //         // var longditsance1 = []
        //         // longditsance1 = Math.sqrt((longdistanceX_disS - longdistanceX_disT) * (longdistanceX_disS - longdistanceX_disT) +
        //         //     (longdistanceY_disS - longdistanceY_disT) * (longdistanceY_disS - longdistanceY_disT)
        //         // )
        //         // console.log(longditsance1)
        //         // console.log(Math.sqrt((sourceArray[i].x -targetArray[i].x) * (sourceArray[i].x -targetArray[i].x) +
        //         //     (sourceArray[i].y - targetArray[i].y) * (sourceArray[i].y - targetArray[i].y)))
        //         // console.log(longDistance)
        //         // console.log(sourceArray[i])
        //         // console.log(targetArray[i])
        //         // console.log(targetArray[i].y)
        //
        //     }
        //     else if (longDistance < 100){
        //         // var longdistanceX_disS = []
        //         // var longdistanceX_disT = []
        //         // var longdistanceY_disS = []
        //         // var longdistanceY_disT = []
        //
        //         // console.log(longDistance)
        //         for (var j = 0; j < socialFinal[sourceArray[i].social - 1].length; j++) {
        //
        //             x_arrow = (-1)*dis_edgeX * (1/ ((Math.pow(DISNUMBER,socialFinal[sourceArray[i].social - 1].length+35)) * (Math.pow(DISNUMBER,socialFinal[sourceArray[i].social - 1].length+35))))
        //             // x_arrow = (-1)*(Math.sqrt(longDistance) / socialFinal[sourceArray[i].social - 1].length) * 0.02 * dis_edgeX
        //             y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
        //             hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).x =
        //                 hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).x - x_arrow
        //             hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).y =
        //                 hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).y - y_arrow
        //             //
        //             // longdistanceX_disS = hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).x
        //             // longdistanceY_disS = hashlayoutNodesID1.getValue(socialFinal[sourceArray[i].social - 1][j].id).y
        //         }
        //         for (var j = 0; j < socialFinal[targetArray[i].social - 1].length; j++) {
        //
        //             x_arrow = (-1)*dis_edgeX * (1/ ((Math.pow(DISNUMBER,socialFinal[targetArray[i].social - 1].length+35)) * (Math.pow(DISNUMBER,socialFinal[targetArray[i].social - 1].length+35))))
        //
        //             // x_arrow = (-1)*(Math.sqrt(longDistance)  / socialFinal[targetArray[i].social - 1].length) * 0.02 * dis_edgeX
        //             y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
        //             hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).x =
        //                 hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).x + x_arrow
        //             hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).y =
        //                 hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).y + y_arrow
        //             //
        //             // longdistanceX_disT = hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).x
        //             // longdistanceY_disT = hashlayoutNodesID1.getValue(socialFinal[targetArray[i].social - 1][j].id).y
        //         }
        //
        //         // console.log(Math.sqrt((sourceArray[i].x -targetArray[i].x) * (sourceArray[i].x -targetArray[i].x) +
        //         //     (sourceArray[i].y - targetArray[i].y) * (sourceArray[i].y - targetArray[i].y)))
        //
        //         // var longditsance1 = []
        //         // longditsance1 = Math.sqrt((longdistanceX_disS - longdistanceX_disT) * (longdistanceX_disS - longdistanceX_disT) +
        //         //     (longdistanceY_disS - longdistanceY_disT) * (longdistanceY_disS - longdistanceY_disT)
        //         // )
        //         // console.log(longditsance1)
        //
        //         // if (Math.sqrt((sourceArray[i].x -targetArray[i].x) * (sourceArray[i].x -targetArray[i].x) +
        //         //     (sourceArray[i].y - targetArray[i].y) * (sourceArray[i].y - targetArray[i].y)) > 200) {
        //         //     console.log(Math.sqrt((sourceArray[i].x - targetArray[i].x) * (sourceArray[i].x - targetArray[i].x) +
        //         //         (sourceArray[i].y - targetArray[i].y) * (sourceArray[i].y - targetArray[i].y)))
        //         // }
        //     }
        // }

        // console.timeEnd(555)
        // console.timeEnd(111)

        /**
         * 版本plus
         */
        // console.time()



        // console.time(666)
        for (var i = 0; i < sourceArray.length; i++) {

            var longDistance = 0
            //边的x轴长
            dis_edgeX = sourceArray[i].x - targetArray[i].x
            //边的y轴长
            dis_edgeY = sourceArray[i].y - targetArray[i].y

            longDistance = Math.sqrt(dis_edgeX * dis_edgeX + dis_edgeY * dis_edgeY)

            // console.log(height / 5)
            if (longDistance > height / 1.5){
                // console.log(height/5)
                //
                // console.log(longDistance)

                x_arrow = 0.42 * dis_edgeX
                y_arrow = (dis_edgeY / dis_edgeX) * x_arrow

                // console.log(x_arrow)
                // console.log(sourceArray[i].x)
                sourceArray[i].x = sourceArray[i].x - x_arrow;
                // console.log(sourceArray[i].x)
                // console.log(sourceArray[i].y)
                sourceArray[i].y = sourceArray[i].y - y_arrow;
                // console.log(sourceArray[i].y)

                targetArray[i].x = targetArray[i].x + x_arrow;
                targetArray[i].y = targetArray[i].y + y_arrow;

                // console.log(x_arrow)
                hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
                hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;

                hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
                hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;

                // var newdistance = 0;
                // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
                //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
                // console.log(newdistance)

            }
            else if (longDistance > height / 2.2 && longDistance < height / 1.5) {
                // console.log(height/5)
                //
                // console.log(longDistance)

                x_arrow = 0.30 * dis_edgeX
                y_arrow = (dis_edgeY / dis_edgeX) * x_arrow

                // console.log(x_arrow)
                // console.log(sourceArray[i].x)
                sourceArray[i].x = sourceArray[i].x - x_arrow;
                // console.log(sourceArray[i].x)
                // console.log(sourceArray[i].y)
                sourceArray[i].y = sourceArray[i].y - y_arrow;
                // console.log(sourceArray[i].y)

                targetArray[i].x = targetArray[i].x + x_arrow;
                targetArray[i].y = targetArray[i].y + y_arrow;

                // console.log(x_arrow)
                hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
                hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;

                hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
                hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
                // var newdistance = 0;
                // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
                //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
                // console.log(newdistance)

            }
            else if (longDistance > height/2.5 && longDistance < height / 2.2){
                // console.log(height/5)
                //
                // console.log(longDistance)

                x_arrow = 0.25 * dis_edgeX
                y_arrow = (dis_edgeY / dis_edgeX) * x_arrow

                // console.log(x_arrow)
                // console.log(sourceArray[i].x)
                sourceArray[i].x = sourceArray[i].x - x_arrow;
                // console.log(sourceArray[i].x)
                // console.log(sourceArray[i].y)
                sourceArray[i].y = sourceArray[i].y - y_arrow;
                // console.log(sourceArray[i].y)

                targetArray[i].x = targetArray[i].x + x_arrow;
                targetArray[i].y = targetArray[i].y + y_arrow;

                // console.log(x_arrow)
                hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
                hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;

                hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
                hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
                // var newdistance = 0;
                // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
                //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
                // console.log(newdistance)
            }
            else if (longDistance > height/3.5 && longDistance < height / 2.5) {
                // console.log(height/5)
                //
                // console.log(longDistance)

                x_arrow = 0.15 * dis_edgeX
                y_arrow = (dis_edgeY / dis_edgeX) * x_arrow

                // console.log(x_arrow)
                // console.log(sourceArray[i].x)
                sourceArray[i].x = sourceArray[i].x - x_arrow;
                // console.log(sourceArray[i].x)
                // console.log(sourceArray[i].y)
                sourceArray[i].y = sourceArray[i].y - y_arrow;
                // console.log(sourceArray[i].y)

                targetArray[i].x = targetArray[i].x + x_arrow;
                targetArray[i].y = targetArray[i].y + y_arrow;

                // console.log(x_arrow)
                hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
                hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;

                hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
                hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
                // var newdistance = 0;
                // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
                //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
                // console.log(newdistance)


            }
            // if (longDistance > height/4.5 && longDistance < height / 3.5) {
            //     // console.log(height/5)
            //     //
            //     // console.log(longDistance)
            //
            //     x_arrow = 0.12 * dis_edgeX
            //     y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
            //
            //     // console.log(x_arrow)
            //     // console.log(sourceArray[i].x)
            //     sourceArray[i].x = sourceArray[i].x - x_arrow;
            //     // console.log(sourceArray[i].x)
            //     // console.log(sourceArray[i].y)
            //     sourceArray[i].y = sourceArray[i].y - y_arrow;
            //     // console.log(sourceArray[i].y)
            //
            //     targetArray[i].x = targetArray[i].x + x_arrow;
            //     targetArray[i].y = targetArray[i].y + y_arrow;
            //
            //     // console.log(x_arrow)
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;
            //
            //     hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
            //     hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
            //
            //     // var newdistance = 0;
            //     // newdistance = Math.sqrt((sourceArray[i].x - targetArray[i].x) * (sourceArray[i].x - targetArray[i].x)
            //     //     + (sourceArray[i].y - targetArray[i].y) * (sourceArray[i].y - targetArray[i].y))
            //     // console.log(newdistance)
            //
            // }
            // if (longDistance > height/5.5 && longDistance < height / 4.5){
            //     // console.log(height/5)
            //     //
            //     // console.log(longDistance)
            //
            //     x_arrow = 0.1 * dis_edgeX
            //     y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
            //
            //     // console.log(x_arrow)
            //     // console.log(sourceArray[i].x)
            //     sourceArray[i].x = sourceArray[i].x - x_arrow;
            //     // console.log(sourceArray[i].x)
            //     // console.log(sourceArray[i].y)
            //     sourceArray[i].y = sourceArray[i].y - y_arrow;
            //     // console.log(sourceArray[i].y)
            //
            //     targetArray[i].x = targetArray[i].x + x_arrow;
            //     targetArray[i].y = targetArray[i].y + y_arrow;
            //
            //     // console.log(x_arrow)
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;
            //
            //     hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
            //     hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
            //
            //     // var newdistance = 0;
            //     // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
            //     //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
            //     // console.log(newdistance)
            //
            // }


            // else if (longDistance > height/8 && longDistance < height / 6){
            //     // console.log(height/5)
            //     //
            //     // console.log(longDistance)
            //
            //     x_arrow = 0.2 * dis_edgeX
            //     y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
            //
            //     // console.log(x_arrow)
            //     // console.log(sourceArray[i].x)
            //     sourceArray[i].x = sourceArray[i].x + x_arrow;
            //     // console.log(sourceArray[i].x)
            //     // console.log(sourceArray[i].y)
            //     sourceArray[i].y = sourceArray[i].y + y_arrow;
            //     // console.log(sourceArray[i].y)
            //
            //     targetArray[i].x = targetArray[i].x - x_arrow;
            //     targetArray[i].y = targetArray[i].y - y_arrow;
            //
            //     // console.log(x_arrow)
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;
            //
            //     hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
            //     hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
            //     // var newdistance = 0;
            //     // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
            //     //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
            //     // console.log(newdistance)
            // }
            // else if (longDistance > height/12 && longDistance < height / 8){
            //     // console.log(height/5)
            //     //
            //     // console.log(longDistance)
            //
            //     x_arrow = 0.8 * dis_edgeX
            //     y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
            //
            //     // console.log(x_arrow)
            //     // console.log(sourceArray[i].x)
            //     sourceArray[i].x = sourceArray[i].x + x_arrow;
            //     // console.log(sourceArray[i].x)
            //     // console.log(sourceArray[i].y)
            //     sourceArray[i].y = sourceArray[i].y + y_arrow;
            //     // console.log(sourceArray[i].y)
            //
            //     targetArray[i].x = targetArray[i].x - x_arrow;
            //     targetArray[i].y = targetArray[i].y - y_arrow;
            //
            //     // console.log(x_arrow)
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;
            //
            //     hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
            //     hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
            //     // var newdistance = 0;
            //     // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
            //     //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
            //     // console.log(newdistance)
            // }
            // else if (longDistance > height/16 && longDistance < height / 12){
            //     // console.log(height/5)
            //     //
            //     // console.log(longDistance)
            //
            //     x_arrow = 0.8 * dis_edgeX
            //     y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
            //
            //     // console.log(x_arrow)
            //     // console.log(sourceArray[i].x)
            //     sourceArray[i].x = sourceArray[i].x + x_arrow;
            //     // console.log(sourceArray[i].x)
            //     // console.log(sourceArray[i].y)
            //     sourceArray[i].y = sourceArray[i].y + y_arrow;
            //     // console.log(sourceArray[i].y)
            //
            //     targetArray[i].x = targetArray[i].x - x_arrow;
            //     targetArray[i].y = targetArray[i].y - y_arrow;
            //
            //     // console.log(x_arrow)
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;
            //
            //     hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
            //     hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
            //     // var newdistance = 0;
            //     // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
            //     //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
            //     // console.log(newdistance)
            // }
            // else if (longDistance > height / 32 && longDistance < height / 16) {
            //     // console.log(height/5)
            //     //
            //     // console.log(longDistance)
            //
            //     x_arrow = 1.5*dis_edgeX
            //     y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
            //
            //     // console.log(x_arrow)
            //     // console.log(sourceArray[i].x)
            //     sourceArray[i].x = sourceArray[i].x + x_arrow;
            //     // console.log(sourceArray[i].x)
            //     // console.log(sourceArray[i].y)
            //     sourceArray[i].y = sourceArray[i].y + y_arrow;
            //     // console.log(sourceArray[i].y)
            //
            //     targetArray[i].x = targetArray[i].x - x_arrow;
            //     targetArray[i].y = targetArray[i].y - y_arrow;
            //
            //     // console.log(x_arrow)
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;
            //
            //     hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
            //     hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
            //     // var newdistance = 0;
            //     // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
            //     //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
            //     // console.log(newdistance)
            // }
            // else if (longDistance < height / 32){
            //     // console.log(height/5)
            //     //
            //     // console.log(longDistance)
            //
            //     x_arrow = 2*dis_edgeX
            //     y_arrow = (dis_edgeY / dis_edgeX) * x_arrow
            //
            //     // console.log(x_arrow)
            //     // console.log(sourceArray[i].x)
            //     sourceArray[i].x = sourceArray[i].x + x_arrow;
            //     // console.log(sourceArray[i].x)
            //     // console.log(sourceArray[i].y)
            //     sourceArray[i].y = sourceArray[i].y + y_arrow;
            //     // console.log(sourceArray[i].y)
            //
            //     targetArray[i].x = targetArray[i].x - x_arrow;
            //     targetArray[i].y = targetArray[i].y - y_arrow;
            //
            //     // console.log(x_arrow)
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).x = sourceArray[i].x;
            //     hashlayoutNodesID1.getValue(sourceArray[i].id).y = sourceArray[i].y;
            //
            //     hashlayoutNodesID1.getValue(targetArray[i].id).x = targetArray[i].x;
            //     hashlayoutNodesID1.getValue(targetArray[i].id).y = targetArray[i].y;
            //     // var newdistance = 0;
            //     // newdistance = Math.sqrt((sourceArray[i].x-targetArray[i].x)*(sourceArray[i].x-targetArray[i].x)
            //     //     + (sourceArray[i].y - targetArray[i].y)*(sourceArray[i].y - targetArray[i].y) )
            //     // console.log(newdistance)
            // }
        }
        // console.timeEnd(666)



        // console.timeEnd()


        var hashNowSource = new HashTable()

        nowData.forEach(function (d){
            hashNowSource.add(d.source,d)
        })

        // var hashNowTarget = new HashTable()
        //
        // nowData.forEach(function (d){
        //     hashNowTarget.add(d.target,d.target)
        // })


        // console.log(hashNowSource.getValue(d.target))
        nowDataCopy1 = nowData;
        // nowDataCopy1.forEach(function (d){
        //     if (hashNowSource.getValue(d.target)){
        //         if (hashNowSource.getValue(d.target).target == d.source && d.target == hashNowSource.getValue(d.target).source ) {
        //             // var valueRepeat = {'source':d.source,'target':d.target,'repeat':1}
        //             nowDataCopy1.remove(d)
        //         }
        //     }
        // })



        // console.timeEnd()


        var nowDataHash1 = new HashTable()

        nowDataCopy1.forEach(function (d){
            var valueFakeStr = []
            valueFakeStr = d.source + d.target
            // console.log(valueFakeStr)
            nowDataHash1.add(valueFakeStr,d)
        })

        // console.log(nowDataHash1.getValues())

        // console.timeEnd()


        // console.log(nowData)
        // console.log(nowDataCopy1)

        // console.time()

        for (var i = 0;i<nowDataCopy1.length;i++) {
            valueChange = nowDataCopy1[i].target + nowDataCopy1[i].source

            if (nowDataHash1.containsKey(valueChange)) {

                nowDataCopy1[i] = {"source": nowDataCopy1[i].source, "target": nowDataCopy1[i].target, "repeat": 1}
            }
        }

        nowLinkTest = {links:[],nodes:[]}

        var linkSource = []

        var linkTarget = []
        // console.log(nowData)
        nowDataCopy1.forEach(function (d) {
            // if (hashNowSource.getValue(d.target)){
            //     if (hashNowSource.getValue(d.target).target == d.source && d.target == hashNowSource.getValue(d.target).source ) {
            //         console.log(d)
            //         console.log(hashNowSource.getValue(d.target))
            //     }
            // }

            var value = {'source': d.source, 'target': d.target, 'value': 1}
            if (!d.repeat) {
                nowLinkTest.links.push(value)

                // console.log(hashlayoutNodesID1.getValue(d.source).x)
                // console.log(hashlayoutNodesID1.getValue(d.source).y)
                linkSource.push(hashlayoutNodesID1.getValue(d.source).x)
                linkSource.push(hashlayoutNodesID1.getValue(d.source).y)

                linkTarget.push(hashlayoutNodesID1.getValue(d.target).x)
                linkTarget.push(hashlayoutNodesID1.getValue(d.target).y)

            }
        })


        // nowLinkTest.links.push()
        // nowLinkTest.add(nowData)
        // console.log(nowLinkTest)
        // gpuDrawingData = nowData.concat(hashlayoutNodesID1.getValues())
        // console.log(hashlayoutNodesID1.getValues())

        var nodeXY = []

        hashlayoutNodesID1.getValues().forEach(function (d){
            var valueNode = {'id':d.id,'x':d.x,'y':d.y,'group':d.age}
            nodeXY.push(d.x)
            nodeXY.push(d.y)
            nowLinkTest.nodes.push(valueNode)
        })


        // var graph = []
        // graph = {links:[],nodes:[]}

        // hashlayoutNodesID1.getValues().forEach(function (d){
        //     var valueNode12 = {'name':d.id}
        //     graph.nodes.push(valueNode12)
        // })
        //
        // nowDataCopy1.forEach(function (d) {
        //     var value = {'source': d.source, 'target': d.target}
        //     if (!d.repeat) {
        //         graph.links.push(value)
        //     }
        // })


    //     var graph = {
    //     "nodes": [{"name": "111"},
    //         {"name": "222"},
    //         {"name": "333"},
    //         {"name": "444"},
    //         {"name": "nodeE"},
    //         {"name": "nodeF"}],
    //     "links": [{"source": 0, "target": 1},
    //         // {"source": 0, "target": 2},
    //         {"source": 0, "target": 3},
    //         {"source": 0, "target": 4},
    //         {"source": 0, "target": 5}]
    // };
    //
    //
    //     d3.select("#main").select("svg").remove();
    //     // d3.select("#main").select("canvas").remove()
    //
    //     console.log(graph)
    //
    //     function drawFR(graph) {
    //         // var width = 400;
    //         // var height = 300;
    //         //设置svg宽度和高度
    //         // console.log(9999999)
    //         var svg = d3.select("#main")
    //             .attr("width", width)
    //             .attr("height", height);
    //
    //
    //         console.log(graph.nodes)
    //         console.log(graph.links)
    //         //设置Force-Directed力参数
    //         var force = d3.layout.force()
    //                         //关联力会变得很强
    //                         .gravity(.05)
    //                         //连线的长度变化
    //                         .distance(300)
    //                         //负数为互斥，正数为吸引力
    //                         .charge(-100)
    //                         //活动区域
    //                         .size([width, height])
    //                         .nodes(graph.nodes)
    //                         .friction(0.8)
    //                         .links(graph.links)
    //                         .start();
    //
    //         // console.log(9999999)
    //
    //         //选择边集合
    //
    //         // console.log(9999999)
    //         var link = svg.selectAll(".link")
    //             .data(graph.links)
    //             .enter().append("line")
    //             .attr("class", "link");
    //         //选择节点集合
    //         var node = svg.selectAll(".node")
    //             .data(graph.nodes)
    //             .enter().append("g")
    //             .attr("class", "node")
    //             .call(force.drag); //响应鼠标拖拽事件
    //         //节点添加圆形图案
    //         node.append("svg:circle").attr("r", 10)
    //             .style("fill", function () {
    //                 return random_color();
    //             })
    //             .style("stroke", "#FFF").style("stroke-width", 3);
    //         node.append("text")
    //             .attr("dx", 12)
    //             .attr("dy", ".36em")
    //             .text(function (d) {
    //                 return d.name
    //             });
    //         //绑定tick事件
    //         // force11.on("tick", function () {
    //         //     link.attr("x1", function (d) {
    //         //         return d.source.x;
    //         //     })
    //         //         .attr("y1", function (d) {
    //         //             return d.source.y;
    //         //         })
    //         //         .attr("x2", function (d) {
    //         //             return d.target.x;
    //         //         })
    //         //         .attr("y2", function (d) {
    //         //             return d.target.y;
    //         //         });
    //         //     node.attr("transform", function (d) {
    //         //         return "translate(" + d.x + "," + d.y + ")";
    //         //     });
    //         // });
    //     }
    //
    //     drawFR(graph)

        // console.log(hashPerlayoutNodes.getValues())
        // console.log(hashlayoutNodesID1.getValues())

        // console.log(nowLinkTest)

        // console.timeEnd()

        // console.log(nodeXY)

        // var addNodesFather = []
        //
        // addNode.forEach(function (d){
        //     for (var i = 0;i<hashlayoutNodesID1.getValue(d).links.length;i++){
        //         addNodesFather.push(hashlayoutNodesID1.getValue(d).links[i])
        //     }
        // })
        //
        // // var addNodesAll = []
        // // addNodesAll = addNode.concat(addNodesFather)
        // //
        // // addNodesFather = this.unique(addNodesFather)
        // //
        // // // console.log(addNodesAll)
        // //
        // // var addNodesFatherLayout = []
        // // // var addNodesAllLayout = []
        // // addNodesFather.forEach(function (d){
        // //
        // //     var valueA = {'id':hashlayoutNodesID1.getValue(d).id,'x':hashlayoutNodesID1.getValue(d).x,
        // //         'y':hashlayoutNodesID1.getValue(d).y,'group':hashlayoutNodesID1.getValue(d).age}
        // //
        // //     addNodesFatherLayout.push(valueA)
        // // })
        //
        // var addAlreadyNode = []
        //
        // var addAlreadyNodes = []
        // addAlreadyEdges.forEach(function (d){
        //     addAlreadyNode.push(d.source)
        //     addAlreadyNode.push(d.target)
        // })
        //
        //
        // // addAlreadyNode = this.unique(addAlreadyNode)
        // //
        // //
        // // addAlreadyNode.forEach(function (d){
        // //     var value = {id:hashlayoutNodesID1.getValue(d).id,'x':hashlayoutNodesID1.getValue(d).x,'y':hashlayoutNodesID1.getValue(d).y,'group':hashlayoutNodesID1.getValue(d).age}
        // //     addAlreadyNodes.push(value)
        // // })
        // // console.log(addAlreadyNode)
        // // console.log(addNodesFather)
        //
        // var addNodeALL = []
        // addNodeALL = addAlreadyNode.concat(addNodesFather)
        // addNodeALL = this.unique(addNodeALL)
        //
        // // console.log(addNodeALL)
        // var addNodeAllLayout = []
        // addNodeALL.forEach(function (d){
        //     var value = {id:hashlayoutNodesID1.getValue(d).id,'x':hashlayoutNodesID1.getValue(d).x,'y':hashlayoutNodesID1.getValue(d).y,'group':hashlayoutNodesID1.getValue(d).age}
        //     addNodeAllLayout.push(value)
        // })


        // console.log(socialFinal)


        // console.timeEnd()

        // console.log()



        // var repulsion = new RepulsionAll(hashlayoutNodesID1.getValues(),nowData,width,height)
        // repulsion.start()
        // for (var i = 0;i < hashlayoutNodesID1.getValues().length;i++){
        //     console.log(hashlayoutNodesID1.getValues()[i])
        // }
        // console.log(hashlayoutNodesID1.getValues())


        /**
         * 买家秀
         * @type {*[]}
         */
        // var value0social = []
        // var value1social = []
        // var value2social = []
        // var value3social = []
        // var value4social = []
        // var value5social = []
        //
        // var social0Number = socialFinal[0].length
        // var social0Number = socialFinal[1].length
        // var social0Number = socialFinal[2].length
        // var social0Number = socialFinal[3].length
        // var social0Number = socialFinal[4].length
        // var social0Number = socialFinal[5].length
        //
        //
        //  value0social = [timeDate.toString(),socialFinal[0].length,'social0']
        // value1social = [timeDate.toString(),socialFinal[1].length,'social1']
        //  value2social = [timeDate.toString(),socialFinal[2].length,'social2']
        // value3social = [timeDate.toString(),socialFinal[3].length,'social3']
        //  value4social = [timeDate.toString(),socialFinal[4].length,'social4']
        // value5social = [timeDate.toString(),socialFinal[5].length,'social5']
        //
        // riverSocial.push(value0social)
        // riverSocial.push(value1social)
        // riverSocial.push(value2social)
        // riverSocial.push(value3social)
        // riverSocial.push(value4social)
        // riverSocial.push(value5social)
        //
        // // console.log(riverSocial)
        //
        // // console.log(socialFinal[0].length)
        // // console.log(socialFinal[1].length)
        // // console.log(timeDate)
        //
        // /**
        //  * 河流图
        //  */
        //
        // riverDraw(riverSocial)

        // console.log(addNodesAllLayout)

        // console.log(addAlreadyNodes)
        // console.log(hashlayoutNodesID1.getValue(132))

        // console.timeEnd()

        // console.log(addAlreadyEdges)

        // var addAlreadyNode = []
        //
        // var addAlreadyNodes = []
        // addAlreadyEdges.forEach(function (d){
        //     addAlreadyNode.push(d.source)
        //     addAlreadyNode.push(d.target)
        // })
        //
        // // console.log(addAlreadyNode)
        //
        // // console.log(addNode)
        // // console.log(addEdges)
        //
        // addAlreadyNode = this.unique(addAlreadyNode)
        //
        // addAlreadyNode.forEach(function (d){
        //     var value = {id:hashlayoutNodesID1.getValue(d).id,'x':hashlayoutNodesID1.getValue(d).x,'y':hashlayoutNodesID1.getValue(d).y,'group':hashlayoutNodesID1.getValue(d).age}
        //     addAlreadyNodes.push(value)
        // })

        // console.log(addAlreadyNode)
        // console.log(addAlreadyEdges)
        //
        // console.log(hashlayoutNodesID1.getValue(339))
        // console.log(hashlayoutNodesID1.getValue(7))
        // console.log(hashlayoutNodesID1.getValue(0))
        //
        // console.log(hashlayoutNodesID1.getValue(132))


        // console.log(layoutNodes)
        // console.log(addAlreadyNodes)

        // console.time()

        // console.timeEnd(2222)

        // console.timeEnd(333)



        // console.log(hashlayoutNodesID1.getValue(132))
        //addalredynode里面没有132
        // console.log(addAlreadyNode)
        // console.log(hashlayoutNodesID1.getValues())

        //这之前一共耗时在35ms左右


        // var deltaD = 0
        // var nNumber = 0
        // hashlayoutNodesID1.getValues().forEach(function (d) {
        //     // console.log(d)
        //     if (hashPerlayoutNodes.containsKey(d.id)) {
        //         value = Math.sqrt((hashlayoutNodesID1.getValue(d.id).x - hashPerlayoutNodes.getValue(d.id).x)*
        //             (hashlayoutNodesID1.getValue(d.id).x - hashPerlayoutNodes.getValue(d.id).x)+(hashlayoutNodesID1.getValue(d.id).y - hashPerlayoutNodes.getValue(d.id).y)
        //         *(hashlayoutNodesID1.getValue(d.id).y - hashPerlayoutNodes.getValue(d.id).y))
        //         valueNumber = Number(value)
        //         deltaD = Number(deltaD)
        //         deltaD = deltaD + valueNumber
        //         nNumber++
        //         // console.log(deltaD)
        //         // console.log(nNumber)
        //     }
        //     // console.log(deltaD/nNumber)
        // })
        // console.log(deltaD/nNumber)


        // var deltaU = 0
        // // var uNumber = 0
        // console.log(hashlayoutNodesID1.getValues())
        // hashlayoutNodesID1.getValues().forEach(function (d){
        //     value = Math.sqrt((hashlayoutNodesID1.getValue(d.id).disp_x*hashlayoutNodesID1.getValue(d.id).disp_x)+hashlayoutNodesID1.getValue(d.id).disp_y*hashlayoutNodesID1.getValue(d.id).disp_y)
        //     value = Number(value)
        //     deltaU = deltaU + value
        //     // console.log(value)
        // })
        // console.log(deltaU/hashlayoutNodesID1.getValues().length)


        // console.log(hashlayoutNodesID1.getValues())
        // console.log(nowData)

        d3.select("#main").select("svg").remove();
        d3.select("#main").select("canvas").remove()


        // var nodes_data = []
        // var edges_data = []
        //
        // hashlayoutNodesID1.getValues().forEach(function (d){
        //     var valueNode12 = {'name':d.id}
        //     nodes_data.push(valueNode12)
        // })
        //
        // nowDataCopy1.forEach(function (d) {
        //     var value = {'source': d.source, 'target': d.target}
        //     if (!d.repeat) {
        //         edges_data.push(value)
        //     }
        // })


        /**
         * force-direct
         * @type {HashTable}
         */
    //     var hashFr = new HashTable()
    //
    //     var subs1 = []
    //     for (i = 0;i < hashlayoutNodesID1.getValues().length;i++){
    //
    //
    //         // console.log(hashlayoutNodesID1.getValues()[i].id)
    //         var value = {
    //             'id': hashlayoutNodesID1.getValues()[i].id,
    //             'age': hashlayoutNodesID1.getValues()[i].age,
    //             'degree': hashlayoutNodesID1.getValues()[i].degree - 1,
    //             'links': hashlayoutNodesID1.getValues()[i].links,
    //             'x': hashlayoutNodesID1.getValues()[i].x,
    //             'y': hashlayoutNodesID1.getValues()[i].y,
    //             'subs': hashlayoutNodesID1.getValues()[i].subs,
    //             'subs1':i,
    //             'social': hashlayoutNodesID1.getValues()[i].social
    //         }
    //         hashFr.add(hashlayoutNodesID1.getValues()[i].id,value)
    //     }
    //
    //     // console.log(hashFr.getValues())
    //
    //     var nowDataFR = []
    //     nowData.forEach(function (d){
    //         // console.log(d)
    //         var FRSOURCE = hashFr.getValue(d.source).subs1
    //         var FRTARGET = hashFr.getValue(d.target).subs1
    //         // console.log(d)
    //         var value = {'source':FRSOURCE,'target':FRTARGET}
    //         // console.log(value)
    //         nowDataFR.push(value)
    //     })
    //
    //     // console.log(nowDataFR)
    //
    //
    //     var nodes_data = []
    //     var edges_data = []
    //     edges_data = nowDataFR
    //     // console.log(now)
    //
    //     for (var i = 0;i < hashlayoutNodesID1.getValues().length;i++){
    //         var  value = {'name':'i'}
    //         // console.log(value)
    //         nodes_data.push(value)
    //     }
    //
    //
    //     var color = d3.scale.category20();
    //     var edgeWidth = 2;
    //     var r = 4;
    //     var svg = d3.select("#main").append("svg")
    //             .attr("width", width)
    //             .attr("height", height);
    //
    //     var force = d3.layout.force()
    //             .nodes(nodes_data)
    //             .links(edges_data)
    //             .size([width, height])
    //             // .linkDistance(200)
    //             // .friction(0.8)
    //             // .charge(-500)
    //             .start();
    //
    //     //边
    //     var links = svg.selectAll("line")
    //             .data(edges_data)
    //             .enter()
    //             .append("line")
    //             .attr("marker-end", "url(#arrow)")
    //             .style("stroke", "#ccc")
    //             .style("stroke-width", edgeWidth);
	// //节点
    //     var nodes = svg.selectAll("circle")
    //             .data(nodes_data)
    //             .enter()
    //             .append("circle")
    //             .attr("r", r)
    //             .style("fill", function (d, i) {
    //                 // console.log(color(i))
    //                 return '#98df8a';
    //             })
    //
    //
    //     force.on("tick", function (d) {
    //         links.attr("x1", function (d) {
    //             var distance = Math.sqrt((d.target.y - d.source.y) * (d.target.y - d.source.y) +
    //                     (d.target.x - d.source.x) * (d.target.x - d.source.x));
    //             var x_distance = (d.target.x - d.source.x) / distance * r;
    //             return d.source.x + x_distance;
    //         }).attr("y1", function (d) {
    //             var distance = Math.sqrt((d.target.y - d.source.y) * (d.target.y - d.source.y) +
    //                     (d.target.x - d.source.x) * (d.target.x - d.source.x));
    //             var y_distance = (d.target.y - d.source.y) / distance * r;
    //             return d.source.y + y_distance;
    //         }).attr("x2", function (d) {
    //             var distance = Math.sqrt((d.target.y - d.source.y) * (d.target.y - d.source.y) +
    //                     (d.target.x - d.source.x) * (d.target.x - d.source.x));
    //             var x_distance = (d.target.x - d.source.x) / distance * r;
    //             return d.target.x - x_distance;
    //         }).attr("y2", function (d) {
    //             var distance = Math.sqrt((d.target.y - d.source.y) * (d.target.y - d.source.y) +
    //                     (d.target.x - d.source.x) * (d.target.x - d.source.x));
    //             var y_distance = (d.target.y - d.source.y) / distance * r;
    //             return d.target.y - y_distance;
    //         });
    //
    //
    //         nodes.attr("cx", function (d) {
    //             return d.x;
    //         }).attr("cy", function (d) {
    //             return d.y;
    //         });
    //
    //
    //     });




        // console.log(layoutNodes)
        // console.log(layoutNodes)


        var jsonForHAC = JSON.stringify(layoutNodes)
        // console.log(jsonForHAC)

        // console.log(typeof layoutNodes)


        //把前端计算好了的坐标位置传给后端进行HAC聚类

        // console.log(9999999999)

        $.ajax({
            type: "get",
            dataType:"json",
            url:"/element_position",
            data: {
                "nodeInformation":jsonForHAC,
            },
            contentType: "application/json",
            success:function (d){
                // console.log("OKOK")

                // console.log(typeof d)
                let jsonNodes = JSON.parse(d)

                // console.log(jsonNodes)
                // console.log(jsonNodes.nodes)
                drawHACTimeGraph(jsonNodes.nodes)



                // console.log(typeof jsonNodes)
                // let jsonTemp = d.replace('\'',' \" ')
                // let jsonNodes = JSON.parse(d)
                // console.log(jsonNodes)
                // console.log(typeof jsonNodes)
            },
            Error:function (){
                console.log("error");

            }
        });

        // console.log(otherNodes)
        // console.log(mainNodes)
        // console.log(layoutNodes)

        // drawing(otherNodes,mainNodes,layoutNodes, width, height)



        const netv = new NetV({
            container: document.getElementById('main'),
            nodeLimit: 31000,
            linkLimit: 140000,
            width:width,
            height:height,
            // backgroundColor:{r: 0.09, g: 0.09, b: 0.09, a: 0.5},

            backgroundColor:{r: 1, g: 1, b: 1, a: 0.5},


            node: {
                style: {
                    fill: {r: 1, g: 0, b: 0.9, a: 1},
                    r: 7,
                    strokeColor: {r: 0.09, g: 0.09, b: 0.09, a: 0.5},
                    strokeWidth: 1
                }
            },
            link: {
                style: {
                    strokeColor: {r: 0.8, g: 0.8, b: 0.8, a: 0.5},
                    strokeWidth: 1.2,
                    // shape: 'curve'
                }
            }
        })

        // var nowlinkTestData = NetV.Utils.transformGraphPosition(nowLinkTest,650, width/2, height/2)

        netv.data(nowLinkTest,nodeXY,linkSource,linkTarget)
        netv.draw()


    };


    this.unique = function (arr) {
        var result = [],
            hash = {};
        for (var i = 0, elem;
             (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;

    }


    // $("#realMini1").dblclick(function (){
    //     // console.log(clusterNode)
    //     drawing3(degreeSortCopy,clusterWidth,clusterHeight,timeNote1,clusterNode,colorCata)
    //     timeNote1++;
    // })
    //
    // $("#timeline_btn1").click(function (){
    //     drawing2(miniLayoutMainCopy, miniWidth, miniHeight, timeNote);
    //     timeNote++
    // })
    //
    // $("#timeline_btn2").click(function (){
    //     drawing2(miniLayoutMainCopy2, miniWidth, miniHeight, timeNote);
    //     timeNote++
    // })
    //
    // $("#timeline_btn3").click(function (){
    //
    //     drawing2(miniLayoutMainCopy3, miniWidth, miniHeight, timeNote);
    //     timeNote++
    // })

    $("#ageSelect").change(function (){
        ageNumber = ageChange()
        // alert(ageNumber)
    })

    $("#degreeSelect").change(function (){
        degreeNumber = degreeChange()
        // alert(degreeNumber)
    })


    // function drawHACTimeGraph(hacNodes){
    //     // hacNodes.nodes().forEach(function (d){
    //         hacNodes.forEach(function (d){
    //
    //             console.log(d)
    //
    //         })
    //         // console.log(hacNodes)
    //     }






    function random_color() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return color;
        }

    function blankLinkAdd(fatherNode,thisNodeID){

        thisNodeID = thisNodeID.toString()
        var str = fatherNode.id.toString()
        fatherNode.id = str.split(",")

        // console.log(thisNodeID)                 //['44'] => 44
        // console.log(fatherNode.id)
        xNode = fatherNode.x + 20
        yNode = fatherNode.y + 20
        var dict5 = {
                'id':thisNodeID,
                'age': 1,
                'degree': 1,
                'links': fatherNode.id,
                'x': xNode,
                'y': yNode,
                'subs': fatherNode.subs + 99
            };
        return dict5;
    }


    function drawingMain3(degreeSortCopy,colorCata,clusterNode){
        d3.select("#main").select("svg").remove();
         var id_index = idToIndex(degreeSortCopy);
        var svg = d3.select("#main")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        for (var i = 0; i < degreeSortCopy.length; i++) {
            // console.log(layoutNodes[i])
            svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(degreeSortCopy[i].links).enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke-width", 0.5)
                .attr("x1", degreeSortCopy[i].x)
                .attr("y1", degreeSortCopy[i].y)
                .attr("x2", function (d) {
                    return degreeSortCopy[id_index[d] - 0].x;
                })
                .attr("y2", function (d) {
                    return degreeSortCopy[id_index[d] - 0].y;
                })
                .attr("stroke", "gray")
        }

        for (var i = 1;i <= clusterNode[0].social;i++) {
            var clusterSocial = []

            for (var j = 0; j < clusterNode.length; j++) {
                if (clusterNode[j].social == i) {
                    clusterSocial.push(clusterNode[j])
                }
            }

        }
        svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(clusterSocial).enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", clusterSocial.length*1.2)
                .attr("cx", function () {
                    return clusterSocial[0].x
                })
                .attr("cy", function () {
                    return clusterSocial[0].y
                })
                .attr("id", function (d) {
                    return d.id;
                })
                .attr("fill",function (){
                    return colorCata[i]
                })
                .attr("stroke", "black")

    }

    function drawing3(degreeSortCopy,clusterWidth,clusterHeight,timeNote1,clusterNode){
        d3.select("#realMini" + timeNote1%5).select("#svg" + timeNote1%5).remove();

        var svg2 = d3.select("#realMini" + timeNote1%5)
            .append("svg")
            .attr("width",clusterWidth)
            .attr("height",clusterHeight)
            .attr("id","svg" + timeNote1%5)


        const width_linear = 4.7237
        const height_linear = 3.7

        for (var j = 0;j<degreeSortCopy.length;j++){
            degreeSortCopy[j].x = degreeSortCopy[j].x/width_linear
            degreeSortCopy[j].y = degreeSortCopy[j].y/height_linear
        }


        for (var i = 0;i < degreeSortCopy.length;i++) {
            svg2.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(degreeSortCopy).enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke", 1)
                .attr("x1", degreeSortCopy[i].x)
                .attr("y1", degreeSortCopy[i].y)
                .attr("x2", function () {
                    return degreeSortCopy[i].x
                })
                .attr("y2", function (){
                    return degreeSortCopy[i].y
                })

                .attr("stroke","gray")
        }

        // console.log(clusterNode[0].social)


        for (var i = 1;i <= clusterNode[0].social;i++){
            var clusterSocial = []

            for (var j = 0;j < clusterNode.length;j++){
                if (clusterNode[j].social == i){
                    clusterSocial.push(clusterNode[j])
                }
            }


            // console.log(colorCata)

            /**
             * 节点社区
             */
            // svg2.append("g")
            //     .attr("class", "nodes")
            //     .selectAll("circle")
            //     .data(clusterSocial).enter()
            //     .append("circle")
            //     .attr("class", "node")
            //     .attr("r", clusterSocial.length*1.2)
            //     .attr("cx", function () {
            //         return clusterSocial[0].x
            //     })
            //     .attr("cy", function () {
            //         return clusterSocial[0].y
            //     })
            //     .attr("id", function (d) {
            //         return d.id;
            //     })
            //     .attr("fill",function (){
            //         return colorCata[i]
            //     })
            //     .attr("stroke", "black")



            svg2.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(clusterSocial).enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", 2)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("id", function (d) {
                    return d.id;
                })
                .attr("fill",function (){
                    return colorCata[i]
                })
                // .attr("fill","colorCata[i]")
                .attr("stroke", "black")

        }

    }

    /**
     * miniMap
     * @param miniLayout
     * @param miniWidth
     * @param miniHeight
     */
    function drawing2(miniLayout, miniWidth, miniHeight,timeNote){

        d3.select("#minimap"+timeNote%5).select("#svg"+timeNote%5).remove();
        // console.log(layoutNodes)
        // console.log(width)
        var id_index = idToIndex(miniLayout);
        // console.log(layoutNodes)
        // console.log(id_index)
        //500: 0// 501: 1// 502: 2// 503: 3// 504: 375// 505: 4

        var svg1 = d3.select("#minimap"+timeNote%5)
            .append("svg")
            .attr("width", miniWidth)
            .attr("height", miniHeight)
            .attr("id","svg"+timeNote%5)


        const width_linear = 4.7237
        const height_linear = 3.7



        for (var j = 0;j<miniLayout.length;j++){
            miniLayout[j].x = miniLayout[j].x/width_linear
            miniLayout[j].y = miniLayout[j].y/height_linear
            // console.log(miniLayout[j].x)
        }


        for (var i = 0;i < miniLayout.length;i++) {
            svg1.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(miniLayout).enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke", 0.8)
                .attr("x1", miniLayout[i].x)
                .attr("y1", miniLayout[i].y)
                .attr("x2", function () {
                    for (var j = 0;j<miniLayout[i].links.length;j++){
                        // console.log(id_index[d.links[j]])
                        // console.log(j)
                        // console.log(n++)
                        if (id_index[miniLayout[i].links[j]]!= undefined){
                            // console.log(miniLayoutCopy[id_index[miniLayout[i].links[j]]].x/width_linear)
                            return miniLayoutCopy[id_index[miniLayout[i].links[j]]].x/width_linear
                            continue;
                        }else {
                            return miniLayout[i].x
                            continue;
                        }
                    }
                    })
                .attr("y2", function (){
                    for (var j = 0;j<miniLayout[i].links.length;j++){
                        // console.log(id_index[d.links[j]])
                        if (id_index[miniLayout[i].links[j]]!= undefined){
                            // console.log(miniLayoutCopy[id_index[miniLayout[i].links[j]]].y/height_linear)
                            return miniLayoutCopy[id_index[miniLayout[i].links[j]]].y/height_linear
                            continue;
                        }else {
                            return miniLayout[i].y
                            continue;
                        }
                    }
                })

                .attr("stroke","gray")
        }

        svg1.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(miniLayout).enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 1.0)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("id", function (d) {
                return d.id;
            })
            .attr("fill", function (d) {
                return compute(linear(d.age))
            })
            .attr("stroke", "orange")
    }

    /**
     * 多边形质心算法
     * Points就是那几个点的信息，需要包含x和y。
     */
    function getPolygonAreaCenter(points){
        // console.log(points)
        var polyCenter = {xx:0,yy:0};
        var sum_x = 0;
        var sum_y = 0;
        var sum_area = 0;
        var p1 = points[1];
        // debugger

        for (var i=2;i<points.length ;i++){
            p2 = points[i];
            area = Area(points[0],p1,p2);
            sum_area +=area;
            sum_x += (points[0].x + p1.x + p2.x) * area;
            sum_y += (points[0].y + p1.y + p2.y) * area;
            p1 = p2;
        }
        var xx = sum_x/sum_area/3;
        var yy = sum_y/sum_area/3;
        // console.log(xx);
        // console.log(yy);
        polyCenter.xx = xx;
        polyCenter.yy = yy;
        return polyCenter;
    }

    /**
     *排序算法
     */
    function compareDegree(property){
        return function (b,a){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    function find(item){
        let currNode = this.head;

        while (currNode && (currNode.data !== item)) {
            currNode = currNode.next;
        }

        return currNode;
    }

    //求质心的区域面积
    function Area(p0,p1,p2){
        var area = 0.0;
        area = p0.x*p1.y + p1.x*p2.y + p2.x*p0.y - p1.x*p0.y - p2.x*p1.y - p0.x*p2.y;
        return area/2;
    }


    function transform(initData) {
        // console.log(initData)
        var copylinks =  initData.links.map(function (item) {
            return {source: item.source, target: item.target}
        })
        // console.log(copylinks)

      return copylinks.filter(function (d) {
          // console.log(d.source != d.target)
          //true
           return d.source != d.target;
        })
    }

    function findNode(data) {
        var nodeData = new Set()
        data.forEach(function (item) {
            nodeData.add(item.source)
            nodeData.add(item.target)
        })
        // console.log(nodeData)
        //set(410){"853", "550", "924", "643", "527",…}
        return nodeData
    }

    function difference(thisSet, otherSet) {
        //初始化一个新集合，用于表示差集。
        var differenceSet = new Set();
        //将当前集合转换为数组
        var values = Array.from(thisSet);
        //遍历数组，如果另外一个集合没有该元素，则differenceSet加入该元素。
        for (var i = 0; i < values.length; i++) {
            if (!otherSet.has(values[i])) {
                differenceSet.add(values[i]);
            }
        }
        return Array.from(differenceSet)
    };

    function countArray(data) {

        // console.log(data)
        //startdata
        var nodeDict = {};
        var layoutNodes = [];
        // var idHash = new HashTable();
        data.forEach(function (item) {
            //item是每一行
            // idHash.add(item.source,item.source)
            // idHash.add(item.target,item.target)
            // console.log()
            // console.log(nodeDict)
            //{}或者{527: Array(1), 532: Array(1), 550: Array(1), 643: Array(1), 853: Array(1), 924: Array(1)}
            // console.log(nodeDict[item.source])
            //undefined或者["550"]
            // console.log(item.target)
            //550一直都是单点
            //判断nodeDict有没有，没有的话先声明一个[]用于接收，然后再把数据push进去 只执行一次就有很多
            if (nodeDict[item.source]) {
                nodeDict[item.source].push(item.target)
            } else {
                nodeDict[item.source] = [];
                nodeDict[item.source].push(item.target)
            }

            // console.log(nodeDict[item.target])
            //undefined或者["924"]
            // console.log(item.source)
            if (nodeDict[item.target]) {
                nodeDict[item.target].push(item.source)
            } else {
                nodeDict[item.target] = [];
                nodeDict[item.target].push(item.source)
            }
        });
        // console.log(idHash.getValues())
        var count = 0;

        // console.log(nodeDict[id])

        //给各点赋予属性值
        d3.selectAll(".node").each(function (d) {
            var id = d3.select(this).attr('id');
            var x = d3.select(this).attr('cx');
            var y = d3.select(this).attr('cy');
            var dict = {};
            // console.log(id)
            // console.log(id)
            dict['id'] = id;
            // console.log(nodeDict[id])
            dict['links'] = nodeDict[id];
            dict['subs'] = count;
            dict['age'] = 1;
            dict['degree'] = nodeDict[id].length;
            dict['x'] = Number(x);
            dict['y'] = Number(y);
            // dict['wdqwd'] = 798789
            layoutNodes.push(dict)
            count++;
        })

        return layoutNodes;
    }

    function countArrayNow(data,node){
        var nodeDict = {};
        var nowDataLayout = [];
        var idArray = [];
        data.forEach(function (item) {
            if (nodeDict[item.source]) {
                nodeDict[item.source].push(item.target)
            } else {
                nodeDict[item.source] = [];
                nodeDict[item.source].push(item.target)
            }
            if (nodeDict[item.target]) {
                nodeDict[item.target].push(item.source)
            } else {
                nodeDict[item.target] = [];
                nodeDict[item.target].push(item.source)
            }
        });
        var count = 0;
        node.forEach(function (d){
            var dict = {};
            dict['id'] = d;
            dict['links'] = nodeDict[d]
            dict['subs'] = count;
            dict['age'] = 1;
            dict['degree'] = nodeDict[d].length

            nowDataLayout.push(dict)
            count++;
        })
    }



    function drawing(otherNodes,mainNodes,layoutNodes, width, height) {

        // console.log(layoutNodes)
        // console.time()
        d3.select("#main").select("svg").remove();

        var id_index = idToIndex(layoutNodes);
        // console.log(id_index)
        var svg = d3.select("#main")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // console.log(svg)
        // console.log(layoutNodes)
        //{id: "500", links: Array(2), subs: 0, age: 2, degree: 2, …}

        for (var i = 0; i < layoutNodes.length; i++) {
            // console.log(layoutNodes[i])


            svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(layoutNodes[i].links).enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke-width", 0.5)
                .attr("x1", layoutNodes[i].x)
                .attr("y1", layoutNodes[i].y)
                .attr("x2", function (d) {
                        // console.log(hashlayoutNodesID11.getValue(d))
                        // console.log(layoutNodes[id_index[d] - 0])

                        return hashlayoutNodesID11.getValue(d).x
                        // return layoutNodes[id_index[d] - 0].x;

                })
                .attr("y2", function (d) {
                        return hashlayoutNodesID11.getValue(d).y
                        // return layoutNodes[id_index[d] - 0].y;

                })
                .attr("stroke", "gray")
        }

        svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(layoutNodes).enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("id", function (d) {
                return d.id;
            })
            .attr("fill", function (d) {
                // console.log(compute(linear(d.age)))
                // console.log(d.age)
                return compute(linear(d.age))
            })
            .attr("stroke", "blue")

            /**
             * 鼠标选择节点的时序特征提取触发器
             */

            // console.timeEnd()

            $(".node").mouseenter(function (){
                console.log("mouse in")
                // console.log(mainNodes)
                svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(mainNodes).enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("r", 5)
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
                    .attr("id", function (d) {
                        return d.id;
                    })
                    .attr("fill", function (d) {
                        // console.log(d.age)
                        // console.log(compute(linear(d.age)))
                        return compute(linear(d.age))
                    })
                    .attr("stroke", "red")

                svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(otherNodes).enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("r", 5)
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
                    .attr("id", function (d) {
                        return d.id;
                    })
                    .attr("fill", "black")
                    .attr("stroke", "gray")
            });



    }

    function drawingCopy(otherNodes,mainNodes,layoutNodes, width, height) {

        d3.select("#main").select("svg").remove();

        var id_index = idToIndex(layoutNodes);
        var svg = d3.select("#main")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // console.log(svg)
        // console.log(layoutNodes)
        //{id: "500", links: Array(2), subs: 0, age: 2, degree: 2, …}

        for (var i = 0; i < layoutNodes.length; i++) {
            // console.log(layoutNodes[i])
            svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(layoutNodes[i].links).enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke-width", 0.5)
                .attr("x1", layoutNodes[i].x)
                .attr("y1", layoutNodes[i].y)
                .attr("x2", function (d) {
                    return layoutNodes[id_index[d] - 0].x;
                })
                .attr("y2", function (d) {
                    return layoutNodes[id_index[d] - 0].y;
                })
                .attr("stroke", "gray")
        }

        svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(layoutNodes).enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("id", function (d) {
                return d.id;
            })
            .attr("fill", function (d) {
                // console.log(compute(linear(d.age)))
                // console.log(d.age)
                return compute(linear(d.age))
            })
            .attr("stroke", "blue")

            /**
             * 鼠标选择节点的时序特征提取触发器
             */

            $(".node").mouseenter(function (){
                console.log("mouse in")
                svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(mainNodes).enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("r", 5)
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
                    .attr("id", function (d) {
                        return d.id;
                    })
                    .attr("fill", function (d) {
                        // console.log(d.age)
                        return compute(linear(d.age))
                    })
                    .attr("stroke", "red")

                svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(otherNodes).enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("r", 5)
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
                    .attr("id", function (d) {
                        return d.id;
                    })
                    .attr("fill", "black")
                    .attr("stroke", "gray")
            });

    }

    function idToIndex(layoutNodes) {
        var idIndex = {};
        layoutNodes.forEach(function (d) {
            idIndex[d.id] = d.id;
        })
        return idIndex;
    }


    /**
 * js HashTable哈希表实现
 * 参数及方法说明：
 * 函数名				|说明				|	返回值
 * ---------------------|-------------------|----------
 * add(key,value)		|添加项				|无
 * ----------------------------------------------------
 * getValue(key)		|根据key取值			|object
 * ----------------------------------------------------
 * remove(key)			|根据key删除一项		|无
 * ----------------------------------------------------
 * containsKey(key)		|是否包含某个key		|bool
 * ----------------------------------------------------
 * containsValue(value)	|是否包含某个值		|bool
 * ----------------------------------------------------
 * getValues()			|获取所有的值的数组	|array
 * ----------------------------------------------------
 * getKeys()			|获取所有的key的数组	|array
 * ----------------------------------------------------
 * getSize()			|获取项总数			|int
 * ----------------------------------------------------
 * clear()				|清空哈希表			|无
 */
    function HashTable() {
        var size = 0;
        var entry = new Object();
        this.add = function (key, value) {
            if (!this.containsKey(key)) {
                size++;
            }
            entry[key] = value;
        }
        this.getValue = function (key) {
            return this.containsKey(key) ? entry[key] : null;
        }
        this.remove = function (key) {
            if (this.containsKey(key) && (delete entry[key])) {
                size--;
            }
        }
        this.containsKey = function (key) {
            return (key in entry);
        }
        this.containsValue = function (value) {
            for (var prop in entry) {
                if (entry[prop] == value) {
                    return true;
                }
            }
            return false;
        }
        this.getValues = function () {
            var values = new Array();
            for (var prop in entry) {
                values.push(entry[prop]);
            }
            return values;
        }
        this.getKeys = function () {
            var keys = new Array();
            for (var prop in entry) {
                keys.push(prop);
            }
            return keys;
        }
        this.getSize = function () {
            return size;
        }
        this.clear = function () {
            size = 0;
            entry = new Object();
        }
    }


}
