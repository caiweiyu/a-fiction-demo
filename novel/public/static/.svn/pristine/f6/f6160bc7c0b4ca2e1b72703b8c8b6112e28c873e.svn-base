//init
$(function () {
    event();
});

//获取消费记录
function getExpenditure() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '',
        success: function (res) {
            if (code === 1) {
                expenditureRender(res.data);
            } else {
                textToast(res.msg);
            }
        }
    });
}

//渲染消费记录
function expenditureRender(data) {
    $.each(data, function (index, item) {
        var $dom = $(`` +
            `<div class='expenditureList'>` +
            `    <div class='expenditureListLeft'>` +
            `        <span class='expenditureName'>1</span>` +
            `       <span class='expenditureTime'>11:28 2018-02-28</span>` +
            `    </div>` +
            `    <div class='expenditureListRight'>+3</div>` +
            `</div>`);
        $dom.appendTo($(".expenditureBox"));
    })
}

//时间激活
function event() {

}