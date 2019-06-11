/**
* <임포트 파일>
<script type="text/javascript" src="/common/js/_class/display/abstract_Window.js"></script>
<script type="text/javascript" src="/common/js/_class/display/ConfirmWindow.js"></script>

*  Pa: poCallBackFunc - 확인 을 클릭하면 true를 인자값으로 주어지고, 취소이면 false.
*  Re:
*/
function ConfirmWindow(psText, poCloseCallBackFunc) {
	var sText = psText; // 내용
	var oCloseCallBackFunc = poCloseCallBackFunc; // close 버튼 콜백 함수

	var MessageWindow = new abstract_Window("확인 창");

	function main() {
		MessageWindow.setType("messageWindow");
		MessageWindow.makeButton(70, "확 인", han_mouseclick_OK);
		MessageWindow.makeButton(70, "취 소", han_mouseclick_Cancel);
		MessageWindow.addEventListenerCloseImg(han_mouseclick_Cancel);
	}

	function hide() {
		MessageWindow.hide();
	}
	this.hide = hide;

	function show() {
		MessageWindow.show(sText);
	}
	this.show = show;


	function han_mouseclick_OK() {
		MessageWindow.hide();
		
		if (oCloseCallBackFunc){
			oCloseCallBackFunc(true);
		}
	}

	function han_mouseclick_Cancel() {
		MessageWindow.hide();

		if (oCloseCallBackFunc){
			oCloseCallBackFunc(false);
		}
		
	}

	main();
}