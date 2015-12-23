$(document).ready(function() {

  // Place JavaScript code here...
 //  $('#file-input').fileinput({
	//     resizeImage: true,
	//     maxImageWidth: 200,
	//     maxImageHeight: 200,
	//     resizePreference: 'width'
	// });
    $("#input-1").fileinput({
        previewFileType: "image",
        browseClass: "btn btn-success",
        browseLabel: "Pick Image",
        browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
        removeClass: "btn btn-danger",
        removeLabel: "Delete",
        removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
        uploadClass: "btn btn-info",
        uploadLabel: "Upload",
        uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> ",
        overwriteInitial: true,
	    maxFileSize: 10000,
	    showClose: false,
        allowedFileExtensions: ["jpg", "png", "gif"],
        maxImageWidth: 250,
        maxImageHeight: 250,
        // maxImageWidth: 200,
        // maxFileCount: 1,
        // resizeImage: true
        // initialPreview: [
        //     '<img src="uploadPImg/'+userPic+'" class="file-preview-image" alt="Your Avatar" title="Your Avatar">',
        // ],
	    // showCaption: false,
        // defaultPreviewContent: '<img src="uploadPImg/'+userPic+'" alt="Your Avatar" style="width:180px">',
        // layoutTemplates: {main2: '{preview} {remove} {upload} {browse}'},
        // uploadUrl: "/account/upload/"
    });
    $("#input-2").fileinput({
                maxFileCount: 10,
                // showPreview: false,
                // uploadUrl: "/sharing/uploadfiles/"+userUploadID,
                // allowedFileExtensions: ["txt", "md", "ini", "text"],
    });
    $("#input-3").fileinput({
        maxFileCount: 10,
        showPreview: false,
        // uploadUrl: "/sharing/uploadfiles/"+userUploadID,
        allowedFileExtensions: ["mp4", "mov", "avi"],
    });

    $("#input-4").fileinput({
        maxFileCount: 10,
        showPreview: false,
        // uploadUrl: "/sharing/uploadfiles/"+userUploadID,
        // allowedFileExtensions: ["zip", "rar", "gz", "tgz"],
    });
    // $("#input-10").fileinput({
    //     // maxFileCount: 1,
    //     showPreview: false,
    //     showUpload: false,
    //     // uploadUrl: "/sharing/uploadfiles/"+userUploadID,
    //     // allowedFileExtensions: ["zip", "rar", "gz", "tgz"],
    // });
    $("#input-10").fileinput({
        previewFileType: "image",
        showUpload: false,
        // showRemove: false,
        showCaption: false,
        // browseClass: "btn btn-success",
        browseLabel: "Pick Image",
        browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
    });
    
    // $('.bxslider').bxSlider();
    $('.postIdeaBtn').on('click', function(){
        if( $('.postIdeaForm').is(':visible') ) {
            // console.log("to be invisible");
            $('.postIdeaForm').animate({ 'height': '0px' }, 'slow', function(){
                $('.postIdeaForm').hide();
            });
            $('.postIdeaList').animate({ 'margin-top': '0px' }, 'slow');
        }
        else {
            // console.log("to be visible");
            $('.postIdeaForm').show();
            $('.postIdeaForm').animate({ 'height': '360px' }, 'slow');
            $('.postIdeaList').animate({ 'margin-top': '20px' }, 'slow');
        }
        // $('.postIdeaForm').toggle('slide', { direction: 'left' }, 1000);
        // $('#main-content').animate({
        //     'margin-left' : $('#main-content').css('margin-left') == '0px' ? '210px' : '0px'
        // }, 1000);
    });
});
$(document).on('ready', function() {
    
});
function nameSelectFoo() {
        var selIndex = document.getElementById("NameSelect").selectedIndex;
        console.log(usersList);
        document.getElementById("demo").innerHTML = "You selected: " + usersList[selIndex].email;
}