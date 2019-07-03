//定义变量

//init
$(function () {
    //初始化推荐搜索
    changeSearchWord();
    //所有事件
    event();
});

//搜索事件
function search(val) {
    //根据搜索内容请求数据
    httpApi({
        type: 'get',
        url: search_word_content,
        params: {
            word: val,
            page: 1
        },
        fun: function (res) {
            if (res.code === 1) {
                if (res.data.length == 0) {
                    showDateNull();
                };
                bookListRender(res.data)
            } else {
                alert(res.msg);
            }
        }
    })
}

//换一批推荐搜索词
function changeSearchWord() {
    httpApi({
        type: 'get',
        url: search_word_filter,
        fun: function (res) {
            if (res.code === 1) {             
                searchWordRender(res.data);     
            } else {
                alert(res.msg);
            }
        }
    })
}
//搜索为空显示
function showDateNull() {
    $('.searchContentBox').html('');
    setTimeout(function(){
        $(`<div class="current-cur">搜索不到哦~</div>`).appendTo($(".searchContentBox"));
    },300)
}

//搜索词渲染
function searchWordRender(list) {
    $('.recommendSearchContent').html('');
    setStorage('local', 'list', list);
    $.each(list, function (index, item) {
        if (item.highlight === true) {
            $dom = $(`<span class="cur">${item.word}</span>`);
            $dom.appendTo($(".recommendSearchContent"));
        } else {
            $dom = $(`<span>${item.word}</span>`);
            $dom.appendTo($(".recommendSearchContent"));
        }
    })
}

//搜索内容渲染
function bookListRender(list) {
    $('.searchContentBox').html('');
    $(".recommendSearchBox").hide();
    $.each(list, function (index, item) {
        item.all_words = format_word(item.all_words);
        $dom = $("" +
            "<div class='PortraitContent'>" +
            "<a href='/book/" + item.id + "'>" +
                "<img class='PortraitContentListImg' src='" + item.cover_url + "'/>" +
                "<div class='PortraitContentListTitle'>" +
                    "<div>" + item.name + "</div>" +
                    "<div class='PortraitContentListAuthor'>" + item.author.name + "</div>" +
                    "<div>" + item.intro + "</div>" +
                    "<div class='PortraitContentListFooter'>" +
                    "<div class='PortraitFooterBtn'>" +
                    "<span>" + item.category + "</span>" +
                    "<span>" + item.status + "</span>" +
                    "<span>" + item.all_words + "</span>" +
                    "</div>" +
                    "</div>" +
                "</div>" +
            "</a>" +
            "</div>");
        $dom.appendTo($('.searchContentBox'));
    })
}

//所有事件
function event() {
    var $html = $("html");
    //点击推荐搜索
    $html.on("tap", ".recommendSearchContent>span", function () {
        $(this).addClass('cur').siblings('span').removeClass('cur');
        $val = $(this).html();
        $(".searchLabel").find("input").val($val);
        search($val);
    });

    //点击搜索
    $html.on("tap", ".searchBtn", function () {
        $val = $(".searchLabel").find("input").val();
        if($val == ''){
            $('.searchContentBox').html('');
            $(".recommendSearchBox").hide();
            setTimeout(function(){
                $(`<div class="current-cur">请输入关键字~</div>`).appendTo($(".searchContentBox"));
            },300)
        }else{
            search($val);
        }
    });

    //换一批
    $html.on("tap", ".changeRecommendSearchContent", function () {
        changeSearchWord();
    });

    //键盘监听搜索
    $html.on('keypress', function (e) {
        var keycode = e.keyCode;
        $val = $(".searchLabel").find("input").val();
        if (keycode == '13') {
            e.preventDefault();
            //请求搜索接口
            search($val);
        }
    });
    //显示推荐搜索
    $html.on("input", ".searchLabel input", function () {
        $('.searchContentBox').html('');
        var $val = $(this).val();
        $(".recommendSearchBox").show();
        if ($val === "") {
            $(".recommendSearchBox").show();
        } else {
            $(".recommendSearchBox").hide();
        }
    });
}