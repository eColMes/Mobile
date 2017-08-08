/*
* 滚动设置
*/
$(function () {
    $.fn.SetAutoScroll = function (param) {
        var myScroll = new IScroll($(this)[0], {
            scrollbars: 'custom',
            //topOffset:$pd[0].offsetHeight,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            //
            //tap: true,
            //infinite
            //click: true,
            //probe
            probeType: 1,
            scrollX: param.scrollX || false,
            scrollY:param.scrollY||true,
        });
        return myScroll;
    }

    $('.autoScroll').each(function () {
        var param = {};
        if ($(this).hasClass("autoHorScroll")) {
            param = {
                scrollX: true,
                scrollY:false
            }
        }
        $(this).SetAutoScroll(param);
    })
 
})


/*
* 弹出层设置
*/
$(function () {
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }
    var _modalTemplateTempDiv = document.createElement('div');
    var defaults = {
        modalStack: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中',
        modalContainer: document.body
    }
    $.fn.animationEnd = function (callback) {
        // __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        $(this).one({ "webkitTransitionEnd": "transitionend", })
        return this;
    };
    $.fn.transitionEnd = function (callback) {
        //__dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        $(this).one("webkitTransitionEnd", callback).one("transitionend", callback);
        return this;
    };
    $.Modal = function (params) {
        params = params || {};
        var modalHTML = '';
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var extraClass = params.extraClass || '';
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
        modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close === undefined || params.buttons[index].close !== false) $.CloseModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        $.OpenModal(modal);
        return modal[0];
    }
    $.OpenModal = function (modal, cb) {
        modal = $(modal);
        var isModal = modal.hasClass('modal'),
            isPanel = modal.hasClass('modal-panel'),
            isNotToast = !modal.hasClass('toast');
        var isToast = modal.hasClass('toast');

        if (isModal && !isPanel) {
            modal.show();
            modal.css({
               // marginTop: -Math.round(modal.outerHeight() / 2) + 'px'
                marginTop: -Math.round(modal.height() / 2) + 'px'
            });
        }
        if (isToast) {
            modal.css({
                marginLeft: -Math.round(modal.outerWidth() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
            });
        }

        var overlay;
        if (!isToast && !isPanel) {
            if ($('.modal-overlay').length === 0) {
                overlay = $('<div class="modal-overlay"></div>').appendTo($(defaults.modalContainer))
            } else {
                overlay = $('.modal-overlay');
            }

        }

        //确保样式已经应用
        var clientLeft = modal[0].clientLeft;
        // Trugger open event
        modal.trigger('open');

        // Classes for transition in
        if (!isToast && !isPanel) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        //callback

        if (typeof cb === 'function') {
            cb.call(this);
        }
        return modal;
    }
    $.CloseModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal') || modal.hasClass('actions-modal'),

            isToast = modal.hasClass('toast');


        //当没有modal 
        if (modal.length === $('.modal.modal-in,.actions-modal.modal-in').length) {
            $('.modal-overlay').removeClass('modal-overlay-visible');
        }
        modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
            modal.remove();
            //if (modal.hasClass('modal-out')) modal.trigger('closed');
            //else modal.trigger('opened');

            //if (isPickerModal) {
            //    $(defaults.modalContainer).removeClass('picker-modal-closing');
            //}
            //if (isPopup || isLoginScreen || isPickerModal) {
            //    modal.removeClass('modal-out').hide();
            //    if (removeOnClose && modal.length > 0) {
            //        modal.remove();
            //    }
            //}
            //else {
            //    modal.remove();
            //}
        });
        setTimeout(function () {
            modal.remove();
        },100)
    }
    $.Alert = function (text, title, cb) {
        if (typeof (title) == 'function') {
            cb = arguments[1];
            title = undefined;
        }
        return $.Modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [{ text: defaults.modalButtonOk, bold: true, onClick: cb }]
        });
    }
    $.Confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.Modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [
                { text: defaults.modalButtonCancel, onClick: callbackCancel },
                { text: defaults.modalButtonOk, bold: true, onClick: callbackOk }
            ]
        });
    };
    $.Actions = function (params) {
        var modal, groupSelector, buttonSelector;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                if (button.bold) buttonClass += ' actions-modal-button-bold';
                if (button.color) buttonClass += ' color-' + button.color;
                if (button.bg) buttonClass += ' bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class=" actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);
        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) $.CloseModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        $.OpenModal(modal);
        return modal[0];
    }
    $.Picker = function (params, cb) {
        var modalHTML;
        var buttonsHTML = '<div class="actions-modal-group"><span class="actions-modal-label">请选择</span>';
        for (var i = 0; i < params.length; i++) {
            buttonsHTML += '<span class="actions-modal-button">' + params[i] + '</span>';
        }
        buttonsHTML += '</div><div class="actions-modal-group"><span iscancel="1" class="actions-modal-button  bg-danger">取消</span></div>';
        modalHTML = '<div class=" actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);

        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);
        modal.on('click', buttonSelector, function () {
            var value = $(this).text();
            if ($(this).attr('isCancel') != 1) {
                cb.call(this, $(this).text());
            }
            $.CloseModal(modal);
        })
        $.OpenModal(modal);

    }

    $.ShowMenu = function (menus) {
        var html = '<div class="modal modal-menu" ><div class="list-view">';
        for (var i = 0; i < menus.length; i++) {
            var m = menus[i];
            var item = '<div class="list-view-item"><a href="#" class="">' + m.text + '</a></div>';
            html += item;
        }
        html += "</div></div>";

        $model = $(html).appendTo($(defaults.modalContainer));
        //
        var width = $model.width();
        $.OpenModal($model);
        //$('body').click(function () {
        //    if ($(this).parents('.modal-menu').length == 0) {
        //        $.CloseModal($model);
        //    }
        //})
    }
    $(document).mouseup(function (e) {
        if ($(e.target).parents('.modal-menu').length == 0) {
            $('.modal-menu').each(function () {
                $.CloseModal($(this));
            })
        }
    })

    $.PopOver = function (params) {


    }
    $.Loading = function (msg) {

        if ($('.modal-preloader-overlay').length === 0) {
            $('<div class="modal-preloader-overlay"></div>').appendTo($(defaults.modalContainer));
        }

        if ($('.modal-preloader')[0]) return;
        var $load = $('<div class="modal-preloader"><span class="loading"></span><span class="loadingText"></span></div>');
        if (msg) {
            $load.find('.loadingText').text(msg);
        }
        $('.modal-preloader-overlay').show();
        return $load.appendTo($(defaults.modalContainer));
        //$(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="modal-preloader"><span class="loading"></span><span class="loadingText"></span></div>');
    }
    $.HideLoading = function ($loading) {
        $('.modal-preloader-overlay').hide();
        if($loading)
            $loading.remove();
    };
    $.Toast = function (msg) {
        if (!msg)
            return;
        var $toast = $('<div class="modal-toast"><div class="mui-toast-message"></div></div>');
        $toast.find('.mui-toast-message').text(msg);
        $toast.appendTo($(defaults.modalContainer));
        setTimeout(function () {
            $toast.remove();

        }, 3000);
    }

    $.OpenPanel = function (params) {
        if (typeof params == "string") {
            params = { url: params };
        }
        _default = {
            url: "",
            content: "",
            animate: "fromLeftIn"
        }
        var $html = $('<div class="modal modal-panel" > </div>');
        $model = $html.appendTo($(defaults.modalContainer));
        //
        var ld = $.Loading();
        setTimeout(function () {
            $.ajax({
                url: params.url + "#" + Math.random(),
                type: "get",
                success: function (text) {


                    $html.html(text);
                    var width = $model.width();
                    $.OpenModal($model).transitionEnd(function () {
                        $.HideLoading(ld)
                    });

                    $model.find('.close-panel-btn').on('click', function () {
                        $.CloseModal($model);
                    })


                }, error: function (xhr) {
                    //$.HideLoading(ld)
                }
            })
        }, 100)
       



      
        return $model;
    }


    $.ClosePanel = function ($model) {
        $.CloseModal($model);
    }

   
})

$(function () {
    //tab
    $('body').on('click', '.buttons-tab .tab-link', function () {
        var $this = $(this);
        var id = $this.attr("for");
        var $container = $(this).parents('.tab-container');
        var $tabs = $container.find(".tabs .tab");
        $tabs.each(function () {
            if ($(this).attr("id") == id) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        })
        $this.parent().children().removeClass("active");
        $this.addClass('active');

    })

})

/*fastClick*/
$(function () {
    function fastClick() {
        var supportTouch = function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        }();
        var _old$On = $.fn.on;

        $.fn.on = function () {
            if (/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch) { // 只扩展支持touch的当前元素的click事件
                var touchStartY, callback = arguments[1];
                _old$On.apply(this, ['touchstart', function (e) {
                    touchStartY = e.changedTouches[0].clientY;
                }]);
                _old$On.apply(this, ['touchend', function (e) {
                    if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

                    e.preventDefault();
                    callback.apply(this, [e]);
                }]);
            } else {
                _old$On.apply(this, arguments);
            }
            return this;
        };
    }

    fastClick();
})