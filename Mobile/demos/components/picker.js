/// <reference path="../../assets/mobile/js/plugins/knockout-3.3.0/knockout.js" />

function picker(model) {
    this = {
        isMuilt:model.isMuilt||false,
        title: ko.observable(""),
        list: ko.observableArray([]),
        selected: ko.observable({}),
    }
    return this;
}


