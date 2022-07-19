var init_data_line;
var time_chart;
// loading的样式
$("#loading").css('margin-top', $("#main").height()/2 - 100 +  'px')
function InitData() {
    // console.log(88888)
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/initial",
        async: true,
        contentType: "application/json",
        success: function (data) {
            // console.log(66666)
            currentTime();
            // console.log(data)
            init_data_line = data["packages"];
            // console.log(init_data_line)
            // console.log(init_data_line)
            // {date: Thu Apr 23 2015 16:45:00 GMT+0800 (中国标准时间), value: 1} 有 2104个
            init_data_line.forEach(function (every) {
                every.date = new Date(every.date);
                // console.log(every.date)
                every.value = +every.value;
                // console.log(every.value)
            });
            //这里是写按钮下面的图
            // AreaChart();
            time_chart = new TimeLineChart();
            // console.log(time_chart)
            //向指定元素添加事件句柄
            document.addEventListener("visibilitychange", time_chart.userLeave, true);
        },
        Error: function () {
            console.log("error");
        }
    });

    //禁止自动刷新
    // $(window).resize(function () {
    //     window.location.reload();
    // });

    function currentTime() {
        //用的time_line.js里面的方法 格式化时间（现在的） 用在右上角
        var date = FormatDateTime((new Date()));
        $("#header").find(".time").text(date);
        // console.log(date)
        //    2021-05-24 16:43 目前的时间
    }
    //这里不是设置时变时长的
    window.setInterval(currentTime, 500);
}

InitData();