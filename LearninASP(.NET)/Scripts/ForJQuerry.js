{
    var marginLevel = +0;
    $(".navbar").hide();
    $(".navbar-inverse").hide();
    $('footer').empty();

    $('#inRootButton').droppable({
        drop: function (event, ui) {
            changeDirectory(ui, 0);
        }
    }).bind("mouseover", function () {
        $(this).css('text-decoration', 'underline')
    }).bind("mouseout", function () {
        $(this).css('text-decoration', '')
    });

    $('#deleteButton').droppable({
        drop: function (event, ui) {
            deleteElement(ui);
        }
    }).bind("mouseover", function () {
        $(this).css('text-decoration', 'underline')
    }).bind("mouseout", function () {
        $(this).css('text-decoration', '')
    });

    $('#renameButton').droppable({
        drop: function (event, ui) {
        }
    }).bind("mouseover", function () {
        $(this).css('text-decoration', 'underline')
    }).bind("mouseout", function () {
        $(this).css('text-decoration', '')
    });
    
    $(document).disableSelection();
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

            $('#' + value.ID).css('margin-left', function (){
                return 20 * marginLevel;
            });
            $('#' + value.ID).addClass("" + it);
            ((value.isFilm) ? $('#' + value.ID).addClass('typeFile') : $('#' + value.ID).addClass('typeDir'));
            addListener($('#' + value.ID));
        });
    }
}
        
function addListener(unit) {
    $(unit).unbind("click drag");
    $(unit).draggable({
        delay: 400,
        revert: true,
        opacity: 0.35,
    }).bind("mouseover", function () {
        $(this).css('text-decoration', 'underline')
    }).bind("mouseout", function () {
        $(this).css('text-decoration', '')
    });
    $(unit).droppable({
        drop: function (event, ui) {
            changeDirectory(ui, $(this).attr('id'));
        }
    });
    $(unit).bind("drag", function (event, ui) {
    });
    $(unit).bind("mouseup", function (event, ui) {
    });
  
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
    });
    $('.' + str).remove();
}

function changeDirectory(dropElem, curId) {
    var it = dropElem.draggable.attr('id');
    $.post("/Home/ChangeDir?id=" + it + "&parId=" + curId, null, olert);
    function olert(result) {
        if (result === "True") {
            var name = dropElem.draggable.context.textContent;
            var margLevelOfDropElem = +($('#' + curId).attr('data-marginLevel')) + 1;
            var isFilm = dropElem.draggable.hasClass('typeDir');
            var isOpen = dropElem.draggable.hasClass('opened');

            $('#' + it).remove();
            if (0 != curId) {
                if ($('#' + curId).hasClass('opened'))
                    $('#' + curId).after("<div class=\"notOpened\" id=\"" + it + "\" data-marginLevel=\"" + margLevelOfDropElem + "\">" + name + "</div>");
                $('#' + it).css('margin-left', function () {
                    return 20 * margLevelOfDropElem;
                });
                $('#' + it).addClass("" + curId);
            } else {
                $('.mainUl').append("<div class=\"notOpened\" id=\"" + it + "\" data-marginLevel=\"" + 0 + "\">" + name + "</div>")
            }
            if (true === isOpen) {
                $('#' + it).removeClass('notOpened');
                $('#' + it).addClass('opened');
            }
            addListener($('#' + it));
            
            if (true === isFilm) {
                $('#' + it).addClass('typeDir');
            } else {
                $('#' + it).addClass('typeFile');
            }
            removeChildren(it);
        } else alert("Impossible to push in file");
    }
}

function deleteElement(ui) {
    $.post("/Home/DeleteElem?id=" + ui.draggable.attr('id'), null, del);
    function del(result) {
        if (result) {
            alert("Delete is OK");
            $('#' + (ui.draggable.attr('id'))).remove();
        } else alert("Something gone wrong");
    }
}
