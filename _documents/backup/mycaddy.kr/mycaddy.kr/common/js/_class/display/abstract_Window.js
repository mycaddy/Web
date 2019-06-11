/**
   <임포트 파일>
<script type="text/javascript" src="/common/js/_class/display/abstract_Window.js"></script>
<script type="text/javascript" src="/common/js/_class/net/AjaxJS.js"></script>

   <설명>
	- 여러개 만들수 있습니다.
*  Pa: 
	poTarget - 출력하는 객체
	psShapeType - 'blank' 이면 아무 스타일이 없는 윈도우를 만듬.
*  Re:
*/
function abstract_Window(psTitle,poTarget, psShapeType) {
	var sTitle = psTitle;
	var sShapeType = psShapeType;

	var oTarget = poTarget;

	var oThis; // 본객체
	var oThis_className_messageWindow = "__messageWindowJS__"; // class 
	var oThis_className_nomalWindow = "__nomalWindowJS__";
	var sThis_classNameNew; // 새로운 class 이름.
	var oThis_content; // 본객체의 문자를 넣을 객체
	var oThis_buttons; // 본객체의 버튼을 넣을 객체
	var oThis_closeButton; // close 버튼 객체

	var sCloseButtonImgURL = "/common/img/button_close_big_white.png";
	var oCloseButtonImgCallBackFunc;
	var sCloseButtonClickType = "hide"; // 닫기 버튼 클릭했을때, 윈도우를 없애는 것이면 'hide', 단순히 안보이게 하는 것이면 'visible'

	var oThis_heightMin;

	var oThis_width;
	var oThis_widthMax;
	var oThis_widthMin;

	var sThis_backgroundColor;
	var sThis_classNameNew_user = ""; // 사용자 지정한 class 이름
	var sThis_css_position = "absolute";
	var sThis_css_left;
	var sThis_css_top;
	var sThis_title_backgroundColor;

	var bForm_has = false;
	var oForm; // form 객체

	var sType; // 메세지 윈도우인지, 보통윈도우 인지.

	var aButton_str = new Array();
	var aButton_callBackFunc = new Array();
	var bButton_make = true; // 버튼 wrap 객체를 만들것인지 여부

	var aElementAdd_str = new Array(); // content 부분에 추가된 element 문자열
	var iElementAdd_radio_idx = 1; // radio 추가시 name 뒤에 붙는 번호

	var aEventFunc_complete = new Array();
	var aEventFunc_draging = new Array();
	var aEventFunc_drag_start = new Array();
	var aEventFunc_drag_stop = new Array();

	var bEnableKeyEnter = false;
	var bEnableKeyEsc = false;

	var oTargetByWrap;


	// toptranspanel 과 똑같이 맞추어야 한다.
	var iZ_index = 5000;


	function main() {
		if (!sTitle){
			sTitle = "";
		}

		sType = "normalWindow";

		if (!oTarget){
			oTarget = $("body")[0];
		}

		th_regEvent();
	}
	
	/**
	* 
	*  Pa: psEventType - 'complete' 로드 완료 후 (모두 쓴 후)
					'draging'
					'drag_start'
					'drag_stop'
	*  Re:
	*/
	function addEventListener(psEventType, poCallBack) {
		if (psEventType == "complete"){
			aEventFunc_complete.push(poCallBack);
		}else if (psEventType == "draging"){
			aEventFunc_draging.push(poCallBack);
		}else if (psEventType == "drag_start"){
			aEventFunc_drag_start.push(poCallBack);
		}else if (psEventType == "drag_stop"){
			aEventFunc_drag_stop.push(poCallBack);
		}

	}
	this.addEventListener = addEventListener;

	function addEventListenerCloseImg(poCloseImgCallBackFunc) {
		oCloseButtonImgCallBackFunc = poCloseImgCallBackFunc;
	}
	this.addEventListenerCloseImg = addEventListenerCloseImg;
	
	/**
	* 
	*  Pa: piCheckedIndex - checked 할 idx 번호
		psDirection - 라디오 방향 (vertical, horizontal)
	*  Re:
	*/
	function addRadio(paTitle, paValue, piCheckedIndex, psDirection) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		if (!psDirection){
			psDirection = "horizontal";
		}

		s1 = "<div class=\"_window_JS_radio_wrap_\">";

		for (i1 = 0; i1 < paTitle.length; i1++){
			if (piCheckedIndex == i1){
				s2 = "checked";
			}else{
				s2 = "";
			}

			if (psDirection == "vertical"){
				s1 += "<div>";
			}

			s1 += "<input type=\"radio\" class=\"radio\" name=\"_window_JS_radio_" + iElementAdd_radio_idx + "_\" value=\"" + paValue[i1] + "\" " + s2 + "> " + paTitle[i1];

			if (psDirection == "vertical"){
				s1 += "</div>";
			}
		}
		
		s1 += "</div>";

		aElementAdd_str.push(s1);

		iElementAdd_radio_idx++;
		
	}
	this.addRadio = addRadio;
	
	/**
	* input text 를 만든다
	*/
	function addTextField(psTitleText, piInputTextWidth, psBasicValue) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		if (!psBasicValue){
			psBasicValue = "";
		}

		s1 = "<div class=\"_window_JS_textField_wrap_\">";
		s1 += "	<span class=\"title\">" + psTitleText + "</span>";
		s1 += "	<input type=\"text\" class=\"_window_JS_textField_text_\" style=\"width:" + piInputTextWidth + "px;\" value=\"" + psBasicValue + "\">";
		s1 += "</div>";

		aElementAdd_str.push(s1);
	}
	this.addTextField = addTextField;

	function addWrapForm() {
		bForm_has = true;
	}
	this.addWrapForm = addWrapForm;

	function hide() {
		var aBotton;
		var i1;

		if (oThis){
			aBotton = $(oThis).find(".buttons").children(".button");
			for (i1 = 0; i1 < aBotton.length; i1++){
				if (aButton_callBackFunc[i1]){
					$(aBotton[i1]).unbind("click", aButton_callBackFunc[i1]);
				}
			}
			$(oThis).remove();
			oThis= null;
		}

	}
	this.hide = hide;


	function getContentElement() {
		return oThis_content;
	}
	this.getContentElement = getContentElement;

	function getForm() {
		return oForm;
	}
	this.getForm = getForm;

	/**
	* radio의 value 값들을 array 로 리턴
	*/
	function getRadioValue() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		var aValue;

		aValue = new Array();

		for (i1 = 1; i1 < iElementAdd_radio_idx; i1++){
			a1 = document.getElementsByName("_window_JS_radio_" + i1 + "_");

			s1 = cGetRadioValue(a1);

			aValue.push(s1);
		}

		return aValue;		
	}
	this.getRadioValue = getRadioValue;
	
	/**
	* radio의 value의 idx 값들을 array 로 리턴
	*/
	function getRadioValueIdx() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		var aValue;

		aValue = new Array();

		for (i1 = 1; i1 < iElementAdd_radio_idx; i1++){
			a1 = document.getElementsByName("_window_JS_radio_" + i1 + "_");

			i2 = cGetRadioValueIdx(a1);

			aValue.push(i2);
		}

		return aValue;		
	}
	this.getRadioValueIdx = getRadioValueIdx;

	/**
	* addTextField() 함수로 만든 input text 의 value 값들을 array 형태로 반환한다.
	*/
	function getTextFieldValue() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		a1 = $(oThis_content).find("._window_JS_textField_text_");
		a2 = new Array();

		for (i1 = 0; i1 < a1.length; i1++){
			a2.push(a1[i1].value);
		}

		if (a2.length == 0){
			a2 = null;
		}

		return a2;		
	}
	this.getTextFieldValue = getTextFieldValue;

	function getThisElement() {
		return oThis;
	}
	this.getThisElement = getThisElement;

	function loadDoc(psURL) {
		var oAjaxJS;

		th_make("");

		oAjaxJS = new AjaxJS(oThis_content, false);

		oAjaxJS.addEventListener("complete3", han_complete3_ajaxJS);
		oAjaxJS.loadPost(psURL);

	}
	this.loadDoc = loadDoc;
	
	/**
	* 만들기만 한다.
	*  Pa: psText - 없어도 된다.
	*/
	function make(psText) {
		th_make(psText);
	}
	this.make = make;
	


	/**
	* 
	*  Pa: piSize- 50, 70, 100, 150
	*  Re:
	*/
	function makeButton(piSize, psText, poClickCallBackFunc) {
		var s1;

		s1 = "<div class=\"mImgButton" + piSize + "_2 button\" >" + psText + "</div>";
		
		aButton_str.push(s1);
		aButton_callBackFunc.push(poClickCallBackFunc);
	}
	this.makeButton = makeButton;
	
	/**
	* poContentElement를 content 부분에 clone(true)로 복사해서 붙인다.
	   poContentElement 는 삭제된다.
	*  Pa:poContentElement
	*/
	function makeCloneContent(poContentElement) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		th_make();

		o1 = getContentElement();
		
		$(poContentElement).show();
		$(o1).html($(poContentElement).clone(true));
		$(poContentElement).remove();

	}
	this.makeCloneContent = makeCloneContent;

	/**
	* 윈도우 크기가 변했을 때 호출하는 함수
	  (close 버튼을 조정한다)
	*/
	function resetSize() {
		th_setLocationCloseButton();
	}
	this.resetSize = resetSize;

	function setBackgroundColor(psColor) {
		sThis_backgroundColor = psColor;
	}
	this.setBackgroundColor = setBackgroundColor;
	
	/**
	* 버튼 wrap 객체를 만들것인지 여부
	*/
	function setButtonMake(pbValue) {
		bButton_make = pbValue;
	}
	this.setButtonMake = setButtonMake;

	function setDrag(poThat) {
		$(oThis).draggable({ handle:poThat}); // 핸들 설정.
	}
	this.setDrag = setDrag;
	
	/**
	* enter 눌렀을 때 제일 처음 button 이 click 되는지 여부
	*/
	function setEnableKeyEnter(pbValue) {
		bEnableKeyEnter = pbValue;
	}
	this.setEnableKeyEnter = setEnableKeyEnter;

	/**
	* esc 눌렀을 때 window 가 없어지는지 여부
	*/
	function setEnableKeyEsc(pbValue) {
		bEnableKeyEsc = pbValue;
	}
	this.setEnableKeyEsc = setEnableKeyEsc;

	function setHeightMin(piHeight) {
		oThis_heightMin = piHeight;
		//$("." + sThis_classNameNew).css("min-width", piWidth);
	}
	this.setHeightMin = setHeightMin;

	
	/**
	* 
	*  Pa: psType - "messageWindow", "normalWindow"
	*/
	function setType(psType) {
		sType = psType;
	}
	this.setType = setType;
	
	/**
	* 본 객체의 새로운 class 이름을 지정한다.
	*/
	function setClassNameThis(psClassName) {
		sThis_classNameNew_user = psClassName;
	}
	this.setClassNameThis = setClassNameThis;

	/**
	* 닫기 버튼 클릭했을때, 윈도우를 없애는 것이면 'hide', 단순히 안보이게 하는 것이면 'visible'
	*  Pa: psClickType - 'hide', 'visible'
	*/
	function setCloseButtonClickType(psClickType) {
		sCloseButtonClickType = psClickType;
	}
	this.setCloseButtonClickType = setCloseButtonClickType;

	function setCloseButtonImg(psValue) {
		sCloseButtonImgURL = psValue;
	}
	this.setCloseButtonImg = setCloseButtonImg;



	function setCssLocation(piLeft, piTop) {
		sThis_css_left = piLeft;
		sThis_css_top = piTop;
	}
	this.setCssLocation = setCssLocation;

	function setCssPosition(psCssPosition) {
		sThis_css_position = psCssPosition;
	}
	this.setCssPosition = setCssPosition;

	function setTitle(psText) {
		sTitle = psTitle;
	}
	this.setTitle = setTitle;

	function setTitleBackgroundColor(psValue) {
		sThis_title_backgroundColor = psValue;
	}
	this.setTitleBackgroundColor = setTitleBackgroundColor;

	/**
	* 이미 만들어져 있는 상태에서, 보이고, 안보이게 한다.
	   먼저, make()함수를 호출해야 한다.
	*  Pa:
	*/
	function setVisible(pbVisible) {
		if (pbVisible){
			th_setLocation();

			$(oThis).show();

			th_setLocationCloseButton();
		}else{
			$(oThis).hide();
		}

	}
	this.setVisible = setVisible;
	
	function setWidth(piWidth) {
		oThis_width = piWidth;
		//alert(sThis_classNameNew);
		//$("." + sThis_classNameNew).css("width", piWidth);
		//alert($("." + sThis_classNameNew)[0]);
	}
	this.setWidth = setWidth;

	function setWidthMin(piWidth) {
		oThis_widthMin = piWidth;
		//$("." + sThis_classNameNew).css("min-width", piWidth);
	}
	this.setWidthMin = setWidthMin;

	function setWidthMax(piWidth) {
		oThis_widthMax = piWidth;
		//$("." + sThis_classNameNew).css("max-width", piWidth);
	}
	this.setWidthMax = setWidthMax;
	
	/**
	* 만들면서 보이게 한다.
	*  Pa: psText - 없어도 된다.
	*/
	function show(psText) {
		th_make(psText);

		th_setLocation();

		$(oThis).show();
		
		th_setLocationCloseButton();
	}
	this.show = show;

	function th_make(psText) {
		var oButtonsDiv, aButton;
		var opThisClassName;
		var iX, iY;
		var s1, i1;
		
		if (oThis){
			return;
		}

		if (!psText){
			psText = "";
		}
		
		// 줄바꿈, 빈공간 변경.
		if (psText){
			//psText = psText.replace(/\n/g, "<br>");
			//psText = psText.replace(/ /g, "&nbsp;");
		}
		
		// 윈도우의 class 설정.
		if (sType == "messageWindow"){
			opThisClassName = oThis_className_messageWindow;
		}else if (sType == "normalWindow"){
			opThisClassName = oThis_className_nomalWindow;
		}

		oThis = $(oTarget).children("." + opThisClassName)[0];

		if (oThis){
			i1 = 1;
			while (true){
				oThis = $(oTarget).children("." + opThisClassName + String(i1))[0];

				if (!oThis){
					in_makeThis(opThisClassName, opThisClassName + String(i1));
					break;
				}
				i1++;
			}
		}else{
			in_makeThis(opThisClassName, opThisClassName);
		}
		


		$(oThis).css({
				"z-index" : iZ_index,
				"position" : sThis_css_position
				});

		//alert($(oThis).html());
		
		// closeImg의 콜백함수 등록.
		$(oThis).children(".windowJS_title").children(".closeImg").click(han_click_closeImg);
		
		//alert(iX +", " + iY);

		// textField 설정
		for (i1 = 0; i1 < aElementAdd_str.length; i1++){
			$(oThis_content).append(aElementAdd_str[i1]);
		}
		
		// 버튼 설정
		if (sType == "normalWindow"){
			if (aButton_str.length == 0){
				$(oThis_buttons).remove();
			}else{
				for (i1 = 0; i1 < aButton_str.length; i1++){
					$(oThis_buttons).append(aButton_str[i1]);
				}
			}
		}else if (sType == "messageWindow"){
			for (i1 = 0; i1 < aButton_str.length; i1++){
				$(oThis_buttons).append(aButton_str[i1]);
			}
		}
		// 버튼의 콜백 함수 등록
		if (oThis_buttons){
			aButton = $(oThis_buttons).children(".button");
			
			for (i1 = 0; i1 < aButton.length; i1++){
				if (aButton_callBackFunc[i1]){
					$(aButton[i1]).click(aButton_callBackFunc[i1]);
				}
			}
		}
		// enbleKey 설정
		if (bEnableKeyEnter || bEnableKeyEsc){
			$(document).keydown(han_document_keydown);
		}

		// close 버튼 이미지 로드
		if (oThis_closeButton){
			$(oThis_closeButton).load(han_load_closeButtonImg);
			$(oThis_closeButton).hide();
			oThis_closeButton.src = sCloseButtonImgURL;
		}

		// 마우스에 대한 버튼 설정.
		cSetButtonAboutMouse();

		// size 설정.
		if (oThis_width){
			$("." + sThis_classNameNew).children(".content").children(".text").css("width", oThis_width);
		}
		if (oThis_widthMin){
			$("." + sThis_classNameNew).children(".content").children(".text").css("min-width", oThis_widthMin);
		}
		if (oThis_widthMax){
			$("." + sThis_classNameNew).children(".content").children(".text").css("max-width", oThis_widthMax);
		}
		
		if (oThis_heightMin){
			$("." + sThis_classNameNew).children(".content").children(".text").css("min-height", oThis_heightMin);
		}
		
		// drag 설정
		//$(oThis).draggable();
		$(oThis).draggable({ 
						handle:".windowJS_title",
						stop : han_this_drag_stop,
						start : han_this_drag_start,
						drag : han_this_draging
							
						}); // 핸들 설정.

		// style 에서 psThisName 으로 스타일이 지정되 있으로, 새로운 이름을 따로 지정한다.
		function   in_makeThis(psThisName, psNewThisName) {
			var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

			sThis_classNameNew = psNewThisName;

			if (sThis_backgroundColor){
				s2 = "background-color:" + sThis_backgroundColor;
			}else{
				s2 = "";
			}

			if (sThis_title_backgroundColor){
				s3 = "background-color:" + sThis_title_backgroundColor;
			}else{
				s3 = "";
			}

			if (sShapeType == "blank"){
				s1 = "<div class=\"" + psThisName + " " + sThis_classNameNew + "\">";
				s1 += "	<div class=\"content\">";
				s1 += "		<div class=\"text\">" + psText + "</div>";
				s1 += "	</div>";
				s1 += "</div>";
			}else{
				s1 = "<div class=\"" + psThisName + " " + sThis_classNameNew + " " + sThis_classNameNew_user + "\"  style=\"" + s2 + "\">";
				s1 += "	<div class=\"windowJS_title\" style=\"" + s3 + "\"><div class=\"titleName\">" + sTitle + "</div><img class=\"closeImg\"></div>";
				s1 += "	<div class=\"content\">";
				s1 += "		<div class=\"text\" style=\"" + s2 + "\">" + psText + "</div>";

				if (bButton_make){
					s1 += "	<div class=\"buttonsWrap\" style=\"" + s2 + "\"><div class=\"buttons\"></div></div>";
				}
				s1 += "	</div>";
				s1 += "</div>";
			}

			$(oTarget).append(s1);


			if (psNewThisName){
				oThis = $(oTarget).children("." + psNewThisName)[0];
			}else{
				oThis = $(oTarget).children("." + psThisName)[0];
			}

			if (bForm_has){
				i1 = 1;
				while (true){
					o1 = document.getElementById("_windowJS_wrapForm" + i1 + "_");

					if (!o1){
						$(oThis).wrap("<form name=\"_windowJS_wrapForm" + i1 + "_\" id=\"_windowJS_wrapForm" + i1 + "_\"  method=\"post\"></form>");

						oForm = document.getElementById("_windowJS_wrapForm" + i1 + "_");

						break;
					}

					i1++;
				}
			}

			$(oThis).hide();


			if (sShapeType == "blank"){
				oThis_content = $(oThis).children(".content").children(".text")[0];
				//alert(oThis_content);
				oThis_buttons = null;
				oThis_closeButton = null;
			}else{
				oThis_content = $(oThis).children(".content").children(".text")[0];
				oThis_buttons = $(oThis).children(".content").children(".buttonsWrap").children(".buttons")[0];
				oThis_closeButton = $(oThis).children(".windowJS_title").children(".closeImg")[0];
			}
		}
	}

	function th_setLocation() {
		var iX, iY;

		if (oThis){
			if (sThis_css_left && sThis_css_top){
				iX = sThis_css_left;
				iY = sThis_css_top;
			}else{
				iX = $(window).width() / 2 - $(oThis).width() / 2 + $(window).scrollLeft();
				iY = $(window).height() / 2 - $(oThis).height() / 2 + $(window).scrollTop() - 10;

				if (iX < 10){
					iX = 10;
				}
	
				if ($(window).scrollTop() > iY){
					iY = $(window).scrollTop() + 10;
				}else if (iY < 10){
					iY = 10;
				}
			}
			
			$(oThis).css({
					"left" : iX,
					"top" : iY
					});
		}
		
	}

	function th_setLocationCloseButton() {
		var i1;
		
		$(oThis_closeButton).show();

		o1 = $(oThis).children(".windowJS_title");
		i1 = $(oThis).width(); // IE 7에서 $(o1).width() 가 정확하게 안나와서 this 로 수정.
		i2 = $(o1).outerHeight();

		//alert(i2);

		$(oThis_closeButton).css("left", i1 - $(oThis_closeButton).width() - 5);
		$(oThis_closeButton).css("top", (i2 / 2) - ($(oThis_closeButton).height() / 2));

	}

	function han_click_closeImg() {
		if (sCloseButtonClickType == "hide"){
			hide();
		}else if (sCloseButtonClickType == "visible"){
			setVisible(false);
		}

		if (oCloseButtonImgCallBackFunc){
			oCloseButtonImgCallBackFunc();
		}
	}

	function han_complete3_ajaxJS() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		//cPrint_d("han_complete3_ajaxJS");
		th_setLocation();


		$(oThis).show();

		th_setLocationCloseButton();
		
		for (i1 = 0; i1 < aEventFunc_complete.length; i1++){
			aEventFunc_complete[i1]();
		}

	}

	function han_document_keydown(poEvent) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		if (bEnableKeyEnter){
			if (poEvent.keyCode == 13){ // enter
				a1 = $(oThis_buttons).children(".button"); // 제일 처음 버튼 클릭
				a1[0].click();
				
			}
		}

		if (bEnableKeyEsc){
			if (poEvent.keyCode == 27){ //esc
				$(oThis).children(".windowJS_title").children(".closeImg").click();
			}
		}
	}

	function han_load_closeButtonImg() {
		th_setLocationCloseButton();
	}

	function han_resize_window() {
		//th_setLocation();
	}

	function han_scroll_window() {
		//th_setLocation();
	}
	
	function han_this_draging(poEvent, poUi) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		
		for (i1 = 0; i1 < aEventFunc_draging.length; i1++){
			aEventFunc_draging[i1]();
		}
	}
	
	function han_this_drag_start(poEvent, poUi) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		
		for (i1 = 0; i1 < aEventFunc_drag_start.length; i1++){
			aEventFunc_drag_start[i1]();
		}
		
	}
	
	function han_this_drag_stop(poEvent, poUi) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		
		for (i1 = 0; i1 < aEventFunc_drag_stop.length; i1++){
			aEventFunc_drag_stop[i1]();
		}
		
	}

	function th_regEvent() {
		$(window).resize(han_resize_window);
		$(window).scroll(han_scroll_window);
	}

	main();
}