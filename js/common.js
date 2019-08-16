var filter = "win16|win32|win64|mac";
if( navigator.platform  ){
	if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
		console.log("모바일 기기에서 접속");
		if (/Android/i.test(navigator.userAgent)) {
			// 안드로이드
		} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			// iOS 아이폰, 아이패드, 아이팟
		} else {
			// 그 외 디바이스
		}
	} else {
		console.log("PC 기기에서 접속");
		var agent = navigator.userAgent.toLowerCase();
		if (agent.indexOf("chrome") != -1) {
			console.log("크롬 브라우저입니다.");
		} else if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1)) {
			console.log('익스11')
		} else if (agent.indexOf("msie") != -1) {
			console.log('익스 10 이하!')
		}
	}
}