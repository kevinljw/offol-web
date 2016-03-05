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
    $('#inPersonbtn').submit(function(e){
        e.preventDefault();

        var thisRemainMoney = parseInt(thisRemainMoneyStr);
        var inputAmount = $('#paymentbtn').find('input[type="text"]');
        var inputNumber = parseInt(inputAmount.val());
        // console.log(inputNumber);
        if(inputNumber>thisRemainMoney){
            alert('您輸入的金額不得大於'+thisRemainMoney+'元');
            return false; 
        }
        else if(inputNumber<=thisRemainMoney && inputNumber>0){
            
            document.forms['inPersonbtn']= document.forms['paymentbtn'];
            document.forms['inPersonbtn'].action="/inPerson/"+projHid;
            
            if(confirm("確認支付金額無誤？")){
                
                // console.log();
                document.forms['inPersonbtn'].submit();
                return true;
            }
            else{
                return false;
            }
        }
        else{
            alert('您輸入的金額有誤，請重新輸入。');
            return false; 
        }
    });
    $('#paymentbtn').submit(function (e) {
        // alert("123");
        // var thisRemainMoneyStr = '!{remainMoney}';
        // console.log(thisRemainMoneyStr);
        e.preventDefault();
        // console.log($(this).attr('id'));
        var thisRemainMoney = parseInt(thisRemainMoneyStr);
        var form = $(this);
        var inputAmount = form.find('input[type="text"]');
        var inputNumber = parseInt(inputAmount.val());
        if(inputNumber>thisRemainMoney){
            alert('您輸入的金額不得大於'+thisRemainMoney+'元');
            return false; 
        }
        else if(inputNumber<=thisRemainMoney && inputNumber>0){
            // console.log(inputNumber);
            // document.forms['paymentbtn'].action='/fundings/'+uid;
            // document.forms['paymentbtn'].submit();
            $('#paymentbtn').ajaxSubmit({
                url: '/fundings/'+uid, 
                type: 'post',
                // beforeSend: function(){
                //     alert('before')
                // },
                success: function(data){  
                    // alert( "success"); 
                    // document.forms['paymentbtn'].submit();
                    if(confirm("確認支付金額無誤？")){
                        document.forms['paymentbtn'].submit();
                        return true;
                    }
                    else{
                        return false;
                    }
                    
                    // return confirm("確認支付金額無誤？");   
                },
                error: function(XmlHttpRequest, textStatus, errorThrown){  
                    alert( "error");  
                } 
            });
            
            // return 
        }
        else{
            alert('您輸入的金額有誤，請重新輸入。');
            return false; 
        }
    
    // var form = $(this),
    //     input = form.find('input[type="text"]');

    //     input.val(input.val().toUpperCase());

    //     alert(input.val());        
        
        
    });
});
function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);    // Not entirely sure if this is necessary
    form.submit();
}
function SubmitForm(){

    document.forms['paymentbtn'].action='/fundings/'+uid;
     document.forms['paymentbtn'].target='_blank';
     document.forms['paymentbtn'].submit();

     document.forms['paymentbtn'].action='https://payment.allpay.com.tw/QuickCollect/Purchase';
     
     document.forms['paymentbtn'].target='_blank';
     document.forms['paymentbtn'].submit();
    // post_to_url('/fundings/'+uid, {'q':'a'});
    return true;
}
function nameSelectFoo() {
        var selIndex = document.getElementById("NameSelect").selectedIndex;
        console.log(usersList);
        document.getElementById("demo").innerHTML = "You selected: " + usersList[selIndex].email;
}