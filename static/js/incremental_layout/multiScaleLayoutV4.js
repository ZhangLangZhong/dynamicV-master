function multiScaleLayoutV4() {
	var nodeArray;
	var apspMatrix;
	var maxAPSPDistance;
    var groupArray;

	var displayAreaWidth;
	var displayAreaHeight;

	var RAD;
	var ITERATIONS;
	var RATIO;
	var MINSIZE;

	var INITIALSIZE;
    this.start = function(nodes, w, h) {
    	console.log('multiScaleLayoutV4 node:' + nodes.length*5);
    	this.nodeArray = nodes;
    	this.displayAreaWidth = w;
    	this.displayAreaHeight = h;
        this.initialConstant();
    	this.layout();
        var i = 0;
        this.nodeArray.forEach(function(d){
            d['label'] = i++;
        	d['age'] = 1;
        	d['degree'] = d.links.length;
        })
    	return this.nodeArray;
    };
    this.initialConstant = function() {
        this.RAD = 7;
        this.ITERATIONS = 4;
        this.RATIO = 3;
        this.MINSIZE = 10;
        this.INITIALSIZE = 100;
    };
    this.layout = function() {
    	this.computeApspMatrix();
        console.log('computeApspMatrix');
       // this.transferIntoConnectedGraph();
    	var k = this.MINSIZE;
    	while(k <= this.nodeArray.length) {
    		var result = this.computeKCenters(k);
    		var centers = result.centers;
    		var vDistances = result.vDistances;
    		var radius = this.selectACenter(vDistances).maxDistance * this.RAD;
    		this.localLayout(centers, radius, vDistances);
    		this.addNoise(centers);
    		k *= this.RATIO;
    	}
    	this.modifyLayout();
    };

    this.computeApspMatrix = function() {
        this.groupArray = [];
        var totalIndexVisited = [];
        var nodeIDtoNode = [];
    	for(var i = 0; i < this.nodeArray.length; i++) {
            this.nodeArray[i].index = i;
            nodeIDtoNode[this.nodeArray[i].id] = this.nodeArray[i];
    	}
        for(var i = 0; i < this.nodeArray.length; i++) {
            this.nodeArray[i].link = [];
            for(var j = 0; j < this.nodeArray[i].links.length; j++) {
                this.nodeArray[i].link.push(nodeIDtoNode[this.nodeArray[i].links[j]]);
            }
        }
    	this.apspMatrix = [];
    	this.apspMatrix.length = this.nodeArray.length;
    	this.maxAPSPDistance = 0;
    	for(var i = 0; i < this.nodeArray.length; i++) {
    		this.apspMatrix[i] = [];
    		this.apspMatrix[i].length = this.nodeArray.length;
    		for(var j = 0; j < this.nodeArray.length; j++) {
    			this.apspMatrix[i][j] = -1; //cannot reach
    		}
    		var visitedIdexes = this.BFS(this.nodeArray[i], i);
            //compute groupArray to make the graph connected
            if(!totalIndexVisited[i]) {
                var array = [];
                var farthestIndex = i;
                var farthestDistance = 0;
                for(var tmpindex in visitedIdexes) {
                    if(this.apspMatrix[i][tmpindex] > farthestDistance) {
                        farthestDistance = this.apspMatrix[i][tmpindex];
                        farthestIndex = tmpindex;
                    }
                    array.push(tmpindex);
                    totalIndexVisited[tmpindex] = true;
                }
                this.groupArray.push({array: array, index1: i, index2: farthestIndex});
            }
    		this.setRandomLayout(this.nodeArray[i]);
    	}
    };

    this.BFS = function(node, index) {
    	this.apspMatrix[index][index] = 0;
    	node.tmpBFSdepth = 0;
    	var queue = [];
    	queue.push(node);
    	var visitedIndexes = [];
    	visitedIndexes[node.index] = true;
    	while(queue.length != 0) {
    		var headNode = queue.shift();
    		for(var i = 0; i < headNode.link.length; i++) {
    			if(visitedIndexes[headNode.link[i].index] === true) {
    				continue;
    			}
    			headNode.link[i].tmpBFSdepth = headNode.tmpBFSdepth + 1;
                var tmpindex = headNode.link[i].index;
    			this.apspMatrix[index][tmpindex] = headNode.link[i].tmpBFSdepth;
    			if(this.apspMatrix[index][tmpindex] > this.maxAPSPDistance) {
    				this.maxAPSPDistance = this.apspMatrix[index][tmpindex];
    			}
    			queue.push(headNode.link[i]);
    			visitedIndexes[headNode.link[i].index] = true;
    		}
    	}
        return visitedIndexes;
    };
    
    this.transferIntoConnectedGraph = function() {
        if(this.groupArray.length == 1) {
            return null;
        }
        var tmpmark = 0;
        console.log('group number:' + this.groupArray.length);
        for(var i = 0; i < this.groupArray.length - 1; i++) {
            var index1;
            var index2;
            if(tmpmark % 5 == 0) {
                index1 = this.groupArray[i].index1;
                index2 = this.groupArray[i + 1].index1;
            }
            else {
                index1 = this.groupArray[i - (tmpmark % 4)].index2;
                index2 = this.groupArray[i + 1].index2;
            }
            tmpmark ++;
            this.addALink(index1, index2, i, this.groupArray[i + 1].array);
        }
    };
    //complexity: O(|V|2), index1GroupindexArray include index1 and index2GroupindexArray include index2
    this.addALink = function(index1, index2, indexB, index2GroupindexArray) {
        this.nodeArray[index1].link.push(this.nodeArray[index2]);
        this.nodeArray[index2].link.push(this.nodeArray[index1]);
        for(var z = 0; z <= indexB; z++) {
            for(var i = 0; i < this.groupArray[z].array.length; i++) {
                for(var j = 0; j < index2GroupindexArray.length; j++) {
                    var sIndex = this.groupArray[z].array[i];
                    var tIndex = index2GroupindexArray[j];
                    this.apspMatrix[sIndex][tIndex] = this.apspMatrix[sIndex][index1] 
                        + this.apspMatrix[index2][tIndex] + 1;
                    this.apspMatrix[tIndex][sIndex] = this.apspMatrix[sIndex][tIndex];
                    //update maxAPSPDistance
                    if(this.apspMatrix[tIndex][sIndex] > this.maxAPSPDistance) {
                        this.maxAPSPDistance = this.apspMatrix[tIndex][sIndex];
                    }
                }
            }
        }
    };

    this.setRandomLayout = function(node) {
    	node.x = Math.random() * this.INITIALSIZE;
    	node.y = Math.random() * this.INITIALSIZE;
    };
    //return centers and vDistances
    this.computeKCenters = function(K) {
    	var randomIndex = Math.floor(Math.random() * this.nodeArray.length);
    	var randomNode = this.nodeArray[randomIndex];
    	var selectedCenters = [];
        var vertexDistances;
    	selectedCenters.push(randomNode);
        vertexDistances = this.apspMatrix[randomIndex].slice(0);
        vertexDistances[randomIndex] = -2; //already in the S
        //var maxDisInCenters = 0;
    	for(var i = 1; i < K; i++) {
    		var nextNode = this.selectACenter(vertexDistances).nextNode;
    		selectedCenters.push(nextNode);
            vertexDistances[nextNode.index] = -2;
            //update vertexDistances
            for(var j = 0; j < this.nodeArray.length; j++) {
                if(vertexDistances[j] === -2) {
                /*if(nextNode.index != j && this.apspMatrix[nextNode.index][j] > maxDisInCenters) {
                    maxDisInCenters = this.apspMatrix[nextNode.index][j];
                }*/
                    continue;
                }
                if(this.apspMatrix[nextNode.index][j] < vertexDistances[j]) {
                    vertexDistances[j] = this.apspMatrix[nextNode.index][j];
                }
            }
    	}
    	return {centers: selectedCenters, vDistances: vertexDistances};
    };
    //return the node to select next and current maxDistance
    this.selectACenter = function(vertexDistances) {
    	var nextIndex;
    	var maxDistance = -1;
    	for(var i = 0; i < this.nodeArray.length; i++) {
    		if(vertexDistances[i] === -2) {
                continue;
            }
            if(vertexDistances[i] > maxDistance) {
                maxDistance = vertexDistances[i];
                nextIndex = i;
            }
    	}
        if(maxDistance === -1) {
            maxDistance = 1;
        }
    	return {nextNode: this.nodeArray[nextIndex], maxDistance: maxDistance};
    };

    this.localLayout = function(centers, radius, vertexDistances) {
        var indexToNeighbours = this.computeIndexToNeighbours(centers, radius, vertexDistances);
        var heapArray = [];
        for(var tmpindex in indexToNeighbours) {
            var tmpres = this.partialDerivativesDelta(this.nodeArray[tmpindex], 
                indexToNeighbours[tmpindex]);
            this.nodeArray[tmpindex].delta = Math.pow(tmpres.deriByX, 2) + Math.pow(tmpres.deriByY, 2);
            this.nodeArray[tmpindex].heapIndex = heapArray.length;
            heapArray.push(this.nodeArray[tmpindex]);
        }
        buildMaxHeap(heapArray);
    	for(var i = 0; i < centers.length * this.ITERATIONS; i++) {
    		var maxDeltaNode = heapArray[0];
            var tmpres2 = this.partialDerivativesDelta(maxDeltaNode, 
                indexToNeighbours[maxDeltaNode.index]);
    		var tmpres3 = this.partialDerivatives(maxDeltaNode, 
                indexToNeighbours[maxDeltaNode.index]);
    		var moveX = (tmpres2.deriByX - tmpres2.deriByY * tmpres3.deriByXY / tmpres3.deriByYY)
    						/ (Math.pow(tmpres3.deriByXY, 2) / tmpres3.deriByYY - tmpres3.deriByXX);
    		var moveY = (-tmpres2.deriByX - tmpres3.deriByXX * moveX) / tmpres3.deriByXY;
    		if(moveX == 'Infinity' || moveX == '-Infinity') {
    			moveX = Math.random() * this.INITIALSIZE / 5;
    		}
    		if(moveY == 'Infinity' || moveY == '-Infinity') {
    			moveY = Math.random() * this.INITIALSIZE / 5;
    		}
    		maxDeltaNode.x += moveX;
    		maxDeltaNode.y += moveY;
            //update heapArray
            for(var j = -1; j < indexToNeighbours[maxDeltaNode.index].length; j++) {
                var tmpnode;
                if(j === -1){
                    tmpnode = maxDeltaNode;
                } else {
                    tmpnode = this.nodeArray[indexToNeighbours[maxDeltaNode.index][j]];
                }
                var tmpres = this.partialDerivativesDelta(tmpnode, 
                    indexToNeighbours[tmpnode.index]);
                tmpnode.delta = Math.pow(tmpres.deriByX, 2) + Math.pow(tmpres.deriByY, 2);
                heapifyInMiddle(heapArray, tmpnode.heapIndex, heapArray.length);
            }
    	}
    	//heap sort----------------------------------------------------------------------
        function heapifyInMiddle(array, index, heapSize) {
            var iMax = index;
            var iLeft = 2 * index + 1;
            var iRight = 2 * (index + 1);
            var iParent = Math.floor((index - 1) / 2);
            if(iParent >= 0 && array[iMax].delta > array[iParent].delta) {
                while(iParent >= 0 && array[iMax].delta > array[iParent].delta) {
                    swap(array, iMax, iParent);
                    iMax = iParent;
                    iParent = Math.floor((iMax - 1) / 2);
                }
                return null;
            }
            maxHeapify(array, iMax, heapSize);
            return null;
;        }

        function swap(array, i, j) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            array[i].heapIndex = i;
            array[j].heapIndex = j;
        }
         
        function maxHeapify(array, index, heapSize) {
            var iMax;
            var iLeft;
            var iRight;
            while (true) {
                iMax = index;
                iLeft = 2 * index + 1;
                iRight = 2 * (index + 1);
                if(iLeft < heapSize && array[index].delta < array[iLeft].delta) {
                    iMax = iLeft;
                }
             
                if(iRight < heapSize && array[iMax].delta < array[iRight].delta) {
                    iMax = iRight;
                }
             
                if (iMax != index) {
                    swap(array, iMax, index);
                    index = iMax;
                } else {
                    break;
                }
            }
        }
         
        function buildMaxHeap(array) {
            var i;
            var iParent = Math.floor(array.length / 2) - 1;
         
            for (i = iParent; i >= 0; i--) {
                maxHeapify(array, i, array.length);
            }
        }


    };
    this.partialDerivativesDelta = function(node, neighbours) {
        var sumX = 0;
        var sumY = 0;
        for(var j = 0; j < neighbours.length; j++) {
            var d = this.apspMatrix[node.index][neighbours[j]];
            var L = d * this.INITIALSIZE / this.maxAPSPDistance;
            var minusX = node.x - this.nodeArray[neighbours[j]].x;
            var minusY = node.y - this.nodeArray[neighbours[j]].y;
            var sqrt = Math.sqrt(Math.pow(minusX, 2) + Math.pow(minusY, 2));
            var resX = (1 / Math.pow(d, 2)) * (minusX - L * minusX / sqrt);
            sumX += resX;
            var resY = (1 / Math.pow(d, 2)) * (minusY - L * minusY / sqrt);
            sumY += resY;
        }
        return {
            deriByX: sumX,
            deriByY: sumY
        };
    };
    this.partialDerivatives = function(node, neighbours) {
        var sumXX = 0;
        var sumYY = 0;
        var sumXY = 0;
        for(var j = 0; j < neighbours.length; j++) {
            var d = this.apspMatrix[node.index][neighbours[j]];
            var L = d * this.INITIALSIZE / this.maxAPSPDistance;
            var minusX = node.x - this.nodeArray[neighbours[j]].x;
            var minusY = node.y - this.nodeArray[neighbours[j]].y;
            var pow32 = Math.pow(Math.pow(minusX, 2) + Math.pow(minusY, 2), 3/2);
            var resXX = (1 / Math.pow(d, 2)) * (1 - L * Math.pow(minusY, 2) / pow32);
            sumXX += resXX;
            var resYY = (1 / Math.pow(d, 2)) * (1 - L * Math.pow(minusX, 2) / pow32);
            sumYY += resYY;
            var resXY = (1 / Math.pow(d, 2)) * L * minusX * minusY / pow32;
            sumXY += resXY;
        }
        return {
            deriByXX: sumXX,
            deriByYY: sumYY,
            deriByXY: sumXY
        };
    };

    this.computeIndexToNeighbours = function(centers, radius, vertexDistances) {
        var indexToNeighbours = [];
        for(var i = 0; i < centers.length; i++) {
            var neighbours = this.computeNeighboursByBFS(centers[i], vertexDistances, radius);
            indexToNeighbours[centers[i].index] = neighbours;
        }
        return indexToNeighbours;
    };

    this.computeNeighboursByBFS = function(node, vertexDistances, radius) {
        node.tmpBFSdepth = 0;
        var queue = [];
        queue.push(node);
        var visitedIndexes = [];
        visitedIndexes[node.index] = true;
        var neighbours = [];
        while(queue.length != 0) {
            var headNode = queue.shift();
            if(headNode.tmpBFSdepth >= radius - 1) {
                continue;
            }
            for(var i = 0; i < headNode.link.length; i++) {
                if(visitedIndexes[headNode.link[i].index] === true) {
                    continue;
                }
                headNode.link[i].tmpBFSdepth = headNode.tmpBFSdepth + 1;
                if(vertexDistances[headNode.link[i].index] === -2) {
                    neighbours.push(headNode.link[i].index);
                }
                queue.push(headNode.link[i]);
                visitedIndexes[headNode.link[i].index] = true;
            }
        }
        return neighbours;
    };

    this.addNoise = function(centers) {
    	for(var i = 0; i < this.nodeArray.length; i++) {
    		var closestCenter = null;
    		var distance = -1;
    		for(var j = 0; j < centers.length; j++) {
    			var tmpDis = this.apspMatrix[i][centers[j].index];
    			if(tmpDis === 0) {
    				closestCenter = centers[j];
    				break;
    			}
    			if(tmpDis < 0) {
    				continue;
    			}
    			if(tmpDis < distance || distance === -1) {
    				distance = tmpDis;
    				closestCenter = centers[j];
    			}
    		}
    		if(closestCenter != null) {
    			this.nodeArray[i].x = closestCenter.x + Math.random();
    			this.nodeArray[i].y = closestCenter.y + Math.random();
    		}
    	}  	
    };

    this.modifyLayout = function() {
    	var minX = null;
    	var minY = null;
    	var maxX = null;
    	var maxY = null;
    	for(var i = 0; i < this.nodeArray.length; i++) {
            this.nodeArray[i].link = null;
    		if(minX > this.nodeArray[i].x || minX === null) {
    			minX = this.nodeArray[i].x;
    		}
    		if(minY > this.nodeArray[i].y || minY === null) {
    			minY = this.nodeArray[i].y;
    		}
    		if(maxX < this.nodeArray[i].x || maxX === null) {
    			maxX = this.nodeArray[i].x;
    		}
    		if(maxY < this.nodeArray[i].y || maxY === null) {
    			maxY = this.nodeArray[i].y;
    		}
    	}
    	maxX = maxX - minX + this.INITIALSIZE / 20 + this.INITIALSIZE / 30;
    	maxY = maxY - minY + this.INITIALSIZE / 20 + this.INITIALSIZE / 30;
    	for(var i = 0; i < this.nodeArray.length; i++) {
    		this.nodeArray[i].x = (this.nodeArray[i].x - minX + this.INITIALSIZE / 20)
    						 * this.displayAreaWidth / maxX;
    		this.nodeArray[i].y = (this.nodeArray[i].y - minY + this.INITIALSIZE / 20)
    						 * this.displayAreaHeight / maxY;
    		
    	}
    };
}; 