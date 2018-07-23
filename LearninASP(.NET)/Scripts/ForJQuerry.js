{
    var marginLevel = +0;
    $(".navbar").hide();
    $(".navbar-inverse").hide();
    $('footer').empty();
    $('.typeDir').draggable({ revert: true });

    $('.mainUl').find().disableSelection();
    var neededElements = $('.notOpened');
    $.each(neededElements, function (index, value) {
        addListener(value);
    });
}

function printDirectory(data) {
    if (data.Directories[0] != null) {
        var it = data.Directories[0].ParentID;

        marginLevel = +$('#' + it).attr('data-marginLevel') + 1;
        
        $.each(data.Directories, function (index, value) {
            if (0 === index) { 
            $('#' + it).after("<div class=\"notOpened\" id=\"" + value.ID + "\" data-marginLevel=\"" + (marginLevel) + "\">" + value.name + "</div>");
            }
            else {
                $('#' + data.Directories[index - 1].ID).after("<div class=\"notOpened\" id=\"" + value.ID + "\" data-marginLevel=\"" + (marginLevel) + "\">" + value.name + "</div>");
            }

            $('#' + value.ID).addClass("" + it);
            $('#' + value.ID).css('margin-left', function () {
                return 20 * marginLevel;
            });
            addListener($('#' + value.ID));
            $('#' + value.ID).draggable({ revert: true });
            $('#' + value.ID).droppable({
                drop: function (event, ui) {
                    changeDirectory(ui, $(this).attr('id'));
                }
            });
        });
    }
}
        
function addListener(unit) {
    $(unit).unbind("click");
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
    $(unit).bind('click drag' , function () {
        var id = $(unit).attr('id');
        removeChildren(id);
        $(unit).removeClass("opened");
        $(unit).addClass("notOpened");
        addListener(unit);
    })
}

function removeChildren(str) {
    var arr = document.getElementsByClassName(str);
    $.each(arr, function (index, value) {
        removeChildren($(value).attr('id'));
    })
    $('.' + str).remove();
}

function changeDirectory(dropElem, curId) {
    var it = dropElem.draggable.attr('id');
    $.post("/Home/ChangeDir?id=" + it + "&parId=" + curId, null, olert);
    function olert(result) {
        if (result) {
            $('#' + curId).after("<div class=\"notOpened\" id=\"" + value.ID + "\" data-marginLevel=\"" + (marginLevel) + "\">" + value.name + "</div>");
            $('#' + it).remove();
        } else alert("Impossible to push in film");
    }
}

