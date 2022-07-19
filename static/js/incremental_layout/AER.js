/**
 *AER(Additional Edge Resizing)
 * 针对增量式布局中，添加边后，我们重新
 * 调整节点的位置和边的长度
 * **/
function AER(hashlayoutNodesID1,addAlreadyEdges,width,height){

	// console.log(hashlayoutNodesID1.getValues())
	//排序后的各点信息 包括id age degree xy
	var nodes = [];
	var id_index;
	//平均分布
	var k = parseInt(Math.sqrt(width*height/hashlayoutNodesID1.getSize())), a = 3 , b = 2;
	// console.log(k)
	//55 恒定
	this.start = function(){
		this.nodePos();
	}

	this.nodePos = function(){
		// console.log(layoutNodes)87 
        // id_index = idToIndex(layoutNodes);
        // console.log(id_index)
		//单纯的索引

		// console.log(addEdges)
		// console.log(layoutNodes)
		var edgesOrder = this.edgeLengthOrder(addAlreadyEdges);

		// console.log(edgesOrder)
		//先计算最长的边，然后依次计算
        // console.log('添加的边：');
		// console.log(addEdges, edgesOrder);
		edgesOrder.forEach(function(d) {
			// console.log(d)
			//{source: '593', target: '564'} 30余个这样的

			// console.log(id_index[d.target])
			//就是这个点的target是ID顺序第**个 55 49
			// console.log(layoutNodes[id_index[d.target] - 0].x)
			// console.log(9999)
			// console.log(layoutNodes[id_index[d.source] - 0].x)
			var x1 = hashlayoutNodesID1.getValue(d.target).x - hashlayoutNodesID1.getValue(d.source).x
			// console.log(x1)

			// var x1 = layoutNodes[id_index[d.target] - 0].x - layoutNodes[id_index[d.source] - 0].x;
			// console.log(x1)
			//457 -131 -370 一些值

			var y1 = hashlayoutNodesID1.getValue(d.target).y - hashlayoutNodesID1.getValue(d.source).y

			// var y1 = layoutNodes[id_index[d.target] - 0].y - layoutNodes[id_index[d.source] - 0].y;
			var edgeLength = Math.sqrt(x1 * x1 + y1 * y1);

			// console.log(edgeLength)
			// console.log(edgeLength) 勾股定理 求边长用的参数
			//经过处理后的edgelength值	这个就是边长******

			// console.log(layoutNodes[id_index[d.target] - 0].degree)
			// console.log(layoutNodes[id_index[d.source] - 0].degree)

			//子节点的度/(子+父)度 根据他的度的值来决定线的长还是短 分布的好看与否
			// console.log(layoutNodes[id_index[d.target] - 0])
			// console.log(layoutNodes[id_index[d.target] - 0].degree)
			var degreeScale = hashlayoutNodesID1.getValue(d.target).degree / (hashlayoutNodesID1.getValue(d.source).degree + hashlayoutNodesID1.getValue(d.target).degree)
			// console.log(degreeScale)
			/**
			 * 上面计算两个点的斜线的长
			 * @type {number}
			 */

			// console.log(b*k/edgeLength)
			//0.8*(1-0.8*51/线的长度)
			w = a * (1 - b * k / edgeLength) * degreeScale;
			// w = a*(1 - b*k/edgeLength)*degreeScale+3;
			// console.log(w)
			//1 左右的数 一个系数
			// console.log(x1)

			//坐标有误差 误差怎么来的？
			// console.log(layoutNodes)
			// console.log(layoutNodes[id_index[d.source]])
			// console.log(layoutNodes[id_index[d.source]].x)
			// console.log(w*x1)
			hashlayoutNodesID1.getValue(d.source).x = w * x1 + hashlayoutNodesID1.getValue(d.source).x;
			// console.log(layoutNodes[id_index[d.source]])
			// console.log(layoutNodes[id_index[d.target] - 0])
			// console.log(layoutNodes[id_index[d.source] - 0].x)
			hashlayoutNodesID1.getValue(d.source).y = w * y1 + hashlayoutNodesID1.getValue(d.source).y;

			hashlayoutNodesID1.getValue(d.target).x = -w * x1 + hashlayoutNodesID1.getValue(d.target).x;
			hashlayoutNodesID1.getValue(d.target).y = -w * y1 + hashlayoutNodesID1.getValue(d.target).y;

			// console.log(layoutNodes[id_index[d.target] - 0])
			// console.log(layoutNodes[id_index[d.target] - 0].y)
		})
	}

    //将边按长度的大小顺序排序，大的在前，小的在后
    this.edgeLengthOrder = function(edges){
		// console.log(edges)
    	var edgeOrder = [];
    	var lengthArray = [];
    	var lengtDict = {};

    	edges.forEach(function(d){
    		// console.log(layoutNodes)
    		// // // console.log(id_index)
			// // // console.log(d.target)
			// // // console.log(layoutNodes[158])
    		// // // console.log(layoutNodes[158].x)
			// // // console.log(layoutNodes[id_index[d.source] - 0])
			// console.log(layoutNodes[3])
			// // console.log(layoutNodes[1].disp_x)
			// console.log(layoutNodes[3].x)
			// console.log(layoutNodes[3].y)
			// console.log(layoutNodes[id_index[d.target] - 0])
			// console.log(layoutNodes[id_index[d.target] - 0].x)

			//d 对每一个 153 412 id_index就是一个hash
			// console.log(d)
			// console.log(layoutNodes[id_index[d.target] - 0])

			// console.log(d)
    	  var x1 = hashlayoutNodesID1.getValue(d.target).x - hashlayoutNodesID1.getValue(d.source).x;
		  var y1 = hashlayoutNodesID1.getValue(d.target).y - hashlayoutNodesID1.getValue(d.source).y;
		  //勾股定理 求tag sou两点的距离
		  var edgeLength = Math.sqrt(x1*x1 + y1*y1);
		  lengtDict[edgeLength] = d;
		  lengthArray.push(edgeLength);
		  // console.log(edgeLength)
    	})
		// console.log(lengthArray)
    	//根据edge的长度进行排序，降序排列
    	lengthArray.sort(function compare(a,b){ return b - a});
    	for (var i = 0; i < lengthArray.length; i++) {
    		edgeOrder[i] = lengtDict[lengthArray[i]];

    	}
    	// console.log(edgeOrder)
        return edgeOrder;
    }

    function idToIndex(layoutNodes) {
        var  idIndex = {};
        // console.log(idIndex)
        layoutNodes.forEach(function (d) {
            idIndex[d.id] = d.subs;
        })
		// console.log(idIndex)
		//500: 0, 501: 1, 502: 2, 503: 3
        return idIndex;
    }
}
