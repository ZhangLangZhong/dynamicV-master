function BundleChart() {
    var main_div = $("#main");
    var mainChart = {
        width: main_div.width(),
        height: main_div.height(),
        radius: Math.min(main_div.width(), main_div.height()) / 2,
        svg: null,
        map_svg: null,
        mini_width: 200,
        mini_border: 2,
        padding: 40,
        label_show_flag: false,
        selected_node: null,
        selected_node_data: null,
        selected_link: null,
        selected_link_data: null
    };
    init();
    fresh();

    function run(d) {
        info_chart.init(d.nodes, d.links.length);
        info_table.init(d.nodes);
        control_chart.initParameters();
        mainChart.now_label_size = INIT_LABEL_SIZE;
        mainChart.now_label_color = INIT_LABEL_COLOR;
        mainChart.now_label_opacity = INIT_LABEL_OPACITY;
        handleData(d);
        drawGraph();
        miniMap();
    }

    function init() {
        mainChart.line = d3.svg.line.radial()
            .interpolate("bundle")
            .tension(0.85)
            .radius(function (d) {
                return d.y;
            })
            .angle(function (d) {
                return d.x / 180 * Math.PI;
            });

        mainChart.node_click_state = 0;
        mainChart.move_state = 0;
        mainChart.tools = d3.select("#main")
            .append("div")
            .attr("class", "btn-group")
            .style({
                "position": "absolute",
                "z-index": "999",
                "top": "2%",
                "left": "2%"
            })
            .selectAll("btn btn-default")
            .data(["refresh", "resize-full", "unchecked"])
            .enter()
            .append("button")
            .attr({
                "type": "button",
                "class": "btn btn-default"
            })
            .attr("title", function (d) {
                switch (d) {
                    case "refresh":
                        return "刷新";
                    case "resize-full":
                        return "重置";
                    case "unchecked":
                        return "框选";
                }
            });
        mainChart.tools.append("span")
            .attr("class", function (d) {
                return "glyphicon glyphicon-" + d;
            })
            .attr("aria-hidden", "true");

        mainChart.tools.on("click", function (d) {
            switch (d) {
                case "refresh":
                    fresh();
                    break;
                case "resize-full":
                    resizeFull();
                    break;
                case "unchecked":
                    regionSelect();
                    break;
            }
        });
        mainChart.parameters = d3.select("#main")
            .append("div")
            .attr("class", "parameters");

        mainChart.tension = mainChart.parameters.append("div").attr("class", "rows");
        mainChart.tension.append("span")
            .attr("class", "tip_label")
            .text("捆绑程度：");

        mainChart.tension.append("input")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", 100)
            .attr("value", 85)
            .style("background-size", "85% 100%")
            .on("input", function () {
                d3.select(this).style("background-size", (this.value - this.min) / (this.max - this.min) * 100 + "% 100%");
                mainChart.line.tension(this.value / this.max);
                /*重置数据，要会和小地图影响*/
                mainChart.cluster.size([360, mainChart.inner_radius]);
                mainChart.result_nodes = mainChart.cluster.nodes(mainChart.nodes_trans);
                mainChart.result_links = mainChart.bundle(reflection(mainChart.result_nodes, mainChart.links));
                mainChart.svg_links.attr("d", mainChart.line);

                mainChart.cluster.size([360, mainChart.mini_inner_radius]);
                mainChart.mini_result_nodes = mainChart.cluster.nodes(mainChart.nodes_trans);
                mainChart.mini_result_links = mainChart.bundle(reflection(mainChart.mini_result_nodes, mainChart.links));
                mainChart.mini_svg_links.attr("d", mainChart.line);
            });

        d3.select("#main")
            .append("div")
            .attr("id", "mini_map")
            .style("width", mainChart.mini_width + mainChart.mini_border + "px")
            .style("height", mainChart.mini_width + mainChart.mini_border + "px");
    }

    function fresh() {
        $("#loading").css("display", "block"); // loading
        $("#over").css("display", "block"); // loading
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/layout",
            data: {'layout_type': now_layout_type},
            async: true,
            contentType: "application/json",
            success: function (d) {
                $("#loading").css("display", "none");
                $("#over").css("display", "none"); 
                run(d);
            },
            Error: function () {
                console.log("error");
            }
        });
    }

    function reflection(nodes, links) {
        var hash = [];
        for (var i = 0; i !== nodes.length; ++i) {
            hash[nodes[i].id] = nodes[i];
        }
        var edges = [];
        for (i = 0; i < links.length; i++) {
            edges.push({
                source: hash[links[i].source],
                target: hash[links[i].target]
            });
        }
        return edges;
    }

    function resizeFull() {
        mainChart.translate = [0, 0];
        mainChart.scale = 1;
        mainChart.g.style("transform", "translate(" + mainChart.translate[0] + "px," + mainChart.translate[1] + "px)scale(" + mainChart.scale + ")");
        mainChart.zoom.translate(mainChart.translate);
        mainChart.zoom.scale(mainChart.scale);
        mainChart.svg_links
            .attr("stroke-opacity", function (d) {
                for (var index = 0; index !== mainChart.links.length; index++) {
                    if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                        return +mainChart.links[index].opacity;
                    }
                }
            })
            .attr("stroke-width", function (d) {
                for (var index = 0; index !== mainChart.links.length; index++) {
                    if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                        return +mainChart.links[index].weight;
                    }
                }
            });

        mainChart.svg_nodes
            .attr("opacity", function (d) {
                return +d.opacity;
            })
            .attr("r", function (d) {
                return +d.size;
            })
            .attr("stroke-width", NODE_STROKE_WIDTH);
        mainChart.nodes_label.attr("font-size", mainChart.now_label_size);
        mainChart.map_frame.attr("transform", "translate(0, 0)").attr("width", mainChart.mini_width).attr("height", mainChart.mini_height);

        level(mainChart.scale);
    }

    function regionSelect() {
        mainChart.node_click_state = 1;
        removeZoom();
        var start_pos;
        mainChart.svg.on("mousedown", function () {
            mainChart.move_state = 0;
            start_pos = d3.mouse(this);
            mainChart.svg.append("rect")
                .attr({
                    "class": "rect_selection",
                    "x": start_pos[0],
                    "y": start_pos[1]
                })
        }).on("mousemove", function () {
            var s = mainChart.svg.select(".rect_selection");
            if (!s.empty() && mainChart.move_state === 0) {
                var pos = d3.mouse(this);
                var parameters = {
                    x: Math.min(pos[0], start_pos[0]),
                    y: Math.min(pos[1], start_pos[1]),
                    width: Math.abs(start_pos[0] - pos[0]),
                    height: Math.abs(start_pos[1] - pos[1])
                };
                s.attr("x", parameters.x)
                    .attr("y", parameters.y)
                    .attr("width", parameters.width)
                    .attr("height", parameters.height);

                mainChart.svg_links.attr("stroke-opacity", LOW_MAIN_OPACITY);
                mainChart.svg_nodes.attr("opacity", LOW_MAIN_OPACITY);
                var selected_data = d3.set();
                mainChart.svg_nodes.each(function (every) {
                    var cx = parseFloat(d3.select(this).attr("cx"));
                    var cy = parseFloat(d3.select(this).attr("cy"));
                    var node_x = mainChart.scale * (cx + mainChart.width / 2) + mainChart.translate[0];
                    var node_y = mainChart.scale * (cy + mainChart.height / 2) + mainChart.translate[1];
                    if (node_x >= parameters.x && node_x <= parameters.x + parameters.width &&
                        node_y >= parameters.y && node_y <= parameters.y + parameters.height) {
                        d3.select(this).attr("opacity", REGION_OPACITY);
                        selected_data.add(every.id);
                        mainChart.links.forEach(function (item) {
                            if (item.source === every.id) {
                                d3.select("#link_" + item.id).attr("stroke-opacity", REGION_OPACITY);
                                d3.select("#node_" + item.target + " circle").attr("opacity", REGION_OPACITY);
                                selected_data.add(item.target);
                            }
                            if (item.target === every.id) {
                                d3.select("#link_" + item.id).attr("stroke-opacity", REGION_OPACITY);
                                d3.select("#node_" + item.source + " circle").attr("opacity", REGION_OPACITY);
                                selected_data.add(item.source);
                            }
                        });
                    }
                });
                info_table.update(selected_data.values());
            }
        }).on("mouseup", function () {
            mainChart.move_state = 1;
            mainChart.svg.on("mousedown", null);
            mainChart.svg.on("mousemove", null);
            mainChart.svg.on("mouseup", null);
            mainChart.svg.selectAll("rect.rect_selection").remove();
            mainChart.rect.call(mainChart.zoom);
            mainChart.svg_nodes.on("mouseover", nodeMoveOver);
            mainChart.svg_nodes.on("mouseout", nodeMoveOut);
            mainChart.svg_links.on("mouseover", linkMoveOver);
            mainChart.svg_links.on("mouseout", linkMoveOut);
        })
    }

    function zoomed() {
        mainChart.translate = d3.event.translate;
        mainChart.scale = d3.event.scale;
        mainChart.g.style("transform", "translate(" + mainChart.translate[0] + "px," + mainChart.translate[1] + "px)scale(" + mainChart.scale + ")");
        /*g放大的时候其子节点不放大*/
        if (mainChart.scale > 1) {
            mainChart.svg_nodes.attr("r", function (d) {
                return +d.size / mainChart.scale;
            }).attr("stroke-width", NODE_STROKE_WIDTH / mainChart.scale);

            mainChart.svg_links.attr("stroke-width", function (d) {
                for (var index = 0; index !== mainChart.links.length; index++) {
                    if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                        return +mainChart.links[index].weight / mainChart.scale;
                    }
                }
            });
            mainChart.nodes_label.attr("font-size", mainChart.now_label_size / mainChart.scale);
        }
        mainChart.map_frame.attr("transform", "translate(" + (-mainChart.translate[0] * mainChart.mini_scale / mainChart.scale) + ","
            + (-mainChart.translate[1] * mainChart.mini_scale / mainChart.scale) + ")")
            .attr("width", mainChart.mini_width / mainChart.scale)
            .attr("height", mainChart.mini_height / mainChart.scale);

        level(mainChart.scale);
    }

    function removeZoom() {
        mainChart.rect.on(".zoom", null);//移除所有zoom事件
        mainChart.svg_nodes.on("mouseover", null);
        mainChart.svg_nodes.on("mouseout", null);
        mainChart.svg_links.on("mouseover", null);
        mainChart.svg_links.on("mouseout", null);
    }

    function handleData(d) {
        mainChart.nodes = d.nodes;
        mainChart.links = d.links;
        mainChart.nodes_trans = {
            id: "",
            children: mainChart.nodes
        };
    }

    function drawGraph() {
        if (mainChart.svg) mainChart.svg.remove();
        if (mainChart.map_svg) mainChart.map_svg.remove();
        mainChart.translate = [0, 0];
        mainChart.scale = 1;
        mainChart.zoom = d3.behavior.zoom()
            .scaleExtent(SCALE_EXTENT)
            .on("zoom", zoomed);

        mainChart.inner_radius = mainChart.radius - mainChart.padding;
        mainChart.cluster = d3.layout.cluster()
            .size([360, mainChart.inner_radius])
            .sort(function (a, b) {
                return d3.ascending(a.key, b.key);
            });
        mainChart.result_nodes = mainChart.cluster.nodes(mainChart.nodes_trans);
        mainChart.bundle = d3.layout.bundle();
        /*result_links中并不包含边所附带的属性*/
        mainChart.result_links = mainChart.bundle(reflection(mainChart.result_nodes, mainChart.links));

        mainChart.svg = d3.select("#main")
            .append("svg")
            .attr("width", mainChart.width)
            .attr("height", mainChart.height);

        mainChart.rect = mainChart.svg.append("rect")
            .attr("width", mainChart.width)
            .attr("height", mainChart.height)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .call(mainChart.zoom);

        mainChart.group = mainChart.svg.append("g")
            .attr("transform", "translate(" + mainChart.width / 2 + "," + mainChart.height / 2 + ")");

        /*mainChart.group的变换导致mainChart.g的坐标原点并不在左上角，而在svg的坐标变换中不能设置变换的相对坐标，但是css3可以设置相对坐标（attr使用svg变换，style使用css3变换）*/
        mainChart.g = mainChart.group.append("g")
            .style("transform-origin", (-mainChart.width / 2) + "px " + (-mainChart.height / 2) + "px");

        mainChart.svg_links = mainChart.g.selectAll(".links")
            .data(mainChart.result_links)
            .enter()
            .append("path")
            .attr("id", function (d) {
                for (var index = 0; index !== mainChart.links.length; index++) {
                    if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                        return "link_" + mainChart.links[index].id;
                    }
                }
            })
            .attr("stroke-opacity", function (d) {
                for (var index = 0; index !== mainChart.links.length; index++) {
                    if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                        return +mainChart.links[index].opacity;
                    }
                }
            })
            .attr("stroke", function (d) {
                for (var index = 0; index !== mainChart.links.length; index++) {
                    if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                        return mainChart.links[index].color;
                    }
                }
            })
            .attr("stroke-width", function (d) {
                for (var index = 0; index !== mainChart.links.length; index++) {
                    if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                        return +mainChart.links[index].weight;
                    }
                }
            })
            .attr("d", mainChart.line)
            .attr("fill", "none")
            .classed("select_link", false);

        mainChart.selected_link = d3.select("#link_" + mainChart.links[0].id);
        mainChart.selected_link_data = mainChart.links[0];
        mainChart.selected_link.attr("stroke", CLICK_SELECT_COLOR).classed("select_link", true);
        control_chart.updateLink(mainChart.selected_link_data);

        mainChart.svg_nodes_g = mainChart.g.selectAll(".nodes")
            .data(mainChart.result_nodes.filter(function (d) {
                return !d.children;
            }))
            .enter()
            .append("g")
            .attr("id", function (d) {
                return "node_" + d.id;
            });

        mainChart.svg_nodes = mainChart.svg_nodes_g.append("circle")
            .attr("r", function (d) {
                return +d.size;
            })
            .attr("opacity", function (d) {
                return +d.opacity;
            })
            .attr("fill", function (d) {
                return d.color;
            })
            .attr("stroke", function (d) {
                return d.stroke;
            })
            .attr("stroke-width", NODE_STROKE_WIDTH)
            .classed("select_node", false)
            .attr("cx", function (d) {
                return (d.y + 10) * Math.cos((d.x - 90) * Math.PI / 180);
            })
            .attr("cy", function (d) {
                return (d.y + 10) * Math.sin((d.x - 90) * Math.PI / 180);
            });

        mainChart.selected_node = d3.select("#node_" + mainChart.nodes[0].id + " circle");
        mainChart.selected_node_data = mainChart.nodes[0];
        mainChart.selected_node.attr("fill", CLICK_SELECT_COLOR).classed("select_node", true);
        control_chart.updateNode(mainChart.selected_node_data);

        mainChart.nodes_label = mainChart.svg_nodes_g.append("text")
            .attr("transform", function (d) {
                return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 15) + ",0)" + (d.x < 180 ? "" : "rotate(180)");
            })
            .attr("dy", "2px")
            .attr("text-anchor", function (d) {
                return d.x < 180 ? "start" : "end";
            })
            .attr("fill", mainChart.now_label_color)
            .attr("font-size", mainChart.now_label_size)
            .attr("opacity", mainChart.now_label_opacity)
            .attr("visibility", "hidden")
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return d.id;
            });

        mainChart.svg_nodes.on("mouseover", nodeMoveOver);

        mainChart.svg_nodes.on("mouseout", nodeMoveOut);

        mainChart.svg_nodes.on("click", nodeClick);

        mainChart.svg_nodes.on("dblclick", nodedbleClick);

        mainChart.svg_links.on("mouseover", linkMoveOver);

        mainChart.svg_links.on("mouseout", linkMoveOut);

        mainChart.svg_links.on("click", linkClick);

        mainChart.mini_height = mainChart.mini_width * (mainChart.height / mainChart.width);
        mainChart.mini_scale = mainChart.mini_width / mainChart.width;

        mainChart.map_svg = d3.select("#mini_map")
            .append("svg")
            .attr("width", mainChart.mini_width)
            .attr("height", mainChart.mini_height)
            .attr("transform", "translate(0," + (mainChart.mini_width - mainChart.mini_height) / 2 + ")");

        level(mainChart.scale);
    }

    function level(level) {
        if (SHOW_ALL) {
            mainChart.svg_nodes_g.attr("display", "block");
            mainChart.svg_links.attr("display", "block");
        }
        else {
            var log = Math.ceil(level);
            mainChart.svg_nodes_g.attr("display", function (d) {
                return (parseInt(d.level) > log ? "none" : "block");
            });
            mainChart.svg_links.attr("display", function (d) {
                return ((parseInt(d[0].level) > log || parseInt(d[2].level) > log) ? "none" : "block");
            });
        }
    }

    function miniMap() {
        mainChart.mini_inner_radius = mainChart.mini_height / 2 - mainChart.padding * mainChart.mini_scale;
        mainChart.cluster.size([360, mainChart.mini_inner_radius]);
        mainChart.mini_result_nodes = mainChart.cluster.nodes(mainChart.nodes_trans);
        mainChart.mini_result_links = mainChart.bundle(reflection(mainChart.mini_result_nodes, mainChart.links));
        mainChart.map_group = mainChart.map_svg.append("g").attr("transform", "translate(" + mainChart.mini_width / 2 + "," + mainChart.mini_height / 2 + ")");
        mainChart.map_g = mainChart.map_group.append("g");
        mainChart.mini_svg_links = mainChart.map_g.selectAll(".m_links")
            .data(mainChart.mini_result_links)
            .enter()
            .append("path")
            .attr("stroke-opacity", MINI_LINK_OPACITY)
            .attr("stroke", MINI_LINK_COLOR)
            .attr("stroke-width", MINI_LINK_WIDTH)
            .attr("fill", "none")
            .attr("d", mainChart.line);

        mainChart.map_g.selectAll(".m_nodes")
            .data(mainChart.mini_result_nodes.filter(function (d) {
                return !d.children;
            }))
            .enter()
            .append("circle")
            .attr("r", MINI_NODE_SIZE)
            .attr("opacity", MINI_NODE_OPACITY)
            .attr("fill", MINI_NODE_COLOR)
            .attr("transform", function (d) {
                return "rotate(" + (d.x - 90) + ")translate(" + (d.y) + ",0)" + (d.x < 180 ? "" : "rotate(180)");
            });

        mainChart.map_drag = d3.behavior.drag()
            .on("dragstart", function () {
                mainChart.mini_translate = d3.transform(mainChart.map_frame.attr("transform")).translate;
            })
            .on("drag", function () {
                mainChart.mini_translate[0] += d3.event.dx;
                mainChart.mini_translate[1] += d3.event.dy;
                mainChart.map_frame.attr("transform", "translate(" + mainChart.mini_translate[0] + "," + mainChart.mini_translate[1] + ")");
                var translate = [(-mainChart.mini_translate[0] / mainChart.mini_scale * mainChart.scale), (-mainChart.mini_translate[1] / mainChart.mini_scale * mainChart.scale)];
                mainChart.g.style("transform", "translate(" + translate[0] + "px," + translate[1] + "px)scale(" + mainChart.scale + ")");
            });

        mainChart.map_frame = mainChart.map_svg.append("rect")
            .attr("class", "mini_background")
            .attr("width", mainChart.mini_width)
            .attr("height", mainChart.mini_height)
            .attr("cursor", "move")
            .call(mainChart.map_drag);

    }

    function linkClick(d) {
        if (d3.select(this).classed("select_link"))
            return false;
        else {
            mainChart.selected_link.attr("stroke", mainChart.selected_link_data.color).classed("select_link", false);
            mainChart.selected_link = d3.select(this);
            for (var index = 0; index !== mainChart.links.length; index++) {
                if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                    mainChart.selected_link_data = mainChart.links[index];
                    break;
                }
            }
            mainChart.selected_link.attr("stroke", CLICK_SELECT_COLOR).classed("select_link", true);
            control_chart.updateLink(mainChart.selected_link_data);
        }
    }

    function linkMoveOver(d) {
        d3.select(this).attr("stroke", OVER_COLOR);
        d3.select("#node_" + d[0]["id"] + " circle").attr("fill", SOURCE_COLOR);
        d3.select("#node_" + d[0]["id"] + " text").attr("visibility", "visible").attr("fill", SOURCE_COLOR);
        d3.select("#node_" + d[2]["id"] + " circle").attr("fill", TARGET_COLOR);
        d3.select("#node_" + d[2]["id"] + " text").attr("visibility", "visible").attr("fill", TARGET_COLOR);
    }

    function linkMoveOut(d) {
        for (var index = 0; index !== mainChart.links.length; index++) {
            if (d[0].id === mainChart.links[index].source && d[2].id === mainChart.links[index].target) {
                d3.select(this).attr("stroke", mainChart.links[index].color);
                break;
            }
        }
        if (d3.select(this).classed("select_link")) d3.select(this).attr("stroke", CLICK_SELECT_COLOR);
        mainChart.nodes.forEach(function (item) {
            if (item.id === d[0]["id"]) {
                d3.select("#node_" + d[0]["id"] + " circle").attr("fill", item.color);
                d3.select("#node_" + d[0]["id"] + " text").attr("fill", mainChart.now_label_color);
                if (!mainChart.label_show_flag) {
                    d3.select("#node_" + d[0]["id"] + " text").attr("visibility", "hidden")
                }
            }
            if (item.id === d[2]["id"]) {
                d3.select("#node_" + d[2]["id"] + " circle").attr("fill", item.color);
                d3.select("#node_" + d[2]["id"] + " text").attr("fill", mainChart.now_label_color);
                if (!mainChart.label_show_flag) {
                    d3.select("#node_" + d[2]["id"] + " text").attr("visibility", "hidden");
                }
            }
        });
    }

    function nodeClick(d) {
        if (d3.select(this).classed("select_node"))
            return false;
        else {
            mainChart.selected_node.attr("fill", mainChart.selected_node_data.color).classed("select_node", false);
            mainChart.selected_node = d3.select(this);
            mainChart.selected_node_data = d;
            mainChart.selected_node.attr("fill", CLICK_SELECT_COLOR).classed("select_node", true);
            info_chart.update(mainChart.selected_node_data);
            control_chart.updateNode(mainChart.selected_node_data);
        }
    }


    // 双击操作
    function nodedbleClick(d) {
        var result_link = []
        mainChart.links.forEach(function (t) {
            if (t.source === d.id) {
                result_link.push(t.target)
            } else if (t.target === d.id) {
                result_link.push(t.source)
            }
        })
        console.log(result_link);
        info_table.update(result_link);
    }

    function nodeMoveOver(d) {
        d3.select(this).attr("fill", OVER_COLOR);
        d3.select("#node_" + d.id + " text").attr("visibility", "visible").attr("fill", OVER_COLOR);
        mainChart.links.forEach(function (t) {
            if (t.source === d.id) {
                d3.select("#link_" + t.id).attr("stroke", TARGET_COLOR);
                d3.select("#node_" + t.target + " circle").attr("fill", TARGET_COLOR);
                d3.select("#node_" + t.target + " text").attr("visibility", "visible").attr("fill", TARGET_COLOR);
            }
            else if (t.target === d.id) {
                d3.select("#link_" + t.id).attr("stroke", SOURCE_COLOR);
                d3.select("#node_" + t.source + " circle").attr("fill", SOURCE_COLOR);
                d3.select("#node_" + t.source + " text").attr("visibility", "visible").attr("fill", SOURCE_COLOR);
            }
        });
    }

    function nodeMoveOut(d) {
        d3.select(this).attr("fill", d.color);
        if (d3.select(this).classed("select_node")) d3.select(this).attr("fill", CLICK_SELECT_COLOR);
        d3.select("#node_" + d.id + " text").attr("fill", mainChart.now_label_color);
        if (!mainChart.label_show_flag) {
            d3.select("#node_" + d.id + " text").attr("visibility", "hidden");
        }
        mainChart.links.forEach(function (t) {
            if (t.source === d.id) {
                d3.select("#link_" + t.id).attr("stroke", t.color);
                mainChart.nodes.forEach(function (item) {
                    if (item.id === t.target) {
                        d3.select("#node_" + t.target + " circle").attr("fill", item.color);
                        if (d3.select("#node_" + t.target + " circle").classed("select_node")) d3.select("#node_" + t.target + " circle").attr("fill", CLICK_SELECT_COLOR);
                        d3.select("#node_" + t.target + " text").attr("fill", mainChart.now_label_color);
                        if (!mainChart.label_show_flag) {
                            d3.select("#node_" + t.target + " text").attr("visibility", "hidden");
                        }
                    }
                });
            }
            else if (t.target === d.id) {
                d3.select("#link_" + t.id).attr("stroke", t.color);
                mainChart.nodes.forEach(function (item) {
                    if (item.id === t.source) {
                        d3.select("#node_" + t.source + " circle").attr("fill", item.color);
                        if (d3.select("#node_" + t.source + " circle").classed("select_node")) d3.select("#node_" + t.source + " circle").attr("fill", CLICK_SELECT_COLOR);
                        d3.select("#node_" + t.source + " text").attr("fill", mainChart.now_label_color);
                        if (!mainChart.label_show_flag) {
                            d3.select("#node_" + t.source + " text").attr("visibility", "hidden");
                        }
                    }
                });
            }
        })
    }

    BundleChart.prototype.update = function (data) {
        mainChart.svg_links.attr("stroke-opacity", LOW_MAIN_OPACITY);
        mainChart.svg_nodes.attr("opacity", LOW_MAIN_OPACITY);
        data.forEach(function (value) {
            d3.select("#node_" + value + " circle").attr("opacity", REGION_OPACITY);
        });
    };

    BundleChart.prototype.restore = function () {
        mainChart.svg_links.attr("stroke-opacity", function (d) {
            return +d.opacity;
        });
        mainChart.svg_nodes.attr("opacity", function (d) {
            return +d.opacity;
        });
    };

    BundleChart.prototype.setNodeColor = function (node_color) {
        if (NODE_ALL) {
            mainChart.svg_nodes.attr("fill", node_color);
            mainChart.svg_nodes[0].forEach(function (item) {
                return item.__data__.color = node_color;
            })
        } else {
            mainChart.selected_node.attr("fill", node_color);
            mainChart.selected_node_data.color = node_color;
        }
    };

    BundleChart.prototype.setNodeStroke = function (node_stroke) {
        if (NODE_ALL) {
            mainChart.svg_nodes.attr("stroke", node_stroke);
            mainChart.svg_nodes[0].forEach(function (item) {
                return item.__data__.stroke = node_stroke;
            })
        } else {
            mainChart.selected_node.attr("stroke", node_stroke);
            mainChart.selected_node_data.stroke = node_stroke;
        }
    };

    BundleChart.prototype.setNodeSize = function (node_size) {
        if (NODE_ALL) {
            mainChart.svg_nodes.attr("r", node_size / mainChart.scale);
            mainChart.svg_nodes[0].forEach(function (item) {
                return item.__data__.size = node_size.toString();
            })
        } else {
            mainChart.selected_node.attr("r", node_size / mainChart.scale);
            mainChart.selected_node_data.size = node_size.toString();
        }
    };

    BundleChart.prototype.setNodeOpacity = function (node_opacity) {
        if (NODE_ALL) {
            mainChart.svg_nodes.attr("opacity", node_opacity);
            mainChart.svg_nodes[0].forEach(function (item) {
                return item.__data__.opacity = node_opacity;
            })
        } else {
            mainChart.selected_node.attr("opacity", node_opacity);
            mainChart.selected_node_data.opacity = node_opacity.toString();
        }
    };

    BundleChart.prototype.setEdgeWidth = function (link_width) {
        if (EDGE_ALL) {
            mainChart.svg_links.attr("stroke-width", link_width);
            mainChart.svg_links[0].forEach(function (item) {
                return item.__data__.weight = link_width;
            })
        } else {
            mainChart.selected_link.attr("stroke-width", link_width / mainChart.scale);
            mainChart.selected_link_data.weight = link_width;
        }
    };

    BundleChart.prototype.setEdgeColor = function (edge_color) {
        if (EDGE_ALL) {
            mainChart.svg_links.attr("stroke", edge_color);
            mainChart.svg_links[0].forEach(function (item) {
                return item.__data__.color = edge_color;
            })
        } else {
            mainChart.selected_link.attr("stroke", edge_color);
            mainChart.selected_link_data.color = edge_color;
        }
    };

    BundleChart.prototype.setEdgeOpacity = function (edge_opacity) {
        if (EDGE_ALL) {
            mainChart.svg_links.attr("stroke-opacity", edge_opacity);
            mainChart.svg_links[0].forEach(function (item) {
                return item.__data__.opacity = edge_opacity;
            })
        } else {
            mainChart.selected_link.attr("stroke-opacity", edge_opacity);
            mainChart.selected_link_data.opacity = edge_opacity;
        }
    };

    BundleChart.prototype.setLabelSize = function (font_size) {
        mainChart.nodes_label.attr("font-size", font_size);
        mainChart.now_label_size = font_size;
    };

    BundleChart.prototype.setLabelColor = function (font_color) {
        mainChart.nodes_label.attr("fill", font_color);
        mainChart.now_label_color = font_color;
    };

    BundleChart.prototype.setLabelOpacity = function (font_opacity) {
        mainChart.nodes_label.attr("opacity", font_opacity);
        mainChart.now_label_opacity = font_opacity;
    };

    BundleChart.prototype.setLabelShow = function (value) {
        mainChart.label_show_flag = value;
        if (mainChart.label_show_flag) {
            mainChart.nodes_label.attr("visibility", "visible");
        }
        else {
            mainChart.nodes_label.attr("visibility", "hidden");
        }
    };

    BundleChart.prototype.setLabelType = function (value) {
        switch (value) {
            case "编号":
                mainChart.nodes_label.text(function (d) {
                    return d.id;
                });
                break;
            case "度":
                mainChart.nodes_label.text(function (d) {
                    return d.degree;
                });
                break;
            case "度中心性":
                mainChart.nodes_label.text(function (d) {
                    return d.degree_centrality;
                });
                break;
            case "接近中心性":
                mainChart.nodes_label.text(function (d) {
                    return d.closeness_centrality;
                });
                break;
            case "介数中心性":
                mainChart.nodes_label.text(function (d) {
                    return d.betweness_centrality;
                });
                break;
            case "特征向量中心性":
                mainChart.nodes_label.text(function (d) {
                    return d.eigenvector_centrality;
                });
                break;
            case "聚类系数":
                mainChart.nodes_label.text(function (d) {
                    return d.clustering;
                });
                break;
            case "端口":
                mainChart.nodes_label.text(function (d) {
                    return d.port;
                });
                break;
            case "连续属性":
                mainChart.nodes_label.text(function (d) {
                    return d.continuous;
                });
                break;
            case "离散属性":
                mainChart.nodes_label.text(function (d) {
                    return d.discrete;
                });
                break;
        }
    };

    BundleChart.prototype.updateFromOthers = function (d) {
        run(d);
    };

    BundleChart.prototype.saveShowedData = function () {
        var links_id = [];
        var result = {nodes: [], links: []};
        //深度拷贝，并剔除循环引用内容
        result.nodes = info_table.getData().slice(0);
        result.nodes.forEach(function (node) {
            delete node.parent;
            delete node.depth;
        });
        mainChart.links.forEach(function (link) {
            result.nodes.forEach(function (node) {
                if (link.source === node.id || link.target === node.id) {
                    if (links_id.indexOf(link.id) === -1) {
                        result.links.push(link);
                        links_id.push(link.id);
                    }
                }
            });
        });
        return result;
    };

    // 给原图显示的接口
    BundleChart.prototype.setLevel = function () {
        // console.log('222');
        level(1)
    }
}
