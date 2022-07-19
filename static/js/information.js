function InfChart() {
    var graph = {
        "parameters": []
    };
    var obj = null;

    var list_container = d3.select("#information")
        .append("div")
        .attr("id", "list_container")
        .style("height", $("#information").height() - 353 + "px");
    var width = $("#list_container").width();
    var sub_width = width - 10;
    var sub_height = 100;
    var step_number = 30;
    var histogram = d3.layout.histogram()
        .bins(step_number)
        .frequency(true);

    var padding = {left: 5, right: 5, bottom: 10, top: 20};
    var padding_width = sub_width - padding.left - padding.right;
    var padding_height = sub_height - padding.top - padding.bottom;
    var y_scale = d3.scale.sqrt().range([padding_height, 0]);
    var step = padding_width / step_number;
    var x_scale = d3.scale.linear().domain([0, step_number]).range([0, padding_width]);
    var item_list = {};

    InfChart.prototype.init = function (character_data, edges_number) {
        list_container.selectAll(".item_div").remove();
        graph.parameters = character_data;
        item_list = {
            "degree": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            },
            "degree_centrality":
                {
                    "data": [],
                    "flag": false,
                    "select_data": [],
                    "brush": d3.svg.brush().x(x_scale)
                },
            "closeness_centrality": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            },
            "betweness_centrality": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            },
            "eigenvector_centrality": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            },
            "clustering": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            },
            "continuous": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            },
            "discrete": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            },
            "port": {
                "data": [],
                "flag": false,
                "select_data": [],
                "brush": d3.svg.brush().x(x_scale)
            }
        };

        graph.parameters.forEach(function (item) {
            item_list.degree.data.push(+item.degree);
            item_list.continuous.data.push(+item.continuous);
            item_list.discrete.data.push(+item.discrete);
            item_list.port.data.push(+item.port);
            item_list.degree_centrality.data.push(+item.degree_centrality);
            item_list.closeness_centrality.data.push(+item.closeness_centrality);
            item_list.betweness_centrality.data.push(+item.betweness_centrality);
            item_list.eigenvector_centrality.data.push(+item.eigenvector_centrality);
            item_list.clustering.data.push(+item.clustering);
        });

        obj = {
            '节点总量': graph.parameters.length,
            '边总量': edges_number,
            '节点编号': graph.parameters[0].id,
            '连续属性': +graph.parameters[0].continuous,
            '离散属性': +graph.parameters[0].discrete,
            '节点端口': +graph.parameters[0].port,
            '度': +graph.parameters[0].degree,
            '度中心性': graph.parameters[0].degree_centrality,
            '接近中心性': graph.parameters[0].closeness_centrality,
            '介数中心性': graph.parameters[0].betweness_centrality,
            '特征向量中心性': graph.parameters[0].eigenvector_centrality,
            '聚类系数': graph.parameters[0].clustering,
            '特征分布': '特征类别——所有节点'
        };
        var gui = new dat.gui.GUI();
        gui.add(obj, '节点总量').listen();
        gui.add(obj, '边总量').listen();
        gui.add(obj, '节点编号').listen();
        gui.add(obj, '连续属性').listen();
        gui.add(obj, '离散属性').listen();
        gui.add(obj, '节点端口').listen();
        gui.add(obj, '度').listen();
        gui.add(obj, '度中心性').listen();
        gui.add(obj, '接近中心性').listen();
        gui.add(obj, '介数中心性').listen();
        gui.add(obj, '特征向量中心性').listen();
        gui.add(obj, '聚类系数').listen();
        var feature = gui.add(obj, '特征分布', ['特征类别——所有节点', '度分布', '度中心性分布', '接近中心性分布', '介数中心性分布', '特征向量中心性分布', '聚类系数分布', '端口分布', '连续属性分布', '离散属性分布']);
        feature.onChange(function (value) {
            drawGraph(value);
        });
        document.getElementById('information').appendChild(gui.domElement);
        /*禁止用户输入*/
        d3.select("#information").selectAll("input").attr("readonly", "readonly");
    };

    InfChart.prototype.update = function (item) {
        obj.节点编号 = item.id;
        obj.度 = item.degree;
        obj.连续属性 = item.continuous;
        obj.离散属性 = item.discrete;
        obj.节点端口 = item.port;
        obj.度中心性 = item.degree_centrality;
        obj.接近中心性 = item.closeness_centrality;
        obj.介数中心性 = item.betweness_centrality;
        obj.特征向量中心性 = item.eigenvector_centrality;
        obj.聚类系数 = item.clustering;
    };

    function drawGraph(type) {
        var item_div;
        switch (type) {
            case "度分布":
                if (!item_list.degree.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_degree");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.degree.flag = false;
                            item_list.degree.select_data = [];
                            item_list.degree.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.degree.brush.empty()) {
                                item_list.degree.brush.clear();
                                item_list.degree.brush(d3.select(".brush." + "info_degree").transition());
                                item_list.degree.brush.event(d3.select(".brush." + "info_degree").transition().delay(500));
                            }
                        });
                    item_list.degree.flag = true;
                    drawOneGraph(item_list.degree.data, "info_degree", "度");
                }
                break;
            case "度中心性分布":
                if (!item_list.degree_centrality.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_degree_centrality");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.degree_centrality.flag = false;
                            item_list.degree_centrality.select_data = [];
                            item_list.degree_centrality.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.degree_centrality.brush.empty()) {
                                item_list.degree_centrality.brush.clear();
                                item_list.degree_centrality.brush(d3.select(".brush." + "info_degree_centrality").transition());
                                item_list.degree_centrality.brush.event(d3.select(".brush." + "info_degree_centrality").transition().delay(500));
                            }
                        });
                    item_list.degree_centrality.flag = true;
                    drawOneGraph(item_list.degree_centrality.data, "info_degree_centrality", "度中心性");
                }
                break;
            case  "接近中心性分布":
                if (!item_list.closeness_centrality.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_closeness_centrality");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.closeness_centrality.flag = false;
                            item_list.closeness_centrality.select_data = [];
                            item_list.closeness_centrality.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.closeness_centrality.brush.empty()) {
                                item_list.closeness_centrality.brush.clear();
                                item_list.closeness_centrality.brush(d3.select(".brush." + "info_closeness_centrality").transition());
                                item_list.closeness_centrality.brush.event(d3.select(".brush." + "info_closeness_centrality").transition().delay(500));
                            }
                        });
                    item_list.closeness_centrality.flag = true;
                    drawOneGraph(item_list.closeness_centrality.data, "info_closeness_centrality", "接近中心性");
                }
                break;
            case  "介数中心性分布":
                if (!item_list.betweness_centrality.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_betweness_centrality");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.betweness_centrality.flag = false;
                            item_list.betweness_centrality.select_data = [];
                            item_list.betweness_centrality.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.betweness_centrality.brush.empty()) {
                                item_list.betweness_centrality.brush.clear();
                                item_list.betweness_centrality.brush(d3.select(".brush." + "info_betweness_centrality").transition());
                                item_list.betweness_centrality.brush.event(d3.select(".brush." + "info_betweness_centrality").transition().delay(500));
                            }
                        });
                    item_list.betweness_centrality.flag = true;
                    drawOneGraph(item_list.betweness_centrality.data, "info_betweness_centrality", "介数中心性");
                }
                break;
            case  "特征向量中心性分布":
                if (!item_list.eigenvector_centrality.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_eigenvector_centrality");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.eigenvector_centrality.flag = false;
                            item_list.eigenvector_centrality.select_data = [];
                            item_list.eigenvector_centrality.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.eigenvector_centrality.brush.empty()) {
                                item_list.eigenvector_centrality.brush.clear();
                                item_list.eigenvector_centrality.brush(d3.select(".brush." + "info_eigenvector_centrality").transition());
                                item_list.eigenvector_centrality.brush.event(d3.select(".brush." + "info_eigenvector_centrality").transition().delay(500));
                            }
                        });
                    item_list.eigenvector_centrality.flag = true;
                    drawOneGraph(item_list.eigenvector_centrality.data, "info_eigenvector_centrality", "特征向量中心性");
                }
                break;
            case "聚类系数分布":
                if (!item_list.clustering.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_clustering");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.clustering.flag = false;
                            item_list.clustering.select_data = [];
                            item_list.clustering.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.clustering.brush.empty()) {
                                item_list.clustering.brush.clear();
                                item_list.clustering.brush(d3.select(".brush." + "info_clustering").transition());
                                item_list.clustering.brush.event(d3.select(".brush." + "info_clustering").transition().delay(500));
                            }
                        });
                    item_list.clustering.flag = true;
                    drawOneGraph(item_list.clustering.data, "info_clustering", "聚类系数");
                }
                break;
            case "端口分布":
                if (!item_list.port.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_port");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.port.flag = false;
                            item_list.port.select_data = [];
                            item_list.port.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.port.brush.empty()) {
                                item_list.port.brush.clear();
                                item_list.port.brush(d3.select(".brush." + "info_port").transition());
                                item_list.port.brush.event(d3.select(".brush." + "info_port").transition().delay(500));
                            }
                        });
                    item_list.port.flag = true;
                    drawOneGraph(item_list.port.data, "info_port", "端口");
                }
                break;
            case "连续属性分布":
                if (!item_list.continuous.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_continuous");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.continuous.flag = false;
                            item_list.continuous.select_data = [];
                            item_list.continuous.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.continuous.brush.empty()) {
                                item_list.continuous.brush.clear();
                                item_list.continuous.brush(d3.select(".brush." + "info_continuous").transition());
                                item_list.continuous.brush.event(d3.select(".brush." + "info_continuous").transition().delay(500));
                            }
                        });
                    item_list.continuous.flag = true;
                    drawOneGraph(item_list.continuous.data, "info_continuous", "连续属性");
                }
                break;
            case "离散属性分布":
                if (!item_list.discrete.flag) {
                    item_div = list_container.append("div").attr("class", "item_div").attr("id", "info_discrete");
                    item_div.append("img")
                        .attr("class", "info_close")
                        .attr("src", "../static/img/close.png")
                        .attr("title", "关闭")
                        .on("click", function () {
                            item_div.remove();
                            item_list.discrete.flag = false;
                            item_list.discrete.select_data = [];
                            item_list.discrete.brush.clear();
                            restore();
                        });
                    item_div.append("img")
                        .attr("class", "info_trash")
                        .attr("src", "../static/img/eraser.png")
                        .attr("title", "清空选定")
                        .on("click", function () {
                            if (!item_list.discrete.brush.empty()) {
                                item_list.discrete.brush.clear();
                                item_list.discrete.brush(d3.select(".brush." + "info_discrete").transition());
                                item_list.discrete.brush.event(d3.select(".brush." + "info_discrete").transition().delay(500));
                            }
                        });
                    item_list.discrete.flag = true;
                    drawOneGraph(item_list.discrete.data, "info_discrete", "离散属性");
                }
                break;
        }
    }

    function drawOneGraph(data, div_id, text) {
        var extent = d3.extent(data);
        histogram.range(extent);
        var his_data = histogram(data);
        var brush_extent = [0, 0];
        y_scale.domain([0, d3.max(his_data, function (d) {
            return d.y;
        })]);
        var svg = d3.select("#" + div_id)
            .append("svg")
            .attr("width", sub_width)
            .attr("height", sub_height);

        svg.append("text")
            .attr("class", "item_text")
            .attr("x", 5)
            .attr("y", 14)
            .text(text);

        var tip_label = svg.append("text").attr("class", "tip_label").attr("x", 90).attr("y", 14);

        var svg_g = svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

        svg_g.selectAll(".bar")
            .data(his_data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return x_scale(i);
            })
            .attr("width", step - 1)
            .attr("y", function (d) {
                return y_scale(d.y);
            })
            .attr("height", function (d) {
                return padding_height - y_scale(d.y);
            });

        var now_brush;
        switch (div_id) {
            case "info_degree":
                now_brush = item_list.degree.brush;
                break;
            case "info_degree_centrality":
                now_brush = item_list.degree_centrality.brush;
                break;
            case  "info_closeness_centrality":
                now_brush = item_list.closeness_centrality.brush;
                break;
            case  "info_betweness_centrality":
                now_brush = item_list.betweness_centrality.brush;
                break;
            case  "info_eigenvector_centrality":
                now_brush = item_list.eigenvector_centrality.brush;
                break;
            case "info_clustering":
                now_brush = item_list.clustering.brush;
                break;
            case "info_port":
                now_brush = item_list.port.brush;
                break;
            case  "info_discrete":
                now_brush = item_list.discrete.brush;
                break;
            case  "info_continuous":
                now_brush = item_list.continuous.brush;
                break;
        }
        now_brush.on("brushend", brushEnd);
        var brush_g = svg_g.append("g").attr("class", "brush " + div_id);
        brush_g.call(now_brush).selectAll("rect").attr("height", padding_height);

        function brushEnd() {
            var extent = now_brush.extent();
            extent = [Math.round(extent[0]), Math.round(extent[1])];
            /*transition 会造成在进行一次brushstart brush brushend 的响应 形成死循环*/
            if (brush_extent[0] !== extent[0] || brush_extent[1] !== extent[1]) {
                brush_extent = extent;
                now_brush.extent(brush_extent);
                now_brush(d3.select(".brush." + div_id).transition());
                now_brush.event(d3.select(".brush." + div_id).transition().delay(500));
                if (!now_brush.empty()) {
                    var true_range = [his_data[extent[0]].x, his_data[extent[0]].x + (extent[1] - extent[0]) * his_data[0].dx];
                    var error_range = [true_range[0] - his_data[0].dx / 1000, true_range[1] + his_data[0].dx / 1000];//刚好相等时候由于很小的错误导致无法筛选
                    switch (div_id) {
                        case "info_degree":
                            item_list.degree.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.degree >= error_range[0] && value.degree <= error_range[1]) {
                                    item_list.degree.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.degree.select_data.length + " 范围：" + Math.ceil(true_range[0]) + " ~ " + Math.floor(true_range[1]));
                            break;
                        case "info_degree_centrality":
                            item_list.degree_centrality.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.degree_centrality >= error_range[0] && value.degree_centrality <= error_range[1]) {
                                    item_list.degree_centrality.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.degree_centrality.select_data.length + " 范围：" + true_range[0].toExponential(2) + " ~ " + true_range[1].toExponential(2));
                            break;
                        case  "info_closeness_centrality":
                            item_list.closeness_centrality.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.closeness_centrality >= error_range[0] && value.closeness_centrality <= error_range[1]) {
                                    item_list.closeness_centrality.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.closeness_centrality.select_data.length + " 范围：" + true_range[0].toExponential(2) + " ~ " + true_range[1].toExponential(2));
                            break;
                        case  "info_betweness_centrality":
                            item_list.betweness_centrality.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.betweness_centrality >= error_range[0] && value.betweness_centrality <= error_range[1]) {
                                    item_list.betweness_centrality.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.betweness_centrality.select_data.length + " 范围：" + true_range[0].toExponential(2) + " ~ " + true_range[1].toExponential(2));
                            break;
                        case  "info_eigenvector_centrality":
                            item_list.eigenvector_centrality.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.eigenvector_centrality >= error_range[0] && value.eigenvector_centrality <= error_range[1]) {
                                    item_list.eigenvector_centrality.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.eigenvector_centrality.select_data.length + " 范围：" + true_range[0].toExponential(2) + " ~ " + true_range[1].toExponential(2));
                            break;
                        case "info_clustering":
                            item_list.clustering.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.clustering >= error_range[0] && value.clustering <= error_range[1]) {
                                    item_list.clustering.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.clustering.select_data.length + " 范围：" + true_range[0].toExponential(2) + " ~ " + true_range[1].toExponential(2));
                            break;
                        case  "info_port":
                            item_list.port.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.port >= error_range[0] && value.port <= error_range[1]) {
                                    item_list.port.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.port.select_data.length + " 范围：" + Math.ceil(true_range[0]) + " ~ " + Math.floor(true_range[1]));
                            break;
                        case  "info_continuous":
                            item_list.continuous.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.continuous >= error_range[0] && value.continuous <= error_range[1]) {
                                    item_list.continuous.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.continuous.select_data.length + " 范围：" + Math.ceil(true_range[0]) + " ~ " + Math.floor(true_range[1]));
                            break;
                        case "info_discrete":
                            item_list.discrete.select_data = [];
                            graph.parameters.forEach(function (value) {
                                if (value.discrete >= error_range[0] && value.discrete <= error_range[1]) {
                                    item_list.discrete.select_data.push(value.id);
                                }
                            });
                            tip_label.text("数量：" + item_list.discrete.select_data.length + " 范围：" + Math.ceil(true_range[0]) + " ~ " + Math.floor(true_range[1]));
                            break;
                    }
                }
                else {
                    switch (div_id) {
                        case "info_degree":
                            item_list.degree.select_data = [];
                            break;
                        case "info_degree_centrality":
                            item_list.degree_centrality.select_data = [];
                            break;
                        case  "info_closeness_centrality":
                            item_list.closeness_centrality.select_data = [];
                            break;
                        case  "info_betweness_centrality":
                            item_list.betweness_centrality.select_data = [];
                            break;
                        case  "info_eigenvector_centrality":
                            item_list.eigenvector_centrality.select_data = [];
                            break;
                        case "info_clustering":
                            item_list.clustering.select_data = [];
                            break;
                        case "info_port":
                            item_list.port.select_data = [];
                            break;
                        case  "info_continuous":
                            item_list.continuous.select_data = [];
                            break;
                        case  "info_discrete":
                            item_list.discrete.select_data = [];
                            break;
                    }
                    tip_label.text("");
                }
                restore();
            }
            else {
                return false;
            }
        }
    }

    function restore() {
        if (item_list.degree.brush.empty()
            && item_list.degree_centrality.brush.empty()
            && item_list.clustering.brush.empty()
            && item_list.closeness_centrality.brush.empty()
            && item_list.eigenvector_centrality.brush.empty()
            && item_list.betweness_centrality.brush.empty()
            && item_list.port.brush.empty()
            && item_list.continuous.brush.empty()
            && item_list.discrete.brush.empty()) {
            info_table.restore();
            now_layout.restore();
        }
        else {
            var multiple_result = item_list.degree.select_data
                .concat(item_list.degree_centrality.select_data)
                .concat(item_list.closeness_centrality.select_data)
                .concat(item_list.betweness_centrality.select_data)
                .concat(item_list.eigenvector_centrality.select_data)
                .concat(item_list.clustering.select_data)
                .concat(item_list.port.select_data)
                .concat(item_list.continuous.select_data)
                .concat(item_list.discrete.select_data);
            var result = d3.set(multiple_result).values();
            info_table.update(result);
            now_layout.update(result);
        }
    }
}

var info_chart = new InfChart();