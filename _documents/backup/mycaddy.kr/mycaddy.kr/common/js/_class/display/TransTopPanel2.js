/**
	<추가사항>
	- [13.10.30] showLoading() 함수 만듬. 판넬을 보이고, loading 이미지 보이게 하는 함수.
	- [13.10.05] oTarget 이 document, window 일 때도 정확히 동작되게 함.
			- 여러 개를 만들 수 있다. 다른 곳에서 새로운 객체를 생성해서 여러개 만들수 있다.
	- [13.06.29] 본 객체를 body 에 만드는것이 아니라, oTarget 객체의 자식 객체로 되도록 수정했습니다.
		그리고, target 객체의 position이 absolute 일경우와 아닐 경우를 나눠서 position을 조정하게 만들었습니다.
	- getIsShow() 메서드 추가. 현재 판넬이 보여지면 true 리턴
	- 크기 변할때 애니메이션 효과를 줄 수 있게, oMoveDuration, sMoveEasing 이 추가 되었다.
	<설명>
	- 크기를 조정할때는 
		...resize($(aThis[piIdx]).innerWidth(), $(aThis[piIdx]).innerHeight());
		...show(); 이런 식으로 한다.
	- 내용이 반드시 테그(div, span 등) 안에 있어야 한다. 그래야 정확히 판넬의 크기가 조정된다.
	- 본 객체는 body 객체의 제일 하단에 'div' 테그를 만들고 'id'를 '__transTopPanel' + 숫자 + '__'로 만든다.
	- z-index는 5000이다.
*	- child 객체는 문자열로 입력 받고, 본 객체에 append 하고,  x, y 만 설정한다.
*/
function TransTopPanel2(psColor, piAlpha, pbHideClick, poTarget, psProgIconSrc, pbMargin, pbFadeShow, pbFadeHide, poFadeSpeed, poMoveDuration, psMoveEasing, piWidth, piHeight) {
	var sColor = psColor; //
	var iAlpha = piAlpha;
	var bHideClick = pbHideClick; // 본 객체를 클릭하면 hide 되는지 여부. true이면 hide 된다.
	var oTarget = poTarget; // 판넬이 보일 객체.
	var bMargin = pbMargin; // 판넬 생성 할때 margin 도 포함 할지 여부, true이면 포함.
	var bFadeShow = pbFadeShow; // 보일때 알파 값이 천천히 변하는지 여부.
	var bFadeHide = pbFadeHide; // 숨길때 알파 값이 천천히 변하는지 여부.
	var oFadeSpeed = poFadeSpeed;  // 'slow', 'normal', 'fast', 밀리 초 숫자
	var oMoveDuration = poMoveDuration; // 크기 변할 때의 속도. 'slow', 'normal', 'fast' 또는 밀리 초.
	var sMoveEasing = psMoveEasing; // 크기 변할 때의 타입 'linear', 'swing'
	var iWidth = piWidth;  // 판넬의 넓이
	var iHeight = piHeight;

	var bAutoSize;

	var oProgIcon; // 프로그래스 아이콘 객체
	var oProgIcon_img; // 프로그래스 아이콘 이미지 객체
	var bProgIcon_show; // 프로그래스 아이콘 표시 여부. true 이면 보인다.
	var sProgIcon_name = "progIcon";
		
	var oPanel;	// 판넬 객체
	var sPanel_name = "__transTopPanel__"; // 판넬 id 앞 글짜.
	
	var iIdNum; // 판넬, 프로그래스 아이콘, child 객체의 아이디 뒤에 붙는 숫자.
	var aEventFunc = new Array(); // 해쉬 객체이다. 키는 이벤트('show', 'hide'), 값은 func 이다.
	var oChild = new Object();	// 본 객체 위에 보여지는 객체.
	oChild.obj; // child 객체
	oChild.sStr; // 객체를 나타내는 HTML 문자열
	oChild.oX; // 숫자나 'auto'
	oChild.oY; // 숫자나 'auto'
	var sChild_name = "child";

	var iZ_index = 5000;

	function init() {
		if (iWidth && iHeight){
			bAutoSize = false;
		}else{
			bAutoSize = true;
		}

		if (psProgIconSrc){
			bProgIcon_show = true;
			th_setProgIcon(psProgIconSrc);
		}
	}

	/**
	* 
	*  Pa: psEventType - 'show', 'hide' 
	*/
	function addEventListener(psEventType, poFunc) {
		aEventFunc[psEventType] = poFunc;
	}
	this.addEventListener = addEventListener;
	/**
	* 본 객체 위에 보여지는 객체.
	*  Pa: psStr - 객체를 나타내는 HTML 문자열
		 poX - 숫자나 'auto'
		 poY - 숫자나 'auto'
	*/
	function appendChild(psStr, poX, poY) {
		oChild.sStr = psStr;
		oChild.oX = poX;
		oChild.oY = poY;
	}
	this.appendChild = appendChild;
	/**
	* 
	*  Pa: psProgIconSrc - 아이콘의 src
	*/
	function appendProgressIcon(psProgIconSrc) {
		th_setProgIcon(psProgIconSrc);
	}
	this.appendProgressIcon = appendProgressIcon;
	
	/**
	* 파넬 객체를 숨기는 메서드이다. 판넬 객체가 없으면 아무 것도 하지 않는다.
	*/
	function hide() {
		if (oPanel){
			$(oPanel).unbind("click", han_mouseClick_panel);
			
			if (oTarget == document || oTarget == window){
				$(window).unbind("resize", han_windowResize);
			}

			if (bFadeHide && oFadeSpeed){
				$(oPanel).fadeTo(oFadeSpeed, 0, han_fadeComplete_hide);
			}else{
				th_hide();
			}
		}
	}
	this.hide = hide;

	function removeChild() {
		oChild = null
	}
	this.removeChild = removeChild;

	/**
	* 
	*  Pa: psEventType - 'show', 'hide' 
	*/
	function removeEventListener(psEventType, poFunc) {
		aEventFunc[psEventType] = null;
	}
	this.removeEventListener = removeEventListener;

	/**
	* - 새로운 내용이 반드시 테그(div, span 등) 안에 있어야 한다. 그래야 정확히 resize 된다.
	*  Pa: piWidth, piHeight - 이 두 값이 모두 없으면 사이즈를 자동 조정
	*/
	function resize(piWidth, piHeight) {
		if (piWidth){
			iWidth = piWidth;
		}

		if (piHeight){
			iHeight = piHeight;
		}

		if (oPanel){
			th_positionSizePanel(piWidth, piHeight);
			
			// child 포지션
			if (oChild.obj)
				th_positionChild();

			// progIcon 포지션.
			if (oProgIcon)
				fo_positionProgIcon();
		}
	}
	this.resize = resize;

	/**
	 판넬만 보이게 하는 함수.
	*/
	function show() {
		if (!getIsShow()){
			th_show();
		}
	}
	this.show = show;

	/**
	  [13.10.30] loading 이미지도 같이 보이게 하는 함수.
	*/
	function showLoading() {
		if (!getIsShow()){
			th_show();
		}
		
		if (bProgIcon_show && oProgIcon_img && oProgIcon_img.complete){
			th_appendProgIcon();
		}
	}
	this.showLoading = showLoading;
	
	/**
	*  현재 판넬이 보여지는 true 리턴.
	*  Pa:
	*  Re:
	*/
	function getIsShow() {
		if (oPanel){
			return true;
		}else{
			return false;
		}
	}
	this.getIsShow = getIsShow;

	function setAutoSize(pbAutoSize) {
		bAutoSize = pbAutoSize;
	}
	this.setAutoSize = setAutoSize;

	function setAlpha(piAlpha) {
		iAlpha = piAlpha;
	}
	this.setAlpha= setAlpha;

	function setColor(psColor) {
		sColor = psColor;
	}
	this.setColor = setColor;
	
	/**
	* 판넬 색을 하얀색으로
	*/
	function setColorWhite() {
		sColor = "#FFFFFF";
	}
	this.setColorWhite = setColorWhite;

	/**
	* 판넬 색을 투명하게
	*/
	function setColorTransparent() {
		sColor = "transparent";
	}
	this.setColorTransparent = setColorTransparent;

	function setFade(pbFadeShow, pbFadeHide, poFadeSpeed) {
		bFadeShow = pbFadeShow;
		bFadeHide = pbFadeHide;
		oFadeSpeed = poFadeSpeed;
	}
	this.setFade = setFade;

	function setHideClick(pbHideClick) {
		bHideClick = pbHideClick;
	}
	this.setHideClick = setHideClick;

	function setMargin(pbMargin) {
		bMargin = pbMargin;
	}
	this.setMargin = setMargin;

	function setMoveDuration(poMoveDuration) {
		oMoveDuration = poMoveDuration;
	}
	this.setMoveDuration = setMoveDuration;

	function setMoveEasing(psMoveEasing) {
		sMoveEasing = psMoveEasing;
	}
	this.setMoveEasing = setMoveEasing;

	this.setMoveDuration = setMoveDuration;

	function setProgIcon(pbProgIconShow, psProgIconSrc) {
		bProgIcon_show = pbProgIconShow;

		th_setProgIcon(psProgIconSrc);
	}
	this.setProgIcon = setProgIcon;

	function setSize(piWidth, piHeight) {
		iWidth = piWidth;
		iHeight = piHeight;
	}
	this.setSize = setSize;

	function setTarget(poTarget) {
		oTarget = poTarget;
	}
	this.setTarget = setTarget;

	function th_appendProgIcon() {
		var o1;

		if (!$(oPanel).children("#"+ sPanel_name + sProgIcon_name)[0]){
			// panel 객체가 progIcon 객체보다 커야 progIcon 객체가 보이도록.
			if ($(oPanel).outerWidth() > $(oProgIcon_img).outerWidth() && $(oPanel).outerHeight() > $(oProgIcon_img).outerHeight() ){
				$(oPanel).append("<img src=\"" + oProgIcon_img.src + "\" id = \"" + sPanel_name + sProgIcon_name + "\">");
				oProgIcon = $(oPanel).children("#"+ sPanel_name + sProgIcon_name)[0]
				fo_positionProgIcon();

			}
		}
	}

	function th_hide() {
		if (oPanel){
			$(oPanel).remove();
			oPanel = null;

			if (aEventFunc["hide"])
				aEventFunc["hide"]();
		}
	}

	function th_setProgIcon(psProgIconSrc) {
		if (!oProgIcon_img){
			oProgIcon_img = new Image();
			$(oProgIcon_img).load(han_imgeLoad_progIcon);
		}

		if (psProgIconSrc){
			oProgIcon_img.src = psProgIconSrc;
		}

	}

	function th_show() {
		var b1, i1;
				
		if (oPanel){
			return;
		}

		if (oTarget == document || oTarget == window ){
			oPanel = $($("body")[0]).children("." + sPanel_name )[0];
		}else{
			oPanel = $(oTarget).children("." + sPanel_name )[0];
		}
		
		// 만약 다른 객체에서 topPanel를 만들고 사용한다면.
		if (oPanel){
			i1 = 1;
			while (true){
				if (oTarget == document || oTarget == window ){
					oPanel = $($("body")[0]).children("." + sPanel_name + String(i1))[0];
				}else{
					oPanel = $(oTarget).children("." + sPanel_name + String(i1))[0];
				}

				if (!oPanel){
					in_makePanel(sPanel_name + String(i1));
					break;
				}
				i1++;
			}
		}else{
			in_makePanel(sPanel_name);
		}

		if (bFadeShow && oFadeSpeed)
			i1 = 0;
		else
			i1 = iAlpha;

		$(oPanel).css({"background-color" : sColor,
				"position" : "absolute",
				"z-index" : iZ_index,
				"opacity" : i1});	
		
		// panel의 width, height 설정.
		th_positionSizePanel();

		// 핸들러 설정.
		if (bHideClick){
			$(oPanel).click(han_mouseClick_panel);
		}

		$(window).resize(han_windowResize);

		// child 객체 설정.
		if (oChild.sStr){
			if (!$(oPanel).children("#"+ sPanel_name + sChild_name)[0]){
				$(oPanel).append("<div id=\"" + sPanel_name + sChild_name + "\">" + oChild.sStr + "</div>");
			}
			if (oTarget == document || oTarget == window ){
				oChild.objl = $($("body")[0]).children("#" + sPanel_name + sChild_name)[0];
			}else{
				oChild.obj = $(oTarget).children("#" + sPanel_name + sChild_name)[0];
			}

			th_positionChild();

		}

		// fade 설정
		if (bFadeShow && oFadeSpeed){
			$(oPanel).fadeTo(oFadeSpeed, iAlpha, han_fadeComplete_show);
			b1 = true;
		}

		function   in_makePanel(psPanel_name) {
			if (oTarget == document || oTarget == window ){
				 $($("body")[0]).append("<div class=\"" + psPanel_name + "\"></div>");
				oPanel =  $($("body")[0]).children("." + psPanel_name )[0];
			}else{
				$(oTarget).append("<div class=\"" + psPanel_name + "\"></div>");
				oPanel = $(oTarget).children("." + psPanel_name )[0];
			}
		}
	}

	function th_showLast() {
		if (aEventFunc["show"])
			aEventFunc["show"]();
	}

	function th_positionChild() {
		var i1, i2, o1;

		if (oChild.oY == "auto")
			i1 = ($(oPanel).height() / 2) - ($(oChild.obj).outerHeight() / 2);
		else	
			i1 = oChild.oY;

		if (oChild.oX == "auto")
			i2 = ($(oPanel).width() / 2) - ($(oChild.obj).outerWidth() / 2);
		else
			i2 = oChild.oX;

		$(oChild.obj).css({	"position" : "absolute",
				"top" : i1,
				"left" : i2});
	}

	function th_positionSizePanel(piWidth, piHeight) {
		var a1, s1, s2;

		a1 = new Array();

		if (piWidth && piHeight){
			a1 = new Array(piWidth, piHeight);
		}else{
			if (bAutoSize){
				a1[0] = $(oTarget).outerWidth(bMargin);
				a1[1] = $(oTarget).outerHeight(bMargin);
				//a1 = mf_getTotalWtHt(oTarget, bMargin);
			}else{
				/* resize() 함수를 호출해서 ,width, height를 설정했어도, 테이블이 hidden 일 경우
				   width, height가 제대로 저장되지 않기 때문에 다시 outerWidth(). outerHeight() 를 사용합니다. */
				if (!iWidth || !iHeight){
					a1[0] = $(oTarget).outerWidth(bMargin);
					a1[1] = $(oTarget).outerHeight(bMargin);
					//a1 = mf_getTotalWtHt(oTarget, bMargin);
				}else{
					a1 = new Array(iWidth, iHeight);
				}
			}
		}

		if (oTarget == window){
			$(oPanel).css({"width" : window.outerWidth,
					"height" :   window.outerHeight,
					"top" : 0,
					"left" : 0});		
		}else if (oTarget == document){
			$(oPanel).css({"width" : a1[0],
					"height" : a1[1],
					"top" : 0,
					"left" : 0});		
			
		}else{
			if (bMargin){
				s1 = $(oTarget).css("margin-top");
				s2 = $(oTarget).css("margin-left");
				
			}else{
				s1 = "0px";
				s2 = "0px";
			}
			
			// target 이 absolute 인경우 top, left를 0으로 설정합니다.
			if ($(oTarget).css("position") == "absolute"){
				$(oPanel).css({"width" : a1[0],
						"height" : a1[1],
						"top" : 0 - new Number(s1.slice(0, s1.indexOf("px"))),
						"left" : 0 - new Number(s2.slice(0, s2.indexOf("px")))});	
			}else if($(oTarget).css("position") == "relative"){
				$(oPanel).css({"width" : a1[0],
						"height" : a1[1],
						"top" : $(oTarget).scrollTop(),
						"left" : $(oTarget).scrollLeft()});	
			}else if($(oTarget).css("position") == "fixed"){
				$(oPanel).css({"width" : a1[0],
						"height" : a1[1],
						"top" : 0 - new Number(s1.slice(0, s1.indexOf("px"))),
						"left" : 0 - new Number(s2.slice(0, s2.indexOf("px")))});	
			}else{
				$(oPanel).css({"width" : a1[0],
						"height" : a1[1],
						"top" : $(oTarget).position().top - new Number(s1.slice(0, s1.indexOf("px"))),
						"left" : $(oTarget).position().left - new Number(s2.slice(0, s2.indexOf("px")))});		
			}

			//alert($(oPanel).css("top") + ", " +$(oPanel).css("left"));
			//alert($(oPanel).css("width") + ", " +$(oPanel).css("height"));
			//alert($(oPanel).css("display"));
		}
	}

	function fo_positionProgIcon() {

		$(oProgIcon).css({"position" : "absolute",
				"display" : "block",
				"top" : ($(oPanel).height() / 2) - ($(oProgIcon).height() / 2),
				"left" : ($(oPanel).width() / 2) - ($(oProgIcon).width() / 2)});
		
	}

	function han_fadeComplete_hide() {
		th_hide();
	}

	function han_fadeComplete_show() {
		th_showLast();
	}

	function han_imgeLoad_progIcon() {
		if (oPanel && bProgIcon_show){
			th_appendProgIcon();
		}
	}

	function han_mouseClick_panel() {
		hide();
	}

	function han_windowResize() {
		// resize()로 하면 윈도우가 줄어들때 판넬이 줄어 들지 않는다.
		if (oPanel){
			$(oPanel).hide();

			th_positionSizePanel();
			
			$(oPanel).show();

			// child 포지션
			if (oChild.obj)
				th_positionChild();

			// progIcon 포지션.
			if (oProgIcon)
				fo_positionProgIcon();
		}
	}
	
	init();
}