/**
* <임포트 파일>
<script type="text/javascript" src="/common/js/_class/display/abstract_Window.js"></script>
<script type="text/javascript" src="/common/js/_class/display/WindowJS.js"></script>

*  Pa: 
	poTarget - 출력하는 객체
	psShapeType - 'blank' 이면 아무 스타일이 없는 윈도우를 만듬.

	예)	
		## 빈 윈도우 생성 후, 내용을 출력 ##
		// 생성
		oWindowJS_couponReg =  new WindowJS("쿠폰등록", han_oWindowJS_couponReg_close);
		oWindowJS_couponReg.setCloseButtonClickType('visible');
		oWindowJS_couponReg.makeCloneContent(document.getElementById("popup_couponReg"));
	
		// 보이게
		oWindowJS_couponReg.setVisible(true);
	
		## 빈 윈도우 생성 후, 내용을 출력(이전) ##
		// 생성
		oWindowJS = new WindowJS("카테고리", in_han_windowJS_close);
		oWindowJS.setCloseButtonClickType('visible');
		oWindowJS.make();
		oWindowJS_contentElement = oWindowJS.getContentElement();
		oElement_content = oWindowJS_contentElement;
		$(oElement_content).html("..."); // 방법1
		$(oElement_content).html($("#div1")[0].outerHTML); // 방법2
		
		// 보이게
		oWindowJS_couponReg.setVisible(true);

*/
function WindowJS(psTitle, poCloseCallBackFunc, poTarget, psShapeType) {
	var sTitle = psTitle; // 제목
	var oCloseCallBackFunc = poCloseCallBackFunc; // close 버튼 콜백 함수
	var oTarget = poTarget;
	var sShapeType = psShapeType;

	var abWindow;

	function main() {
		abWindow = new abstract_Window(sTitle, oTarget, sShapeType);
		abWindow.addEventListenerCloseImg(han_close_window);
	}

	function addEventListener(psEventType, poCallBack) {
		abWindow.addEventListener(psEventType, poCallBack);
	}
	this.addEventListener = addEventListener;

	function addEventListenerCloseImg(poCallBackFunc) {
		oCloseImgCallBackFunc = poCallBackFunc;
	}
	this.addEventListenerCloseImg = addEventListenerCloseImg;

	function addRadio(paTitle, paValue, piCheckedIndex, psDirection) {
		abWindow.addRadio(paTitle, paValue, piCheckedIndex, psDirection);
	}
	this.addRadio = addRadio;

	function addTextField(psTitleText, piInputTextWidth, psBasicValue) {
		abWindow.addTextField(psTitleText, piInputTextWidth, psBasicValue);
	}
	this.addTextField = addTextField;

	function addWrapForm() {
		abWindow.addWrapForm();
	}
	this.addWrapForm = addWrapForm;

	function getContentElement() {
		return abWindow.getContentElement();
	}
	this.getContentElement = getContentElement;

	function getForm() {
		return abWindow.getForm();
	}
	this.getForm = getForm;

	function getRadioValue() {
		return abWindow.getRadioValue();
	}
	this.getRadioValue = getRadioValue;

	function getRadioValueIdx() {
		return abWindow.getRadioValueIdx();
	}
	this.getRadioValueIdx = getRadioValueIdx;
	
	function getTextFieldValue() {
		return abWindow.getTextFieldValue();
	}
	this.getTextFieldValue = getTextFieldValue;

	function getThisElement() {
		return abWindow.getThisElement();
	}
	this.getThisElement = getThisElement;


	function hide() {
		abWindow.hide();
	}
	this.hide = hide;

	function make(psText) {
		abWindow.make(psText);
	}
	this.make = make;

	function makeButton(piSize, psText, poClickCallBackFunc) {
		abWindow.makeButton(piSize, psText, poClickCallBackFunc);
	}
	this.makeButton = makeButton;

	function makeCloneContent(poContentElement) {
		abWindow.makeCloneContent(poContentElement);
	}
	this.makeCloneContent = makeCloneContent;

	function resetSize() {
		abWindow.resetSize();
	}
	this.resetSize = resetSize;

	function setBackgroundColor(psColor) {
		abWindow.setBackgroundColor(psColor);
	}
	this.setBackgroundColor = setBackgroundColor;

	function setButtonMake(pbValue) {
		abWindow.setButtonMake(pbValue);
	}
	this.setButtonMake = setButtonMake;

	function setClassNameThis(psClassName) {
		abWindow.setClassNameThis(psClassName);
	}
	this.setClassNameThis = setClassNameThis;

	function setCloseButtonClickType(psClickType) {
		abWindow.setCloseButtonClickType(psClickType);
	}
	this.setCloseButtonClickType = setCloseButtonClickType;
	
	function setCloseButtonImg(psValue) {
		abWindow.setCloseButtonImg(psValue);
	}
	this.setCloseButtonImg = setCloseButtonImg;

	function setCssLocation(piLeft, piTop) {
		abWindow.setCssLocation(piLeft, piTop);
	}
	this.setCssLocation = setCssLocation;

	function setCssPosition(psCssPosition) {
		abWindow.setCssPosition(psCssPosition);
	}
	this.setCssPosition = setCssPosition;


	function setDrag(pbValue) {
		abWindow.setDrag(pbValue);
	}
	this.setDrag = setDrag;

	function setEnableKeyEnter(pbValue) {
		abWindow.setEnableKeyEnter(pbValue);
	}
	this.setEnableKeyEnter = setEnableKeyEnter;

	function setEnableKeyEsc(pbValue) {
		abWindow.setEnableKeyEsc(pbValue);
	}
	this.setEnableKeyEsc = setEnableKeyEsc;

	function setHeightMin(piHeight) {
		abWindow.setHeightMin(piHeight);
	}
	this.setHeightMin = setHeightMin;


	function setTitleBackgroundColor(psValue) {
		abWindow.setTitleBackgroundColor(psValue);
	}
	this.setTitleBackgroundColor = setTitleBackgroundColor;

	function setVisible(pbVisible) {
		abWindow.setVisible(pbVisible);
	}
	this.setVisible = setVisible;

	function setWidth(piWidth) {
		abWindow.setWidth(piWidth);
	}
	this.setWidth = setWidth;

	function setWidthMin(piWidth) {
		abWindow.setWidthMin(piWidth);
	}
	this.setWidthMin = setWidthMin;

	function setWidthMax(piWidth) {
		abWindow.setWidthMax(piWidth);
	}
	this.setWidthMax = setWidthMax;

	function show(psText) {
		abWindow.show(psText);
	}
	this.show = show;

	function showLoadDoc(psURL) {
		abWindow.loadDoc(psURL);
	}
	this.showLoadDoc = showLoadDoc;

	function han_close_window() {		
		if (oCloseCallBackFunc){
			oCloseCallBackFunc();
		}
	}

	main();
}