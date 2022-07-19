/**
 * Created by zhangye on 2018/11/16.
 */
function deleteNodes(layoutNodes, nowData) {
    // console.log(nowData)
     //{source: "853", target: "550"}
     //526 是per里面的点
     var nowDataDict =  countLinks(nowData);


     // var hashTest = new HashTable()

     // console.log(nowDataDict)
     // console.log(nowDataDict)
     //按照顺序把和这个点 以及他的source都加入

     var layoutNodesCopy = [];
     // console.log(layoutNodes)
     //{id: "500", links: Array(2), subs: 0, age: 2, degree: 2, …

     //先无条件把perlayout组成的layout变成这个1
     var layoutNodes1 = [].concat(layoutNodes);

     // layoutNodes1.forEach(function (d){
     //     hashTest.add(d.id,d)
     // })

    // console.log(hashTest.getValues())

    // console.log(layoutNodes1);
    // console.log(layoutNodesCopy.length)

    //此时的layout1其实是上一帧的节点
    layoutNodes1.forEach(function(d){
        // console.log(d)

          //d是上一帧的每一行 的id啊 links啊 xy这些
          //这个if的意思就是说如果nowdataNode里面还存在上一个layout的点 那就将改变关系的node的LINKs
        // 因为有的已经不崽nowdata里面了嘛 更新一下老节点中还存在于新节点里面的node的links这些
          if(nowDataDict[d.id]){
              d.links = nowDataDict[d.id];
              d.degree = nowDataDict[d.id].length;
              d.subs = layoutNodesCopy.length;
              layoutNodesCopy.push(d);
          }
     })
    // console.log([].concat(layoutNodesCopy));

    // console.log(layoutNodesCopy)

    //所以这里面拿出来的layout是老节点还在新节点里面的点的完全体值 【但是】没有弄新增节点进来的LINKS那些 所以才会导致后面的报错
    return layoutNodesCopy;
}

function countLinks(data) {
    var nodedict = {};
    //nowdata的每一行 SO TA
    data.forEach(function(d) {
        //如果这个ID已经有人当第一个LINKS了
        if(nodedict[d.source]) {
            //数组里面多一个LINKS链接
            nodedict[d.source].push(d.target);
        }
        //如果这个ID没有人当第一个LINKS 就先创造 然后把这个的target放进去 因为SO的TA就是他的LINKS嘛
        else {
            nodedict[d.source] = [];
            nodedict[d.source].push(d.target);
        }


        if(nodedict[d.target]) {
            nodedict[d.target].push(d.source)
        } else {
            nodedict[d.target] = [];
            nodedict[d.target].push(d.source);
        }
    })
    // console.log(nodedict)
    //返回的就是从nowData拿过来的SO TA集合然后分组而成的各点的LINKS
    return nodedict;
}
// function deepCopy(arr) {
//     var str = JSON.stringify(arr);
//     var copy = JSON.parse(str);
//     return copy;
// }
