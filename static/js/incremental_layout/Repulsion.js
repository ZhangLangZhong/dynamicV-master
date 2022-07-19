function Repulsion(layoutNodes, addData, width, height) {
    var id_index ;
	var changeNodesArray = [];
	var labelDict = {};
	var k = 14,
		β = 0.1,
		t = 10;
	this.start = function() {
		this.repulsion();
	}
	this.repulsion = function() {
		console.log(layoutNodes)
        id_index = idToIndex();
        layoutNodes.forEach(function(d) {
			changeNodesArray.push(d.id);
			//changeNodesArray.push(d.target);
		})
		changeNodesArray = this.unique(changeNodesArray);
		var label = [];
		layoutNodes.forEach(function(d) {
			if(labelDict[d.index]) {
				labelDict[d.index].push(d.id);
			} else {
				labelDict[d.index] = [];
				labelDict[d.index].push(d.id);
			}
		})
		for(var head in labelDict) {
			label.push(head);
		}
		//console.log(label, labelDict)
		for(var iteration_count = 0; iteration_count < 20; iteration_count++) {

			for(var i = 0; i < changeNodesArray.length; i++) {
				var pos_x = layoutNodes[id_index[changeNodesArray[i]] - 0].x;
				var pos_y = layoutNodes[id_index[changeNodesArray[i]] - 0].y;
				var nodeLabel = layoutNodes[id_index[changeNodesArray[i]] - 0].index;
				var Fr_partion = 0,
					Fr_nodes = 0,
					Fr_total = 0,
					Fa_nodes = 0,
					F_total;
		
				/***计算节点的总排斥力（需要移动的节点）***/
				for(var head in labelDict) {
					if(head != nodeLabel) {

						var gravity_partion_x = 0,
							gravity_partion_y = 0;
						for(var n = 0; n < labelDict[head].length; n++) {
							var partion_id = labelDict[head][n];
							gravity_partion_x += layoutNodes[id_index[partion_id] - 0].x;
							gravity_partion_y += layoutNodes[id_index[partion_id] - 0].y;
						}
						gravity_partion_x = gravity_partion_x / labelDict[head].length;
						gravity_partion_y = gravity_partion_y / labelDict[head].length;

						var disp_x = pos_x - gravity_partion_x;
						var disp_y = pos_y - gravity_partion_y;
						var distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);
						Fr_partion += k * k * (labelDict[head].length) * (disp_x + disp_y) / (distance * distance);
						
					} else {
						var node_x = 0,
							node_y = 0;
						for(var n = 0; n < labelDict[head].length; n++) {
							var partion_id = labelDict[head][n];

							if(partion_id != changeNodesArray[i]) {
								node_x = layoutNodes[id_index[partion_id] - 0].x;
								node_y = layoutNodes[id_index[partion_id] - 0].y;

								var disp_x = pos_x - node_x;
								var disp_y = pos_y - node_y;
								var distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);
								Fr_nodes += k * k * (disp_x + disp_y) / (distance * distance);
								
							}

						}
						
					}
				}

				Fr_total = Fr_partion + Fr_nodes; //总排斥力
               
				/***计算节点的总吸引力（需要移动的节点）***/

				var links = layoutNodes[id_index[changeNodesArray[i]] - 0].links;
				for(var n = 0; n < links.length; n++) {
					var node_id = links[n];
					node_x = layoutNodes[id_index[node_id] - 0].x;
					node_y = layoutNodes[id_index[node_id] - 0].y;

					var disp_x = pos_x - node_x;
					var disp_y = pos_y - node_y;
					var distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);
					Fa_nodes +=  -1*distance*(disp_x + disp_y) / k;
					
				}
				
				/***节点的合力，并以此计算需要移动的距离***/
				F_total = Fa_nodes + Fr_total;
			//	console.log(Fa_nodes,Fr_total, F_total)
				var node_age = layoutNodes[id_index[changeNodesArray[i]] - 0].age;
				d_t = Math.pow(Math.E, -β * node_age);
				layoutNodes[id_index[changeNodesArray[i]] - 0].x = pos_x +  d_t*F_total/Math.abs(F_total)*Math.min(t, Math.abs(F_total));
				layoutNodes[id_index[changeNodesArray[i]] - 0].y = pos_y +  d_t*F_total/Math.abs(F_total)*Math.min(t, Math.abs(F_total));
                t = 0.8*t;
				/***防止置换超出边界(约束规范化)***/
                var min_x = 99999, min_y = 9999, max_x = 0, max_y = 0;
                layoutNodes.forEach(function(d){
                	if(d.x > max_x){
                		max_x = d.x;
                	}
                	if(d.y > max_y){
                		max_y = d.y;
                	}
                	if(d.x < min_x){
                		min_x = d.x;
                	}
                	if(d.y < min_y){
                		min_y = d.y;
                	}
                })
                var r_x = width/(max_x - min_x);
                var r_y = height/(max_y - min_y);

                if(layoutNodes[id_index[changeNodesArray[i]] - 0].x <= 0||layoutNodes[id_index[changeNodesArray[i]] - 0].x >= width){
                	layoutNodes[id_index[changeNodesArray[i]] - 0].x = (layoutNodes[id_index[changeNodesArray[i]] - 0].x - min_x)*r_x ;
                }
                
                if(layoutNodes[id_index[changeNodesArray[i]] - 0].y <= 0||layoutNodes[id_index[changeNodesArray[i]] - 0].y >= height){
                	layoutNodes[id_index[changeNodesArray[i]] - 0].y = (layoutNodes[id_index[changeNodesArray[i]] - 0].y - min_y)*r_y ;
                	
                }

			}
		}

	}
	this.unique = function(arr) {
		var result = [],
			hash = {};
		for(var i = 0, elem;
			(elem = arr[i]) != null; i++) {
			if(!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;

	}

    function idToIndex() {
        var  idIndex = {};
        layoutNodes.forEach(function (d) {
            idIndex[d.id] = d.subs;
        })
        return idIndex;
    }
}