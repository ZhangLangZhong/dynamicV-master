// let HashFinalNodes = HashTable()

function drawHACTimeGraph(hacNodes) {

    // let aaa =
    let socialHac = []

    //arr
    // console.log(hacNodes)

    // console.log(hacNodes)

    let hashHacNodes = new HashTable()
    hacNodes.forEach(d =>{
        hashHacNodes.add(d.id,d)
    })

    // console.log(hashHacNodes.getValues())


    hacNodes.map(mapItem => {
        if (socialHac.length == 0) {
            socialHac.push({index: mapItem.index, List: [mapItem]})
        } else {
            //有相同社区的就添加到当前项
            let socialHacIndex = socialHac.some(item => {
                if (item.index == mapItem.index) {
                    item.List.push(mapItem)
                    return true
                }
            })
            //没找到同一个社区再添加一个对象
            if (!socialHacIndex) {
                socialHac.push({index: mapItem.index, List: [mapItem]})
            }
        }
    })

    // console.log(socialHac)
    // console.log(hacNodes)





    let centerNodes = []

    socialHac.forEach(d => {

        /**
         * part1 求中心点的坐标位置
         * @type {number}
         */
        let HacCenterNode_X = 0
        let HacCenterNode_Y = 0
        // console.log(d)
        // console.log(d.List)


        let indexNum = []
        //167 406 461...
        // let valuelink = {index:d.index,indexLinks:indexNum}
        d.List.forEach(socialNode => {
            // console.log(socialNode)
            // let
            HacCenterNode_X += socialNode.x
            HacCenterNode_Y += socialNode.y

            /**
            * part2 求边连接关系
            */

            // valuelink = {index:d.index,indexLinks:[]}

            //167 下面的406 461 605进
            for (let i = 0; i < socialNode.links.length; i++) {

                // valuelink = {index:d.index,indexLinks:[]}
                // console.log(d.index)
                // console.log(hashHacNodes.getValue(socialNode.links[i]))
                // console.log(valuelink.indexLinks)
                // console.log(hashHacNodes.getValue(socialNode.links[i]).index)
                // console.log(valuelink.indexLinks.indexOf(hashHacNodes.getValue(socialNode.links[i]).index))
                // console.log(typeof valuelink.indexLinks)
                // console.log((hashHacNodes.getValue(socialNode.links[i]).index))
                // console.log(valuelink.indexLinks.indexOf(hashHacNodes.getValue(socialNode.links[i]).index))


                //如果这个links的index也在父节点的社区 则不管他 因为是同一个社区的
                if (hashHacNodes.getValue(socialNode.links[i]).index == d.index){
                    continue
                }
                // else if (valuelink.indexLinks.hasOwnProperty(hashHacNodes.getValue(socialNode.links[i]).index)){
                //    判断里面有没有这个index
                else if (indexNum.indexOf(hashHacNodes.getValue(socialNode.links[i]).index) == 0){
                // else if (indexAlreadyHad(hashHacNodes.getValue(socialNode.links[i]).index,valuelink.indexLinks)){
                    // console.log(valuelink.indexLinks)
                    // console.log(999999999)
                    continue
                }
                // 这个links点的index不属于父节点同一社区
                else{
                    // console.log(console.log((hashHacNodes.getValue(socialNode.links[i]).index)))
                    // valuelink = {index:d.index,indexLinks:hashHacNodes.getValue(socialNode.links[i]).index}
                    indexNum.push(hashHacNodes.getValue(socialNode.links[i]).index)
                }
                // console.log(valuelink)

                // unique(indexNum)
            }
            // unique(indexNum)

            //167这个点的外支
            // console.log(valuelink)

            // socialNode.links.forEach(linkInfor =>{
            //     //解构就是看这个属于哪个社区
            //     // console.log(linkInfor)
            //     // hashHacNodes.getValue()
            //     if (hashHacNodes.getValue(linkInfor).index == d.index){
            //         continue
            //     }
            //
            // })


        })
        let indexFinal = unique(indexNum)
        // unique(indexNum)
        // let valuelink = {index:d.index,indexLinks:indexFinal}
        // console.log(valuelink)

        let center_x = HacCenterNode_X / d.List.length
        let center_y = HacCenterNode_Y / d.List.length

        // /**
        //  * part2 求边连接关系
        //  */
        // d.List.forEach(S =>{
        //
        //
        //
        // })



        value = {"index": d.index, "x": center_x, "y": center_y,"indexLinks":indexFinal}
        centerNodes.push(value)
    })


    console.log(centerNodes)

    let HashFinalNodes = new HashTable()
    centerNodes.forEach(d=>{
        HashFinalNodes.add(d.index,d)
    })

    console.log(HashFinalNodes.getValues)

    drawingHACGraph(centerNodes,HashFinalNodes)
    // console.log(centerNodes)


}

function drawingHACGraph(centerNodes,HashFinalNodes){
    // let HashFinalNodes = HashTable()
    // centerNodes.forEach(d=>{
    //     HashFinalNodes.add(d.index,d)
    // })


    d3.select("#HACGraph").select("svg").remove();

    let width = $("#HACGraph").width()
    let height = $("#HACGraph").height()

    var svg = d3.select("#HACGraph")
        .append("svg")
        .attr("width",width)
        .attr("height",height)


    for (let i = 0; i < centerNodes.length; i++) {

        // console.log(88888888888)
        svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(centerNodes[i].indexLinks).enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", 0.5)
            .attr("x1", centerNodes[i].x)
            .attr("y1", centerNodes[i].y)
            .attr("x2", d => {
                return HashFinalNodes.getValue(d).x
            })
            .attr("y2", d => {
                return HashFinalNodes.getValue(d).y
            })
            .attr("stroke", "gray")
    }

        svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(centerNodes).enter()
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
            .attr("fill", "blue")
            .attr("stroke", "blue")





}

function indexAlreadyHad(indexNum,allIndex){

    var result = allIndex.some(item =>{
        if (item){
            return true
        }
    })

}

function unique(arr) {
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (newArr.indexOf(arr[i]) === -1) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    }




//echarts版本
//只有点
// function drawingHACGraph(centerNodes) {
//     this.Mychart = echarts.init(document.getElementById("HACGraph"))
//     option = {
//         // title: {
//         //     text: 'Basic Graph'
//         // },
//         tooltip: {},
//         // animationDurationUpdate: 10,
//         animationEasingUpdate: 'quinticInOut',
//         series: [
//             {
//                 type: 'graph',
//                 layout: 'none',
//                 symbolSize: 20,
//                 // roam: true,
//                 // label: {
//                 //     show: true
//                 // },
//                 // edgeSymbol: ['circle', 'arrow'],
//                 // edgeSymbolSize: [4, 10],
//                 // edgeLabel: {
//                 //     fontSize: 20
//                 // },
//                 // data: [
//                 //   {
//                 //     name: 'Node 1',
//                 //     x: 300,
//                 //     y: 300
//                 //   },
//                 //   {
//                 //     name: 'Node 2',
//                 //     x: 800,
//                 //     y: 300
//                 //   },
//                 //   {
//                 //     name: 'Node 3',
//                 //     x: 550,
//                 //     y: 100
//                 //   },
//                 //   {
//                 //     name: 'Node 4',
//                 //     x: 550,
//                 //     y: 500
//                 //   }
//                 // ],
//
//                 data: centerNodes,
//
//
//                 // links: [],
//                 // links: [
//                 //   {
//                 //     source: 0,
//                 //     target: 1,
//                 //     symbolSize: [5, 20],
//                 //     label: {
//                 //       show: true
//                 //     },
//                 //     lineStyle: {
//                 //       width: 5,
//                 //       curveness: 0.2
//                 //     }
//                 //   },
//                 //   {
//                 //     source: 'Node 2',
//                 //     target: 'Node 1',
//                 //     label: {
//                 //       show: true
//                 //     },
//                 //     lineStyle: {
//                 //       curveness: 0.2
//                 //     }
//                 //   },
//                 //   {
//                 //     source: 'Node 1',
//                 //     target: 'Node 3'
//                 //   },
//                 //   {
//                 //     source: 'Node 2',
//                 //     target: 'Node 3'
//                 //   },
//                 //   {
//                 //     source: 'Node 2',
//                 //     target: 'Node 4'
//                 //   },
//                 //   {
//                 //     source: 'Node 1',
//                 //     target: 'Node 4'
//                 //   }
//                 //
//                 lineStyle: {
//                     opacity: 0.9,
//                     width: 2,
//                     curveness: 0
//                 }
//             }
//         ]
//     };
//     this.Mychart.setOption(option)
// }