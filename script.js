$(function(){
	tabUI();
	iframeUI();
});
var iframeUI = function(){
	var $el = $('.tab_panel'),
		$timer = 10000;
	$el.each(function(e){
		var $this = $(this),
			$button = $this.find('.button'),
			$input = $this.find('.input'),
			$iframe = $this.find('.iframe'),
			$inputVal;
		reloadSrc();
		var $time = setInterval(reloadSrc,$timer);
		$el.data('timeout',$time);

		$button.click(function(){
			if($(this).hasClass('btn_reload')){
				clearInterval($time);
				reloadSrc();
				$time = setInterval(reloadSrc,$timer);
			}else if($(this).hasClass('btn_link')){
				$inputVal = $input.val();
				window.open($inputVal)
			}
		});

		function reloadSrc(){
			$inputVal = $input.val();
			$iframe.attr('src',$inputVal);
		}
	});
}
var tabUI = function(){
	var $tab = $('.js_tab'),
		$onText = '현재선택';

	$(document).on('click','.js_tab a',function(e){
		e.preventDefault();
		var $this = $(this),
			$idx = $this.closest('li').index(),
			$closest = $this.closest('.js_tab'),
			$isNoHash = $closest.hasClass('no_hash') ? true: false,
			$isFirst = $closest.data('isFirst'),
			$href = $this.attr('href'),
			$target = $closest.data('target'),
			$winScrollTop = $(window).scrollTop();
		if($($href).length){
			if($isFirst == true){
				$closest.data('isFirst', false) ;
			}else if($isNoHash == false){
				location.hash = $href;
				$(window).scrollTop($winScrollTop);
			}
			if($this.closest('.fixed').length){
				var $scrollTop = $this.closest('.fixed').offset().top - $('#header').outerHeight();
				$('html,body').stop(true,false).animate({'scrollTop':$scrollTop},100);
			}

			if($target == undefined){
				$($href).addClass('active').attr('aria-expanded',true).siblings('.tab_panel').attr('aria-expanded',false).removeClass('active');;
			}else{
				$($target).attr('aria-expanded',false).removeClass('active');
				$($href).addClass('active').attr('aria-expanded',true);
			}
			$this.attr('title',$onText).parent().addClass('active').siblings().removeClass('active').find('a').removeAttr('title');
			$this.attr('aria-selected',true).closest('li').siblings().find('[role=tab]').attr('aria-selected',false);
		}else{
			console.error('대상 지정 오류! href값에 해당 id값을 넣어 주세요~');
		}
		var $arr = $closest.children('.arr')
		if($arr.length){
			var $liLength = $closest.find('>ul>li').length,
				$liWidth = 100/$liLength,
				$arrLeft = ($liWidth*$idx)+($liWidth/2);
			$arr.css('left',$arrLeft+'%');
		}
	});

	var $hash = location.hash;
	if($tab.length){
		$tab.each(function(e){
			$(this).find('ul').attr('role','tablist');
			var isHash =false;
			var tarAry = [];
			var isHashClk = '';
			$(this).find('li').each(function(f){
				$(this).attr('role','presentation');
				var _a = $(this).find('a'),
					_aId = _a.attr('id'),
					_href = _a.attr('href');
				if(!_aId) _aId = 'tab_btn_'+e+'_'+f;
				tarAry.push(_href);
				_a.attr({
					'id' :_aId,
					'role' :'tab',
					'aria-controls': _href.substring(1),
					'aria-selected':'false'
				});
				$(_href).attr({
					'role':'tabpanel',
					'aria-labelledby':_aId,
					'aria-expanded':'false'
				});
				if(_href == $hash || $(_href).find($hash).length){
					isHash = true;
					isHashClk = _a;
				}
			});
			$(this).data('target',tarAry.join(','));
			if(isHash == false){
				$(this).data('isFirst',true);
				$(this).find('li').eq(0).find('a').trigger('click');
			}
			if(isHash == true){
				isHashClk.trigger('click');
			}
		});
	}

	if($('.tabmenu').length){
		$(document).on('click','.tabmenu.js_tab a',function(e){
			e.preventDefault();
			scrollUI.center($(this).parent());
		});
		//setTimeout(function(){
			$('.tabmenu').each(function(){
				var $active = $(this).find('.active');
				scrollUI.center($active);
			});
		//},100)
	}
};

//스크롤 관련
var scrollUI = {
	center: function(el){
		var $parent = $(el).parent(),
			$parentWidth = $parent.outerWidth(),
			$parentScrollW = $parent.get(0).scrollWidth,
			$thisLeft = $(el).position().left,
			$thisWidth = $(el).outerWidth(),
			$scrollLeft = $thisLeft - ($parentWidth/2) + ($thisWidth/2),
			$speed = Math.max(300,Math.abs($scrollLeft * 2));
		if($parentWidth < $parentScrollW)$parent.animate({'scrollLeft':'+='+$scrollLeft},$speed);
	}
};
