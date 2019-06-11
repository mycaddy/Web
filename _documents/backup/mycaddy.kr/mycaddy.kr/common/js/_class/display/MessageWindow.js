/**
* <임포트 파일>
<script type="text/javascript" src="/common/js/_class/display/abstract_Window.js"></script>
<script type="text/javascript" src="/common/js/_class/display/MessageWindow.js"></script>

*/
function MessageWindow(psTitle, poCloseCallBackFunc) {
	var sTitle = psTitle; // 내용
	var oCloseCallBackFunc = poCloseCallBackFunc;  // close 버튼 콜백 함수

	var oAbstractWindow = new abstract_Window(sTitle);

	function main() {
		oAbstractWindow.setType("messageWindow");
		oAbstractWindow.addEventListenerCloseImg(han_mouseclick_close);
	}
	
	/**
	* 
	*  Pa: piButtonSize - 30, 50, 70, 100, 150 만 됩니다..
	*  Re:
	*/
	function makeButton(piButtonSize, psButtonText, poCallBackFunc) {
		oAbstractWindow.makeButton(piButtonSize, psButtonText, poCallBackFunc);
	}
	this.makeButton = makeButton;

	function hide() {
		oAbstractWindow.hide();
	}
	this.hide = hide;

	function show(psText) {
		oAbstractWindow.show(psText);
	}
	this.show = show;
	
	function setHeightMin(piWidth) {
		oAbstractWindow.setHeightMin(piWidth);
	}
	this.setHeightMin = setHeightMin;

	function setWidth(piWidth) {
		oAbstractWindow.setWidth(piWidth);
	}
	this.setWidth = setWidth;

	function setWidthMin(piWidth) {
		oAbstractWindow.setWidthMin(piWidth);
	}
	this.setWidthMin = setWidthMin;

	function setWidthMax(piWidth) {
		oAbstractWindow.setWidthMax(piWidth);
	}
	this.setWidthMax = setWidthMax;

	function han_mouseclick_close() {
		oAbstractWindow.hide();
		
		if (oCloseCallBackFunc){
			oCloseCallBackFunc();
		}
	}

	main();
}