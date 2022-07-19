function BackChart() {
    var padding = {top: 50, bottom: 50, left: 70, right: 70};
    var main_div = $("#main");
    var mainChart = {
        width: main_div.width(),
        height: main_div.height(),
        svg: null,
        map_svg: null,
        mini_width: 200,
        mini_border: 2,
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

    function resizeFull() {
        mainChart.translate = [0, 0];
        mainChart.scale = 1;
        mainChart.g.attr("transform", "translate(" + mainChart.translate + ")scale(" + mainChart.scale + ")");
        mainChart.zoom.translate(mainChart.translate);
        mainChart.zoom.scale(mainChart.scale);

        mainChart.svg_links
            .attr("stroke-opacity", function (d) {
                return +d.opacity;
            })
            .attr("stroke-width", function (d) {
                return +d.weight;
            })
            .attr("x1", function (d) {
                return mainChart.x_scale(d.x1);
            })
            .attr("y1", function (d) {
                return mainChart.y_scale(d.y1);
            })
            .attr("x2", function (d) {
                return mainChart.x_scale(d.x2);
            })
            .attr("y2", function (d) {
                return mainChart.y_scale(d.y2);
            });
        mainChart.svg_nodes
            .attr("opacity", function (d) {
                return +d.opacity;
            })
            .attr("r", function (d) {
                return +d.size;
            })
            .attr("stroke-width", NODE_STROKE_WIDTH)
            .attr('cx', function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("cy", function (d) {
                return mainChart.y_scale(d.y);
            });
        mainChart.nodes_label
            .attr("font-size", mainChart.now_label_size)
            .attr("x", function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("y", function (d) {
                return mainChart.y_scale(d.y);
            })
            .attr("transform", function (d) {
                return "rotate(30," + mainChart.x_scale(d.x) + " " + mainChart.y_scale(d.y) + ")"
            });
        mainChart.nodes_line_label
            .attr("stroke-width", INIT_NODE_LABEL_LINK_WIDTH)
            .attr("x1", function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("y1", function (d) {
                return mainChart.y_scale(d.y);
            })
            .attr("x2", function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("y2", function (d) {
                return mainChart.y_scale(d.y);
            });
        mainChart.map_frame.attr("transform", "translate(0, 0)").attr("width", mainChart.mini_width).attr("height", mainChart.mini_height);

        level(mainChart.scale);
    }

    function regionSelect() {
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
                    var true_node_x = d3.select(this).attr("cx");
                    var true_node_y = d3.select(this).attr("cy");
                    var node_x = mainChart.scale * parseFloat(true_node_x) + mainChart.translate[0];
                    var node_y = mainChart.scale * parseFloat(true_node_y) + mainChart.translate[1];
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
        });
    }

    function zoomed() {
        mainChart.translate = d3.event.translate;
        mainChart.scale = d3.event.scale;
        mainChart.g.attr("transform", "translate(" + mainChart.translate + ")scale(" + mainChart.scale + ")");
        /*g放大的时候其子节点不放大*/
        if (mainChart.scale > 1) {
            mainChart.svg_nodes.attr("r", function (d) {
                return +d.size / mainChart.scale;
            }).attr("stroke-width", NODE_STROKE_WIDTH / mainChart.scale);

            mainChart.svg_links.attr("stroke-width", function (d) {
                return +d.weight / mainChart.scale;
            });
            mainChart.nodes_label.attr("font-size", mainChart.now_label_size / mainChart.scale);
            mainChart.nodes_line_label.attr("stroke-width", INIT_NODE_LABEL_LINK_WIDTH / mainChart.scale);
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

    function handleData(view_data) {
        mainChart.nodes = view_data.nodes;
        mainChart.links = view_data.links;

        mainChart.x_scale = d3.scale.linear().domain(d3.extent(mainChart.nodes, function (d) {
            return d.x;
        })).range([padding.left, mainChart.width - padding.right]);

        mainChart.y_scale = d3.scale.linear().domain(d3.extent(mainChart.nodes, function (d) {
            return d.y;
        })).range([padding.top, mainChart.height - padding.bottom]);
    }

    function drawGraph() {
        if (mainChart.svg) mainChart.svg.remove();
        if (mainChart.map_svg) mainChart.map_svg.remove();
        mainChart.translate = [0, 0];
        mainChart.scale = 1;
        mainChart.zoom = d3.behavior.zoom()
            .scaleExtent(SCALE_EXTENT)
            .on("zoom", zoomed);
        mainChart.move_state = 0;

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

        mainChart.g = mainChart.svg.append("g");

        mainChart.svg_links = mainChart.g.selectAll(".links")
            .data(mainChart.links)
            .enter()
            .append("line")
            .attr("id", function (d) {
                return "link_" + d.id;
            })
            .attr("stroke-opacity", function (d) {
                return +d.opacity;
            })
            .attr("stroke", function (d) {
                return d.color;
            })
            .attr("stroke-width", function (d) {
                return +d.weight;
            })
            .classed("select_link", false)
            .attr("x1", function (d) {
                return mainChart.x_scale(d.x1);
            })
            .attr("y1", function (d) {
                return mainChart.y_scale(d.y1);
            })
            .attr("x2", function (d) {
                return mainChart.x_scale(d.x2);
            })
            .attr("y2", function (d) {
                return mainChart.y_scale(d.y2);
            });

        mainChart.selected_link = d3.select("#link_" + mainChart.links[0].id);
        mainChart.selected_link_data = mainChart.links[0];
        mainChart.selected_link.attr("stroke", CLICK_SELECT_COLOR).classed("select_link", true);
        control_chart.updateLink(mainChart.selected_link_data);

        //节点可拖动
        mainChart.drag = d3.behavior.drag()
            .on("drag", function (d) {
                var x = d3.mouse(this)[0];
                var y = d3.mouse(this)[1];
                d3.select(this).attr("cx", x).attr("cy", y);
                d3.select("#node_" + d.id + " line")
                    .attr("x1", x).attr("y1", y)
                    .attr("x2", d3.select("#node_" + d.id + " text").attr("x"))
                    .attr("y2", d3.select("#node_" + d.id + " text").attr("y"));
                mainChart.links.forEach(function (t) {
                    if (t.source === d.id) {
                        d3.select("#link_" + t.id).attr("x1", x);
                        d3.select("#link_" + t.id).attr("y1", y);
                    }
                    if (t.target === d.id) {
                        d3.select("#link_" + t.id).attr("x2", x);
                        d3.select("#link_" + t.id).attr("y2", y);
                    }
                })
            });

        //标签可拖动
        mainChart.label_drag = d3.behavior.drag()
            .on("drag", function (d) {
                var x = d3.mouse(this)[0];
                var y = d3.mouse(this)[1];
                d3.select(this)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("transform", "rotate(30," + x + " " + y + ")");
                d3.select("#node_" + d.id + " line")
                    .attr("x1", d3.select("#node_" + d.id + " circle").attr("cx"))
                    .attr("y1", d3.select("#node_" + d.id + " circle").attr("cy"))
                    .attr("x2", x).attr("y2", y);
            });

        mainChart.svg_nodes_g = mainChart.g.selectAll(".nodes")
            .data(mainChart.nodes)
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
            .attr('cx', function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("cy", function (d) {
                return mainChart.y_scale(d.y);
            })
            .call(mainChart.drag);

        mainChart.selected_node = d3.select("#node_" + mainChart.nodes[0].id + " circle");
        mainChart.selected_node_data = mainChart.nodes[0];
        mainChart.selected_node.attr("fill", CLICK_SELECT_COLOR).classed("select_node", true);
        control_chart.updateNode(mainChart.selected_node_data);

        mainChart.nodes_label = mainChart.svg_nodes_g.append("text")
            .attr("x", function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("y", function (d) {
                return mainChart.y_scale(d.y);
            })
            .attr("transform", function (d) {
                return "rotate(30," + mainChart.x_scale(d.x) + " " + mainChart.y_scale(d.y) + ")"
            })
            .attr("cursor", "default")
            .attr("fill", mainChart.now_label_color)
            .attr("font-size", mainChart.now_label_size)
            .attr("opacity", mainChart.now_label_opacity)
            .attr("visibility", "hidden")
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return d.id;
            })
            .call(mainChart.label_drag);

        //添加节点和标签之间的虚线连线（标签可拖动）
        mainChart.nodes_line_label = mainChart.svg_nodes_g.append("line")
            .attr("stroke-dasharray", "3, 3")
            .attr("stroke-opacity", INIT_NODE_LABEL_LINK_OPACITY)
            .attr("stroke", INIT_NODE_LABEL_LINE_COLOR)
            .attr("stroke-width", INIT_NODE_LABEL_LINK_WIDTH)
            .attr("visibility", "hidden")
            .attr("x1", function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("y1", function (d) {
                return mainChart.y_scale(d.y);
            })
            .attr("x2", function (d) {
                return mainChart.x_scale(d.x);
            })
            .attr("y2", function (d) {
                return mainChart.y_scale(d.y);
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
                var source_level, target_level;
                for (var i = 0; i !== mainChart.nodes.length; i++) {
                    if (mainChart.nodes[i].id === d.source) {
                        source_level = mainChart.nodes[i].level;
                    }
                    if (mainChart.nodes[i].id === d.target) {
                        target_level = mainChart.nodes[i].level;
                    }
                }
                return ((parseInt(source_level) > log || parseInt(target_level) > log) ? "none" : "block");
            });
        }
    }

    function miniMap() {
        mainChart.map_g = mainChart.map_svg.append("g");
        mainChart.map_g.selectAll(".m_links")
            .data(mainChart.links)
            .enter()
            .append("line")
            .attr("stroke-opacity", MINI_LINK_OPACITY)
            .attr("stroke", MINI_LINK_COLOR)
            .attr("stroke-width", MINI_LINK_WIDTH)
            .attr("x1", function (d) {
                return posMiniX(mainChart.x_scale(d.x1));
            })
            .attr("y1", function (d) {
                return posMiniY(mainChart.y_scale(d.y1));
            })
            .attr("x2", function (d) {
                return posMiniX(mainChart.x_scale(d.x2));
            })
            .attr("y2", function (d) {
                return posMiniY(mainChart.y_scale(d.y2));
            });

        mainChart.map_g.selectAll(".m_nodes")
            .data(mainChart.nodes)
            .enter()
            .append("circle")
            .attr("r", MINI_NODE_SIZE)
            .attr("opacity", MINI_NODE_OPACITY)
            .attr("fill", MINI_NODE_COLOR)
            .attr("cx", function (d) {
                return posMiniX(mainChart.x_scale(d.x));
            })
            .attr("cy", function (d) {
                return posMiniY(mainChart.y_scale(d.y));
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
                mainChart.g.attr("transform", "translate(" + translate + ")scale(" + mainChart.scale + ")");
            });

        mainChart.map_frame = mainChart.map_svg.append("rect")
            .attr("class", "mini_background")
            .attr("width", mainChart.mini_width)
            .attr("height", mainChart.mini_height)
            .attr("cursor", "move")
            .call(mainChart.map_drag);
    }

    function posMiniX(x) {
        return x / mainChart.width * mainChart.mini_width;
    }

    function posMiniY(y) {
        return y / mainChart.height * mainChart.mini_height;
    }

    function linkClick(d) {
        if (d3.select(this).classed("select_link"))
            return false;
        else {
            mainChart.selected_link.attr("stroke", mainChart.selected_link_data.color).classed("select_link", false);
            mainChart.selected_link = d3.select(this);
            mainChart.selected_link_data = d;
            mainChart.selected_link.attr("stroke", CLICK_SELECT_COLOR).classed("select_link", true);
            control_chart.updateLink(mainChart.selected_link_data);
        }
    }

    function linkMoveOver(d) {
        d3.select(this).attr("stroke", OVER_COLOR);
        d3.select("#node_" + d.source + " circle").attr("fill", SOURCE_COLOR);
        d3.select("#node_" + d.source + " text").attr("visibility", "visible");
        d3.select("#node_" + d.source + " line").attr("visibility", "visible");
        d3.select("#node_" + d.target + " circle").attr("fill", TARGET_COLOR);
        d3.select("#node_" + d.target + " text").attr("visibility", "visible");
        d3.select("#node_" + d.target + " line").attr("visibility", "visible");
    }

    function linkMoveOut(d) {
        d3.select(this).attr("stroke", d.color);
        if (d3.select(this).classed("select_link")) d3.select(this).attr("stroke", CLICK_SELECT_COLOR);
        mainChart.nodes.forEach(function (item) {
            if (item.id === d.source) {
                d3.select("#node_" + d.source + " circle").attr("fill", item.color);
                if (!mainChart.label_show_flag) {
                    d3.select("#node_" + d.source + " text").attr("visibility", "hidden");
                    d3.select("#node_" + d.source + " line").attr("visibility", "hidden");
                }
            }
            if (item.id === d.target) {
                d3.select("#node_" + d.target + " circle").attr("fill", item.color);
                if (!mainChart.label_show_flag) {
                    d3.select("#node_" + d.target + " text").attr("visibility", "hidden");
                    d3.select("#node_" + d.target + " line").attr("visibility", "hidden");
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
        info_table.update(result_link);
    }

    function nodeMoveOver(d) {
        d3.select(this).attr("fill", OVER_COLOR);
        d3.select("#node_" + d.id + " text").attr("visibility", "visible");
        d3.select("#node_" + d.id + " line").attr("visibility", "visible");
        mainChart.links.forEach(function (t) {
            if (t.source === d.id) {
                d3.select("#link_" + t.id).attr("stroke", TARGET_COLOR);
                d3.select("#node_" + t.target + " circle").attr("fill", TARGET_COLOR);
                d3.select("#node_" + t.target + " text").attr("visibility", "visible");
                d3.select("#node_" + t.target + " line").attr("visibility", "visible");
            }
            else if (t.target === d.id) {
                d3.select("#link_" + t.id).attr("stroke", SOURCE_COLOR);
                d3.select("#node_" + t.source + " circle").attr("fill", SOURCE_COLOR);
                d3.select("#node_" + t.source + " text").attr("visibility", "visible");
                d3.select("#node_" + t.source + " line").attr("visibility", "visible");
            }
        })
    }

    function nodeMoveOut(d) {
        d3.select(this).attr("fill", d.color);
        if (d3.select(this).classed("select_node")) d3.select(this).attr("fill", CLICK_SELECT_COLOR);
        if (!mainChart.label_show_flag) {
            d3.select("#node_" + d.id + " text").attr("visibility", "hidden");
            d3.select("#node_" + d.id + " line").attr("visibility", "hidden");
        }
        mainChart.links.forEach(function (t) {
            if (t.source === d.id) {
                d3.select("#link_" + t.id).attr("stroke", t.color);
                mainChart.nodes.forEach(function (item) {
                    if (item.id === t.target) {
                        d3.select("#node_" + t.target + " circle").attr("fill", item.color);
                        if (d3.select("#node_" + t.target + " circle").classed("select_node")) d3.select("#node_" + t.target + " circle").attr("fill", CLICK_SELECT_COLOR);
                        if (!mainChart.label_show_flag) {
                            d3.select("#node_" + t.target + " text").attr("visibility", "hidden");
                            d3.select("#node_" + t.target + " line").attr("visibility", "hidden");
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
                        if (!mainChart.label_show_flag) {
                            d3.select("#node_" + t.source + " text").attr("visibility", "hidden");
                            d3.select("#node_" + t.source + " line").attr("visibility", "hidden");
                        }
                    }
                });
            }
        })
    }

    BackChart.prototype.update = function (data) {
        mainChart.svg_links.attr("stroke-opacity", LOW_MAIN_OPACITY);
        mainChart.svg_nodes.attr("opacity", LOW_MAIN_OPACITY);
        data.forEach(function (value) {
            d3.select("#node_" + value + " circle").attr("opacity", REGION_OPACITY);
        });
    };

    BackChart.prototype.restore = function () {
        mainChart.svg_links.attr("stroke-opacity", function (d) {
            return +d.opacity;
        });
        mainChart.svg_nodes.attr("opacity", function (d) {
            return +d.opacity;
        });
    };

    BackChart.prototype.setNodeSize = function (node_size) {

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

    BackChart.prototype.setNodeColor = function (node_color) {
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

    BackChart.prototype.setNodeStroke = function (node_stroke) {
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

    BackChart.prototype.setNodeOpacity = function (node_opacity) {
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

    BackChart.prototype.setEdgeWidth = function (link_width) {
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

    BackChart.prototype.setEdgeColor = function (edge_color) {
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

    BackChart.prototype.setEdgeOpacity = function (edge_opacity) {
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

    BackChart.prototype.setLabelSize = function (font_size) {
        mainChart.nodes_label.attr("font-size", font_size);
        mainChart.now_label_size = font_size;
    };

    BackChart.prototype.setLabelColor = function (font_color) {
        mainChart.nodes_label.attr("fill", font_color);
        mainChart.now_label_color = font_color;
    };

    BackChart.prototype.setLabelOpacity = function (font_opacity) {
        mainChart.nodes_label.attr("opacity", font_opacity);
        mainChart.now_label_opacity = font_opacity;
    };

    BackChart.prototype.setLabelShow = function (value) {
        mainChart.label_show_flag = value;
        if (mainChart.label_show_flag) {
            mainChart.nodes_line_label.attr("visibility", "visible");
            mainChart.nodes_label.attr("visibility", "visible");
        }
        else {
            mainChart.nodes_line_label.attr("visibility", "hidden");
            mainChart.nodes_label.attr("visibility", "hidden");
        }
    };

    BackChart.prototype.setLabelType = function (value) {
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

    BackChart.prototype.updateFromOthers = function (d) {
        run(d);
    };

    BackChart.prototype.saveShowedData = function () {
        var links_id = [];
        var result = {nodes: [], links: []};
        result.nodes = info_table.getData();
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
    BackChart.prototype.setLevel = function () {
        level(1)
    }
}