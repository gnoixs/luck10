$(function(){
	$('.outer').css({
		'width':window.innerWidth+'px',
		'height':window.innerHeight+'px',
	});
	$('.outer .inner').css({
		'zoom':window.innerWidth/640,
		'visibility':'visible'
	});
})
