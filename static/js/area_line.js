function AreaChart() {
    var areaChart = {tools_width: 60};
    var area_line = $("#area_line");
    areaChart.width = area_line.width() - areaChart.tools_width;
    areaChart.height = area_line.height();
    init();
    createChart();

    function init() {
        areaChart.tools = d3.select("#area_line").append("div")
            .attr("id", "area_line_tools")
            .style("width", areaChart.tools_width + "px")
            .style("height", areaChart.height + "px")
            .append("div")
            .attr("class", "btn-group-vertical");
        areaChart.tools.append("button")
            .attr({
                "type": "button",
                "class": "btn btn-default"
            })
            .attr("title", "重置")
            .on("click", function () {
                areaChart.zoom.translate([0, 0]);
                areaChart.zoom.scale(1);
                areaChart.svg.select(".x.axis").call(areaChart.x_axis);
                areaChart.area_g.select("path").attr("d", areaChart.area);
            })
            .append("span")
            .attr("class", "glyphicon glyphicon-resize-full")
            .attr("aria-hidden", "true");
    }

    function createChart() {
        areaChart.padding = {left: 15, right: 15, top: 10, bottom: 20};
        areaChart.padding_width = areaChart.width - areaChart.padding.left - areaChart.padding.right;
        areaChart.padding_height = areaChart.height - areaChart.padding.bottom - areaChart.padding.top;
        areaChart.x_scale = d3.time.scale()
            .domain(d3.extent(init_data_line, function (d) {
                return d.date;
            }))
            .range([0, areaChart.padding_width]);
        areaChart.y_scale = d3.scale.linear()
            .domain(d3.extent(init_data_line, function (d) {
                return d.value;
            }))
            .range([areaChart.padding_height, 0]);

        areaChart.x_axis = d3.svg.axis()
            .scale(areaChart.x_scale)
            .orient("bottom");

        areaChart.zoom = d3.behavior.zoom()
            .x(areaChart.x_scale)
            .scaleExtent(SCALE_EXTENT)
            .on("zoom", zoomed);

        areaChart.svg = d3.select("#area_line")
            .append("svg")
            .style("position", "absolute")
            .style("left", areaChart.tools_width + "px")
            .attr("width", areaChart.width)
            .attr("height", areaChart.height)
            .style("position", "absolute")
            .call(areaChart.zoom);

        areaChart.area = d3.svg.area()
            .interpolate("basis")
            .x(function (d) {
                return areaChart.x_scale(d.date);
            })
            .y0(function () {
                return areaChart.y_scale(areaChart.padding_height);
            })
            .y1(function (d) {
                return areaChart.y_scale(d.value);
            });

        areaChart.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + areaChart.padding.left + "," + (areaChart.height - areaChart.padding.bottom) + ")")
            .call(areaChart.x_axis);

        areaChart.area_g = areaChart.svg.append("g")
            .attr("transform", "translate(" + areaChart.padding.left + "," + areaChart.padding.top + ")");

        areaChart.area_g.append("clipPath")
            .attr("id", "clip_path")
            .append("rect")
            .attr({
                x: 0,
                y: 0,
                width: areaChart.padding_width,
                height: areaChart.padding_height
            });

        areaChart.area_g.append("path")
            .datum(init_data_line)
            .attr('fill', AREA_COLOR)
            .attr('opacity', AREA_OPACITY)
            .attr('stroke', AREA_STROKE)
            .attr("d", areaChart.area)
            .attr("clip-path", "url(#clip_path)");
    }

    function zoomed() {
        areaChart.svg.select(".x.axis").call(areaChart.x_axis);
        areaChart.area_g.select("path").attr("d", areaChart.area);
    }
}

var AREA_COLOR = '#C4C9CF';
var AREA_STROKE = "#FFFAFA";
var AREA_OPACITY = 0.9;