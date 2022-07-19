/***
 * age算法设置节点是否移动，
 * 以及移动的难易程度
 * preLayoutNodes:变化之前的数据
 * ***/
function AGE(hashPerlayoutNodes, hashlayoutNodesID1, addNode) {
	var nodesArray = [];
	this.start = function() {
		this.age();
	}

	this.age = function() {

	    // console.log(layoutNodes)
	    // console.log(preLayoutNodes)
        // console.log(nodesArray)

        // id_index = idToIndex(layoutNodes);
        // perId_index = idToIndex(preLayoutNodes);

        //过去的点的集合
		hashPerlayoutNodes.getValues().forEach(function(d) {
			nodesArray.push(d.id);
		})

         // console.log(layoutNodes.length)

        // _.forEach(hashlayoutNodesID1.getValues(),function (d){

        hashlayoutNodesID1.getValues().forEach(function (d){
            // console.log(d)
            var id = d.id
           // console.log(id, i);

            //新增节点的age为1，不用计算
            // if(addNode.includes(id)){
            //     //这个i就不执行下面的行
            // 	// continue;
			// }
            var perLinks = [], links = [];
            // console.log(preLayoutNodes[perId_index[id] - 0])


            // console.log(hashPerlayoutNodes.getValue(id))
            // console.log(999)
            if (addNode.includes(id)){
                return true;
            }

            perLinks = hashPerlayoutNodes.getValue(id).links
            // console.log(perLinks)

            // perLinks = preLayoutNodes[perId_index[id] - 0].links;
            // console.log(layoutNodes[id_index[id] - 0])

            links = hashlayoutNodesID1.getValue(id).links

            // links = layoutNodes[id_index[id] - 0].links;
            //console.log('节点链接情况：');
            //console.log(perLinks, links);
            //没有变化的节点age只需加1
            if(equalArray(perLinks, links)){
                var value = hashlayoutNodesID1.getValue(id)
                var temp = hashlayoutNodesID1.getValue(id).age
                temp = temp + 1;
                value.age = temp;
                hashlayoutNodesID1.remove(id)
                hashlayoutNodesID1.add(id,value)


                // hashlayoutNodesID1.getValue(i).age++;
                // console.log(layoutNodes[i])
			}


            var add_age = 0,
                rem_age = 0,
                tol_age = 0,
				del_age = 0;

             //计算节点的age（rem_age，add_age）;
            for(var j = 0; j < links.length; j++) {
                if(perLinks.indexOf(links[j]) > -1) {

                    rem_age += hashPerlayoutNodes.getValue(links[j]).age;
                    // rem_age += preLayoutNodes[perId_index[links[j]] - 0].age;
                    // console.log(rem_age)
                } else {
                    if(nodesArray.indexOf(links[j]) > -1){

                        add_age += hashPerlayoutNodes.getValue(links[j]).age
                        // add_age += preLayoutNodes[perId_index[links[j]] - 0].age;
                        // console.log(add_age)
                    }else{
                    	//这时此节点为新增节点
                        add_age++;
                    }
                }
            }
            //计算节点的age（del_age）;
            for(var k = 0; k < perLinks.length; k++) {
                if(links.indexOf(perLinks[k]) == -1) {

                    del_age += hashPerlayoutNodes.getValue(perLinks[k]).age;

                    // del_age += preLayoutNodes[perId_index[perLinks[k]] - 0].age;
                }
            }
            tol_age = rem_age + add_age + del_age;
            // console.log('节点age：')
            // console.log(tol_age, rem_age, add_age, del_age)
            // console.log('节点id：')
            // console.log(id_index[id] - 0, perId_index[id] - 0)

            var tempAge = parseInt(hashPerlayoutNodes.getValue(id).age)
            var tempValue = hashlayoutNodesID1.getValue(id)
            var tempAgeFinal = parseInt(tempAge * (rem_age / tol_age) + 1)
            tempValue.age = tempAgeFinal
            hashlayoutNodesID1.remove(id)
            hashlayoutNodesID1.add(id,tempValue)

            // hashlayoutNodesID1.getValue(id).age = parseInt(tempAge * (rem_age / tol_age) + 1)
            //
            // layoutNodes[id_index[id] - 0].age = parseInt(preLayoutNodes[perId_index[id] - 0].age * (rem_age / tol_age) + 1);
            // console.log(layoutNodes[id_index[id] - 0].age)

		})
	}

	this.unique = function(arr) {
		return  Array.from(new Set(arr));
	}

	//将对于id转为对应数组下标
    function idToIndex(layoutNodes) {
        var  idIndex = {};

        // for (var i = 0;i<layoutNodes.length;i++){
        //     idIndex[layoutNodes[i].id] = layoutNodes[i].subs;
        //
        // }
        layoutNodes.forEach(function (d) {
            idIndex[d.id] = d.subs;
        })
        return idIndex;
    }

    //判断两数字数组是否相等
    function equalArray(arr1, arr2) {
	    // console.log(arr1.sort().toString())
         if(arr1.sort().toString() === arr2.sort().toString()){
             return true;
		 }
		 return false;
    }
}
