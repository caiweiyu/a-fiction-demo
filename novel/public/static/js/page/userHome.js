//init
var flog = {
    changefont: true
};
$(function () {
    blockListRender();
    // 获取用户信息
    getUserInfo();
    //用户去掉广告
    userRemoveBD();
    event();
});

// 块渲染
function blockListRender() {
    blockList.forEach(function (item) {
        var block = $("  <div class='block' data-type='" + item.type + "'>" +
            "  <a href='" + item.url + "'>" +
            "    <img class='blockImg' src='" + item.icon + "'/>" +
            "    <span class='blockTitle'>" + item.title + "</span>" +
            "    <img class='blockArrow' src='/static/images/Page/arrow.png'/>" +
            "  </a>" +
            " </div>");
        block.appendTo($(".blockBox"));
    });
}

// //获取用户信息
function getUserInfo() {
    $.ajax({
        type: "get",
        url: get_userInfo_api,
        dataType: "json",
        success: function (res) {
            if (res.code === 1) {
                var data = res.data;
                userInfoRender(data);
            } else {
                textToast(res.msg);
            }
        },
        error: function (e) {
            textToast("获取用户信息失败，错误代码：01");
        }
    });
}

function event() {
    var $html = $('html');
    $html.on('tap', '.lookMoreMeun', function () {
        flog.changefont === true ? (function () {
            $('.setting_bottom_box').stop().animate({
                height: '60vw'
            });
            $('.settingMenuBox').show();
            $('.myshefbook_box').show();
            flog.changefont = false;
        }()) : (function () {
            $('.setting_bottom_box').stop().animate({
                height: '0vw'
            });
            $('.settingMenuBox').hide();
            $('.myshefbook_box').hide();
            flog.changefont = true;
        }())
    });
    //进入分类页
    $html.on('tap', '.fl_imgmark', function () {
        location.href = `/app/classification`;
    });
    //进入排行页
    $html.on('tap', '.ph_imgmark', function () {
        location.href = `/app/rank`;
    });
    //进入全本页
    $html.on('tap', '.allbook_imgmark', function () {
        location.href = `/app/end`;
    });
    //进入新书页
    $html.on('tap', '.newbook_imgmark', function () {
        location.href = `/app/new`;
    });
    //返回首页
    $html.on('tap', '.index_imgmark', function () {
        location.href = `/index.html`;
    })
    //返回我的
    $html.on('tap', '.me_imgmark', function () {
        location.href = `/user.html`;
    });
    //去我的书架
    $html.on('tap', '.toMySelfBook', function () {
        location.href = `/bookshelf.html`;
    })
}
//用户信息渲染
function userInfoRender(data) {
    $(".username").find(">em").html(data.nickname);
    $(".userId").find(">em").html(data.username);
    $(".userPortrait").attr("src", data.cover);
    $(".coinNum").html(data.balance);
    $(".bookNum").html(data.bookshelf_num);
    $(".vipLv").attr("data-lv", data.vip).find("em").html(`${data.vip}`);

}

//保存用户操作去掉广告行为
function userRemoveBD() {

    $('html').on('tap', '.closeThat', function () {
        var removeThat1 = $('.RandomBD').remove();
        setStorage('removeThat', removeThat1);
    });
    var __userdone__ = getStorage('removeThat');

    if (__userdone__) {
        $('.RandomBD').remove();
    }
}
