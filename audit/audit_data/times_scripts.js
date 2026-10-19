
            function showAlert(message, className, autoHide)
            {
                $("#info-alert").html(message);
                $("#info-alert").removeClass('alert-danger alert-success alert-info alert-warning');
                $("#info-alert").addClass(className);
                $("#info-alert").fadeIn();
                if (autoHide)
                {
                    window.setTimeout(function () {
                        $("#info-alert").fadeToggle(1500);
                    }, 3000);
                }
            }
            function HideAlert()
            {
                $("#info-alert").fadeToggle(500);
            }
        

// ======================================


        function editBooking(bookingID) {
            
              $.post('/admin/booking/editinfo?get_name', {
                _csrf: 'eFpZTXFjNWgwIx18PhFEGCs.E343EFsaTwIdICYmBjlLax4sQy9gHA==',
                id: bookingID
            }, function (htm) {
                $("#room-name-in-modal").text(htm);
               
            })
            
            $.post('/admin/booking/editinfo', {
                _csrf: 'eFpZTXFjNWgwIx18PhFEGCs.E343EFsaTwIdICYmBjlLax4sQy9gHA==',
                id: bookingID
            }, function (htm) {
                $("#BMD .modal-body").html(htm);
                $("#BMD").modal('show');
            })
        }

        function newBooking(timesID) {
            $.post('/admin/booking/createbooking', {
                _csrf: 'eFpZTXFjNWgwIx18PhFEGCs.E343EFsaTwIdICYmBjlLax4sQy9gHA==',
                id: timesID
            }, function (htm) {
                $("#BMD .modal-body").html(htm);
                $("#BMD").modal('show');
            })
            
             $.post('/admin/booking/createbooking?get_name', {
                _csrf: 'eFpZTXFjNWgwIx18PhFEGCs.E343EFsaTwIdICYmBjlLax4sQy9gHA==',
                id: timesID
            }, function (htm) {
                $("#room-name-in-modal").text(htm);
               
            })
            
        }
    

// ======================================


            $(document).ready(function () {
                $('.confirms').click(function (event) {
                    var url = event.toElement.href;
                    showAlert('Подтвердите удаление <a class="btn btn-danger" href="' + url + '">Удалить</a> <button onclick="HideAlert()" class="btn btn-default">Отмена</button>', 'alert-warning');
                    return false;
                });
            });
            var inp = null;
            var fill = null;
            function loadFiles(inputid, fillImg,dir) {
                inp = inputid;
                fill = fillImg;
                var url = "/admin/default/files";
                if (dir)
                    url = url+'?dir='+dir;
                $.post(url, {_csrf: "eFpZTXFjNWgwIx18PhFEGCs.E343EFsaTwIdICYmBjlLax4sQy9gHA=="})
                        .done(function (data) {
                            // download images to modal window
                            images = JSON.parse(data);
                            $("#myModalBox #modalContent").children().remove();
                            for (var i = 0; i < images.length; i++) {
                                $("#modalContent").append("<img src='/" + images[i] + "' width='100' height='100'\n\
             onclick='fileSelect(\"" + images[i] + "\", \"" + inputid + "\", \"" + fillImg + "\")' class='imgmanager'>");
                            }
                        });
                $("#myModalBox").modal('show');
            }
            function fileSelect(path, inputid, fillImg) {
                $("#" + inputid).val('/' + path);
                $("#myModalBox").modal('hide');
                $('#myModalBox .imgmanager').remove();
                $("#" + fillImg).attr('src', "/" + path);
                if ($('#photo-gallery')) {
                    resetJcrop();
                }

            }
        

// ======================================

jQuery(document).ready(function () {
jQuery(document).pjax("#w0 a", "#w0", {"push":true,"replace":false,"timeout":1000,"scrollTo":false});
jQuery(document).on('submit', "#w0 form[data-pjax]", function (event) {jQuery.pjax.submit(event, '#w0', {"push":true,"replace":false,"timeout":1000,"scrollTo":false});});
});

// ======================================


            //$("form#myId").dropzone({ url: "/admin/default/upload", paramName:"UploadForm[imageFile]"});
            var myDropzone = new Dropzone("form#myId", {url: "/admin/default/upload", paramName: "UploadForm[imageFile]"});
            myDropzone.on("success", function () {
                loadFiles(inp, fill);
            });
        

// ======================================

