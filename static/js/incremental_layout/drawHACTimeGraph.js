function drawHACTimeGraph(hacNodes) {

    // let aaa =
    let socialHac = []

    //arr
    // console.log(hacNodes)

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
        let HacCenterNode_X = 0
        let HacCenterNode_Y = 0
        // console.log(d)
        // console.log(d.List)
        d.List.forEach(socialNode => {
            // console.log(socialNode)
            // let
            HacCenterNode_X += socialNode.x
            HacCenterNode_Y += socialNode.y
        })
        let center_x = HacCenterNode_X / d.List.length
        let center_y = HacCenterNode_Y / d.List.length
        value = {"index": d.index, "x": center_x, "y": center_y}
        centerNodes.push(value)
    })


    console.log(centerNodes)
    drawingHACGraph(centerNodes, socialHac)
    // console.log(centerNodes)

}

// function drawingHACGraph(centerNodes,socialHac){
//     d3.select("#HACGraph").select("svg").remove();
//
//     let width = $("#HACGraph").width()
//     let height = $("#HACGraph").height()
//
//     var svg = d3.select("#HACGraph")
//         .append("svg")
//         .attr("width",width)
//         .attr("height",height)
//
//
//     for (let i = 0; i < centerNodes.length; i++) {
//
//         console.log(88888888888)
//         svg.append("g")
//             .attr("class","nodes")
//             .selectAll("circle")
//             .data(centerNodes).enter()
//             .attr("class","node")
//             .attr("r",5)
//             .attr("cx",centerNodes[i].x)
//             .attr("cy",centerNodes[i].y)
//             .attr("id",centerNodes[i].index)
//             .attr("fill","blue")
//             .attr("stroke","blue")
//
//
//     }
//
//
// }


//echarts版本
//只有点
function drawingHACGraph(centerNodes) {
    this.Mychart = echarts.init(document.getElementById("HACGraph"))
    option = {
        // title: {
        //     text: 'Basic Graph'
        // },
        tooltip: {},
        // animationDurationUpdate: 10,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 20,
                // roam: true,
                // label: {
                //     show: true
                // },
                // edgeSymbol: ['circle', 'arrow'],
                // edgeSymbolSize: [4, 10],
                // edgeLabel: {
                //     fontSize: 20
                // },
                // data: [
                //   {
                //     name: 'Node 1',
                //     x: 300,
                //     y: 300
                //   },
                //   {
                //     name: 'Node 2',
                //     x: 800,
                //     y: 300
                //   },
                //   {
                //     name: 'Node 3',
                //     x: 550,
                //     y: 100
                //   },
                //   {
                //     name: 'Node 4',
                //     x: 550,
                //     y: 500
                //   }
                // ],

                data: centerNodes,


                // links: [],
                // links: [
                //   {
                //     source: 0,
                //     target: 1,
                //     symbolSize: [5, 20],
                //     label: {
                //       show: true
                //     },
                //     lineStyle: {
                //       width: 5,
                //       curveness: 0.2
                //     }
                //   },
                //   {
                //     source: 'Node 2',
                //     target: 'Node 1',
                //     label: {
                //       show: true
                //     },
                //     lineStyle: {
                //       curveness: 0.2
                //     }
                //   },
                //   {
                //     source: 'Node 1',
                //     target: 'Node 3'
                //   },
                //   {
                //     source: 'Node 2',
                //     target: 'Node 3'
                //   },
                //   {
                //     source: 'Node 2',
                //     target: 'Node 4'
                //   },
                //   {
                //     source: 'Node 1',
                //     target: 'Node 4'
                //   }
                //
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
    };
    this.Mychart.setOption(option)


}