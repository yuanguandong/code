
function findWeather() {
    $("#refresh").addClass("rotate");
    setTimeout(function(){
      $("#refresh").removeClass("rotate");
    },1000);
    var cityUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
    $.getScript(cityUrl, function(script, textStatus, jqXHR) {
        var citytq = remote_ip_info.city ;
        var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&city=" + citytq + "&day=4";
        $.ajax({
            url : url,
            dataType : "script",
            scriptCharset : "gbk",
            success : function(data) {
                var _w = window.SWther.w[citytq][0];
                var _w1 = window.SWther.w[citytq][1];
                var _w2 = window.SWther.w[citytq][2];
                var _w3 = window.SWther.w[citytq][3];
                var _w4 = window.SWther.w[citytq][4];

                var condition = _w.f1;
                var condition1 = _w1.f1;
                var condition2 = _w2.f1;
                var condition3 = _w3.f1;
                var condition4 = _w4.f1;

                var range = _w.t1 + "℃～" + _w.t2 + "℃  ";
                var range1 = _w1.t1 + "℃～" + _w1.t2 + "℃  ";
                var range2 = _w2.t1 + "℃～" + _w2.t2 + "℃  ";
                var range3 = _w3.t1 + "℃～" + _w3.t2 + "℃  ";
                var range4 = _w4.t1 + "℃～" + _w4.t2 + "℃  ";

                var temperature = Math.round(_w.t1/2+_w.t2/2) + '°';
                var temperature1 = Math.round(_w1.t1/2+_w1.t2/2) + '°';
                var temperature2 = Math.round(_w2.t1/2+_w2.t2/2) + '°';
                var temperature3 = Math.round(_w3.t1/2+_w3.t2/2) + '°';
                var temperature4 = Math.round(_w4.t1/2+_w4.t2/2) + '°';

                var date = new Date();
                var weekday = new Array(7);
                    weekday[0] = "SUN";
                    weekday[1] = "MON";
                    weekday[2] = "TUE";
                    weekday[3] = "WED";
                    weekday[4] = "THU";
                    weekday[5] = "FRI";
                    weekday[6] = "SAT";
                var weekday0 =weekday[date.getDay()];
                var weekday1 =weekday[date.getDay()+1];
                var weekday2 =weekday[date.getDay()+2];
                var weekday3 =weekday[date.getDay()+3];
                var weekday4 =weekday[date.getDay()+4];

                condition = 'icon-' + _w.f1;
                condition1 = 'icon-' + _w1.f1;
                condition2 = 'icon-' + _w2.f1;
                condition3 = 'icon-' + _w3.f1;
                condition4 = 'icon-' + _w4.f1;

              //if(!document.getElementById('wek')){return;}
              $('.wek').html(weekday0);
              $('.tmp').html(temperature);
              $('.range').html(range);
              $('#icon').addClass(""+condition+"");

                //if(!$('#wekL')){return;}
              $('#wekL').html(weekday0);
              $('#tmpL').html(temperature);
              $('#rangeL').html(range);
              $('#addressL').html(citytq + ',CN');
              $('#iconL').addClass(""+condition+"");


          //if(!$('#wek1')){return;}
              $('#range1').html(range1);
              $('#icon1').addClass(""+condition1+"");

          //if(!$('#wek2')){return;}
              $('#wek2').html(weekday2);
              $('#range2').html(range2);
              $('#icon2').addClass(""+condition2+"");

          //if(!$('#wek3')){return;}
              $('#wek3').html(weekday3);
              $('#range3').html(range3);
              $('#icon3').addClass(""+condition3+"");
              
          //if(!$('#wek4')){return;}
              $('#wek4').html(weekday4);
              $('#range4').html(range4);
              $('#icon4').addClass(""+condition4+"");                


            }
        });
    });
}

$(".leftbtn").click(function(){
  $(this).siblings().removeClass("box-gradient");
  $(this).siblings().addClass("box-gray");
  $(this).removeClass("box-gray");
  $(this).addClass("box-gradient");
  $(".weatherLarge .other .ulbox").animate({left:'0'},"fast");
});

$(".rightbtn").click(function(){
  $(this).siblings().removeClass("box-gradient");
  $(this).siblings().addClass("box-gray");
  $(this).removeClass("box-gray");
  $(this).addClass("box-gradient");
  $(".weatherLarge .other .ulbox").animate({left:'-33.33%'},"fast");
});