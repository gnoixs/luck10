$(function(){
	$(window).on('ready resize',function(){
		//外层容器
		$('.outer').css({
			'width':window.innerWidth+'px',
			'height':window.innerHeight+'px',
		});
		//内层页面
		$('.outer .page').css({
			'zoom':window.innerWidth/640,
			'visibility':'visible'
		});
		//选球区容器
		$('.sections').css({
			'height':(window.innerHeight*640/window.innerWidth-($('.nav').height()+$('.nav-down').height()+$('.footer').height()))+'px',
			'top':($('.nav').height()+$('.nav-down').height())+'px'
		});
	})
})
