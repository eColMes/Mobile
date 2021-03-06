﻿
var taskFunctionBusiness = {
    _panelCache: {},
    _options: {

    },
    Init: function () {

    },
    OpenPanel: function (url) {
        var zz =$.Loading();
        this.GetPanelHtml(url, function (html) {
            $.OpenPanel({
                content: html,
                css: "modal-panel-taskOperator "
            })
            $.HideLoading(zz);
        })
      
    },
    GetPanelHtml: function (url, callback) {
        var _this = this;
        if (this._panelCache.hasOwnProperty(url) && callback) {
            callback(this._panelCache[url]);
        } else {
            $.ajax({
                url: url,
                data: {num:Math.random()},
                success: function (result) {
                    var result = _this._panelCache[url] = result;
                    if (callback) {
                        callback(result);
                    }

                }
            })
        }
    }
}
