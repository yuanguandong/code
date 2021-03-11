var finish = 0; 
var size = 70;
var speed = 1;
var precent = 0;
var width = 0;
var precentNum = 0;

function finsishNum(){
	finish = finish+speed;	
}

var timer = setInterval("finsishNum();changefinish();",1);

changefinish(precent);


function changefinish(){
	precent = (finish/size).toFixed(2);
	precentNum = (precent*100).toFixed(2);
	width = 300*precent;

	$(".percent").html(precentNum+'%');
	$(".size").html('总大小：'+ size + ' M');
	$(".speed").html('速度：' + speed +'M/s');
	$(".finish").html('已完成：'+ finish + ' M');
	$(".progress").css('width',width);
	if(finish>=size){
		clearInterval(timer);
		$(".loading").slideUp();
		$(".complete").slideDown();
		$(".detail").slideUp();
		$(".completeText").slideDown();
		$(".progressbar").slideUp();
	}
}


setTimeout("$('.LoadingWindow').fadeOut();",1000);	