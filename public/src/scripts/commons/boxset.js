$(function(){

	var zoom = window.innerWidth/640;

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
		//隐藏弹层
		$('.curtion').hide();
	});
	//计时器
	var time = 600;
	var timer = setInterval(function(){
		if(time<0){
			time = 600;
		}
		if(time>900){
			clearInterval(time);
			alert('时间不能超过15分钟');
		}else{
			var m = Math.floor(time/60);
			var s = time % 60;
			if(m<10){
				m = '0'+m;
			}
			if(s<10){
				s = '0'+s;
			}
			
			var t = m + ':'+s;
			$('#timer').text(t);
			time--;
		}
	},1000);

//功能点击
	$('.page').on('click',function(evt){
		var _target = $(evt.target).attr('clickid');
		switch(_target){
			case 'back':  										//返回按钮
				//window.history.go(-1);
			break;
			case 'showmore': 									//右侧显示更多按钮
				if($('#showMore').css("display") == 'none'){
					$('#showMore').show();
				}else{
					$('#showMore').hide();
				}
			break;
			case 'shake': 										//摇一摇按钮
				$('#alert').show();
			break;
			case 'showlottery': 								//开奖列表
				if($('#showLottery').css('display') == 'none'){
					$('#showLottery,.support').show(500);
					$(evt.target).removeClass('rotate');
					
				}else{
					$('#showLottery,.support').hide(500);
					$(evt.target).addClass('rotate');
				}
			break;
			case 'refresh':  									//刷新开奖列表
				console.log('refresh');
			break;
			case 'shakecancel': 								//取消摇一摇功能
				$('#alert').hide();
			break;
			case 'shakecomfirm': 								//摇一摇确认清空
				clearUp();
				$('#alert').hide();
			break;
			case 'rebet':
				$('#confirm').hide();
			break;
			case 'betconfirm': 									//确定投注
				console.log('确定投注'); 
				break;
		}
	});


	//改变投注金额和投注按钮
	$('.footer li').on('click',function(evt){
		if($(this).attr('clickid') == 'addchip'){
			$('#bet').show();
			$('#amount').focus();
		}else if($(this).attr('clickid') == 'bet'){
			$('#confirm').show();
		}
	});
	$('#amount').on('keypress',function(evt){ 	//输入的金额
		var enter = evt.keyCode || evt.charCode;
		if(enter == 13){
			var value = $(this).val();
			if(value.length == 0){
				alert('请输入金额');
			}else{
				$('#betUnit').text($(this).val()+'元');
				$('#bet').hide();
			}
		}
	});

	//按钮形式改变投注金额
	$('#bet button').on('click',function(evt){
		$('#betUnit').text($(this).attr('count')+'元');
		$('#bet').hide();
	});

//清空所有
	function handleShake(){
		
	}
//------------------------------------------------------------------------------------

//投注逻辑
	var _timeout = null;
	var _interval = null;
	var isAready = false;
	var x=y=_x=_y=null;			//touchstart,touchmove最原始的坐标
	var _target = null;			//目标对象
	var isMoved = false;
	var stepBack = false;

	var choosed = [];			//选球


//第一个阶段
	$('.sections ul li div').on('touchstart',function(evt){
		
		 x = evt.target.offsetLeft;			//touchmove 判断区域的时候回用到
		 y = evt.target.offsetTop;

		 _target = $(evt.target);

		_x = evt.touches[0].pageX / zoom;
		_y = evt.touches[0].pageY / zoom;

		//_target.attr('choose','y');

		 var _width = parseFloat($('.tip').css('width').replace(/px/,''));
		 var _height = parseFloat($('.tip').css('height').replace(/px/,''));

		 _target.prev().text('+'+getBetUnit()).css('visibility','visible');
		 
		 removeBetAnim(_target);

		//需要设置的数据		
		var __x = _x - _width;
		var __y = _y - 150 + $('.sections')[0].scrollTop;

		if(__x <= 0){			//左边不够显示
			__x += _width;
			//__y -=_height;	//？显示在上边
		}

		$(this).addClass('active');
		
		$('.tip').css({'left': __x +'px','top' : __y +'px'});


		_timeout = setTimeout(function(){
			isAready = true;
			$('.tip').show();
			_interval = setInterval(function(){
				_target.prev().text('+'+summation(_target));
			},200);
		},1000);
	});

//第二个阶段
	$('.sections ul li div').on('touchmove', function(evt){
		evt.preventDefault();	

		var _width = parseFloat($('.tip').css('width').replace(/px/,''));

		clearTimeout(_timeout);
		clearInterval(_interval);

		if(!isAready){
			return;
		}
		
		_x = evt.touches[0].pageX / zoom;
		_y = evt.touches[0].pageY / zoom;
		
		//需要设置的数据
		var __x = _x - _width;
		var __y = _y;
		//console.log('before:'+__x,__y);
		if(__x <= 0){		//左边界
			__x += _width;	
			if(__x<=0){
				__x = 0;
			}
		}
		if(__x >= 640 - _width){	//右边界
			__x = 640 - _width;
		}
		__y = _y - 150 + $('.sections')[0].scrollTop;
		
		if(__y <= 0){			//上边界
			__y = 0;
		}
		
		if(__y >= parseFloat($('.sections').css('height')) - parseFloat($('.tip').css('height')) +$('.sections')[0].scrollTop){		//下边界
			__y = parseFloat($('.sections').css('height')) - parseFloat($('.tip').css('height')) + $('.sections')[0].scrollTop;
		}
		//console.log('after:'+__x,__y);
		showTip(__x,__y);


		if(_x -x < 0 || _x - x > 75 || __y - y < 0 || __y - y > 75){		//脱离目标触控区
			//tipActive();
			if(!stepBack){
				tipActive();
			}else{
				$('.tip').hide();
			}
		}else{								//触控区域外
			if(isMoved){	//说明第二次移入
				stepBack = true;
				tipRecover();
				addBetAnim(_target,true);
				cannelBet(_target,stepBack);
			}
		}
		
	});

//第三个阶段	
	$('.sections ul li div').on('touchend',function(evt){

		clearTimeout(_timeout);
		clearInterval(_interval);
		
		tipRecover();

		if(isAready && isMoved){			//持续按住了指定时间，且有移动
			cannelBet(_target,stepBack);	
			addBetAnim(_target,true);	
		}else{
			_target.attr('choose','y');
			addBetAnim(_target);
			$(_target).next().text('￥'+getAddUp(_target)).css('visibility','visible');		//设置一注的总金额
			$('.betAmount').text(getBetAmount().length);
			$('#total').text(getToalAmount(choosed));
			//console.log(formatData(choosed));
		}
		initVarible();			
	});


	//变量初始化
	function initVarible(){
		_timeout = null;
		_interval = null;
		isAready = false;
		x=y=_x=_y=null;			
		_target = null;		
		isMoved = false;
		stepBack = false;
	}

	//获取下注单位
	function getBetUnit(){
		return parseFloat($('#betUnit').text().replace(/元/,''));
	}

	//显示加注动画
	function addBetAnim(_target,isImdi){
		_target.prev().css('visibility','hidden');
		if(!isImdi){
			_target.prev().addClass('transition');
		}else{
			_target.prev().removeClass('transition');
		}
		
	}
	//隐藏加注动画
	function removeBetAnim(){
		_target.prev().removeClass('transition');
	}

	//跟随提示图标
	function tipActive(){
		//$('.tip').text('松手撤销投注').addClass('active').show().css({'left': __x  +'px','top':  __y  +'px'});
		$('.tip').text('松手撤销投注').addClass('active');
		isMoved = true;
	}
	//只是显示提示
	function showTip(__x,__y){
		$('.tip').show().css({'left': __x  +'px','top':  __y  +'px'});
	}

	//恢复跟随图标
	function tipRecover(){
		$('.tip').text('下移撤销').removeClass('active').hide();
	}
	//每一注累加的金额
	function summation(_target){
		var orgin = parseFloat(_target.prev().text().substr(1));
		orgin += getBetUnit();
		return orgin;
	}

	//取消或撤回
	function cannelBet(_target,stepBack){
		if(stepBack){			//上一步
			if(_target.attr('choose') == 'n'){
				_target.removeClass('active');
			}
		}else{					//取消
			_target.next().text('￥0').css('visibility','hidden');
			_target.removeClass('active');
			_target.attr('choose','n');
		}
		$('.betAmount').text(getBetAmount().length);
		$('#total').text(getToalAmount(choosed));		
	}


	//一注的总金额
	function getAddUp(_target){
		var _o = parseFloat(_target.next().text().replace(/￥/,''));
		var _add = parseFloat(_target.prev().text().replace(/\+/,''));
		return _o+_add;
	}


	//获取总的注数,返回数量和金额,组装信息数组
	function getBetAmount(){
		choosed = [];
		$('.sections ul li div').each(function(index,ele){
			if($(ele).attr('choose') == 'y'){
				choosed.push($(ele).attr('breed')+'-'+parseFloat($(ele).next().text().replace(/￥/,'')));
			}
		});
		//console.log(choosed);
		return choosed;
	}



	//获取总金额
	function getToalAmount(arr){
		var all = 0;
		for(var i = 0; i<arr.length;i++){
			var ele = parseFloat(arr[i].split('-')[1]);
			all+=ele;
		}
		return all;
	}




	//格式化数据
	function formatData(arr){
		var model = {
			'single':{
				type:'单点',
				rate: $('.sections section').eq(0).find('strong').text(),
				choose:[]
			},
			'bigOrSmall':{
				type:'大小',
				rate: $('.sections section').eq(1).find('strong').text(),
				choose:[]
			},
			'combine':{
				type:'组合',
				rate: $('.sections section').eq(2).find('strong').text(),
				choose:[]
			},
			'dranOrTig':{
				type:'龙虎',
				rate: $('.sections section').eq(3).find('strong').text(),
				choose:[]
			}
		};
		for(var i = 0;i<arr.length;i++){
			var _arr = arr[i].split('-');
			var ele = {};
			ele.name = _arr[0];
			ele.amount = _arr[1];
			switch(_arr[0].length){
				case 3: 														//单点
					model.single.choose.push(ele);
					break;
				case 1: 													    //大小
					model.bigOrSmall.choose.push(ele);
					break;
				case 2: 													   //组合
					model.combine.choose.push(ele);
					break;
				default: 													  //龙虎
					model.dranOrTig.choose.push(ele);
			}

		}
		return model;
	}

	//清空
	function clearUp(){
		$('.sections ul li div').each(function(index, ele){
			$(ele).attr('choose','n').removeClass('active');
			$(ele).prev().text(0).css('visibility','hidden');
			$(ele).next().text('￥0').css('visibility','hidden');
			$('#betUnit').text('10元');
			$('.betAmount').text(0);
			$('#total').text(0);
		});
	}
});
