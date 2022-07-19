/**
 * Created by zhangye on 2018/6/28.
 */

var paichi = []
function RepulsionAll(layoutNodes, nowData,width, height){
    let id_index;
    let k = 10	,β = 0.08, t = 10;
    let distance_x = 1;
    this.start = function(){
      this.repulsion();
      //  console.log([].concat(layoutNodes))
    };

    this.repulsion = function () {
        id_index = idToIndex();
        layoutNodes.forEach(function(d) {
            // console.log(d)
            d.disp_x = 0;
            d.disp_y = 0;
        });

        /**计算排斥力**/
       for(var iteration_count = 0; iteration_count < 20; iteration_count++) {
            for(let i = 0; i < layoutNodes.length; i++) {
                // console.log(layoutNodes[i])
                let pos_x = layoutNodes[i].x;
                let pos_y = layoutNodes[i].y;
                layoutNodes[i].disp_x = 0;
                layoutNodes[i].disp_y = 0;
                 for(let j = 0; j < layoutNodes.length; j++){
                     if(i != j){
                         // console.log(pos_x)
                         let  node_x = layoutNodes[j].x;
                         // console.log(node_x)
                         let  node_y = layoutNodes[j].y;

                         let disp_x = pos_x - node_x;
                         let disp_y = pos_y - node_y;
                         let distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);

                         // console.log(distance)
                         if(distance == 0){//出现节点重合的情况则给一个很大的排斥力
                             distance = 0.1;
                             disp_x = 1;
                             disp_y = 1;
                         }
                         if(distance < 100){
                             distance_x = 1
                         }else{
                             distance_x = 0;
                         }

                         let disp_repl_x = disp_x > 0?1:-1;
                         let disp_repl_y = disp_y > 0?1:-1;
                         let fr = k*k/(distance)*10 > 2000?2000:k*k/(distance)*10;
                         layoutNodes[i].disp_x =  layoutNodes[i].disp_x + distance_x*disp_repl_x*fr*10;
                         layoutNodes[i].disp_y =  layoutNodes[i].disp_y + distance_x*disp_repl_y*fr*10;

                     }
                 }
                 // console.log(layoutNodes[i].disp_x)
            }
            // console.log(layoutNodes[j].disp_x)
            /**计算吸引力**/
            // nowData.forEach(function (d) {
            //     var source_id = d.source;
            //     var target_id = d.target;
            //     var pos_x = layoutNodes[id_index[source_id] - 0].x;
            //     var pos_y = layoutNodes[id_index[source_id] - 0].y;
            //
            //     var node_x = layoutNodes[id_index[target_id] - 0].x;
            //     var node_y = layoutNodes[id_index[target_id] - 0].y;
            //
            //     var disp_x = pos_x - node_x;
            //     var disp_y = pos_y - node_y;
            //     var distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);
            //
            //     if(distance == 0){//出现节点重合的情况则给一个很小的吸引力
            //         distance = 0.001;
            //         disp_x = 1;
            //         disp_y = 1;
            //     }
            //     var disp_a_x =  (disp_x/Math.abs(disp_x));
            //     var disp_a_y =  (disp_y/Math.abs(disp_y));
            //
            //     var fa = (distance*distance)/k;
            //     layoutNodes[id_index[source_id] - 0].disp_x = layoutNodes[id_index[source_id] - 0].disp_x - disp_a_x*fa;
            //     layoutNodes[id_index[source_id] - 0].disp_y = layoutNodes[id_index[source_id] - 0].disp_y - disp_a_y*fa;
            //
            //     layoutNodes[id_index[target_id] - 0].disp_x = layoutNodes[id_index[target_id] - 0].disp_x + disp_a_x*fa;
            //     layoutNodes[id_index[target_id] - 0].disp_y = layoutNodes[id_index[target_id] - 0].disp_y + disp_a_y*fa;
            //
            // })

           for(let i = 0; i < layoutNodes.length; i++){
                let links = layoutNodes[i].links;
                let pos_x = layoutNodes[i].x;
                let pos_y = layoutNodes[i].y;

                // console.log(layoutNodes[i])
               // console.log(links)
                for(let n = 0; n < links.length; n++){
                    let node_id = links[n];
                    let node_x = layoutNodes[id_index[node_id] - 0].x;
                    let node_y = layoutNodes[id_index[node_id] - 0].y;

                    let disp_x = pos_x - node_x;
                    let disp_y = pos_y - node_y;
                    let distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);


                    if(distance == 0){//出现节点重合的情况则给一个很小的吸引力
                        distance = 0.1;
                        disp_x = 1;
                        disp_y = 1;
                    }

                    let fa = (distance*distance)/k > 2000?2000:(distance*distance)/k;
                    let disp_a_x = disp_x > 0?1:-1;
                    let disp_a_y = disp_y > 0?1:-1;
                    layoutNodes[i].disp_x =  layoutNodes[i].disp_x - disp_a_x*fa;
                    //这个值越大越往东南走
                    layoutNodes[i].disp_y =  layoutNodes[i].disp_y - disp_a_y*fa;
                }

            }



           // console.log(layoutNodes)
           // for (var i=0;i<layoutNodes.length;i++){
           //     // console.log(layoutNodes[i].disp_x)
           // }
            /**计算位置**/
            for(let i = 0; i < layoutNodes.length; i++){
                let node_age = layoutNodes[i].age;

                // console.log(layoutNodes[i].disp_x)
                //大数，有正有负
                //abs取绝对值  || 或
                let layout_disp_x = layoutNodes[i].disp_x/Math.abs( layoutNodes[i].disp_x)||1;
                // console.log(layout_disp_x)
                //1 -1
                // console.log(layoutNodes[i])
                let layout_disp_y = layoutNodes[i].disp_y/Math.abs( layoutNodes[i].disp_y)||1;
                d_t = Math.pow(Math.E, -β * node_age);
                // console.log(d_t)
                // console.log(Math.abs( layoutNodes[i].disp_x))
                //大数字
                // console.log(t)
                //恒定10
                // console.log(layout_disp_x)
                //正1和负1

                layoutNodes[i].x = layoutNodes[i].x +  d_t* layout_disp_x *Math.min(t, Math.abs( layoutNodes[i].disp_x));
                layoutNodes[i].y = layoutNodes[i].y +  d_t* layout_disp_y *Math.min(t, Math.abs( layoutNodes[i].disp_y));
                // console.log(layoutNodes[i].x)

                if(layoutNodes[i].x <= 0||layoutNodes[i].x >= width){
                    this.controlPos(layoutNodes[i].id);
                }
                if(layoutNodes[i].y <= 0||layoutNodes[i].y >= height){
                    this.controlPos(layoutNodes[i].id);
                }

            }
            t = 0.8*t;
        }
 }

    /***防止置换超出边界(约束规范化)***/
    this.controlPos = function (id) {
        let min_x = 99999, min_y = 9999, max_x = 0, max_y = 0;
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
        let r_x = width/(max_x - min_x);
        let r_y = height/(max_y - min_y);

        if(layoutNodes[id_index[id] - 0] .x <= 0||layoutNodes[id_index[id] - 0].x >= width){
            layoutNodes[id_index[id] - 0].x = (layoutNodes[id_index[id] -0].x - min_x)*r_x ;
        }

        if(layoutNodes[id_index[id] - 0].y <= 0||layoutNodes[id_index[id] - 0].y >= height){
            layoutNodes[id_index[id] - 0].y = (layoutNodes[id_index[id] - 0].y - min_y)*r_y ;

        }
    }


    function idToIndex() {
        let  idIndex = {};
        layoutNodes.forEach(function (d) {
            idIndex[d.id] = d.subs;
        })
        // console.log(idIndex)
        return idIndex;
    }

}
