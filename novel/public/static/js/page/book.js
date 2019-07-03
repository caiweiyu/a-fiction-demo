//init
$(function () {
    getBookContentData();
    event();
});

//获取图书信息
function getBookContentData() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: get_book_cont_url,
        data: {
            like: 1
        },
        success: function (res) {
            if (res.code === 1) {
                bookContent = res.data;
                bookContentRender(res.data);
                RecommendedBooksRender(res.data.like);
            } else {
                textToast(res.msg);
            }
        },
        error: function (e) {
            textToast("获取图书信息失败，错误代码：01");
        }
    })
}

// 图书信息渲染
function bookContentRender(data) {
    var {
        id,
        category,
        cover_url,
        intro,
        author,
        name,
        new_chapter,
        book_update_time
    } = data;
    $(".bookImg").attr("src", cover_url);
    $(".bookTips").find("em").html(category);
    $(".bookName").html(name);
    $(".bookAuthor").find("em").html(author.name);
    $(".introContent").html(intro);
    $(".bookUpdate").html(`<a href="/book/content.html?book_id=${id}&add_mock=1"><em>目录</em><div>最近更新"${new_chapter.name}"</div><span>${book_update_time}</span></a>`);
}

//事件
function event() {
    //加入书架
    $html.on('tap', '.joinInBookshelf', function () {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: pushIn_bookshelf_api,
            data: {
                book_id: bookId
            },
            success: function (res) {
                if (res.code === 1) {
                    textToast("加入书架成功");
                } else {
                    textToast(res.msg);
                }
            },
            error: function (err) {
                textToast('加入书架失败，错误代码：01');
            }
        })
    });

    //阅读
    $html.on('tap', '.readingBook', function () {
        toBookContentPage();
    });

    //展开更多图书信息
    $('.footerEnd').attr('style', 'display:none');
    $html.on('tap', '.bookPicture', function (e) {
        e.preventDefault();
        $('.footerEnd').attr('display') === "none" ? (function () {
            $('.bookPicture').attr('src', '/static/images/Page/moreway.png');
            $('.footerEnd').attr('display', 'block').fadeIn();
        }()) : (function () {
            $('.bookPicture').attr('src', '/static/images/Page/moreany.png');
            $('.footerEnd').attr('display', 'none').fadeOut();
        }())
    });

    $html.on("tap", ".readingMore", function () {
        likeBook();
    })
}

function likeBook() {
    httpApi({
        url: `/api/book_like/${bookId}`,
        type: 'get',
        fun: function (res) {
            if (res.code === 1) {
                RecommendedBooksRender(res.data);
            } else {
                textToast(res.msg)
            }
        }
    })
}

function toBookContentPage() {
    location.href = `${reading_url}?book_id=${bookId}`;
}

function RecommendedBooksRender(list) {
    $(".blockCont").html("");
    $.each(list, function (index, item) {
        var $dom = book_cover_vertical_list(item);
        $dom.appendTo($(".blockCont"));
    });
}