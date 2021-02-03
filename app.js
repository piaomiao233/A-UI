var app_info = function(e){
    new aui.form({
        formPath: 'info.html',
        clickitem: e&&$(e),
    })
}, app_function_info = function(e){
    new aui.form({
        formPath: 'function.html',
        clickitem: e&&$(e),
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
}