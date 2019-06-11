/**
* <임포트 파일>
<script type="text/javascript" src="/common/js/_class/display/abstract_Window.js"></script>
<script type="text/javascript" src="/common/js/_class/display/AlertWindow.js"></script>

*/
function AlertWindow(psText, poCloseCallBackFunc) {
	var sText = psText; // 내용
	var oCloseCallBackFunc = poCloseCallBackFunc;  // close 버튼 콜백 함수

	var MessageWindow = new abstract_Window("알림 창");

	function main() {
		MessageWindow.setType("messageWindow");
		MessageWindow.makeButton(70, "확 인", han_mouseclick_OK);
		MessageWindow.addEventListenerCloseImg(han_mouseclick_OK);
		
		// enter 눌렀을 때 닫기.
		$(window).keydown(han_keydown_window);
	}

	function hide() {
		MessageWindow.hide();
	}
	this.hide = hide;

	function show() {
		MessageWindow.show(sText);
	}
	this.show = show;

	function han_keydown_window(poEvent) {
		if (poEvent.keyCode == 13){ //엔터
			han_mouseclick_OK();
		}
	}

	function han_mouseclick_OK() {
		MessageWindow.hide();
		
		if (oCloseCallBackFunc){
			oCloseCallBackFunc();
		}
	}

	main();
}