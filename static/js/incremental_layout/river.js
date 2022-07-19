function riverDraw(riverSocial) {

  /**
   * echarts版本
   */
  var myRiver = echarts.init(document.querySelector("#all_view #info_table"));

  // console.log(riverSocial)

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(0,0,0,0.2)',
          width: 1,
          type: 'solid'
        }
      }
    },
    legend: {
      data: ['social0', 'social1', 'social2', 'social3', 'social4', 'social5']
    },
    singleAxis: {
      top: 50,
      bottom: 50,
      axisTick: {},
      axisLabel: {},
      type: 'time',
      axisPointer: {
        animation: true,
        label: {
          show: true
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          opacity: 0.2
        }
      }
    },
    series: [
      {
        type: 'themeRiver',
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.8)'
          }
        },
        data:
        //   ['2015/11/08', 10, 'DQ'],
        //   ['2015/11/09', 15, 'DQ'],
        //
        //   ['2015/11/08', 35, 'TY'],
        //   ['2015/11/09', 36, 'TY'],
        //
        //   ['2015/11/08', 21, 'SS'],
        //   ['2015/11/09', 25, 'SS'],
        //
        //   ['2015/11/08', 10, 'QG'],
        //   ['2015/11/09', 15, 'QG'],
        //
        //   ['2015/11/08', 10, 'SY'],
        //   ['2015/11/09', 15, 'SY'],
        //
        //   ['2015/11/08', 10, 'DD'],
        //   ['2015/11/09', 15, 'DD'],
        //
        // ]
        riverSocial

      }
    ]
  };

  // console.log(data)
  myRiver.setOption(option)

  /**
   * d3版本
   */

  // var chart
  // chart = StackedAreaChart(unemployment, {
  //   x: d => d.date,
  //   y: d => d.unemployed,
  //   z: d => d.industry,
  //   yLabel: "↑ Unemployed persons",
  //   width,
  //   height: 500
  // })
  //
  // function StackedAreaChart(data, {
  //   x = ([x]) => x, // given d in data, returns the (ordinal) x-value
  //   y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  //   z = () => 1, // given d in data, returns the (categorical) z-value
  //   marginTop = 20, // top margin, in pixels
  //   marginRight = 30, // right margin, in pixels
  //   marginBottom = 30, // bottom margin, in pixels
  //   marginLeft = 40, // left margin, in pixels
  //   width = 640, // outer width, in pixels
  //   height = 400, // outer height, in pixels
  //   xType = d3.scaleUtc, // type of x-scale
  //   xDomain, // [xmin, xmax]
  //   xRange = [marginLeft, width - marginRight], // [left, right]
  //   yType = d3.scaleLinear, // type of y-scale
  //   yDomain, // [ymin, ymax]
  //   yRange = [height - marginBottom, marginTop], // [bottom, top]
  //   zDomain, // array of z-values
  //   offset = d3.stackOffsetDiverging, // stack offset method
  //   order = d3.stackOrderNone, // stack order method
  //   xFormat, // a format specifier string for the x-axis
  //   yFormat, // a format specifier for the y-axis
  //   yLabel, // a label for the y-axis
  //   colors = d3.schemeTableau10, // array of colors for z
  // } = {}) {
  //   // Compute values.
  //   const X = d3.map(data, x);
  //   const Y = d3.map(data, y);
  //   const Z = d3.map(data, z);
  //
  //   // Compute default x- and z-domains, and unique the z-domain.
  //   if (xDomain === undefined) xDomain = d3.extent(X);
  //   if (zDomain === undefined) zDomain = Z;
  //   zDomain = new d3.InternSet(zDomain);
  //
  //   // Omit any data not present in the z-domain.
  //   const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));
  //
  //   // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
  //   // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
  //   // each tuple has an i (index) property so that we can refer back to the
  //   // original data point (data[i]). This code assumes that there is only one
  //   // data point for a given unique x- and z-value.
  //   const series = d3.stack()
  //       .keys(zDomain)
  //       .value(([x, I], z) => Y[I.get(z)])
  //       .order(order)
  //       .offset(offset)
  //       (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
  //       .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
  //
  //   // Compute the default y-domain. Note: diverging stacks can be negative.
  //   if (yDomain === undefined) yDomain = d3.extent(series.flat(2));
  //
  //   // Construct scales and axes.
  //   const xScale = xType(xDomain, xRange);
  //   const yScale = yType(yDomain, yRange);
  //   const color = d3.scaleOrdinal(zDomain, colors);
  //   const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);
  //   const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);
  //
  //   const area = d3.area()
  //       .x(({i}) => xScale(X[i]))
  //       .y0(([y1]) => yScale(y1))
  //       .y1(([, y2]) => yScale(y2));
  //
  //   const svg = d3.create("svg")
  //       .attr("width", width)
  //       .attr("height", height)
  //       .attr("viewBox", [0, 0, width, height])
  //       .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  //
  //   svg.append("g")
  //       .attr("transform", `translate(${marginLeft},0)`)
  //       .call(yAxis)
  //       .call(g => g.select(".domain").remove())
  //       .call(g => g.selectAll(".tick line").clone()
  //           .attr("x2", width - marginLeft - marginRight)
  //           .attr("stroke-opacity", 0.1))
  //       .call(g => g.append("text")
  //           .attr("x", -marginLeft)
  //           .attr("y", 10)
  //           .attr("fill", "currentColor")
  //           .attr("text-anchor", "start")
  //           .text(yLabel));
  //
  //   svg.append("g")
  //       .selectAll("path")
  //       .data(series)
  //       .join("path")
  //       .attr("fill", ([{i}]) => color(Z[i]))
  //       .attr("d", area)
  //       .append("title")
  //       .text(([{i}]) => Z[i]);
  //
  //   svg.append("g")
  //       .attr("transform", `translate(0,${height - marginBottom})`)
  //       .call(xAxis);
  //
  //   return Object.assign(svg.node(), {scales: {color}});
  // }
}