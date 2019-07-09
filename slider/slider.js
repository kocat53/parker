var _count = 0,
_slider, //setinterval 용
_index = 0, // 갯수 세기용
_prevContentGroup,
startAuto,
_changeCount = 0;

$(function(){
	var $sliderInner = $('.slider_inner'), // 슬라이드 내부
		$sectionWith = $('.slider_top').innerWidth(),// 전체 넓이
		$item = $sliderInner.children(),// 슬라이더 아이템 지정
		$Length = $item.length, // 갯수 구하기
		// 페이저(썸네일)
		$thumb = $('.thumb_inner'),
		$thumbWidth = $thumb.innerWidth(), // 썸네일 warp 넓이
		$thumbItem = $thumb.children(), //
		$pagerWidth = ($thumbWidth / $Length),
		_timer = 2000;

	// 슬라이더 아이템 넓이 지정
	$item.each(function(){
		var $index = $(this).index();
		$(this).css({ 
			'width':$sectionWith
		}).attr('data-index',$index);
	});

	// 위에서 각각 넓이를 지정한 후  그 값을 곱하여  감싸고 있는부모에게 제공
	var  $width = $item.innerWidth(),
	$fullWidth = ($Length * $width); 
	
	// 횩새몰라 한겹 감싸고 위드값 지정
	$sliderInner.wrap('<div class="slider_wrap"></div>').css({
		'width':$fullWidth,
	});
	
	// 썸네일 갯수에 따른 넓이 자동 지정, 
	//4개 미만일경우 갯수/100%
	// 4개 이상일 경우는 무조건 4개 나눈 값!
	if($Length > 4) {
		$thumbItem.css('width',($thumbWidth/4));
	} else {
		$thumbItem.css('width',$pagerWidth)
	}

	//  썸네일각각에  인덱스값 부여
	$thumbItem.each(function(){
		$(this).attr('data-thumIndex',$(this).index());
	});

	// 이미지의 등록 갯수가 4개보다 많다면;
	if($Length > 4) {
		// 뒤에 추가될 이미지의 갯수를 구함
		var $pagerAdd = (4-$Length % 4)
	}

	// 위에서 붙을 값을 구하여 반복문 실행
	for(i =0; i <= $pagerAdd-1; i++){
		//붙을 아이템들 복사해서 on 클래스 제거하고
		var readyItem = $thumbItem.eq(i).clone().removeClass('on').addClass('clone_item');
		// 추가함
		$thumb.append(readyItem);
	}

	// 자동 롤링
	function autoSlider(){
		_slider = setInterval(function(){
			_changeCount++; // 카운트 시작
			_index++;
			if(_index >= $Length) {
				_index = 0;
			}
			sliderChange();
			changePagerGroup(); // 복사작업 시작
		},_timer);
	}

	//autoSlider();

	// 페이저 버튼 처리
	$thumb.on('mouseenter', '.item_pager', function(){
		_changeCount++;
		_changeCount = $(this).index();
		var $this = $(this),
			$index = $this.data('thumindex');
		
		$this.addClass('on').siblings().removeClass('on');
		$('.slide_item[data-index='+ $index+']').removeClass('hide').siblings().addClass('hide');
		_index = $index;
	});

	// 오버시 애니메이션 멈춤
	$thumb.hover(function(){
		clearInterval(_slider);
		window.clearTimeout(startAuto);
	},function(){
		startSlider();
	});
	
	// 버튼 처리
	$('.btn_slider').click(function(){
		clearInterval(_slider);
		window.clearTimeout(startAuto);
		
		var $this = $(this);
		$('.slide_item').removeClass('hide');

		if($this.hasClass('btn_next')){
			_changeCount++;
			_index++;
			if(_index > $Length-1){
				_index = 0;
			}
			sliderChange();
		} else {
			_changeCount--;
			_index--;
			if(_index < 0){
				_index = $Length-1;
			}
			sliderChange();
		}
		changePagerGroup();
		startSlider();
	});

	// 마우스 올릴시 이벤트 멈춤 처리
	$('.slider_top').hover(function(){
		clearInterval(_slider);
		window.clearTimeout(startAuto);
	},startSlider);

	// 넓이 처리
	$(window).resize(function(){
		var $window = $(window).width();
		$('.slide_item').css('width',$window);
		$sliderInner.css({
			'width':$Length*$window,
		});
	});

	// 멈춘뒤 다시 재생용 함수..
	function startSlider(){
		startAuto = setTimeout(autoSlider);
	}

	// 슬라이드 이미지 바뀌는거
	function sliderChange(){
		$('.slide_item[data-index='+ _index+']').removeClass('hide').siblings().addClass('hide');
		onChangePager();
	}

	var originalItem = $('.item_pager:nth-last-child(-n+' + $pagerAdd + ')').length; // 오리지날 갯수
	var allLength = $Length -originalItem;
	var masterLength = (allLength - (4 - ($pagerAdd - 1))); // 오리지날 갯수 빼기 (원래 보여질값에 인덱스 0 부터 시작하니까 1로 만들기위해 1 더한 값)
	
	// 페이저 무한루프다리!!
	function changePagerGroup(){
		if($Length > 4) { // 이미지가 4개 이상이라면
			
			if (_changeCount >= 4) { // 보여지는 갯수만큼 된다면
				_changeCount = 0; // 카은트 초기화
				var rollingPager = $('.item_pager:gt('+($pagerAdd-1)+'):lt(4)'); // 앞에서부터   3개 숫자의  벓  다음에 오는 숫자4개를
				var rollingClone = rollingPager.clone(); // 복사해서
				$thumb.append(rollingClone); // 넣고
				$('.item_pager:lt(4)').remove(); // 지우고
			}
			
			// 첫번쨰 버튼에서 마이너스를 누를 경우!
			if (_changeCount < 0) {
				// 여기가 진짜 힘들었다.... 이전 처리 하는게....
				_prevContentGroup = $('.item_pager:not(:nth-last-child(-n+' + $pagerAdd + ')):gt(' + masterLength + ')');	
				var appendClone = _prevContentGroup.clone(),
					lastAddclone = appendClone.slice(0, $pagerAdd);
				
				$thumb.prepend(_prevContentGroup);
				$('.item_pager:nth-last-child(-n+' + $pagerAdd + ')').remove();
				$thumb.append(lastAddclone)
				_changeCount = 3;
			}
		}
	}

	// 페이저 변경인데 'ㅅ'..
	function onChangePager(){
		$('.item_pager').removeClass('on');
		$('.item_pager[data-thumIndex='+_index+']').addClass('on');
	}
});