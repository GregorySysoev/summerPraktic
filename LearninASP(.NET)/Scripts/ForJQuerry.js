var neededElements = $('.notOpened');

$.each(neededElements, function (index, value) {
    addListener(value);
});

function printDirectory(data) {
    var it = data.Directories[0].ParentID;
    $('#' + it).after('<ul class="' + it + '">');
    $.each(data.Directories, function (index, value) {
        $('.' + it).append("<li class=\"notOpened\" id=\"" + value.ID + "\">" + value.name + "</li>");
        addListener($('#' + value.ID));
        //$('#' + value.ID).sortable();
    });
    $('#' + it).after("</ul>");
}

function addListener(unit) {
    $(unit).unbind();
    if ($(unit).hasClass("notOpened")) {
        notOpenDirListener(unit);
    } else {
        openDirListener(unit);
    }
}

function notOpenDirListener(unit) {
    $(unit).bind("click", function () {
        var id = $(unit).attr('id');
        $.get("/Home/GetChildren?id=" + id, null, printDirectory);
        $(unit).removeClass("notOpened");
        $(unit).addClass("opened");
        addListener(unit);
    });
}

function openDirListener(unit) {
    $(unit).bind("click", function () {
        var id = $(unit).attr('id');
        $('.' + id).empty();
        $('.' + id).detach();
        $(unit).removeClass("opened");
        $(unit).addClass("notOpened");
        addListener(unit);
    })
}

