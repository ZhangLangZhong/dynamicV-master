function info_bar(addNode,deleteNode){


    //实例化对象
    var myBar = echarts.init(document.querySelector("#all_view #info_table"));

    var time = "2015:14:15"

    var addNode_len = addNode.length
    var deleteNode_len = deleteNode.length


    var option = {

        tooltip: {

        },
        dataset: {
            source: [
                ['product', 'addNode', 'deleteNode'],
                [time, addNode_len, deleteNode_len],

            ]
        },
        xAxis: {type: 'category',
                axisLabel:{
                color: "white"
                }

        },

        legend:{
          textStyle:{
              color:"white"
          }
        },

        yAxis: {
            // axisLine:{
            //     color:"black",
            //   show:false
            // },
            splitLine:{
              lineStyle:{
                  color:"black"
              }
            },
            axisLabel:{
                color: "white"
                }

        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            {type: 'bar',
            itemStyle:{
                //修改柱子颜色
                color:"orange"
            }
            },
            {type: 'bar'}
            ]
    };


//    把配置项给实例对象
    myBar.setOption(option)
}