function InfTable() {
    var height = $("#info_table").height();
    var table = $("#data_table");
    var table_data = null;
    var columns = [
        {checkbox: true},
        {field: "id", title: "编号"},
        {field: "continuous", title: "连续属性", sortable: true},
        {field: "discrete", title: "离散属性", sortable: true},
        {field: "port", title: "端口", sortable: true},
        {field: "degree", title: "度", sortable: true},
        {field: "degree_centrality", title: "度中心性", sortable: true},
        {field: "closeness_centrality", title: "接近中心性", sortable: true},
        {field: "betweness_centrality", title: "介数中心性", sortable: true},
        {field: "eigenvector_centrality", title: "特征向量中心性", sortable: true},
        {field: "clustering", title: "聚类系数", sortable: true}];
    table.bootstrapTable({
        columns: columns,
        search: true,
        pagination: true,
        height: height,
        searchOnEnterKey: false,
        sortable: true,
        pageSize: 10,
        showRefresh: true,
        pageList: [10, 50, 200, "All"],
        uniqueId: "node"
    });

    table.on("refresh.bs.table", function () {
        table.bootstrapTable('load', table_data);
    })
        .on("check.bs.table", function () {
            updateMain();
        })
        .on("uncheck.bs.table", function () {
            updateMain();
        })
        .on("check-all.bs.table", function () {
            updateMain();
        })
        .on("uncheck-all.bs.table", function () {
            updateMain();
        });

    function updateMain() {
        var selected = table.bootstrapTable('getSelections');
        var result = [];
        selected.forEach(function (item) {
            result.push(item.id);
        });
        if (result.length)
            now_layout.update(result);
        else {
            now_layout.restore();
            info_table.restore();
        }
    }

    InfTable.prototype.init = function (data) {
        table_data = data;
        table.bootstrapTable('load', table_data);
    };

    InfTable.prototype.update = function (data) {
        var update_data = [];
        data.forEach(function (item) {
            for (var i = 0; i !== table_data.length; ++i) {
                if (item === table_data[i].id) {
                    table_data[i]["0"] = true;
                    update_data.push(table_data[i]);
                    break;
                }
            }
        });
        table.bootstrapTable('load', update_data);
    };

    InfTable.prototype.restore = function () {
        table_data.forEach(function (item) {
            item["0"] = false;
        });
        table.bootstrapTable('load', table_data);
    };

    InfTable.prototype.getData = function () {
        return table.bootstrapTable('getSelections');
    }
}

var info_table = new InfTable();