$(document).ready(function() {
    
  // Place JavaScript code here...
 //  $('#file-input').fileinput({
	//     resizeImage: true,
	//     maxImageWidth: 200,
	//     maxImageHeight: 200,
	//     resizePreference: 'width'
	// });
    // $('.carousel').carousel({
    //   interval: 1000
    // })
    // $('#myCarousel').carousel({
    //   interval: 3000
    // });
});
$(document).on('ready', function() {
    
});
function nameSelectFoo() {
        var selIndex = document.getElementById("NameSelect").selectedIndex;
        console.log(usersList);
        document.getElementById("demo").innerHTML = "You selected: " + usersList[selIndex].email;
}