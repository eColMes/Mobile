/// <reference path="../../zepto.min.js" />
/// <reference path="knockout.debug.js" />
(function(){

    Object.prototype.toViewModel = function () { 
        for (var key in this) {
            var obj = this[key]; 
            if (isArray(obj)) {
                this[key] = ko.observableArray(); 
                obj.forEach(function (v) {
                    this[key].push(v.toViewModel());
                })
            } else if (isObj) {
                this[key] = ko.observable(obj.toViewModel());
            } else {
                this[key] = ko.observable(obj);
            }
        }
        return this;
    }
   

    function isArray(obj) {
        return Object.prototype.toString.call(obj)===  '[object Array]'; 
    }
    function isObj(obj){
        return Object.prototype.toString.call(obj)=== "[object Object]";
    }
})


