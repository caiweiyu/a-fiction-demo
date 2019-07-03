// 此JS为书本内容渲染的模板


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
function book_vertical_list(item) {
    return $("" +
        "<div class='verticalList'>" +
        "    <a href='/book/" + item.id + "'>" +
        "        <span class='bookName'>" + item.name + "</span>" +
        "        <span class='bookAuthor'>" + item.author_name + "</span>" +
        "    </a>" +
        "</div>");
}

//竖向多内容派排列
function book_details_vertical_list(item) {
    return $("" +
        "<div class='PortraitContent'>" +
        "    <a href='/book/" + item.id + "'>" +
        "        <img onerror='imgError(" + `"${item.name}"` + ",this)' class='PortraitContentListImg' src='" + item.cover_url + "'/>" +
        "        <div class='PortraitContentListTitle'>" +
        "            <h3>" + item.name + "</h3>" +
        "            <h5>" + item.author_name + "</h5>" +
        "            <p>" + item.intro + "</p>" +
        "            <div class='PortraitFooterBtn'><span>" + item.category + "</span><span>" + item.sub_category + "</span></div>" +
        "        </div>" +
        "        <a class='Right_position' href='/book/" + item.id + "'><span>立即阅读</span></a>" +
        "    </a>" +
        "</div>");
}

//导航栏
function navigation(item) {
    return $("" +
        "<div data-page='" + item.text + "'>" +
        "    <img src='" + item.image + "' />" +
        "    <span>" + item.text + "</span>" +
        "</div>");
}
