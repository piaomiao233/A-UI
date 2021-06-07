/*
  A-UI是一款基于JQuery的前端框架。
  框架采用单页面，多内窗风格思路。
  框架由本人业余开发，不保证更新频率。
  制作by 飘渺

  QQ：283598506
  微信：13014772278
  承接JS+CSS+PHP+Nodejs开发
  演示: http://www.aliong.com
  github: https://github.com/piaomiao233/A-UI

*/
$(function(){
  var e = aui = window.aui = new Object();
  e.openForms = e.forms = [],
  e.onload = function(){
  /* 给数组加入remove功能  可能与其他框架产生冲突
    Array.prototype.remove = function(val) {
      var i = this.indexOf(val);
      i>-1&&this.splice(i, 1)
    };
    */
    e.app_item_init()
  },
  e.app_item_init = function(){
    let t = $('#app-item-box');
    t&&(c = t.children(0).width(), s = parseInt(t.width() / c), t.width(s * c))
  },
  /*  监听message
      未完成

  */
  e.post_message = {
    init: function(){
      addEventListener('message', function(e){
        e.post_message.receive(e)
      })
    },
    add: function(key, func){
      this.list[key] = func
    },
    remove: function(key, func){
      this.list.splice(i,1)
    },
    receive: function(t){

    },
    list: {},
  },

  /* 定时器组件  使用 aui.timer.init() 启动
      start = 启动定时器 每秒检测1次
      stop = 停止计时器
          clear = 是否清空
      add = 添加定时
          func = 方法
          loop = 间隔时间, 如果为假那么为单次事件
          next = 下次执行时间(为-1时默认是下一个loop的时间, 大于等于0时为当前时间加next的值)
      del = 删除定时
          func = 方法
  */
  e.timer = {
    start: function(){
      e.timer.timer_id || (e.timer.timer_id = setInterval(e.timer.loop, 1000))
    },
    stop: function(clear){
      clearInterval(e.timer.timer_id),
      clear&&this.clear()
    },
    clear: function(){
      e.timer.timer_list = []
    },
    loop: function(){
      let time = e.time(), l = e.timer.timer_list;
      for (let i=l.length-1; i>=0; i--) {
        let v = l[i];
        v.next<=time && ( v.func(), v.loop ? v.next = time + v.loop:this.del(v))
      }
    },
    add: function(func, loop, next){
      next=aui.default(next, -1);
      next<0 ? next = e.time() + loop : next<e.time() && (next=e.time()+next),
      e.timer.timer_list.push({
          next: next,
          func: func,
          loop: loop
      })
    },
    del: function(func){
      let l = e.timer.timer_list;
      for (let i=l.length-1;i>=0;i--)
        func == l[i].func && l.splice(i, 1)
    },
    timer_list: [],
  },
  //背景图片轮播
  e.bgImage = function (images ,time){
    time = aui.default(time, 30000);
    var i = 0;
    $(".bgLayer").append($("<img style='animation:unset; background-image: url("+(e.is.array(images)?images[0]:images)+");'></img>"));
    e.is.array(images)&&images.length>1 && setInterval(function(){
      i < images.length-1 ? i++ : i=0;
      var url = images[i];
      $.get(url, function(){
        var bgimg = $("<img style='background-image: url("+url+");'></img>");
        $(".bgLayer").append(bgimg);
        setTimeout(function(){
          $(".bgLayer :first").remove()
        }, 3000)
      })
    }, time);
  },
  //数组处理类
  e.array = {
    //数组移除元素
    remove: function(val, arr){
      var i = arr.indexOf(val);
      i>-1&&arr.splice(i, 1);
      return arr
    },
    isIn: function(val, arr){
      if(e.is.array(val))
      for (const i of val) {
        if(arr.indexOf(i)==-1)
        return false;
      }
      else
        return arr.indexOf(val) >- 1;
      return true
    }
  },
  //字符串处理类
  e.string = {
    //去除字符串两边空格
    trim: function(e){
      return e.replace(/(^\s*)|(\s*$)/g, "");
    },
    copy: function(str){
      var save = function (e){
          e.clipboardData.setData('text/plain',str);
          e.preventDefault()
      }
      let e = window.document;
      e.addEventListener('copy',save),
      e.execCommand("copy"),
      e.removeEventListener('copy',save)
    },
    low: function(e){
      return e.toLowerCase()
    },
    upp: function(e){
      return e.toUpperCase()
    },
    isIn: function(v, str){
      if(e.is.array(v)){
        for (const i of v)
          if(str.indexOf(i)>-1)
            return true;
      }else
        return str.indexOf(v)>-1;
      return false
    },
    pos: function(v, str){
      return str.indexOf(v)
    }
  },
  //获取窗口, 仅支持唯一窗口
  e.getForm = function(e){
    return aui.openForms[e]
  },
  /** 窗口类
   *  new aui.from({
        formPath: 'url', 窗口路径(不带后缀)
        form: $(jq), //jq元素(有此项时忽略 formPath)

        clickitem: $(jq), //触发的按钮(为空时不显示任务栏图标)
        onload: function || [function], //启动后调用 可为数组
        data: {}, //用户数据(可用form.get获取)

        icon: 'url' || null, //任务栏图标,为空时复制clickitem的图标,
        mini_icon: 'url' || null, //小图标, 依附在任务栏图标右上角
        ones: true, //仅能开启1个(仅限formPath启动), 可用aui.getForm(formPath)进行获取
        select: true, //重定义select选项
        parent: null, //父级窗口
        onclose: 关闭时调用函数

        useMask: false, //使用遮罩层
        maskClose: true, //点击遮罩层关闭窗口
        maskBlack: true, //黑色遮罩层
      })
   */
  e.form = class {
    init(){
      this.formPath = null;
      this.form = null;
      this.taskbar = null;
      this.clickitem = null;
      this.mask = null;
      this.onclose = null;
      this.parent = null;
      this.maskBlack = true;
      this.useMask = false;
      this.maskClose = false;
  
      this.data = {};
      this._data = {};
      this.icon = null;
      this.mini_icon = null;
      this.ones = true;
      this.onload = null;
      this.drag = true;
      this.offset = 1;
      this.isTop = false;
      this.anime = true;
      this._center = false;
      //-----以下为html组件绑定------
      this.select = true;
      this.checkbox = true;
      this.tips = true;
      this.range = true;
      this.mobile = false;
      this.menu = true;
    }

    //-----以上为html组件绑定------
    constructor(param){
      this.init(this);
      if(aui.is.object(param))
        for (const key in param)
          this.hasOwnProperty(key) && (this[key] = param[key]);
      (!this.ones || !aui.openForms[this.formPath]) ? this.open() : aui.openForms[this.formPath].show()
    }
    //获取data的参数
    get(k){
      return (data&&data[k])||null
    }
    find(e){
      return this.form.find(e)
    }
    //打开窗口
    open(){
      var e = this, bind = function(){
        let down = aui.bind('down',function(){return aui.is.mobile()});
        e.ones&&(aui.openForms[e.formPath] = e),
        aui.forms.push(e),
        e.anime = e.anime?'-anime':'',
        e.form.addClass("form-open"+e.anime),setTimeout(function(){e.form.removeClass("form-open"+e.anime)},200),
        e.useMask && ($(".topLayer").append(e.mask=$('<div class="mask'+(e.maskBlack?' mask-black':'')+'"></div>')),
          e.maskClose && e.mask.bind({
            click: function(){e.close()},
            contextmenu: function(){ return false},
          })
        ),
        e.top(),
        (e.clickitem || e.icon)&&e.addTaskbar(),
        e.form.find(".form-btn-close").click(function(){
          e.close()
        }).bind(down),
        e.form.find(".form-btn-mini").click(function(){
          e.form.addClass("form-close" + e.anime)
        }).bind(down);
        aui.is.mobile() || e.drag && aui.dom.drag(e.form,e.form.find(".form-title"),null,false),
        !aui.is.undefined(e.offset)&&(aui.is.object(e.offset) ? e.form.offset(e.offset) : (!aui.is.mobile()||e._center) && e.center(e.offset)),
        e.select&&aui.html.select(e.form),
        e.checkbox&&aui.html.checkbox(e.form),
        e.tips&&aui.html.hover_tips(e.form),
        e.range&&aui.html.range(e.form),
        e.menu&&aui.html.menu(e),
        e.form.bind(aui.bind('down',function(t){ t.which==1 && e.top()})),
        e.onload&&e.callOnLoad()
      };
      e.form ? bind() : aui.http.get((e.mobile||aui.is.mobile()?'form_m/':'form/') + e.formPath, function(s){
        e.form = $(s), bind()
      }, function(){aui.tips('功能异常')})
    }
    center(e){
      aui.dom.center(this.form, e)
    }
    //启动时调用
    callOnLoad(){
      if(aui.is.array(this.onload))
        for (const i of this.onload)
          i(this)
      else
        this.onload(this)
    }
    //显示窗口
    show(top){
      top=aui.default(top, true);
      var t = this, e = t.form;
      top&&this.top(),
      e.show().hasClass("form-close"+t.anime)&&(
        e.removeClass("form-close"+t.anime).addClass("form-open"+t.anime),setTimeout(function(){e.removeClass("form-open"+t.anime)},200)
      )
    }
    //隐藏窗口
    mini(){
      var e = this.form;
      e.addClass("form-close"+this.anime)
      ,setTimeout(function(){e.hide()},200)
    }
    //添加状态栏图标
    addTaskbar(){
      let e = this, s = e.taskbar = $('<div class="taskbar-app"></div>');
      $("#taskbarbox").append(s),
      this.clickitem?s.append(this.clickitem.find('img').clone()):
      this.icon&&s.append($(`<img src="${this.icon}">`)),
      e.mini_icon&&s.append($(`<img class="mini-icon" src="${e.mini_icon}">`)),
      e.icon&&s.find('img').attr('src', e.icon),
      s.click(function(){
        !e.isTop || e.form.hasClass("form-close"+e.anime)? e.show() : e.mini()
      })
      /*
      let p = s.offset(), wh = $(window).height() * 0.15, pos, down = function(event){
        event.preventDefault(),
        aui.is.mobile()&&(event=event.changedTouches[0]),
        pos = {x: event.clientX - p.left, y:event.clientY - p.top},
        aui.dragDom = clone = s.css('opacity', 0).clone().css({opacity: 1, position: 'absolute'}).offset(p),
        $("#taskbarbox").append(clone)
        aui.bind('move', move, clone)
        aui.bind('up', up, clone)
      }, move = function(event){
        event.preventDefault();
        if(aui.dragDom!=clone){up();return}
        aui.is.mobile()&&(event=event.changedTouches[0]);
        let h = p.top - clone.offset().top, _h = event.clientY + p.top;
        clone.offset({left: p.left, top: _h})
        //h>0 && clone.offset({left: p.left, top: _h})
        //clone.css('opacity', 1-(h/wh))
      }, up = function(event){
        event.preventDefault(),
        aui.dragDom = null
        //clone.remove(), s.css('opacity', 1)
      };
      aui.bind('down', down, s)
      */
    }
    //窗口置顶
    top(){
      for (const i of aui.forms)
        i==this ? (i.isTop||this.form.parent().children().length-1!=this.form.index()&&$('.topLayer').append(this.form),i.isTop=true) : i.isTop=false
    }
    //关闭窗口
    close(){
      var e = this;
      e.mask&&e.mask.remove(),
      aui.array.remove(e, aui.forms),
      e.onclose && e.onclose(e),
      e.taskbar&&e.taskbar.animate({opacity:0},'.2s',function(){e.taskbar.remove()}),
      e.form.addClass("form-close" +e.anime),setTimeout(function(){
        e.form.remove()
      },200)
      delete aui.openForms[this.formPath];
    }
    height(e){
      return this.form.height(e)
    }
    width(e){
      return this.form.width(e)
    }
    offset(e){
      return this.form.offset(e)
    }

  },
  //载入动画
  e.loding = function(show, error, max){
    show = aui.default(show, true),
    max = aui.default(max, 5),
    this.loding_show = true;
    let dom = $('.loding-top'), create = function(){
      dom = $('<div class="loding-top" style="opacity:0"><div class="loding-top-load1"><div></div></div><div class="loding-top-load2"><div class="loding-top-load-in1"></div><div class="loding-top-load-in2"></div><div class="loding-top-load-in3"></div><div class="loding-top-load-in4"></div></div></div>');
      $('body').append(dom), aui.dom.center(dom, 0.8), dom.animate({opacity:1},'.2s')
    };
    show ? (create(), setTimeout(function(){
      aui.loding_show&&(aui.loding(null),
      error?error():aui.tips('系统异常'))
    }, max)): dom.animate({opacity:0},'.2s', function(){dom.remove()}),this.loding_show = false
  },
  //浮动提示
  e.tips = function(msg, time, func){
    time = aui.default(time, 3000);
    var dom = $('<div class="tips-top"><text>'+msg+'</text></div>');
    $('body').append(dom),
    this.dom.center(dom,this.is.mobile() ? 1.4 : 0.9),
    setTimeout(function(){
      dom.animate({opacity:0},'1s',function(){
        dom.remove(), func&&func()
      })
    }, time)
  },
  /** 检测类
   *  url: url判定
   *  mobile: 移动端判定
   *  ie: ie判定
   */
  e.is = {
    url: function(e){
      return this.is.string(e) && (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/i.test(e))
    },
    mobile: function(){
      return (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent))
    },
    ie: function(){
      return navigator.userAgent.indexOf('MSIE') >= 0
    },
    ios: function(){
      return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    },
    android: function(){
      return e.string.isIn(['Android', 'Adr'], navigator.userAgent)
    },
    html5Plus: function(){// 判断runtime是否支持5+ API，分辨是否在app里面打开
      return e.string.isIn('Html5Plus', navigator.userAgent)
    },
    inFrame: function(){ //判断是否在frame中
        return window.frames.length != parent.frames.length
    },
    array: function(e){
      return Array.isArray(e)
    },
    string: function(e){
      return typeof e === 'string'
    },
    object: function(e){
      return typeof e === 'object'
    },
    undefined: function(e){
      return typeof e === 'undefined'
    },
    haskey: function(key, obj){
      return Object.hasOwnProperty.call(obj, key)
    },
    function: function(e){
      return this.func(e)
    },
    func: function(e){
      return typeof e === 'function'
    },
    int: function(e){
      return this.number(e)
    },
    number: function(e){
      return !this.undefined(e) && e !== null && !isNaN(e)
    },
    include: function(e){ //检测文件是否被引入
      let j = /js$/i.test(e);
      $(j?'script':'link').each(function(i){
        if(i.attr(j?'src':'href').indexOf(e) > -1) 
          return true
      });
      return false;
    },
    agent: function(t){
      let s = navigator.userAgent;
      if(this.array(t))
        for (const i of t) 
          if(e.string.isIn(i, s))
            return true;
      else
        return e.string.isIn(t, s);
      return false
    },
    form: function(t){
      return t instanceof e.form
    },
    jq: function(t){
      return t instanceof jQuery
    },
    jQuery: function(t){
      return this.jq(t)
    }
  },  
  /* 绑定事件
      type = 类型 (down, up, move, click)
      func = 事件
      dom = JQ元素
  */
  e.bind = function(type, func, dom){
    type = e.string.low(type);
    let t = {};
    if(e.string.isIn('down', type))
      t.touchstart = t.mousedown = func;
    if(e.string.isIn('up', type))
      t.touchend = t.mouseup = func;
    if(e.string.isIn('move', type))
      t.touchmove = t.mousemove = func;
    if(e.string.isIn('click', type))
      t.click = t.touchstart = func;
    dom&&dom.bind(t);
    return t
  },
  /* 动态引入js或css
      src = 路径
      onload = 引入后调用
  */
  e.include = function(src, onload = null){
    if(this.is.include(src)){
      onload();
      return
    }
    /js$/i.test(src) ? $.getScript(src, onload) : (
      $('head').children(':last').attr({
          rel: "stylesheet", type: 'text/css', href: src,
      }), onload() )
  },
  /* 元素操作
    dom.center: 窗口居中
        dom = 窗口元素
        offset = 屏幕纵坐标判定, 默认1
        back = 是否返回数据而不是直接位移
    dom.drag : 窗口拖动
        dom = 窗口元素
        dragDom = 拖动的触发元素, 一般为标题(留空则为全窗口拖动)
        click = 拖动结束触发事件
        top = 拖动时置于顶层
    dom.inwin : 将窗口置于屏幕内 防止被遮挡
  */
  e.dom = {
    center: function(dom, offset, back){
      aui.is.jq(dom)||(dom=$(dom)),
      offset = aui.default(offset, 1);
      let x = ($(window).width() - 20 - dom.width()) / 2,
      y = ($(window).height() * offset - dom.height()) / 2;
      back||dom.css({left: x + 'px',top: y + 'px'});
      return {left: x, top: y}
    },
    drag: function(dom, dragDom, click, top){
      aui.is.jq(dom) || (dom=$(dom)),
      dragDom && (aui.is.jq(dragDom)||(dragDom=$(dragDom))),
      top = aui.default(top, true);
      let win = $(window), dragTime=0, dragPos = {x:0, y:0},
      Move = function(event){
        if(e.dragDom!=dom){Up();return}
        event=e.get.touche(event);
        let x=event.clientX-dragPos.x, y=event.clientY-dragPos.y, pos=dom.offset();
        x<0 ? pos.left=0 : x+dom.width() > win.width() ? pos.left=win.width()-dom.width() : pos.left=x,
        y<0 ? pos.top=0 : y+dom.height() > win.height() ? pos.top=win.height()-dom.height() : pos.top=y,
        dom.offset(pos)
      }, Up = function(){
        win.unbind(e.bind('move', Move)).unbind(e.bind('up', Up)),
        e.is.function(click) && (base.time()-dragTime<200) && click()
      }, Down = function(event){
        e.dragDom = dom,
        event = e.get.touche(event);
        win.bind(e.bind('move', Move)).bind(e.bind('up', Up)),
        dragTime = e.time(),
        dragPos = {x: event.clientX - dom.offset().left, y: event.clientY - dom.offset().top},
        top && dom.parent().append(dom)
      };
      e.bind('down', Down, dragDom||dom)
    },
    inwin: function(dom){
      aui.is.jq(dom)||(dom=$(dom));
      let win = $(window), pos = dom.offset();
      pos.left < 0 && (pos.left = win.width()*0.05),
      pos.top < 0 && (pos.top = win.height()*0.05),
      pos.left + dom.width() > win.width() && (pos.left = win.width()*0.95-dom.width()),
      pos.top + dom.height() > win.height() && (pos.top = win.height()*0.95-dom.height()),
      dom.offset(pos)
    }
  },
  e.get = {
    /*
      字符串获取函数 从window开始逐级查找
    */
    func: function(t){
      let f = window;
      for (const i of t.split('.')){
        f = f[i];
        if(!f) break
      }
      if(!e.is.func(f))
          return console.log(t + ' 不是函数', f);
      if(arguments.length > 1){
        let arg = [];
        for (let i=1;i<arguments.length;i++)
          arg.push(arguments[i]);
        return f(...arg)
      }else return f
    },
    /*
      字符串转json
    */
    json: function(t){
      let e = null;
      try{ e = JSON.parse(t)}
      catch{ console.log('JSON格式异常',t)}
      return e
    },
    /*
      json转字符串
    */
    jsonStr: function(t){
      if(e.is.object(t))
        return JSON.stringify(t);
      else
        return console.log('不是object对象', t), null
    },
    touche: function(t){
      e.is.mobile() && (
        t = t.changedTouches ? t.changedTouches[0] : t.originalEvent.changedTouches[0]
      );
      return t
    },
    
  },
  /* 设置默认值
      val = 参数
      def = 默认值
  */
  e.default = function(val, def){
    return e.is.undefined(val) ? def : val
  },
  /* url工具
    build : 组装参数
    get : 获取get参数
  */
  e.url = {
    build: function(t){
      if(!aui.is.object(t)) return t;
      var ary = [];
      for (var p in t)
          ary.push(p + '=' + encodeURI(t[p]))
      return ary.join('&');
    },
    get: function(name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      return r!=null ? unescape(r[2]) : null;
    },
  },
  //获取10位时间戳
  e.time = function(m){
    e=aui.default(e, true);
    let t=new Date().getTime();
    return m ? t : Math.round(t/1000)
  },
  //格式化时间戳
  e.date = function(time, fmt){
    fmt = aui.default(fmt, "YYYY-mm-dd HH:MM");
    let date = new Date(time?time.toString().length==10?time*1000:time:null), ret, opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt)
      ret = new RegExp("(" + k + ")").exec(fmt),
      ret && (fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0"))));
    return fmt;
  },
  //cookie操作 读取/修改
  e.cookie = {
    set: function(key, val, day){
      day = aui.default(day, 7);
      let exp = new Date();
      exp.setTime(exp.getTime() + day *24*60*60*1000);
      window.document.cookie = key + "="+escape(val)+";expires="+exp.toGMTString();
    },
    get: function(key){
      let arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
          return unescape(arr[2]);
      else
          return null;
    },
    del: function(key){
      e.cookie.set(key, '', -1)
    },
  },
  /* 文件类
    read = 读取本地文件
        path = 本地路径
        call = 委托事件
        type = 文件类型(text, byte, 默认text)
        char = 文件编码(默认utf8)
    save = 保存文件
        name = 文件名
        text = 内容
        hand = 文件头(修改文件头可以保存音乐图片等类型的文件)
    select = 选择本地文件
        call = 委托事件
        ones = 打开单一文件(多文件时返回数组)
    readSelect = 选择并读取本地文件(单一文件)
        call = 委托事件
        type = 文件类型(text, byte, 默认text)
    getEx = 获取文件路径后缀
    excludeEx = 根据后缀排除文件(无视大小写)
        arr = 文件数组
        ex = 后缀(支持字符串和数组)

  */
  e.file = {
    read: function(file, call, type, char){
      type = aui.default(type, 'text');
      if(!aui.is.object(file)) 
        return console.error('需要file object, 不是路径');
      let e = new FileReader();
      e.onload = function(){
          call(e.result)
      };
      if(type=='text')
        e.readAsText(file, char||'UTF-8');
      else if(type=='byte')
        e.readAsBinaryString(file);
      else
        e.readAsDataURL(file);
    },
    save: function(name, text, hand){
      let v = $('<a></a>');
      v.css('display','none').attr({href: aui.set.default(hand, 'data:text/plain;charset=utf-8,') + encodeURIComponent(text), download: name}),
      $('body').append(v),v.trigger("click"),v.remove()
    },
    //选择文件
    select: function (call, ones) {
      ones=aui.default(ones, true),
      $(`<input type="file" ${ones?'':'multiple="multiple"'}></input>`)
          .on('change', function(e){
              let s = e.target.files;
              call(ones?s[0]:s)
          }).trigger("click")
    },
    readSelect: function(func, type, ex, msg){
      type = aui.default(type, 'text');
      let e = this, str = aui.string;
      e.select(function(s){
        if(ex && str.low(e.getEx(s.name)) != str.low(ex))
          return aui.tips(msg||`请选择${str.upp(ex)}文件`);
        e.read(s, func, type)
      }, true)
    },
    getEx: function(path){
      let i = path.lastIndexOf(".");
      return i>-1 ? aui.string.low(path.substr(i+1)) : null
    },
    getName: function(path){
      let i = path.lastIndexOf("."),
      s = path.lastIndexOf("/");
      s<0 ? (s=0) : (s+=1);
      return i>-1 ? path.substr(s, i) : path.substr(s)
    },
    excludeEx: function(arr, ex){
      let list=[], low = aui.string.low;
      if(!ex || ex=='*')
        return arr;
      else if(aui.is.array(ex)){
        for (const i of arr)
          for (const v of ex)
          low(this.getEx(i.name)) == low(v)&&list.push(i);
      }else{
        ex = low(ex);
        for (const i of arr)
          ex.indexOf(low(this.getEx(i.name)))>-1&&list.push(i);
      }
      return list;
    },
    folder: function(){
      try {
        var Message = "\u8bf7\u9009\u62e9\u6587\u4ef6\u5939"; //选择框提示信息
        var Shell = new ActiveXObject("Shell.Application");
        var Folder = Shell.BrowseForFolder(0, Message, 64, 17); //起始目录为：我的电脑
        //var Folder = Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面
        if (Folder != null) {
            Folder = Folder.items(); // 返回 FolderItems 对象
            Folder = Folder.item(); // 返回 Folderitem 对象
            Folder = Folder.Path; // 返回路径
            if (Folder.charAt(Folder.length - 1) != "\\") {
                Folder = Folder + "\\";
            }
            console.log(Folder)
        }
      }
      catch (e) {
          aui.tips('无法选择文件夹'),
          console.log(e.message)
      }
    }
  },
  /* 给JQ的$.get,$.post加了个error
  */
  e.http = {
    get: function(url, succ, error, time, pro){
      $.ajax({
        url: url,
        type: 'GET',
        async: true,
        timeout: time || 1000,
        success: succ,
        error: error,
        xhr: function(){
          let xhr = $.ajaxSettings.xhr();
          if(pro && xhr.upload){
            xhr.upload.addEventListener('progress',function(e){
              if (e.lengthComputable) {
                let p = e.loaded / e.total;
                console.info("progress: "+Math.round(p * 100)+"%");
              }
            }, false);
          }
          return xhr
        }
      })
    },
    post: function(url, data, succ, error, time, pro){
      let s = {
        url: url,
        async: true,
        type: 'POST',
        data: data,
        timeout: time || 1000,
        success: succ,
        error: error,
      };
      pro&&(s.xhr=function(){if(pro){
        let xhr = $.ajaxSettings.xhr();
        if(xhr.upload){
          xhr.upload.addEventListener('progress',function(e){
            if (e.lengthComputable) {
              let p = e.loaded / e.total;
              pro(p), console.info("progress: "+Math.round(p * 100)+"%");
            }
          }, false);
        }
        return xhr
      }});
      $.ajax(s)
    },
    json: function(url, succ, error, t){
      $.ajax({
        url: url,
        type: 'GET',
        async: true,
        timeout: t || 1000,
        success: succ,
        error: error,
      })
    },
    webview: function(param){
      new e.form({
        formPath: 'webview.html',
        data: param.data,
        onclose: param.onclose,
        onload: function(win){
          win.find('iframe').attr('src', param.url),
          param.name&&win.find('#form-title-text').text(param.name),
          param.onload&&param.onload(win)
        }
      })
    },

  },
  /*
    图标抽屉
    items = [{
        icon:图标
        name:名字
        func:点击事件
      }]
    onload : 生成后调用
    formPath = 打开的窗口路径
  */
  e.drawer = function(items, onload, form){
    let param = {
      drag: false,
      useMask: true,
      maskClose: true,
      _center: true,
      offset: aui.is.mobile() ? 0.9 : 0.8,
      onload: onload
    };
    form ? aui.is.jq(form) ? param.form = form : param.formPath = formPath : param.form = $('<div class="app-drawer"><div class="items"></div></div>');
    let v = new aui.form(param),
        e = v.find('div');
    for (const i of items) {
      let dom = $(`<div class="app-item"><img src="${i.icon}"><text>${i.name}</text></div>`);
      i.func&&(typeof i.func == 'function' ? dom.click(function(){i.func(i)}) : dom.attr("onclick", i.func)),
      e.append(dom), dom.click(function(){v.close()})
    }
  },
  /* 数据验证器  代码参考 https://gitee.com/nullfeng/js_validate/blob/master/src/Validate.js

  */
  e.validate = function(data, rule, name){
    if(!e.is.object(data))
      return console.log('验证器必须是object', t);
    let _rule = {
      number: function (v){ return /^-?\d*\.?\d+$/.test(v)},
			chinese: function (v){ return /^[\u4e00-\u9fa5]+$/.test(v)},
			email: function (v){ return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(v)},
			idcard: function (v){ return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(v)},
			phone: function (v){ return /^[1][3-9][0-9]{9}$/.test(v)},
			require: function (v) { return (v !== null && v != undefined && v !== ''); },
			length: function (v, m, n) { return !(('' + v).length < m || ('' + v).length > n); },
			min: function (v, l) { return ('' + v).length >= l; },
			max: function (v, l) { return ('' + v).length <= l; },
			eq: function (v, m) { return v == m; },
			neq: function (v, m) { return v != m; },
			gt: function (v, m) { return v > m; },
			lt: function (v, m) { return v < m; },
			between: function (v, m, n) {
				if (isNaN(v)) return false;
				return v > m && v < n;
			},
			in: function () {
				for (let i = 1, len = arguments.length; i < len; i++)
					if (arguments[0] == arguments[i])
						return true;
				return false;
			},
    },_msg = {
      number: '$0只能是数字',
			chinese: '$0只能是中文',
			email: '$0格式不正确',
			idcard: '$0格式不正确',
			phone: '$0格式不正确',
			require: '$0不能为空',
			length: '$0长度只能是$1到$2个字符',
			min: '$0至少$1个字符',
			max: '$0不能超过$1个字符',
			eq: '$0只能是$1',
			neq: '$0不能为$1',
			gt: '$0不能小于$1',
			lt: '$0不能大于$1',
			between: '$0值只能在$1到$2之间',
			in: '$0只能取$n',
    };
    for (const [key, val] of Object.entries(data))
      if(rule[key] && _rule[key])
        for (let r of rule[key].replace(':',',').split('|')) {
          let r = r.split(',');
          if(!_rule[r[0]](val, r[1],r[2])){
            let s = _msg[r[0]];
            name && name[key] && s.replace('$0', name[key])
            for (let i = 1; i < array.length; i++)
              r[i] && s.replace('$'+i, r[i]);
            return aui.tips(s), false
          }
        }
    return true
  },
  e.for = function(obj, func, nokey){
    for (const [key, val] of Object.entries(obj))
      nokey ? func(val) : func(key, val)
  },
  /* 弹出菜单

  */
  e.menu = function(option){
    if(!option) return;
    let param = {
      drag: false,
      useMask: true,
      maskClose: e.default(option.maskClose, true),
      data: option.data,
      maskBlack: option.maskBlack,
      anime: false,
      onclose: option.onclose,
      offset: option.offset || !option.event ? 1 : {left: option.event.pageX, top: option.event.pageY},
      form: $(`<div class="aui-menu" style="${option.style||''}"></div>`),
      onload: function(win){
        let item;
        for (let i of option.list) {
          item = $(`<div class="aui-menu-item" style="${i.style||''}">${i.name}</div>`),
          i.css&&item.css(i.css),
          win.form.append(item),
          e.is.string(i.func)?(item.attr('onclick', i.func),i.func=null) :
          item.click(function(){
            i.func&&i.func(win.data), win.close()
          })
        }
        item&&item.addClass('aui-menu-item-end'),
        e.dom.inwin(win.form)
      }
    };
    return new aui.form(param);
  },
  /* 弹窗输入参数
    
    option = {
      close = 点击旁边关闭.
      list = [
        {
          key: key
          name: 名称
          rule: 验证参数
          type: text(input[默认])/btn(button)/select/enter
          placeholder: 提示,
          tips: 提示
          func: btn/enter 函数
          select: {
            key: name
          }
        }
      ]
    }
  */
  e.input_menu = function(option){
    let rule={}, name={}, param = {
      drag: false,
      useMask: true,
      maskClose: e.default(option.maskClose, true),
      onclose: option.onclose,
      maskBlack: option.maskBlack,
      anime: false,
      center: 0.8,
      form: $(`<div class="aui-input-menu"></div>`),
      data: {},
      onload: function(win){
        for(const i of option.list){
          let s, v = $(`<div class="aui-input-item"></div>`);
          switch(i.type){
            case 'select':
              v.append($(`<text ${i.tips&&'class="hover-tips-text" data-tips="'+i.tips+'"'}">${i.name||i.key}</text>`)),
              s = $(`<select></select>`),
              e.for(i.select, function(k, v){
                s.append($(`<option value ="${kay}">${v}</option>`))
              }),
              win.data[i.key] = s;
            break;
            case 'text':

            break;
            case 'btn':
            case 'button':
              s = $(`<button type="button">${i.name||i.key}</button>`),
              s.click(function(){i.func(win)});
            break;
            case 'enter':
              s = $(`<button type="button">${i.name||'确定'}</button>`),
              s.click(function(){
                let data = {};
                e.for(win.data, function(key, val){
                  data[key] = val.val()
                }),
                (e.default(option.validate, true) || e.validate(data, rule, name)) && (i.func(data), win.close());
              })
            break;
            case 'back':
              s = $(`<button type="button">${i.name||'返回'}</button>`),
              s.click(function(){win.close()});
            break;
            case 'text':
            case 'input':
              i.rule&&(rule[i.key]=i.rule),
              i.name&&(name[i.key]=i.name),
              v.append($(`<text ${i.tips&&'class="hover-tips-text" data-tips="'+i.tips+'"'}">${i.name||i.key}</text>`)),
              s = $(`<input type="text" placeholder="${i.placeholder||''}" value="${i.value||''}">`);
              win.data[i.key] = s;
          }
          win.form.append(v),
          s&&v.append(s)
        }
        win.form.children(':last').css('border-bottom','unset'),
        e.dom.inwin(win.form)
      }
    };
    return new aui.form(param);
  },
  /*
    select = 重新定义html的select标签 让他更好显示多项
        e = form对象或者是JQ对象
        size = 折叠显示的最大数量
    img_list = 图片选择模块
        dom = 需要实例化的JQ元素
        param = 附加参数(主要用于自定义class)
        // 获取图集使用, 顺序为列表中的顺序 img_list.get() = [
        //    图片1, 图片2,...
        //]
    checkbox = 重定义 input的checkbox

    hover_tips = 气泡提示组件
        在需要触发的元素上加上hover-tips类, 并在元素内添加 data-tips="提示" 属性
    range = 滑块浮动显示数值

  */
  e.html = {
    menu: function(win){
      let form = e.is.jq(win) ? win : win.form;
      form.find('menu').each(function(){
        let menu = $(this), list = [];
        menu.children('item').each(function(){
          let item = $(this), func = e.string.trim(item.attr('func'));
          e.is.form(win) && (
            func == 'menu-mini' ? (func = function(){win.mini()}) : 
            func == 'menu-close' ? (func = function(){win.close()}) : 
            null
          )
          list.push({
            name: item.attr('name'),
            style: item.attr('style'),
            func: func,
          })
        }),
        form.find(menu.attr('for')).click(function(event){
          e.menu({
            list: list,
            event: event,
            maskBlack: true,
          })
        })
      })
    },
    close: function(back){
      if(back && history.length > 2){
        window.history.go(-1);
      }else{
        if(e.is.agent(['Firefox','Chrome']))
          location.href = "about:blank";
        else{
          window.opener = null;
          window.open('', '_self');
        }
        window.close();
      }
    },
    select: function(form, size){
      size = e.default(size, 7),
      form = (form.form||form).find("select"),
      form.each(function(){
        let e = $(this), c, l, v, mask = $('<div class="mask"></div>'), end = function(){
          c.remove(),c=null,e.attr("disabled","true"),e.attr("disabled",null),mask.remove()
        }, hide = (e.find(":first").is(":visible") || e.find(":first").css('display') == 'none');
        e.click(function(){
          if(c) end();
          else{
            v = e.find("option"),
            l = v.length-(hide?1:0);
            if(l>1){
              c = e.clone().css('position','absolute'), pos = e.offset();
              (hide ? c.find(":not(:first)") : c.children()).show(),
              c.find(":last").css('border-bottom','unset'),
              c.get(0).selectedIndex = e.get(0).selectedIndex,
              $('body').append(mask).append(c), c.attr('size', size),
              c.height( e.height() * (l>size ? size : l)),
              c.width(e.width()),
              c.css({left: pos.left, top: pos.top + e.height() +3}),
              e.attr("disabled","true"),e.attr("disabled",null),
              c.change(function(){
                e.get(0).selectedIndex = c.get(0).selectedIndex,end(),e.trigger("change")
              }),
              mask.click(end)
            }
          }
        })
      })
    },
    checkbox: function(form){
      form.find('input[type=checkbox]').each(function(){
        let v = $('<label class="checkbox-label"><span class="checkbox-circle"></span><span class="checkbox-on">ON</span><span class="checkbox-off">OFF</span></label>'),
        active = 'checkbox-label-active',
        e = $(this), b;
        v.attr('style',e.attr('style')),
        e.hide().after(v),
        e.prop('checked') && v.addClass(active),
        v.click(function(){
          e.prop('checked', b = !e.prop('checked')),
          b ? v.addClass(active) : v.removeClass(active),
          e.trigger("change")
        })
      })
    },
    hover_tips: function(form, showVal){
      if(e.is.mobile())
        return form.find('[class^=hover-tips]').each(function(){
          let s = $(this);
          s.click(function(){
            aui.tips(s.attr('data-tips'), 1000)
          })
        });
      let v;
      form.find('[class^=hover-tips]').hover( function(e){
        v || ($(this).attr('data-tips') && ((
          v = $('<div class="hover-tips-box"></div>'),
          $('body').append(v),
          v.animate({opacity:1}, '.3s')
        ),
        v.text((showVal&&$(this).val())||$(this).attr('data-tips')),
        v.offset({left: e.pageX, top: e.pageY+10})))
      }, function(e){
        v && v.animate({opacity:0},'.3s',function(){
          v.remove(), v = null
        })
      }).bind(aui.bind('move',function(e){
        v && v.offset({left: e.pageX, top: e.pageY+10})
      }))
    },
    range: function(form){
      form.find('input[type=range]').each(function(){
        let v, s = $(this);
        s.bind(aui.bind('down',function(e){
          e=aui.get.touche(e),
          v = $(`<div class="range-hover">${s.val()}</div>`),
          $('body').append(v),
          v.animate({opacity:1}, '.3s'),
          v.offset({left: e.pageX - v.width() / 2, top: s.offset().top - v.height() - 5})
        })).bind(aui.bind('move',function(e){
          v && (
            e=aui.get.touche(e),
            e.pageX > s.offset().left+5 && e.pageX < s.offset().left + s.width()-5 &&
            v.offset({left: e.pageX - v.width() / 2, top: s.offset().top - v.height() - 5}),
            v.text(s.val())
          )
        })).bind(aui.bind('up',function(e){
          v && v.animate({opacity:0},'.3s',function(){
            v.remove(), v = null
          })
        }))
      })
    },
    img_list: class {

      init(){
        this.win = null;
        this.dom = null;
        this.img_name = false;
  
        this._imgs = [];
        this.add_btn = null;
        this._item_new = 'img-list-item-new';
        this._item = 'img-list-item';
        this._click = 'img-list-item-click';
        this.jq_item_new = ':not(.img-list-item-new)';
        this._input_name = '<input type="text" class="hover-tips-input" data-tips="该图片在json中的文件名">';
        this.ex = 'png,jpg';
        this.menu = [];
        this.onload = null;
      }

      constructor(dom, param){
        this.init();
        let e = this;
        this.dom = dom;
        if(aui.is.object(param))
          for (const key in param)
            this.hasOwnProperty(key) && (this[key] = param[key]);
        this.add_btn = dom.find('.'+this._item_new),
        this.add_btn||(this.add_btn=$(`<div class="${this._item} ${this._item_new}"></div>`),dom.append(this.add_btn)),
        this.add_btn.click(function(){e.add()}),
        this.onload&&this.onload(this)
      }
      count(){
        return this._imgs.length
      }
      clear(){
        this._imgs = [], this.dom.children(':not(:last)').remove()
      }
      add(){
        let t = this;
        aui.file.select(function(list){
          list = aui.file.excludeEx(list, t.ex);
          if(list.length<1){
            aui.tips(`请选择${t.ex}图片`);
            return
          };
          for (const i in list){
            aui.file.read(list[i], function(data){
              let item = {
                dom: $(`<div class="${t._item}"></div>`),
                data: data,
                name: aui.file.getName(list[i].name),
                ex: aui.file.getEx(list[i].name),
              };
              t.img_name && (item.dom.append($(t._input_name).val(item.name).attr('title', item.name).change(function(){
                let e = $(this).val(); $(this).attr('title', e), item.name=e
              })), 
              aui.html.hover_tips(item.dom)),
              item.dom.css('background-image', `url(${data})`),
              t.dom.append(item.dom),
              t._imgs.push(item),
              t.bind(item),
              t.top()
            }, 'img')
          }
        }, false)
      }
      del(item){
        aui.array.remove(item, this._imgs),
        item.dom.remove()
      }
      top(){
        this.dom.append(this.add_btn)
      }
      bind(item){
        let t = this, win = $(window), dom = item.dom, clone, down = function(e){
          if(!e || e.target != this) 
            return;
          else if (e.which == 3){
            aui.menu({
              list: t.menu.concat([
                {'name':'前移', 'func': function(){
                  let i = dom.index();
                  i>0 && t.dom.children(t.jq_item_new).eq(i-1).before(dom)
                }},
                {'name':'后移', 'func': function(){
                  let i = dom.index(), s = t.dom.children(t.jq_item_new);
                  i<s.length-1 && s.eq(i+1).after(dom)
                }},
                {'name':'删除', 'func': function(){t.del(item)}},
              ]),
              event: e,
              onclose: function(){dom.removeClass(t._click)},
              data: {
                img_list : t,
                item: item,
              },
            });
            for (const i of t._imgs)
              item==i?i.dom.addClass(t._click) :i.dom.removeClass(t._click);
          }else if(e.which == 1){
            clone = dom.css('opacity',0).clone().css({opacity: 0.6, position: 'absolute'}).offset({left: e.pageX-dom.width()/2, top:e.pageY-dom.height()/2}),
            win.bind(aui.bind('up', up)).bind(aui.bind('move', move)),
            t.dom.append(clone)
          }
        }, up = function(){
          dom.css('opacity',1),
          clone&&clone.remove(),
          win.unbind(aui.bind('up', up)).unbind(aui.bind('move', move));
        }, move = function(e){
          let p = t.dom.offset();
          e.pageX > p.left && e.pageY > p.top && e.pageX < p.left + t.dom.width() && e.pageY < p.top + t.dom.height() &&
          clone.offset({left: e.pageX-dom.width()/2, top:e.pageY-dom.height()/2});
          for (const i of t._imgs){
            let pos = i.dom.offset();
            if(i != item &&
              e.pageX > pos.left &&
              e.pageY > pos.top &&
              e.pageX < pos.left + i.dom.width() &&
              e.pageY < pos.top + i.dom.height()
            ){
              i.dom.index() < dom.index()? i.dom.before(dom) : dom.before(i.dom);
              break
            }
          }
        };
        dom.bind(aui.bind('down', down))
           .bind("contextmenu",function(e){ if(e && e.target == this) return false})
      }
      get(){
        for (const i of this._imgs)
          i.id = i.dom.index();
        let list = {};
        for (const i of this._imgs)
          list[i.id] = {data:i.data, name: i.name, id: i.id, ex: i.ex, param: i.param};
        return list
      }
    },
  },
  /*  弹窗 支持2按钮
      msg : 提示文字
      param = {
        name1 : 按钮1文字(默认确定)
        func1 : 按钮1事件
        name2 : 按钮2文字(默认取消)
        func2 : 按钮2事件(留空则隐藏按钮2)
        close : 点击旁边关闭
      }
  */
  e.message = function(msg, param){
    param = aui.default(param, {});
    let dom = `<div class="msg-top"><text>${msg}</text><div class="msg-top-btns"><div class="msg-top-btn-left">`, 
    bind = function(e){
      e.form.find('.msg-top-btn-left').click(function(){
        aui.default(param.func1&&param.func1(),true)&&e.close()
      }),
      param.func2 ? e.form.find('.msg-top-btn-right').click(function(){
        aui.is.func(param.func2)&&param.func2(), e.close()
      }) : e.form.find('.msg-top-btn-left').css('width', '100%')
    };
    dom += (param.name1 || '确定') + '</div>',
    param.func2 && (dom += '<div class="msg-top-btn-right">' + (param.name2 || '取消')) + '</div>',
    dom += '</div></div>';
    return new aui.form({
      form: $(dom),
      onload: bind,
      drag: false,
      useMask: true,
      maskClose : param.close,
      _center: true,
      offset: 0.8,
    })
  },
  e.input_box = function(msg, param){
    param.close=e.default(param.close,false);
    param.func2=e.default(param.func2,true);
    param.type=e.default(param.type,'text');
    let s = '', func = param.func1;
    param.func1 = function(){
      return func&&func(s)
    };
    let win = e.message(msg, param),
    input = $(`<input type="${param.type}" id="input_box" placeholder="${param.tips||''}" style="width: 80%;margin-top: 1em;">`);
    win.find('text').after(input), input.change(function(){
      s=$(this).val()
    });
    return win
  }

  /* 消息推送, 模仿移动端
      param = {
        icon = 图标
        closeTime = 自动关闭时间
        onclick = 点击触发
        onclose = 关闭触发
        onload = 启动触发
        msg = 提示文字
        data = 自选数据
      }
  */
  e.push = class{
    init(){
      this.data = null;
      this.icon = null;
      this.closeTime = null;
      this.onclick = null;
      this.onclose = null;
      this.onload = null;
      this.clickClose = true;
      this.form = $(`<div class="push-item"><div class="push-img"></div><div class="push-text"></div><div class="push-close">×</div></div>`);
      this.msg = null;
    }
    
    constructor(param){
      this.init();
      let t = this;
      if(!param.msg) return;
      if(aui.is.object(param))
        for (const key in param)
          t.hasOwnProperty(key) && (t[key] = param[key]);
      e.is.string(t.form)&&(t.form=$(t.form)),
      t.icon && t.seticon(),
      t.msg && t.setmsg(),
      t.open(),
      t.form.click(function(e){t.click(e)}),
      t.form.find('.push-close').click(function(){t.close()}),
      e.is.number(t.closeTime) && setTimeout(function(){
        t.close()
      }, t.closeTime),
      t.onload && t.onload(t)
    }
    seticon(s){
      this.form.find('.push-img').css('background-image', `url(${s||this.icon})`)
    }
    setmsg(s){
      this.form.find('.push-text').text(s||this.msg)
    }
    open(){
      $('.push-box').append(this.form).children().removeClass('push-last').last().addClass('push-last')
    }
    click(event){
      if(event.target==this.form){
        onclick&&onclick(this.data),
        this.clickClose&&this.close()
      }
    }
    close(){
      let t = this;
      onclose&&onclose(t.data),
      t.form.animate({opacity:0}, '.3s', function(){
        t.form.remove(),
        $('.push-box').children().removeClass('push-last').last().addClass('push-last')
      })
    }
  }

  return e.onload(), e
});
