var app_info = function(e){
    new aui.form({
        formPath: 'info.html',
        clickitem: e&&$(e),
    })
},app_function_info = function(e){
    new aui.form({
        formPath: 'function.html',
        clickitem: e&&$(e),
    })
},app_form = function(e){
    new aui.form({
        formPath: 'form.html',
        clickitem: e&&$(e),
    })
}