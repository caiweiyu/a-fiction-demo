//定义变量
var bookName = "";
var book_pic_url = "";
var fontSize;
var fontSizeText;
var bgColorchange;
var flog = {
    flag: true,
    changefont: true,
    shefalse:true
};
var getOne;
var getTwo;

var all_page_num = 0;
var now_page = 1;
var chapter_list = [];
var chapter_header = 0;
var sequence = true;
//init
$(function () {
    //获取书本信息
    getBookData();
    //获取章节列表
    getChapterList(true);
    //看看是不是登陆后要订阅本章节
    isLoginCollection();
    //所有
    event();
    //新手引导
    newGuideset();

    //检测滚轮到底部
    // scroll event
    $(window).scroll(function () {
        recordScrollTop();
        // scroll at bottom(判断滑向底部显示底部banner)
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
            // load data
            $(".footerSidebar").show().css({
                "position": "relative"
            });
        } else if ($(window).scrollTop() + $(window).height() < $(document).height()) {
            // load data
            $(".footerSidebar").hide().css({
                "position": "fixed"
            });       
        }
        //scroll at top(滑动固定书标题);
        var scrollTop = $(document).scrollTop();
        if (scrollTop > 0) {
            $('.header_top').addClass('fixedTop');
        } else {
            $('.header_top').removeClass('fixedTop');
        }
    });

    // 检测章节列表滚轮
    $(".chapterBox").scroll(function () {
        var scroll_height = $(this).scrollTop();
        var box_scroll_height = $(this)[0].scrollHeight;
        var box_height = $(this).height();
        if (scroll_height + box_height >= box_scroll_height) {
            now_page += 1;
            chapterListRender(chapter_list[chapter_header].chapters[`page${now_page}`]);
        }
        
    });

    //调用正文章节展开
    getLastURL();

    //获取默认背景
    getFontBGinit();
    //获取默认字体
    getBGinit()
});

 //记录滚动到底部出现新手引导
//检测页面跳转，跳转时记录

//检测页面跳转方法
function recordScrollTop() {
    var historical = getStorage('local', 'historical');
    historical[book_id]["scroll_top"] = scrollY;
    setStorage('local', 'historical', historical);
}
//记录路由
function rememberHistory(chapter_id) {
    history.pushState({
        book_id,
        chapter_id
    }, "", `?book_id=${book_id}&chapter_id=${chapter_id}`);
}

//检测是否登录后订阅
function isLoginCollection() {
    var status = getStorage("session", "is_login_collection");
    if (status === 0) {
        joinInBookshel();
        setStorage("session", "is_login_collection", 1);
    }
}

//获取书本信息
function getBookData() {
    $.ajax({
        type: 'get',
        jsonType: 'json',
        url: `/api/book/${book_id}`,
        success: function (res) {
            if (res.code === 1) {
                var data = res.data;
                bookName = data.name;
                book_pic_url = data.cover_url;
                bookDataRender(data);
            } else {
                alert(res.msg);
            }
        },
        error: function (e) {
            textToast('获取书本信息,请求失败，错误码:01');
        }
    })
}

//书本信息渲染
function bookDataRender(data) {
    $("title").html(data.name);
    $(".isEnd").html(data.status);
}

//获取章节列表
function getChapterList() {
    setLoading();
    $.ajax({
        type: 'get',
        jsonType: 'json',
        url: get_chapter_list_api,
        success: function (res) {
            if (res.code === 1) {
                var data = res.data;
                if (!sequence) {
                    data = data.reverse();
                    $.each(data, function (index, item) {
                        data[index].chapters = item.chapters.reverse();
                    })
                }
                paging(data, 200);
                chapterHerderRender(chapter_list);
            } else {
                alert(res.msg);
            }
            removeLoading();
        },
        error: function (e) {
            removeLoading();
            textToast('获取章节列表,请求失败，错误码:01');
        }
    })
}

function paging(data, limit) {
    chapter_list = [];
    var page = 1;
    $.each(data, function (index1, item1) {
        var json = {
            id: item1.id,
            name: item1.name,
            chapters: {}
        };
        chapter_list.push(json);
        $.each(item1.chapters, function (index2, item2) {
            if ((index2 + 1) % limit === 1) {
                chapter_list[index1].chapters[`page${page}`] = [];
                page += 1;
                all_page_num += 1;
            }
            if ((index2 + 1) < page - 1 * limit || page - 1 !== 0) {
                chapter_list[index1].chapters[`page${page - 1}`].push(item2);
            }
        })
    });
}

function chapterHerderRender(list) {
    if (list.length === 0) {
        textToast('该书本还没录入所有章节，请返回首页观看其他书籍');
        return;
    }
    $(".chapterBox").html("");
    var chapter_id = getUrlParam('chapter_id');
    if (getStorage('local', 'historical')) {
        var historical = getStorage('local', 'historical');
        if (!historical[book_id]) {
            chapter_id = list[0].chapters.page1[0].id;
        } else {
            chapter_id = historical[book_id].chapter_id;
        }
    } else {
        chapter_id = list[0].chapters.page1[0].id;
    }
    getChapterContent(chapter_id);
    $.each(list, function (index, item) {
        var $dom = $("" +
            "<div class='chapterBigList' data-id='" + item.id + "'>" +
            "    <div class='chapterBigListHeader'>" + (item.name === "" ? '正文' : item.name) + "</div>" +
            "<div class='chapterBigListContent'>" +
            "</div>");
        $dom.appendTo($(".chapterBox"));
        chapterListRender(item.chapters.page1);
    })
}

//章节列表
function chapterListRender(list) {
    if (!list) {
        if (chapter_list[chapter_header + 1]) {
            chapter_header += 1;
        }
        return;
    }

    var header_id = chapter_list[chapter_header].id;
    var chapterBigBox = $(`.chapterBigList[data-id='${header_id}']`).find(".chapterBigListContent");
    $.each(list, function (index, item) {
        var $chaptersDom = $("" +
            "<div class='chapterList'  data-free_status='" + item.free_status + "' data-id='" + item.id + "' data-price='" + item.price + "' data-vip_flag='" + item.vip_flag + "'>" +
            item.name +
            "    <img class='lock' src='/static/images/Page/lock.png'/>" +
            "</div>");
        $chaptersDom.appendTo(chapterBigBox);
    })
}

//显示章节盒子
function showChapter() {
    $(".catalogBox").show(function () {
        $(".catalogBox").animate({
            "left": "0"
        }, 300);
    })
}

//隐藏章节盒子
function hideChapter() {
    $(".catalogBox").animate({
        "left": "-100vw"
    }, 300, function () {
        $(".catalogBox").hide();
    });
}

//获取章节内容
function getChapterContent(chapter_id) {
    setLoading();
    $.ajax({
        type: 'get',
        dataType: "json",
        url: `/api/book/chapter/${chapter_id}`,
        success: function (res) {
            removeLoading();
            lock = true;
            if (res.code === 1) {
                var data = res.data;
                //储存本地数据库
                //先看看有没有数据
                var historical = getStorage('local', 'historical');
                var lately = {
                    bookName: bookName,
                    chapterName: data.name,
                    bookUrl: `/book/content.html?book_id=${book_id}`
                };
                if (historical[book_id]) {
                    if (historical[book_id].chapter_id !== chapter_id) {
                        historical[book_id].chapter_id = chapter_id;
                        historical[book_id].scroll_top = 0;
                    }

                } else {
                    historical[book_id] = {
                        chapter_id: chapter_id,
                        book_name: bookName,
                        book_url: `/book/content.html?book_id=${book_id}`,
                        book_pic_url: book_pic_url,
                    };
                }

                setStorage('local', 'historical', historical);
                setStorage('local', 'lately', lately);
                chapterContentRender(data);
            } else {
                textToast(res.msg);
            }
        },
        error: function (e) {
            removeLoading();
            textToast("获取章节内容,请求失败，错误代码：01");
        }
    })
}

//章节内容渲染
function chapterContentRender(data) {
    $(".chapterContent").html("");
    if (data.next) {
        next_id = data.next.id;
    } else if (data.next == null) {
        setTimeout(function () {
            $('.nextChapter').attr("disabled", "disabled");
        }, 500)
    }
    if (data.last) {
        last_id = data.last.id;
    }

    const contents = (data.content).toString().split(/[(\r\n)\r\n]+/);

    $.each(contents, function (index, item) {
        const dom = $(`<p>${item}</p>`);
        dom.appendTo($(".chapterContent"));
    });
    $('html , body').scrollTop(0);
    $('.chapter_title').html(data.name);
    $(".chapter_name").html(data.name);
    //回到用户看到那个点
    var historical = getStorage('local', 'historical');
    if (historical[book_id].scroll_top) {
        $("html,body").scrollTop(historical[book_id].scroll_top);
    }

}

//付费章节内订阅按钮
function subscribeBtnRender(params) {
    $(".subscribeBtn").remove();
    var $subscribe = $("<div class='subscribeBtn' data-chapter_id='" + params.chapter_id + "' data-price='" + params.price + "'>+订阅</div>");
    $subscribe.appendTo($(".bookContent"));
}

//插入购买盒子
function setBuyBox(data) {
    getUserBalance(function (res) {
        var $toastContent =
            "<div class='balance'>" +
            "   我的余额：<em>" + res + "</em>书币" +
            "</div>" +
            "<div class='buyThisChapter chapterType' data-type='one'>" +
            "   购买本章：<em>" + data.price + "</em>书币" +
            "</div>";
        // "<div class='buyAllChapter chapterType' data-type='all'>" +
        // "   全部章节购买：<em>123413</em>书币" +
        // "</div>";

        var params = {
            msg: $toastContent,
            type: 'fun',
            time: '',
            btn1name: '去充值',
            btn2name: '确认购买',
            fun1: function () {
                location.href = paymentUrl;
            },
            fun2: function () {
                subscribe(data.chapter_id);
            }
        };
        toast(params);
    });
}

//订阅
function subscribe(chapter_id) {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/api/book/chapter/take',
        data: {
            chapter_id,
            app_type: system
        },
        success: function (res) {
            textToast(res.msg);
            if (res.code === 1) {
                getChapterContent(chapter_id);
            }
        },
        error: function (e) {
            textToast('请求失败，错误代码：01');
        }
    });
}

//添加最新章节跳转小说正文章节展开
function getLastURL() {
    try {
        var laststr = getUrlParam('add_mock').toString();
        laststr == '1' ? (function () {
            setTimeout(function () {
                $(".catalogBox").show(function () {
                    $(".catalogBox").animate({
                        "left": "0"
                    }, 300);
                })
            }, 500)
        }()) : console.log('Error')
    } catch (e) {
        console.log(e)
    }
}

//加入书架
function joinInBookshel() {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: pushIn_bookshelf_api,
        data: {
            book_id: bookId
        },
        success: function (res) {
            textToast(res.msg);
            if (res.code === 1) {
                textToast("加入书架成功");
            } else if (res.code === -500) {
                setStorage("session", "is_login_collection", 0);
                location.href = "/user/login";
            }
        },
        error: function (err) {
            textToast('加入书架失败，错误代码：01');
        }
    });
}

//默认字体
function getFontBGinit() {
    var __getOne__ = getStorage('local', 'getOne');
    if (__getOne__) {
        $(__getOne__.name).css('font-size', __getOne__.fontsize);
        $(__getOne__.elem).addClass('fontCur').siblings('span').removeClass('fontCur');
    }
}
//默认模式
function getBGinit() {
    var __getTwo__ = getStorage('local', 'getTwo');
    if (__getTwo__) {
        $('.bookContent').css({
            'background': __getTwo__.background,
            'color': __getTwo__.color
        });
        $(__getTwo__.elem).addClass('contentBg').siblings('span').removeClass('contentBg');
    }
}

//点击设置字体(方法封装)
function settingFont() {
    if (fontSizeText === 'setting_font_small') {
        $('.chapterContent')
            .css('font-size', '4.5vw');
        getOne = {
            'name': '.chapterContent',
            'fontsize': '4.5vw',
            'elem': '.setting_font_small'
        };
        setStorage('local', 'getOne', getOne);

    } else if (fontSizeText === 'setting_font_middle') {
        $('.chapterContent')
            .css('font-size', '5.5vw');
        getOne = {
            'name': '.chapterContent',
            'fontsize': '5.5vw',
            'elem': '.setting_font_middle'
        };
        setStorage('local', 'getOne', getOne);

    } else if (fontSizeText === 'setting_font_large') {
        $('.chapterContent')
            .css('font-size', '6.5vw');
        getOne = {
            'name': '.chapterContent',
            'fontsize': '6.5vw',
            'elem': '.setting_font_large'
        };
        setStorage('local', 'getOne', getOne);

    }


}
//点击设置背景(方法封装)
function settingBGcolor() {
    if (bgColorchange === 'setting_bg_day') {
        $('.bookContent')
            .css({
                'background': '#fdfdfd',
                'color': '#000'
            });
        getTwo = {
            'background': '#fdfdfd',
            'color': '#000',
            'elem': '.setting_bg_day'
        }
        setStorage('local', 'getTwo', getTwo);

    } else if (bgColorchange === 'setting_bg_night') {
        $('.bookContent')
            .css({
                'background': '#1a1a1a',
                'color': 'rgb(134, 134, 126)'
            });
        getTwo = {
            'background': '#1a1a1a',
            'color': 'rgb(134, 134, 126)',
            'elem': '.setting_bg_night'
        }
        setStorage('local', 'getTwo', getTwo);

    } else if (bgColorchange === 'setting_bg_green') {
        $('.bookContent')
            .css({
                'background': '#d3e6c2',
                'color': '#000'
            });
        getTwo = {
            'background': '#d3e6c2',
            'color': '#000',
            'elem': '.setting_bg_green'
        }
        setStorage('local', 'getTwo', getTwo);
    }
}

//我的菜单展开关闭方法
function controlMenu() {
    flog.flag === true ? (
        function () {
            $('.menu_content').fadeIn()
            $(".footerSidebar").fadeIn().css({
                "position": "fixed"
            });
            flog.flag = false;
        }()) : (
        function () {
            $('.menu_content').fadeOut();
            $(".footerSidebar").fadeOut().css({
                "position": "fixed"
            });
            $('.setting_box').stop().animate({
                left: '50vw'
            });
            flog.changefont = true;
            flog.flag = true;
        }()
    )
}

//事件
function event() {
    //点击更多展开加入书签跟底部栏
    $html.on('tap', '.setting_font_box>span', function () {
        fontSizeText = $(this).attr('class');
        $(this).addClass('fontCur').siblings('span').removeClass('fontCur');
    });

    $html.on('tap', '.setting_font_box1>span', function () {
        bgColorchange = $(this).attr('class');
        $(this).addClass('contentBg').siblings('span').removeClass('contentBg');
    });

    //我的菜单展开
    $html.on('tap', '.menu_img', function (e) {
        e.stopPropagation();
        controlMenu();
    });

    $html.on('tap', '.chapterContent', function (e) {
        e.stopPropagation();
        controlMenu();
    });

    //返回首页
    $html.on('tap', '.to_home', function () {
        location.href = `/index.html`;
    });

    //返回书籍详情
    $html.on('tap', '.to_book_details', function () {
        location.href = `/book/${book_id}`;
    });

    //返回我的书架
    $html.on('tap', '.to_my_bookshelf', function () {
        location.href = `/bookshelf.html`;
    });

    //设置字体
    $html.on('tap', '.setting_Font', function () {
        flog.changefont === true ? (function () {
            $('.setting_box').stop().animate({
                left: '-67vw'
            });
            flog.changefont = false;
        }()) : (function () {
            $('.setting_box').stop().animate({
                left: '67vw'
            });
            flog.changefont = true;
        }())
    });

    //点击加入书架
    $html.on('tap', '.joinInBookshelf', function () {
        joinInBookshel();
    });

    //设置字体方法调用
    $html.on('tap', fontSizeText, function () {
        settingFont()
    });

    //设置变化背景
    $html.on('tap', bgColorchange, function () {
        settingBGcolor();
    });

    //隐藏目录
    $html.on('tap', ".closeCatalog", function () {
        hideChapter();
    });

    //打开目录
    $html.on("tap", ".openCatalogBox", function (e) {
        e.stopPropagation();
        showChapter();
        controlMenu();
    });

    // 返回书籍页
    $html.on('tap', ".back", function () {
        location.href = `/book/${book_id}`;
    });

    // 上一章
    $html.on('tap', ".lastChapter", function () {
        getChapterContent(last_id);
    });

    // 下一章
    $html.on('tap', ".nextChapter", function () {
        getChapterContent(next_id);
    });

    //获取该章节的内容
    $html.on("tap", '.chapterList', function () {
        if (!lock) return;
        lock = false;
        hideChapter();
        var chapter_id = $(this).data("id");
        getChapterContent(chapter_id);
    });

    //充值类型
    $html.on('tap', '.chapterType', function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        buy_type = $(this).data('type');
    });
    //新手引导
    $('html').on('tap', '.gotIt', function (e) {
        e.stopPropagation();
        $('.newGuide').hide();
        $('body').children().filter('div').show();
        $('.footerSidebar').show();
        newGuide = {
            params:true
        }
        setStorage('local','newGuide', newGuide);
    });
    //内容订阅按钮
    $html.on('tap', '.subscribeBtn', function () {
        var params = {
            chapter_id: $(this).data('chapter_id'),
            price: $(this).data('price')
        };
        setBuyBox(params)
    });

    //正倒叙切换
    $html.on("tap", ".chapterBtn", function (e) {
        e.stopPropagation();
        sequence = sequence ? false : true;
        $(this).css({
            "transform": `rotate(${sequence ? 0 : -180}deg)`
        })
        getChapterList();
    });
}