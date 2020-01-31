var wordBox = document.getElementById('item_area'), // 단어 영역
	mainText = document.getElementById('mainText'),
	mainTextWord = mainText.textContent, // 제시어
	write = document.getElementById('wordInput'), // 입력창 영역
	lastWord = mainTextWord.substr(mainTextWord.length -1), // 제시어의 마지막 단어
	regex= /[a-z]|[ \[\]{}()<>?|`~!@#$%^ ☆★&*_=,.;:\"'\\]/g; //특문 & 영문 & 숫자 정규식

//입력 한 글자가 한글인지 체크
function onChange() {
	if (regex.test(write.value)) {
		alert('한글만 입력해 주세요.')
		write.value = '';
	}
}

	// 입력창에서 엔터 클릭시 발생
function onSubmit(e){
	e.preventDefault(); // 새로고침 방지

	if (write.value.charAt(0) == lastWord && write.value.length > 1) {
		var textValue = write.value;

		//wordBox.insertBefore(textValue, wordBox.firstChild);
		mainText.innerHTML = textValue;
		write.value = '';
		lastWord = textValue.substr(textValue.length - 1);
	} else {
		console.log('틀림');
		write.value = '';
	}
}

