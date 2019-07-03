var manOrWoman = 'man';

//获取所有图书列表
function getBookData(getBookDataUrl) {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: getBookDataUrl,
        success: function (res) {
            if (res.code === 1) {
                bookBlockList = res.data;
                if (!res.data) {
                    alert("该板块暂无内容");
                    return;
                }
                //板块渲染
                blockRender(res.data);
            } else {
                textToast(res.msg);
            }
        },
        error: function (e) {
            textToast("请求失败");
        }
    })
}

//模块渲染
function blockRender(list) {
    $.each(list, function (index, item) {
        var show_type = item.show_type;
        var book_type = item.name;
        switch (show_type) {
            case "book_banner":
                book_banner(item.data);
                break;
            case "book_cover_vertical_list":
                blockRandom(item, book_type, show_type);
                bookListRender(item.data, book_type, show_type);
                break;
            case "book_vertical_list":
                blockRandom(item, book_type, show_type);
                bookListRender(item.data, book_type, show_type);
                break;
            case "book_details_vertical_list":
                blockRandom(item, book_type, show_type);
                bookListRender(item.data, book_type, show_type);
                break;
            case "navigation":
                navBlockRandom(item, book_type, show_type);
                navListRender(item.data, book_type, show_type);
                break;
        }
    });
}

//banner内容渲染
function book_banner(list) {
    $(".index-swiper-container").find(" .swiper-wrapper").html("");
    list.forEach(function (item) {
        var $dom = $("" +
            "<div class='swiper-slide indexBannerSlide'>" +
            "    <a href='" + item.link + "'>" +
            "      <img src='" + item.image + "'/>" +
            "    </a>" +
            "</div>");
        $dom.appendTo($(".index-swiper-container").find(" .swiper-wrapper"));
    });
}

//容器渲染
function blockRandom(list, book_type, show_type) {
    // $(`.Block[data-type='${book_type}']`).remove();
    var $dom = $("" +
        "<div class='Block' data-book_type='" + book_type + "' data-show_type='" + show_type + "'>" +
        "    <div class='blockHeader'>" +
        "        <span class='blockName'>" + "<span class='blockMark'>|</span>" + list.name + "</span>" +
        "        <span class='readingMore' data-book_type='" + book_type + "' data-show_type='" + show_type + "'>更多》</span>" +
        "    </div>" +
        "    <div class='blockCont'>" +
        "    </div>" +
        "</div>");
    $dom.appendTo($(".bookBlockBox"));
}

//导航容器渲染
function navBlockRandom(list, book_type, show_type) {
    var $dom = $("<div class='header' data-book_type='" + book_type + "'  data-show_type='" + show_type + "'></div>");
    $dom.appendTo($(".bookBlockBox"));
}

//列表渲染
function bookListRender(list, book_type, show_type) {
    $(".Block[data-book_type='" + book_type + "' ][data-show_type='" + show_type + "']").find(".blockCont").html(" ");
    $.each(list, function (index, item) {
        var $dom;
        switch (show_type) {
            case "book_cover_vertical_list":
                $dom = book_cover_vertical_list(item);
                break;
            case "book_vertical_list":
                $dom = book_vertical_list(index, item);
                break;
            case "book_details_vertical_list":
                $dom = book_details_vertical_list(item);
                break;
        }
        $dom.appendTo($(".Block[data-book_type='" + book_type + "'][data-show_type='" + show_type + "']").find(".blockCont"));
    });
}

//导航内容渲染
function navListRender(list, book_type, show_type) {
    $.each(list, function (index, item) {
        $dom = navigation(item);
        $dom.appendTo($(".header[data-book_type='" + book_type + "'][data-show_type='" + show_type + "']"));
    })
}

//横版
function book_cover_vertical_list(item) {
    return $("" +
        "<div class='horizontalBlockList'>" +
        "    <a href='/book/" + item.id + "'>" +
        "        <img onerror='imgError(" + `"${item.name}"` + ",this)' class='horizontalBlockListImg' src='" + item.cover_url + "'/>" +
        "        <div class='horizontalBlockListName'>" + item.name + "</div>" +
        "    </a>" +
        "</div>");
}

//竖版
function book_vertical_list(index, item) {
    var index = index + 1;
    if (index == 1) {
        return $("" +
            "<div class='verticalList'>" +
            "    <a href='/book/" + item.id + "'>" +
            "        <span class='numOrder'>" + index + "</span>" +
            "        <div class='img_src'></div>" +
            "        <div class='numOrder_one'>" +
            "           <span class='bookName1'>" + item.name + "</span>" +
            "           <span class='bookAuthor'>" + item.author_name + "</span>" +
            "        </div>" +
            "    </a>" +
            "</div>");
    } else {
        return $("" +
            "<div class='verticalList'>" +
            "    <a href='/book/" + item.id + "'>" +
            "        <span class='numOrder'>" + index + "</span>" +
            "        <span class='bookName'>" + item.name + "</span>" +
            "    </a>" +
            "</div>");
    }
}

//竖向多内容派排列
function book_details_vertical_list(item) {
    const $category_1 = item.category ? "<span>" + item.category + "</span>" : "";
    const $category_2 = item.sub_category ? "<span>" + item.sub_category + "</span>" : "";

    return $("" +
        "<div class='PortraitContent'>" +
        "<div>" +
        "    <a href='/book/" + item.id + "'>" +
        "        <img onerror='imgError(" + `"${item.name}"` + ",this)' class='PortraitContentListImg' src='" + item.cover_url + "'/>" +
        "        <div class='PortraitContentListTitle'>" +
        "            <div class='book_title_name'>" + item.name + "</div>" +
        "            <div class='book_author_name'>" + item.author_name + "</div>" +
        "            <p class='ContentListTitlePage'>" + item.intro + "</p>" +
        "            <div class='PortraitFooterBtn'>" + $category_1 + $category_2 + "</div>" +
        "        </div>" +
        "        <a class='Right_position' href='/book/" + item.id + "'><span>立即阅读</span></a>" +
        "    </a>" +
        "</div>" +
        "</div>");
}

//导航栏
function navigation(item) {
    return $("" +
        "<div data-page='" + item.text + "' data-type='" + item.link + "'>" +
        "    <img src='" + item.image + "' />" +
        "    <span>" + item.text + "</span>" +
        "</div>");
}