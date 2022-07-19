/**
 * 针对于图分区的
 * LPA算法改进版
 * layoutNodes中在
 * index属性表示类别标签label
 * ***/
function LPA(layoutNodes){
    var id_index;
	this.start = function(){
		
		this.labelTransform();
		this.nodeDegree();//计算节点的度
	}
	
	this.labelTransform =function(){
	
	 var threshold = layoutNodes.length*0.05;
	 var j = 0;

	 while(1){
	 	
	   var count = 0;
	   for (var i = 0; i < layoutNodes.length; i++) {
	   	var nodeLabel = this.labelMax(layoutNodes[i].links, i+1)
	   	if(layoutNodes[i].index != nodeLabel){
	   	   count++;	
	   	}
	 	   layoutNodes[i].index = nodeLabel;
	   }
	  // console.log(j++)
	    //当只有不足5%的节点改变其label时，我们停止算法迭代	
	   if(count < threshold){
	   	 break;
	   }   
	 } 
	}
	//获取此节点邻居标签，找到出现次数最大标签，若出现次数最多标签不止一个，则选择一个距离最近的节点标签替换成此节点标签
	this.labelMax =function(links,nodeId){
		var index = 0;
		var labelAndId = {};
		var labeled = [];
		var res = {};
        id_index = idToIndex();
		for(var i = 0; i < links.length; i++){

			//console.log(id_index[links[i]]+"+++++++++++++++++++",links[i])
			labeled[i] = layoutNodes[id_index[links[i]] - 0].index;
			//同一label下的节点Id
			if(labelAndId[labeled[i]]){
				labelAndId[labeled[i]].push(links[i]);
			}else{
				labelAndId[labeled[i]] = [];
				labelAndId[labeled[i]].push(links[i]);
			}
		}
		//console.log(labelAndId)
		labeled.sort();//从小到大排序
		//console.log(labeled)
		var max = 0;
		for(var i = 0; i < labeled.length;){
			 var count = 0;
			 for(var j = i; j < labeled.length; j++){
			 	if(labeled[i] == labeled[j]){
			 		count++;
			 	}
			 }
			 if(count > max){
			 	max = count;
			 }
			 if(res[count]){
			 	res[count].push(labeled[i])
			 }else{
			 	res[count] = []
			 	res[count].push(labeled[i])
			 }
			 //res[labeled[i]] = count;
			 i += count;
		}
	//	console.log(max);
		//出现次数最多标签不止一个，则选择一个距离最近的节点组标签替换成此节点标签
		if(res[max].length > 1){
			var record = 0;
			var distance_node= [];
			var min_dis = 999999999;
		   	for(var i = 0; i < res[max].length; i++){
		   		var label = res[max][i];
		   		var nodeIds = labelAndId[label];
		   		distance_node[i] = this.distance(nodeId,nodeIds);
		   		if(distance_node[i] < min_dis){
		   			min_dis = distance_node[i];
		   			record = label;
		   		}
		   		
		   	}
		   index = record;
		 // console.log(index); 	
		}else{
		   index = res[max][0];
		 //  console.log(index);
		}
		
		return index;
	}
    
    this.distance = function(sourceId,targetId){
    	var res_dis = 0;
    	for (var i = 0; i < targetId.length; i++) {
    		var dis_x = layoutNodes[id_index[targetId[i]] - 0].x - layoutNodes[id_index[sourceId] - 0].x;
    		var dis_y = layoutNodes[id_index[targetId[i]] - 0].y - layoutNodes[id_index[sourceId] - 0].y;
    		var dis_node = Math.sqrt(dis_x*dis_x + dis_y*dis_y);
    		res_dis += dis_node;
    	}
    	return res_dis;
    }
    this.nodeDegree = function(){
    	layoutNodes.forEach(function(d){
    		d.degree = d.links.length;
    	})
    }

    function idToIndex() {
        var  idIndex = {};
        layoutNodes.forEach(function (d) {
            idIndex[d.id] = d.subs;
        })

        return idIndex;
    }

}
