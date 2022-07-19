var Export = {
    saveAsJson: function (data) {
        if (!data.nodes.length) {
            alert("请筛选要保存的数据！");
            return false;
        }
        var BB = self.Blob;
        var contentStr = JSON.stringify(data, null, ' '); //内容
        var file_name = "data_" + this.getDate() + ".json"; //文件名
        saveAs(
            new BB(
                ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
                , {
                    type: "text/plain;charset=utf8"
                }
            ), file_name);
    },
    //获取当前时间(作为保存文件名)
    getDate: function () {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        date = date.getFullYear() + '-' + month + '-' + strDate +
            "-" + date.getHours() + date.getMinutes() +
            date.getSeconds();
        return date;
    }
};
