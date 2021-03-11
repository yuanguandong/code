//动态时钟
$(function(){
  var clockSeconds = $('.sec'),
      clockMinutes = $('.min'),
      clockHours = $('.hr');
  function getTime () {
    var date = new Date(),
        seconds = date.getSeconds(),
        minutes = date.getMinutes(),
        hours = date.getHours(),
        degSeconds = seconds * 360 / 60,
        degMinutes = (minutes + seconds / 60) * 360 / 60,
        degHours = (hours + minutes / 60 + seconds / 60 / 60) * 360 / 12;
        console.log('clockSeconds.length',clockSeconds.length)
      for(var i=0;i < clockSeconds.length; i++){
          clockSeconds[i].setAttribute( 'style', '-webkit-transform: rotate(' + degSeconds + 'deg); -moz-transform: rotate(' + degSeconds + 'deg); -ms-transform: rotate(' + degSeconds + 'deg); -o-transform: rotate(' + degSeconds + 'deg); transform: rotate(' + degSeconds + 'deg);');
          clockMinutes[i].setAttribute('style', '-webkit-transform: rotate(' + degMinutes + 'deg); -moz-transform: rotate(' + degMinutes + 'deg); -ms-transform: rotate(' + degMinutes + 'deg); -o-transform: rotate(' + degMinutes + 'deg); transform: rotate(' + degMinutes + 'deg);');
          clockHours[i].setAttribute('style', '-webkit-transform: rotate(' + degHours + 'deg); -moz-transform: rotate(' + degHours + 'deg); -ms-transform: rotate(' + degHours + 'deg); -o-transform: rotate(' + degHours + 'deg); transform: rotate(' + degHours + 'deg);');
      }
   }
  $(function() {
    setInterval(getTime,1000);
  });
});

//获取时间


//获取时间函数
function startTime(){
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var Month=new Array(12)
      Month[0]="January"
      Month[1]="February"
      Month[2]="March"
      Month[3]="April"
      Month[4]="May"
      Month[5]="June"
      Month[6]="July"
      Month[7]="August"
      Month[8]="September"
      Month[9]="October"
      Month[10]="November"
      Month[11]="December";
  month = Month[month];
  if(day<10){
    day="0"+day
  }
  if(hour<10){
    hour="0"+hour
  }
  if(minute<10){
    minute="0"+minute
  }
  if(second<10){
    second="0"+second
  }
  if(!$('.time_num')){return;}
  $('.time_num').html(hour + ':' +minute);
  $('.month').html(month + ', ');
  $('.day').html(day);
  setTimeout('startTime()',10);
}
startTime();
