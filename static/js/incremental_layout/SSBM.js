/**
 * SSBM((Sorted Sequential Barycenter Merging)
 * 在增量式布局中，确定添加节点
 * 的先后顺序，并用改进的质心算法
 * 确定添加节点的位置。
 * **/
function SSBM(layoutNodes, addNodes, width, height) {

    var k = parseInt(Math.sqrt(width*height/layoutNodes.length)*3);
    // console.log(layoutNodes.length)
    // console.log(k)
	//154 152 150....
	var nodesArrayCopy1 = [];
	var id_index ;



	this.start = function() {
		// console.time()

     var nodeOrder;
     nodeOrder = this.nodesOrder();
     // console.log(nodeOrder)
		//35 {id: "504", count: 1, nodes: Array(1)}
     this.nodesPos(nodeOrder, nodesArrayCopy1)

		// console.timeEnd()
	}

	this.nodesOrder = function() {
		// console.time(333)
		// console.log(layoutNodes)

		//On
        id_index = idToIndex(layoutNodes);
		// console.timeEnd()
        // console.log(id_index)

		// console.log(id_index)
		var nodesArray = [];
		var nodesDict;
		var nodeCount;
		var nodeOrder = [];
		var addNodesArray = [];

		//addNodes知道他的source或者target 可以就直接加入进去了
		var addNodesCopy = [].concat(addNodes);
		var nodesDictCopy;

		// console.log(addNodes)
		// console.log(addNodesCopy)

		// console.log(layoutNodes)

		//On
		layoutNodes.forEach(function(d) {
			//原来的纯点集
			nodesArray.push(d.id);
		})

		var nodesArrayHash = new HashTable()

		layoutNodes.forEach(function (d){
			nodesArrayHash.add(d.id,d.id)
		})

		// console.log(nodesArrayHash.getValues())

		// console.log(nodesArray)
		// console.log(nodesArrayHash.getValues())

		// console.log(nodesArray)
		nodesArrayCopy1 = [].concat(nodesArrayHash.getValues());

		// console.log(nodesArrayCopy1)

		// console.log(nodesArrayHash.getValues())
		// console.log(addNodesArray)
		// console.log(nodesArrayCopy1)
		// console.time()
		addNodes.forEach(function(d){
			// console.log(d)
			//nodesArrayHash是过去的纯点集
			if (!nodesArrayHash.containsKey(d.source)){
				// console.log(d)
				addNodesArray.push(d.source)
			}

			if (!nodesArrayHash.containsKey(d.target)){
				addNodesArray.push(d.target)
			}

			//就是没有的点？然后把它们push进去
			// if(nodesArray.indexOf(d.source) == -1){
			// 	console.log(d)
			// 	addNodesArray.push(d.source);
			// }
			// console.log(addNodesArray)
			// if(nodesArray.indexOf(d.target) == -1){
			// 	addNodesArray.push(d.target);
			// }
		})

		// console.timeEnd()
		//新增的节点
		// console.time()

		// console.time()
		// console.log(addNodesArray)

		//剔除重复的点 417 304等
        addNodesArray = this.unique(addNodesArray);

		// console.log(addNodesArray)
		// console.timeEnd()
		// console.log(addNodesArray)
		// console.log('新增节点：', addNodesArray)


		// console.timeEnd(333)
		// console.log(addNodes)
		// console.time(222)

		// console.time(333)

		while(1) {
			// console.log(nodesArray)
			nodeCount = [];
			nodesDict = {};
			nodesDictCopy = {};
			// console.time()
			// console.log(addNodes)
			// console.log(addNodesCopy)


			// console.time(444)
			addNodesCopy.forEach(function(d) {
				//首先传进来一堆的{source：“123”，target：“456”的对子}
				// console.log(d)
				// console.log(nodesArray.indexOf(d.source))
				// console.log(nodesDict[d.source])
				//undefined 或者 0

				// console.log(nodesDict)
				////nodesArrayHash是过去的纯点集
				// if (!nodesArrayHash.containsKey(d.source)&&!nodesArrayHash.containsKey(d.target)){
				//
				// // if(nodesArray.indexOf(d.source) == -1 && nodesArray.indexOf(d.target) == -1) {
				// // 	console.log(d)
				// 	if(!nodesDict[d.source]) {
				// 		nodesDict[d.source] = 0;
				// 	}
				// 	if(!nodesDict[d.target]) {
				// 		nodesDict[d.target] = 0;
				// 	}
				// }

				// console.log(nodesDict)
				// console.log(nodesDictCopy)
				////nodesArrayHash是过去的纯点集

				//d是对子
				if (nodesArrayHash.containsKey(d.source) && !nodesArrayHash.containsKey(d.target)) {

					//先看这个点之前有没有点住过
					if (nodesDict[d.target]) {
						//有人住过就加床铺
						nodesDict[d.target]++;
						//然后把这个入住信息加入到这个房间
						nodesDictCopy[d.target].push(d.source);
					}
					//没有人住过 所以先把这个房间开启
					else {
						nodesDict[d.target] = 1;
						nodesDictCopy[d.target] = [];
						//加入入住名单
						nodesDictCopy[d.target].push(d.source);
					}
				}

				if (!nodesArrayHash.containsKey(d.source) && nodesArrayHash.containsKey(d.target)) {

					if (nodesDict[d.source]) {
						nodesDict[d.source]++;
						nodesDictCopy[d.source].push(d.target);
					} else {
						nodesDict[d.source] = 1;
						nodesDictCopy[d.source] = [];
						nodesDictCopy[d.source].push(d.target);
					}
				}

				// console.log(nodesDict[d.target])
				// console.log(nodesDict[d.source])
				//	要么undefined 要么 1 少有到2的
				// console.log(nodesDict)
				//	相当于一个占位符？ 就是这个点后面有几个关联的
				//	相当于客房入住统计
				// 	console.log(nodesDictCopy)
			})
			// console.timeEnd(444)

			// console.timeEnd()
			// console.log(nodesDict)
			// 504: 1 507:1  .... 556:0  0为source 1为target
			// console.log(nodesDictCopy)
			//504: ['987']   507: ['759']
			// console.time()
			// var nodeCountHash = new HashTable()
			//
			// // nodeCount.forEach(function (d){
			// // 	nodeCountHash.add(d,d)
			// // })
			//
			// for (var head in nodesDict){
			// 	nodeCountHash.add(nodesDict[head],nodesDict[head])
			// }
			// console.log(nodeCountHash.getValues())
			//
			//
			// console.log(nodesDict)
			// var nodesCountHash = new HashTable()
			//
			// for (var head in nodesDict){
			// 	nodesCountHash.add()
			// }



			for(var head in nodesDict) {
				// console.log(nodesDict[head])
				nodeCount.push(nodesDict[head]);
			}

			// console.log(nodesDict)

			//把每一间客房的入住人数统计出来
			// console.log(nodeCount)

			// console.log(nodeCount)
			// console.timeEnd()
			// console.log(nodeCount)
			// [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] 递减 最高35
			// console.log(nodeCount)
			// console.log(nodeCount)
			// console.log(nodeCountHash.getValues())

			// console.log(nodeCount)

			//通过这个函数 把2全部挪到前面
			//根据新增节点与已存在的节点的连接的度的大小顺序（降序）
			nodeCount.sort(function compare(a, b) {
				return b - a
			});

			// console.log(nodeCount)

			// console.log(nodeCount)
			// console.log(nodesDict[0])

			//选择count最大的节点
			// console.time()


			// for (var head in )


			// console.log(nodesDict)
			// console.log(nodeCount[0])
			for(var head in nodesDict) {
				//这个head就是nodesDict里面的 id 相当于客房号
				// console.log(head)
				// console.log(nodesDict[head])

					//先把入住人数最多的房间找到
               	 if(nodesDict[head] == nodeCount[0]) {
					nodeOrder.push({"id":head, "count":nodeCount[0], "nodes":nodesDictCopy[head]})
					// 纯点集
					nodesArray.push(head);
					// console.log(nodesArray)
					break;
				 }
			}

			// console.log(nodesArray)
			// console.timeEnd()
			// console.log(nodeOrder)

            var addNodesCopy_i = 0;
            var delete_i = [];

            // console.log(addNodes)

			//对子
            addNodesCopy.forEach(function(d){
            	// console.log(d)
				// console.log(addNodesCopy_i)
				//这里的nodesArray是不断增长的
            	if(nodesArray.indexOf(d.source) > -1 && nodesArray.indexOf(d.target) > -1) {
            		// console.log(addNodesCopy_i)
            		delete_i.push(addNodesCopy_i);
				}
            	addNodesCopy_i++;
            })
			// console.log(delete_i)

            var number = 0
			// console.log(delete_i.length)

            for (var i = 0; i < delete_i.length; i++) {
            	number = delete_i[i] - i;
            	// console.log(number)
				//可删除从 index 处开始的零个或多个元素
            	addNodesCopy.splice(number,1);
            }

            // console.log(nodeOrder)

			if(nodeOrder.length == addNodesArray.length) {
				break;
			}

		}
		// console.timeEnd(333)

		// console.log(nodeOrder)
			  // {id: "504", count: 1, nodes: Array(1)}

		// console.timeEnd()
		return nodeOrder;
	}



    this.nodesPos = function(nodeOrder, nodesArrayCopy){
		// console.log(nodesArrayCopy)
       // console.log('新增节点顺序',nodeOrder)
    	     /**
        	 * degree:节点的度
        	 * index:节点的类别
        	 * **/


        nodeOrder.forEach(function(d){
        	// console.log(layoutNodes.length)
        	var subs =  layoutNodes.length - 1;
        	layoutNodes[subs + 1] = {'degree': 0, 'id': d.id, 'links': [], 'x': 0, 'y': 0,'age': 1, 'subs': subs + 1};
        	// console.log(layoutNodes[subs+1])
            id_index = idToIndex(layoutNodes);

            // console.log(id_index)
        	var x1 = Math.random(), y1 = Math.random();
        	// console.log(d)
			//{id: "504", count: 1, nodes: Array(1)}

			// console.log(d)

			// console.log(subs)
			// console.log(d)
			// console.log(id_index[d.id])


			console.log(d.count)

			//d.count是这个点的source 点的多少
        	//计算node的x，y
        	if(d.count >= 2){

        		// console.log(d.nodes)
				//source点的名称
        		var center_x = 0, center_y = 0;
        		for(var i = 0; i < d.nodes.length; i++){
        			// console.log(layoutNodes[id_index[d.nodes[i]] - 0])
					//就是source单独点的信息 {id: "840", links: Array(3), subs: 239, age: 1, degree: 3,…}
        			center_x += layoutNodes[id_index[d.nodes[i]] - 0].x;
        			center_y += layoutNodes[id_index[d.nodes[i]] - 0].y;
        		}
        		// console.log(d.count)
        		center_x = (1/d.count)*center_x;
        		center_y = (1/d.count)*center_y;

        		layoutNodes[id_index[d.id] - 0].x = center_x + 0.05*k*x1;
        		layoutNodes[id_index[d.id] - 0].y = center_y + 0.05*k*y1;

        	}else if(d.count == 1){
        		// console.log(d.nodes)
        		var center_x = 0, center_y = 0;
        		center_x += layoutNodes[id_index[d.nodes[0]] - 0].x;
        		center_y += layoutNodes[id_index[d.nodes[0]] - 0].y;
        		layoutNodes[id_index[d.id] - 0].x = center_x + 0.5*k*x1;
        		layoutNodes[id_index[d.id] - 0].y = center_y + 0.5*k*y1;

        	}else{
        		// console.log(d.nodes)
        		var random_x = 4*width/5 - 100*x1;
        		var random_x1 = width/5 + 100*x1;
        		var node_x = 0;
        		if(Math.random() >= 0.5){
                    node_x = random_x
				}else{
                    node_x = random_x1;
				}
        		layoutNodes[id_index[d.id] - 0].x = node_x;
        		layoutNodes[id_index[d.id] - 0].y = height*y1;
        	}

        	// console.log(center_x)


        	//相应的改变layoutNodes
        	addNodes.forEach(function(n){
        		// console.log(d.id)
				//添加的点
				// console.log(n.source)
				// console.log(n)
				// source target的{}
				// console.log(layoutNodes[id_index[n.source] - 0])
        		if(d.id == n.source){
        			// console.log(nodesArrayCopy.indexOf())
        			if(nodesArrayCopy.indexOf(n.source) > -1){
        				layoutNodes[id_index[n.source] - 0].links.push(d.id);
        				layoutNodes[id_index[n.source] - 0].degree++;
        			}
        			layoutNodes[id_index[d.id] - 0].index = d.id - 1;
        			layoutNodes[id_index[d.id] - 0].degree++;
        			layoutNodes[id_index[d.id] - 0].links.push(n.target);
        		}
        		if(d.id == n.target){
        			// console.log(layoutNodes[id_index[d.id] - 0].index)
        			if(nodesArrayCopy.indexOf(n.target) > -1){
        				layoutNodes[id_index[n.target] - 0].links.push(d.id);
        				layoutNodes[id_index[n.target] - 0].degree++;
        			}
        			layoutNodes[id_index[d.id] - 0].index = d.id;
        			layoutNodes[id_index[d.id] - 0].degree++;
        			layoutNodes[id_index[d.id] - 0].links.push(n.source);
        		}
        	})
        })

    }

	this.unique = function(arr) {
        return  Array.from(new Set(arr));
	}

     function idToIndex(layoutNodes) {
        var  idIndex = {};
        layoutNodes.forEach(function (d) {
            idIndex[d.id] = d.subs;
        })
        return idIndex;
    }
}



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