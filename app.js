var app_info = function(e){
    new aui.form({
        formPath: 'info.html',
        clickitem: e&&$(e),
    })
}, app_function_info = function(e){
    new aui.form({
        formPath: 'function.html',
        clickitem: e&&$(e),
        onload: function(win){
            win.find('#app_func_form').click(function(e){ app_info() }),
            win.find('#app_func_message').click(function(e){ app_message() }),
            win.find('#app_func_html').click(function(e){ app_html() }),
            win.find('#app_func_file').click(function(e){ app_file() }),
            win.find('#app_func_validate').click(function(e){ app_validate() }),
            win.find('#app_func_other').click(function(e){ app_other() })
        }
    })
}, app_form = function(e){
    aui.drawer([
        {name: '窗体模块', icon:'', func:function(){
            new aui.form({
                formPath: 'form.html',
                clickitem: e&&$(e),
            })
        }},
        {name: 'DOM模块', icon:'', func:function(){
            new aui.form({
                formPath: 'dom.html',
                clickitem: e&&$(e),
            })
        }},
        {name: '图标抽屉', icon:'', func:function(){
            new aui.form({
                formPath: 'drawer.html',
                clickitem: e&&$(e),
            })
        }},
        {name: '菜单模块', icon:'', func:function(){
            new aui.form({
                formPath: 'menu.html',
                clickitem: e&&$(e),
                onload: function(win){
                    win.find('#menu-example').click(function(e){
                        aui.menu({
                            list: [
                              {'name':'按钮1', 'func': function(){aui.tips('按钮1')}},
                              {'name':'按钮2', 'func': function(){aui.tips('按钮2')}},
                              {'name':'按钮3', 'func': function(){aui.tips('按钮3')}},
                            ],
                            event: e,
                        })
                    })
                }
            })
        }},
    ])

}, app_message = function(e){
    new aui.form({
        formPath: 'message.html',
        clickitem: e&&$(e),
        onload: function(win){
            win.find('#push-example1').click(function(){
                new aui.push({
                    msg: '这是推送的信息',
                })
            })
            win.find('#push-example2').click(function(){
                new aui.push({
                    msg: '推送信息在5秒后自动关闭',
                    closeTime: 5000,
                })
            })

        }
    })
}, app_html = function(e){
    new aui.form({
        formPath: 'html.html',
        clickitem: e&&$(e),
        onload: function(win){
            win.find('#image-list-example').click(function(){
                new aui.form({
                    formPath: 'img-list.html',
                    onload: function(win){
                        let img_list = new aui.html.img_list(win.find('.img-list'));
                        win.find('#image-list-show').click(function(){
                            let size = 0, num = 0;
                            aui.for(img_list.get(), function(k, v){
                                size += v.data.length, num++;
                            }),
                            aui.tips(`您选择了${num}张图片,总大小${size}`)
                        })
                    }
                })
            })
        }
    })
}, app_file = function(e){
    new aui.form({
        formPath: 'file.html',
        clickitem: e&&$(e),
    })
}, app_validate = function(e){
    new aui.form({
        formPath: 'validate.html',
        clickitem: e&&$(e),
    })
}, app_other = function(e){
    new aui.form({
        formPath: 'other.html',
        clickitem: e&&$(e),
    })
}



$('#app_info').click(function(e){ app_info(e) }),
$('#app_function_info').click(function(e){ app_function_info(e) }),
$('#app_form').click(function(e){ app_form(e) }),
$('#app_message').click(function(e){ app_message(e) }),
$('#app_html').click(function(e){ app_html(e) }),
$('#app_file').click(function(e){ app_file(e) }),
$('#app_validate').click(function(e){ app_validate(e) }),
$('#app_other').click(function(e){ app_other(e) })