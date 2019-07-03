// 定义变量
var $html = $('html');
var flog = {
    changefont: true
};
//init
$(function () {
    //init
    // 请求首页数据
    setSex();
    //渲染继续阅读
    continueReading();
    //banner图
    var mySwiper = new Swiper('.index-swiper-container', {
        autoplay: 5000, //可选选项，自动滑动
    });
    // 方法上线
    event();
});

//继续阅读
function continueReading() {
    var lately = getStorage('local', 'lately');
    if (!$.isEmptyObject(lately)) {
        var $dom = $(`<a href="${lately.bookUrl}">
            <div class="continueTitle">
                <span class="time_icon"></span>
                <span>继续阅读</span>
            </div>
            <i></i>
            <div class="continueCont">
                <span class="continueName">《${lately.bookName}》</span>
                <span class="continueChapter">${lately.chapterName}</span>
            </div>
        </a>`);
        $dom.appendTo($(".continueReading"));
    } else {
        console.log("没有历史记录");
    }
}

//设置性别内容
function setSex() {
    var sex = getStorage("local", "sex_type");
    setSexBtn(sex, $(".channel>span[data-type='" + sex + "']"));
}

//设置默认选项
function setSexBtn(channelType, $dom) {
    setStorage("local", "sex_type", channelType);
    manOrWoman = channelType;
    $dom.addClass("cur").siblings().removeClass("cur");
    $(".bookBlockBox").children().filter("div").remove();
    var apiUrl = channelType === 'man' ? get_book_data_url_man : get_book_data_url_woman;
    getBookData(apiUrl);
}

//绑定事件
function event() {

    //男频女频
    $(".channel").find(" span").on("tap", function () {
        var channelType = $(this).data("type");
        var $dom = $(this);
        setSexBtn(channelType, $dom);
    });

    //板块显示更多
    $("html").on("tap", ".readingMore", function () {
        var book_type = $(this).data("book_type");
        var show_type = $(this).data("show_type");

        $.each(bookBlockList, function (index, item) {
            if (item.show_type === show_type && item.name === book_type) {
                numInit[book_type] += 3;
                if (numInit[book_type] > item.data.length) {
                    numInit[book_type] = item.data.length + 1
                }
                bookListRender(item.data, book_type, show_type);
            }
        });
    });
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
        location.href = `/app/rank`
    });
    //进入全本页
    $html.on('tap', '.allbook_imgmark', function () {
        location.href = `/app/end`
    });
    //进入新书页
    $html.on('tap', '.newbook_imgmark', function () {
        location.href = `/app/new`
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

    $("html").on("tap", ".header>div", function () {
        const bookType = $(this).data("type");
        location.href = `/app/${bookType}?sex=${manOrWoman}`
    })

}