/*
* 滚动设置
*/
$(function () {
    function scrollEntity() {
        this.id="",
        this.$dom=null,
        this.scroll = {}
    }

    $.fn.SetAutoScroll = function (param) {
        param = param || {}
        var myScroll = new IScroll($(this)[0], {
            //scrollbars: 'custom',
            ////topOffset:$pd[0].offsetHeight,
            //mouseWheel: true,
            //interactiveScrollbars: true,
            //shrinkScrollbars: 'scale',
            //fadeScrollbars: true,
            ////
            ////tap: true,
            ////infinite
            //scrollbars: true,
            //mouseWheel: true,
            //interactiveScrollbars: true,
            //shrinkScrollbars: 'scale',
            //fadeScrollbars: true,
            click: true,
            ////probe
            ////probeType: 1,
            scrollX: param.scrollX || false,
            scrollY: param.scrollY || true,
           // preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/, className: /(^|\s)btn(\s|$)/ }
        });
        return myScroll;
    }

    $('.autoScroll').each(function () {
        var param = {};
        if ($(this).hasClass("autoHorScroll")) {
            var width = 0;
            $(this).find('.scroll').children().each(function () {
                width += $(this).width();
            })
            $(this).find('.scroll').width(width);
            $(this).find('.scroll').width();
            param = {
                scrollX: true,
                scrollY: false
            }
        }
        var autoScroll = $(this).SetAutoScroll(param);
        var entity = new scrollEntity();
        entity.scroll = autoScroll;
        entity.element = this;
        entity.id = $(this).attr("id");

        window.autoScrolls || (window.autoScrolls = []);
        window.autoScrolls.push(entity);
     
    })

   

})


/*
* 弹出层设置
*/
$(function () {
    /**
 * ModalHelper helpers resolve the modal scrolling issue on mobile devices
 * https://github.com/twbs/bootstrap/issues/15852
 * requires document.scrollingElement polyfill https://github.com/yangg/scrolling-element
 */
    var ModalHelper = (function (bodyCls) {
        var scrollTop;
        return {
            afterOpen: function () {
                //alert(document.scrollingElement||document.body.scrollTop);
                scrollTop = document.scrollingElement || document.body.scrollTop;
                document.body.classList.add(bodyCls);
                document.body.style.top = -scrollTop + 'px';
              
            },
            beforeClose: function () {
               
                document.body.classList.remove(bodyCls);
                // scrollTop lost after set position:fixed, restore it back.
               
                if (document.scrollingElement) {
                    document.scrollingElement.scrollTop = scrollTop;
                } else {
                    document.body.scrollTop = scrollTop;
                }
               
            }
        };
    })('modal-open');


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
    var overlay;
    if ($('.modal-overlay').length === 0) {
        overlay = $('<div class="modal-overlay"></div>').appendTo($(defaults.modalContainer));
        overlay.on("touchmove", function (e) { e.preventDefault(); }, false);
    } else {
        overlay = $('.modal-overlay');
    }
    $._addModalToModalContainer = function ($modal) {
        overlay.before($modal);
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
    $.Modal = function (params)  {
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

        //$(defaults.modalContainer).append(modal[0]);
        $._addModalToModalContainer(modal[0]);
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
      
        // modal.on("touchmove", function (e) { e.preventDefault(); }, false);
        ModalHelper.afterOpen();
      
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
            ModalHelper.beforeClose();
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
            ModalHelper.beforeClose();
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
        //$(defaults.modalContainer).append(modal[0]);
        $._addModalToModalContainer(modal[0]);

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

        $model = $(html)//.appendTo($(defaults.modalContainer));
        $._addModalToModalContainer($model)
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

    $.PopUp = function (params) {
        var _default = {
            content: "",
            styles:"",
        }
        var html = '<div class="modal modal-pop"/>'
        $.OpenModal
    }
    $.Loading = function (msg) {
        var _default = {
            msg: "",
            isNeedOverLay: ""
        }
        

        if ($('.modal-preloader')[0]) return;
        var $load = $('<div class="modal-preloader"><span class="loading"></span><span class="loadingText"></span></div>');
        if (msg) {
            $load.find('.loadingText').text(msg);
        }
        //$('.modal-preloader-overlay').show();
        $._addModalToModalContainer($load);
        $load.width();
        return $load;
        //return $load.appendTo($(defaults.modalContainer));
        //$(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="modal-preloader"><span class="loading"></span><span class="loadingText"></span></div>');
    }
    $.HideLoading = function ($loading) {
       // $('.modal-preloader-overlay').hide();
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
       var  _default = {
            url: "",
            content: "",
            css: "fromLeftIn"
        }
        if (typeof params == "string") {
            params = { url: params };
        } else {
            params = $.extend(_default, params);
        }
       
        var $model = $('<div class="modal modal-panel ' + params.css + '" > </div>');
          
        $._addModalToModalContainer($model);

        //var ld = $.Loading();
        var drawHtml = function (html) {
           
            $model.html(html);
           
            var width = $model.width();
           
            $model.find('.close-panel-btn').on('click', function () {
                $.CloseModal($model);
            })
            $.OpenModal($model);
            
            $model.transitionEnd(function () {
                //$.HideLoading(ld)
               
            });
        }
        //
        if (params.content) {
            drawHtml(params.content);
            return;
        }

      
       
        setTimeout(function () {
            $.ajax({
                url: params.url + "#" + Math.random(),
                type: "get",
                success: function (text) {
                    drawHtml(text);
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
    //$('body').on('touchmove', '.modal', function (e) {
    //    e.preventDefault();
    //}).on('touchstart', '.modal-overlay', function (e) {
    //    e.preventDefault();
    //})
})
 
$(function () {
    //tab
    $('body').on('click', '.buttons-tab .tab-link', function () {
        var $this = $(this);
        var id = $this.attr("for");
        var $container = $("#"+id).parent();
        var $tabs = $container.children();
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
//$(function () {
//    function fastClick() {
//        var supportTouch = function () {
//            try {
//                document.createEvent("TouchEvent");
//                return true;
//            } catch (e) {
//                return false;
//            }
//        }();
//        var _old$On = $.fn.on;

//        $.fn.on = function () {
//            if (/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch) { // 只扩展支持touch的当前元素的click事件
//                var touchStartY, callback = arguments[1];
//                _old$On.apply(this, ['touchstart', function (e) {
//                    touchStartY = e.changedTouches[0].clientY;
//                }]);
//                _old$On.apply(this, ['touchend', function (e) {
//                    if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

//                    e.preventDefault();
//                    callback.apply(this, [e]);
//                }]);
//            } else {
//                _old$On.apply(this, arguments);
//            }
//            return this;
//        };
//    }

//    fastClick();
//})


/*lookup 子页面弹出*/

$(function () {
    $('body').on('click', '.pop-panel-sub>.pop-panel-titlebar>.pop-panel-sub-back', function () {
        $(this).parent().parent().removeClass("active");
    })
})

//折叠面板
$(function () {
    $('.collapse-panel').on('click', '.btn-collapse-panel', function () {
        var $panel = $(this).parents('.collapse-panel').first();
        if ($panel.hasClass('close')) {
            $panel.removeClass('close');
        } else {
            $panel.addClass('close');
        }
        var $scroll = $(this).parents('.autoScroll');
        //刷新滚动区域
        $scroll.each(function () {
            var _this = this;
            window.autoScrolls.forEach(function (v) {
                if (v.element && v.element.parentElement && v.element == _this) {
                    v.scroll.refresh();
                }
            })
        })
       
    })
})

//图片浏览

$(function () {
    $.ViewImage= function (param) {
        var option = {
            imageType: 0,//0 表示base64，或者url， 1 表示input的html元素,2 表示 其他img 标签
            src: "",
            onDelete: function () {

            },
            onClose: function () {

            }
        }
        option = $.extend(option, param);

        var html = '<div class="imgFullScreenView">' +
            '<img class="imgPreview" src="'+ option.src + '" >' +
            '<div class="buttons"><a class="btn btn-block icon iconfont icon-arrow-left" events="onClose" ></a><a class="btn btn-block icon iconfont icon-shanchu1" events="onDelete onClose" ></a></div>  </div>';

        var $html = $(html).appendTo($('body'));
       $html.on('click', '.btn', function () {
            $(this).attr('events').split(' ').forEach(function (v) {
                if (v && option[v]) {
                    option[v].call(this);
                }
            })
            $html.remove();
            
        })

    }


    $.File = {
        IsImage: function (fileName) {
            return fileName.match(/.jpg|.gif|.png|.bmp/i) ? true : false;
        },
        IsVideo: function (fileName) {
            return fileName.match(/.mp4|.mov/i) ? true : false;
        },
        ViewVideo: function (param) {
            var option = {
                imageType: 0,//0 表示base64，或者url， 1 表示input的html元素,2 表示 其他img 标签
                src: "",
                onDelete: function () {

                },
                onClose: function () {

                }
            }
            option = $.extend(option, param);

            var html = '<div class="videoFullScreenView">' +
                '<video class="videoPreview" autoplay="autoplay" src="' + option.src + '" />' +
                '<div class="buttons"><a class="btn btn-block icon iconfont icon-arrow-left" events="onClose" ></a><a class="btn btn-block icon iconfont icon-shanchu1" events="onDelete onClose" ></a></div>  </div>';

            var $html = $(html).appendTo($('body'));
            $html.on('click', '.btn', function () {
                $(this).attr('events').split(' ').forEach(function (v) {
                    if (v && option[v]) {
                        option[v].call(this);
                    }
                })
                $html.remove();

            })
        }


    }
})