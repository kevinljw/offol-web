$(document).on('ready', function() {
    // $('.octagon').draggable({
    //   drag: function(event, ui){
    //     var rotateCSS = 'rotate(' + ui.position.left + 'deg)';

    //     $(this).css({
    //       '-moz-transform': rotateCSS,
    //       '-webkit-transform': rotateCSS
    //     });
    //   }
    // });
    var slotEnable = false;
    var wheelDeg = getRotationDegrees($('#btmTarget'));
    // $('#dataDebug').text(wheelDeg);
    $('#confirmAmount').click(function() {
      var form = $('form#slotForm');
      if(parseInt(form.find('#amount').val())>0 && parseInt(form.find('#amount').val())<=parseInt($('#remainNum').text().split('次剩餘')[0])){
          $('#amount').prop('readonly', true);
          $(this).attr('disabled', 'disabled');
          $('#gameHintText').text('旋轉後放開');
          slotEnable = true;
      }
      else{
        alert( "輸入金額錯誤，請再次檢查" );
      } 
      
    });
    var lastDeg;
    var rotateDegVal = 2000;
    var params = {
        handle: $('#slotHandler'),
        
        // Callback fired on rotation start.
        start: function(event, ui) {
            // console.log("Rotating started");
            $("#rTarget").attr("class", "col-xs-offset-1 col-xs-10 col-md-offset-2 col-md-8");
            wheelDeg = getRotationDegrees($('#btmTarget'));
            // console.log("wheelDeg-"+wheelDeg);

            if(!slotEnable){
                $('#gameHintText').text('< 請先選擇同時抽獎數');
                // $('#slotResultModel').toggle();
                // $('#slotResultModel').toggle(true);
            }
        },
        // Callback fired during rotation.
        rotate: function(event, ui) {
            // console.log("Rotating");
            // console.log(ui.angle.current * 180/Math.PI);
            var rotateCSS;
            
            rotateCSS  = 'rotate(' + (ui.angle.current*-45/Math.PI) + 'deg)';  
            
            
            // var rotateCSS = 'rotate(' + ui.angle.current*0.1+'rad)';
            
            // $('#dataDebug').text(rotateCSS);
            $('#btmTarget').css({
              '-moz-transform': rotateCSS,
              '-webkit-transform': rotateCSS
            });
            
        },
        // Callback fired on rotation end.
        stop: function(event, ui) {
            // $('#rTarget').addClass("tada2");
            $('#gameHintText').text('');
            if(slotEnable){
                $('#amount').prop('readonly', false);
                $('#confirmAmount').attr('disabled', false);
                
                slotEnable=false;

                wheelDeg = getRotationDegrees($('#btmTarget'));
                // console.log("wheelDeg:"+wheelDeg)
                // console.log("Stop:"+((wheelDeg>0)?wheelDeg-rotateDegVal:wheelDeg+rotateDegVal));
                var rotateCSS = 'rotate(' + ((wheelDeg>0)?wheelDeg-rotateDegVal:wheelDeg+rotateDegVal) + 'deg)';
                
                $('#btmTarget').css({
                  '-moz-transform': rotateCSS,
                  '-webkit-transform': rotateCSS,
                  '-webkit-transition-duration': '3.1s', /* Safari */
                  '-moz-transition-duration': '3.1s',
                  'transition-duration': '3.1s'
                });
                var form = $('form#slotForm');
                // console.log(parseInt($('#remainNum').text().split('次剩餘')[0]), parseInt(form.find('#amount').val()))
                $('#remainNum').html((parseInt($('#remainNum').text().split('次剩餘')[0])-parseInt(form.find('#amount').val()))+'次<small>剩餘</small>');
                // console.log(form);
                setTimeout(function(){ 
                    form.ajaxSubmit({
                        url: '/slot', 
                        type: 'post',
                    beforeSend: function(){
                        $(".resultArea").text('');
                    },
                    success: function(data){  
                        $('#slotResultModel #bodyText').html('您共投擲'+form.find('#amount').val()+'組序號<br><br>[結果]: '+data);
                        $("#slotResultModel").modal();

                        return true;
                        // return confirm('您共投擲'+form.find('#amount').val()+'組序號\n[結果]: '+data);
                        // $(".resultArea").text(data);            
                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown){  
                        alert( "error"); 
                        return false; 
                    } 
                });
                }, 3000);
                
            }
        },
        rotationCenterX: 50.0, 
        rotationCenterY: 50.0
    };
    
    $('#rTarget').rotatable(params);
    // $("#rTarget").removeClass("animated infinite tada2");
});
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    // return (angle < 0) ? angle + 360 : angle;
    return angle;
}