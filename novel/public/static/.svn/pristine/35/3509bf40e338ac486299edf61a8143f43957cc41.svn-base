//弹窗参数
// var params = {
//     msg: '提示信息,可为字符串html',
//     type: 'fun || autoClose',
//     time: '时间',
//     btn1name: '第一个按钮名字',
//     btn2name: '第二个按钮名字',
//     fun1: function () {
//          第一个按钮方法
//     },
//     fun2: function () {
//          第二个按钮方法
//     }
// };

//弹窗示例
// toast({
//     msg: '<p style="text-align: center; font-size:3.5vw;">测试信息</p>',
//     type: 'autoClose',
//     time: 1000,
// });

function toast(params) {
    var $btnBox =
        "<div class='btnBox'>" +
        "    <span class='btn1'>" + params.btn1name + "</span>" +
        "    <span class='btn2'>" + params.btn2name + "</span>" +
        "</div>";

    //创建弹窗盒子

    var $toastBox = $("" +
        "<div class='toastBox' data-function_type='buy'>" +
        "    <div class='toast'>" +
        "        <div class='toastHeader'>" +
        "            <div class='closeToastBox'></div>" +
        "        </div>" +
        "        <div class='toastContent'>" +
        "            <div class='toastText'>" + params.msg + "</div>" +
        ((params.type === 'fun') ? $btnBox : '') +
        "        </div>" +
        "    </div>" +
        "</div>");

    $toastBox.appendTo($("body"));

    //根据类型判断行为
    switch (params.type) {
        case 'fun':
            funEvent(params.fun1, params.fun2);
            break;
        case 'autoClose':
            closeToastBox(params.time);
            break;
    }
    commentEvent();
}

function closeToastBox(time) {
    setTimeout(function () {
        $(".toastBox").remove();
    }, time);
}

function funEvent(fun1, fun2) {
    //按钮一touch事件
    $("html").on('tap', '.btn1', fun1);
    //按钮二touch事件
    $("html").on('tap', '.btn2', fun2);

}

function commentEvent() {
    //关闭操作
    $("html").on('tap', '.closeToastBox', function () {
        $(".toastBox").remove();
    });
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
//获取url路径
function GetUrlRelativePath(param) {
    var url = document.location.toString();
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);
    window.location = relUrl = param;
}

//文本盒子方法
function textToast(msg) {
    toast({
        msg: '<p style="text-align: center; font-size:3.5vw;">' + msg + '</p>',
        type: 'autoClose',
        time: 1500,
    });
}

//获取用余额
function getUserBalance(callback) {
    var userBalance;
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: get_user_balance_api,
        success: function (res) {
            if (res.code === 1) {
                userBalance = res.data.balance;
                callback(userBalance);
            } else {
                callback(0);
            }
        },
        error: function () {
            textToast('获取用户余额失败。错误代码：01');
        }
    });
}

//loading
function setLoading() {
    try {
        var $dom = $("<div class='loadingBox'><img src='/static/images/Page/loading.gif' /></div>");
        $dom.appendTo($("body"));
    } catch (e) {
        alert(e);
    }
}

function removeLoading() {
    $(".loadingBox").remove();
}

function newGuideset() {
    var newGuide = getStorage('local','newGuide');
    if (newGuide.params === true) {
        $('body').children('div').show();
        $('.footerSidebar').show();
        $('.newGuide').hide();
    } else {
        try {
            setTimeout(function () {
                $('body').children('div').hide();
                setTimeout(function(){
                    $('.footerSidebar').hide();
                },300);
                newTypeHtml();
            }, 10000);
        } catch (e) {

        }

    }
}

/** 
总请求
需要参数
{
    url,
    type,
    params,
    fun,//成功回调
}
**/


function httpApi(data) {
    const {
        url,
        type,
        params,
        fun
    } = data;
    $.ajax({
        url,
        data: params,
        dataType: "json",
        type,
        success: function (res) {
            fun(res);
        },
        error: function (e) {
            removeLoading();
            alert('请求失败', e)
        }
    })
}

//图片错误显示的图片
function imgError(book_name, dom) {
    $(dom).attr("src", "/static/images/no_cover.jpg");
}

//处理小说字数统计
function format_word(word) {
    var new_word = (word / 10000).toFixed(0);
    if (new_word < 1) {
        new_word = word;
    }
    return new_word + '万';
}
//本地存储
// 设置本地储存 name为储存的地方，data为数据
function setStorage(type, name, data) {
    if (type === "local") {
        if (typeof data === "object") {
            data = JSON.stringify(data)
        }
        localStorage.setItem(name, data);
    } else {
        sessionStorage.setItem(name, JSON.stringify(data));
    }
}

//获取本地储存的数据
function getStorage(type, name) {
    if (type === "local") {
        var params = localStorage.getItem(name);
        if (params === null) {
            params = {};
        } else {
            if (isJSON(params)) {
                params = JSON.parse(params);
            }
        }
        return params;
    } else {
        return JSON.parse(sessionStorage.getItem(name)) === null ? {} : JSON.parse(sessionStorage.getItem(name));
    }
}

//判断字符串里面是不是json
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            return false;
        }
    }
}
//拼接新手引导的模板
function newTypeHtml() {
    $dom = $(`
    <div class="newGuide">
    <div class="guideTitle">
        <p>点击【添加到我的小程序】</p>
    </div>
    <div class="firstTitlePic">
        <div class="Pic01"></div>
        <div class="Pic02">
            <p>点击右上角</p>
            <p>选择【添加到我的小程序】</p>
            <span class="Pic02-title"></span>
        </div>
        <div class='Pic03'>
        </div>
    </div>
    <div class="SecondTitlePic">
        <div class="Pic011"></div>
        <div class="Pic022">
            <p>回到微信首页，下拉界面</p>
            <p>从【我的小程序】进入笔趣在线</p>
        </div>
    </div>
    <div class="TirchTitlePic">
        <div class="Pic0111"></div>
        <div class="Pic0222">
            <p>打开【笔趣在线】小说首页</p>
            <p>就可以随时随地地畅读最新最热门地小说啦！</p>
        </div>
        <div class="Pic0333"></div>
    </div>
    <div class="gotIt">
        <p>好的，我知道了</p>
    </div>
</div>
    `);
    $dom.appendTo($('body'));
    
}
