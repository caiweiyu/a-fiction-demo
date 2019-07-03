//init
$(function () {
    //获取用余额
    getUserBalance(function (res) {
        $(".balance").find("em").html(res);
    });
    //档位渲染
    positionRender();
    //获取支付环境
    getPaymentEnvironment();
    //事件
    event();
});

//档位渲染
function positionRender() {
    positionList.forEach(function (item) {
        var $dom = $("" +
            "<div class='position' data-money='" + item.money + "'>" +
            "    <span class='positionMoney'>¥<em>" + item.money + "</em></span>" +
            "    <span class='positionName'>" + item.content + "</span>" +
            "</div>");
        $dom.appendTo($(".rechargePosition"));
    })
}

//支付环境
function getPaymentEnvironment() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: payment_environment_api,
        success: function (res) {
            if (res.code === 1) {
                var data = res.data;
                paymentMethodRender(data);
            } else {
                textToast(res);
            }
        },
        error: function (e) {
            textToast('获取支付环境失败，错误代码：01');
        }
    })
}

//渲染支付方式
function paymentMethodRender(paymentMethodList) {
    paymentMethodList.forEach(function (item) {
        var $dom = $("" +
            "<div class='paymentMethod' data-method_id='" + item.id + "' data-method='" + item.css + "'>" +
            "    <img class='methodIcon' src='/static/images/Page/" + item.css + ".png'/>" +
            "    <div class='methodSystem'>" + item.name + "</div>" +
            "    <img class='methodChecked' src='/static/images/Page/paymentMethod_ncur.png'/>" +
            "</div>");
        $dom.appendTo($(".paymentMethodBox"));
    })
}

//事件
function event() {
    //选择支付方式
    $html.on('tap', ".paymentMethod", function () {
        var paymentSystemId = $(this).data("method_id");
        $(this).find(" .methodChecked").attr("src", "/static/images/Page/paymentMethod_cur.png");
        $(this).siblings().find(" .methodChecked").attr("src", "/static/images/Page/paymentMethod_ncur.png");
        paySystem = paymentSystemId;
    });

    //充值档位
    $html.on('tap', ".position", function () {
        $(this).addClass("cur").siblings().removeClass("cur");
        $(".anyAmount").find("input").val("").removeClass("cur");
        recharge_amount = $(this).data('money');
    });

    //自定义金额
    $html.on('change', '.anyAmount input', function () {
        recharge_amount = $(this).val();
        $(".position").removeClass('cur');
        $(this).addClass('cur')
    });

    //支付
    $html.on('tap', ".paymentBtn", function () {
        if (recharge_amount === 0 || recharge_amount === "0" || !(/^\d+.?\d*$/.test(recharge_amount))) {
            textToast("请输入正确的充值金额或选择充值档位");
            return;
        }
        if (!paySystem) {
            textToast("请选择充值方式");
            return;
        }
        alert(paySystem);
        switch (paySystem) {
            case 101:
                break;
            case 102:
                break;
            case 103:

                break;
            case 104:

                break;
            case 201:
                var params = {
                    money: recharge_amount * 100,
                    pay_way_id: paySystem,
                    app_type: system,
                };
                getPaymentData(params);
                break;
            case 202:

                break;
            case 203:

                break;
            case 204:

                break;
        }
    });
}