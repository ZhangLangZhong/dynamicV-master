/**
 * Created by zhangye on 2018/6/6.
 */
function d3layout(data, width, height) {
    var tmp_nodes = [];
    var index_of_nodes = [];
    var nodeNumber = 0;
    var links = [];
    var nodes = [];
    var nodeDict = {}

    // console.log(nodes)

    this.draw = function () {

        //link的push
        data.forEach(function (item) {
            // console.log(tmp_nodes)
            //所以的定点的点id
            // console.log(item)
            tmp_nodes.push(item.source);
            tmp_nodes.push(item.target);

             // console.log(nodes)

            // console.log(tmp_nodes)

            // console.log(nodeDict[item.source])
            // console.log(nodeDict)
            // console.log(item.source)
            if (nodeDict[item.source]) {
                nodeDict[item.source].push(item.target)
            } else {
                nodeDict[item.source] = [];
                nodeDict[item.source].push(item.target)
            }

            if (nodeDict[item.target]) {
                nodeDict[item.target].push(item.source)
            } else {
                nodeDict[item.target] = [];
                nodeDict[item.target].push(item.source)
            }

        });


         // console.log(nodes)

        //根据so ta集合传入的点 存在重复
        // console.log(tmp_nodes)
        tmp_nodes = this.unique(tmp_nodes);

        //纯点集 无重复
        // console.log(tmp_nodes)
        index_of_nodes = d3.map();
        // console.log(index_of_nodes)
        nodeNumber = tmp_nodes.length;

        // console.log(nodeNumber)

        //根据新增节点与已存在的节点的连接的度的大小顺序（升序）
        tmp_nodes.sort(function compare(a, b) {
            return a - b
        });

         // console.log(nodes)

        // console.log(tmp_nodes)
        for (var i = 0; i !== tmp_nodes.length; ++i) {
            var node = {id: tmp_nodes[i]};
            // console.log(node)
            nodes.push(node);
            // console.log(nodes)

            // console.log(i)
            index_of_nodes.set(tmp_nodes[i], i);

            // console.log(index_of_nodes.set(tmp_nodes[i], i))
            //layoutNodes
            // console.log(nodes)
        }


         // console.log(nodes)
        //so ta集
        // console.log(data)

        data.forEach(function (item) {

            // console.log(index_of_nodes.get(item.source))
            var link = {
                source: index_of_nodes.get(item.source),
                target: index_of_nodes.get(item.target)
            };
            links.push(link);

            // console.log(links)

        });

        // console.log(links)

        //边
        // console.log(data)

        // console.log(nodes)



        // console.log(nodes)
        // nodes.forEach(function (d){
        //     console.log(d.x)
        // })

        // console.log(links)


        var svg = d3.select("#main")
            .append("svg")
            .attr("width", width)
            .attr("height", height);



        this.force = d3.layout.force()
            .nodes(nodes)
            .links(links)
                // .linkDistance(0.01)
            .size([width, height])



        // let scale = d3.scale.linear()
        //     .domain([1,5])
        //     .range([0,100])

        this.force.start();

        var svg_links = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke-opacity", 0.9)
            .attr("stroke", "gray")

        var svg_nodes = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function (d) {
                return 2;
            })
            .attr("id", function (d) {
                // console.log(d)
                return d.id;
            })
            .attr("opacity", 1)
            .attr("stroke", "red")
            .attr("fill", "red")
        //.call(mainChart.force.drag);


        /**
         * new
         * @type {{nodes: [], links: []}}
         */
        // var staticData = {links:[],nodes:[]}
        //
        //
        // var staticLinkSource = []
        // var staticLinkTarget = []
        // var staticNodeXY = []
        //
        //
        //
        // var hashStaticData = []
        // hashStaticData = new HashTable()
        //
        //
        //
        //
        // nodes.forEach(function (d){
        //     // console.log(d)
        //     hashStaticData.add(d.id,d)
        // })
        //
        // var hashstaticLinks = []
        // hashstaticLinks = new HashTable()
        //
        // // console.log(data)
        //
        // data.forEach(function (d){
        //     var value = []
        //     value = d.source + d.target
        //     hashstaticLinks.add(value,d)
        // })
        //
        // for (var i = 0;i<data.length;i++){
        //     value = data[i].target + data[i].source
        //     if (hashstaticLinks.containsKey(value)){
        //         data[i] = {"source": data[i].source, "target": data[i].target, "repeat": 1}
        //     }
        // }
        //
        // data.forEach(function (d){
        //     var value = {'source': d.source, 'target': d.target, 'value': 1}
        //     if (!d.repeat){
        //         staticData.links.push(value)
        //
        //         staticLinkSource.push(hashStaticData.getValue(d.source).x)
        //         staticLinkSource.push(hashStaticData.getValue(d.source).y)
        //
        //         staticLinkTarget.push(hashStaticData.getValue(d.target).x)
        //         staticLinkTarget.push(hashStaticData.getValue(d.target).y)
        //     }
        // })
        //
        // nodes.forEach(function (d){
        //     var valueNode = {'id':d.id,'x':d.x,'y':d.y,'group':1}
        //
        //     staticNodeXY.push(d.x)
        //     staticNodeXY.push(d.y)
        //
        //     staticData.nodes.push(valueNode)
        // })

        // console.log(staticData)
        // console.log(staticLinkTarget)
        // console.log(staticLinkSource)
        // console.log(staticNodeXY)

        // d3.select("#main").select("svg").remove();
        // d3.select("#main").select("canvas").remove()
        //
        //
        // const netv1 = new NetV({
        //     container: document.getElementById('main'),
        //     nodeLimit: 800,
        //     linkLimit: 2000,
        //     width:width,
        //     height:height,
        //     // backgroundColor:{r: 0.09, g: 0.09, b: 0.09, a: 0.5},
        //
        //     backgroundColor:{r: 1, g: 1, b: 1, a: 0.5},
        //
        //
        //     node: {
        //         style: {
        //             fill: {r: 1, g: 0, b: 0.9, a: 1},
        //             r: 7,
        //             strokeColor: {r: 0.09, g: 0.09, b: 0.09, a: 0.5},
        //             strokeWidth: 1
        //         }
        //     },
        //     link: {
        //         style: {
        //             strokeColor: {r: 0.8, g: 0.8, b: 0.8, a: 0.5},
        //             strokeWidth: 1.2,
        //             // shape: 'curve'
        //         }
        //     }
        // })
        //
        // netv1.data(staticData,staticNodeXY,staticLinkSource,staticLinkTarget)
        //
        // netv1.draw()




        // console.log(hashstaticLinks.getValues())



        // console.log(hashStaticData.getValues())



        // console.log(svg_links)
        this.force.on("tick", function () {

            svg_links.attr("x1", function (d) {
                return d.source.x;
            });
            svg_links.attr("y1", function (d) {
                return d.source.y;
            });
            svg_links.attr("x2", function (d) {
                return d.target.x;
            });
            svg_links.attr("y2", function (d) {
                return d.target.y;
            });

            svg_nodes.attr("cx", function (d) {
                return d.x;
            });
            svg_nodes.attr("cy", function (d) {
                return d.y;
            });
        });

        // d3.select("#main").select("svg").remove();
        // d3.select("#main").select("canvas").remove()
        //
        //
        // const netv1 = new NetV({
        //     container: document.getElementById('main'),
        //     nodeLimit: 800,
        //     linkLimit: 2000,
        //     width:width,
        //     height:height,
        //     // backgroundColor:{r: 0.09, g: 0.09, b: 0.09, a: 0.5},
        //
        //     backgroundColor:{r: 1, g: 1, b: 1, a: 0.5},
        //
        //
        //     node: {
        //         style: {
        //             fill: {r: 1, g: 0, b: 0.9, a: 1},
        //             r: 7,
        //             strokeColor: {r: 0.09, g: 0.09, b: 0.09, a: 0.5},
        //             strokeWidth: 1
        //         }
        //     },
        //     link: {
        //         style: {
        //             strokeColor: {r: 0.8, g: 0.8, b: 0.8, a: 0.5},
        //             strokeWidth: 1.2,
        //             // shape: 'curve'
        //         }
        //     }
        // })
        //
        // netv1.data(staticData,staticNodeXY,staticLinkSource,staticLinkTarget)
        //
        // netv1.draw()



        // console.log(nodes)
        //
        // nodes.forEach(function (d){
        //     console.log(d)
        // })




        var count = 0;

        // console.log(nodes)

        return nodes
    }


    this.unique = function (arr) {
        var result = [],
            hash = {};
        for (var i = 0, elem;
             (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;

    }

}


