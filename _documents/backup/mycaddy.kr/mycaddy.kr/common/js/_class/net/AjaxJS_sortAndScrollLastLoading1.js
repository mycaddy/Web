/**
  <추가사항>
	- sortHead(), setScrollLastLoading() 가 추가 되었다. 
  <주의>
  <필요 문서>
	<script type="text/javascript" src="/js/[class]/display/TransTopPanel2.js"></script>
* <설명>
	- delay, fade 순서 : delayBefore -> fadeBefor-> fadeAfter -> delayAfter.
	- 로드 될 문서 시작 문자열은 '<!-- __Ajax contents start__ -->', 이고 끝 문자열은 '<!-- __Ajax contents end__ -->' 이다.
	- 타겟 객체에 문자열을 넣고, 판넬의 resize()를 하면 크기가 정확히 안되므로, interval로 2초 정도 계속 resize()를 호출한다.

*/
function AjaxJS_sortAndScrollLastLoading1(poTarget, pbAppend, poPanel, pbFadeBefore, pbFadeAfter, poFadeSpeed, piDelayBefore, piDelayAfter, piScrollLast_intervalSec) {
	var oTarget = poTarget; // 로드 후 문자열을 넣을 객체
	var bAppend = pbAppend; // oTarget에 append()를 할 것인지 여부, true이면 append()로, false 면 html()로 새로이 넣고, null 이면 쓰지 않는다.
	var oPanel = poPanel;  // transTopPanel 객체 
	var bFadeBefore = pbFadeBefore; // 로드 전 객체에 fade 할 것인지 여부
	var bFadeAfter = pbFadeAfter;  // 로드 후 객체에 fade 할 것인지 여부
	var oFadeSpeed = poFadeSpeed;
	var iDelayBefore = piDelayBefore; // 로드 전 딜레이 밀리초.
	var iDelayAfter = piDelayAfter; // 로드 후 딜레이 밀리초.

	var sSortType = new Array(); // 'asc', 'desc' 저장. (키: 숫자.)
	var sSortAscImgSrc;
	var sSortDescImgSrc;
	var oSortTarget;
	var oSortTarget_prev;
	var iSortNum;
	var iSortNum_prev;
	var iSort_table; // head 의 정렬할 table 객체.

	var oPage; // page 객체
	var iPage_listViewCount; // 한 페이지당 몇개의 리스트가 보일것인지
	var iPage_pageNumCount; // 페이지 번호가 몇개 보일 것인지.
	var iPage_nowPage; // 현재 페이지 번호
	var iPage_listTotalCount; // 리스트의 총 갯수.
	var oPage_pageFirstButton; //  활성화 되지 않았을 때의 img 객체
	var oPage_pagePrevButton;
	var oPage_pageNextButton;
	var oPage_pageLastButton;
	var oPage_pageFirstButton_on; //  활성화 되었을 때의 img 객체
	var oPage_pagePrevButton_on;
	var oPage_pageNextButton_on;
	var oPage_pageLastButton_on;

	var oScrollLast_scrollTarget; // scroll 이벤트 핸들러를 등록할 객체.
	var oScrollLast_target; // scrollLastLoading 될 때 쓰여질 table 객체.
	var iScrollLast_tableColspan;
	var iScrollLast_viewLen; // 로딩될때 몇개의 content가 보일 것인지.
	var oScrollLast_loadingImg; // loading 이미지 객체.
	var sScrollLast_loadingImgSrc;
	var sScrollLast_loadingImgClassName = "__ajaxjs_scrollLastLoading__";
	var iScrollLast_loadingheight;  // 로딩 될 동안 공간의 height.
	var iScrollLast_page; // 페이지. 0부터 시작.
	var oScrollLast_transTopPanel; // 
	var sScrollLast_end = false; // 리스트를 마지막까지 로딩 된 경우 true.
	var sScrollLast_endClassName = "__ajaxjs_scrollLastLoading_end__";
	var bScrollLast_intervalFinish; // interval 이 끝났으면 true.
	var oScrollLast_intervalId;
	var iScrollLast_intervalSec = 1000;
	
	var sLastSubmitType; // get, post 인지
	var sLastURL; // URL
	var sLastData;
	var sLastType; 
	var sLastURL_sort; // sLastURL 에 order by 까지 된 URL.

	var bAutoWidth = false; // 자동으로 테이블의 width 값을 넓여줄 것인지. true이면 자동 width 값을 넓혀준다.

	var iTableTheadTrHt; // table의 thead 부분의 tr의 height 입니다.

	var oTableTheadColne; // thead 부분을 복사한 객체입니다.
	var sTableParentPrevPosition;
	var bFixHead; // fixHead 이면 true입니다.
	
	var oTableFixTd; // 고정시킬 td를 복사한 객체입니다.
	var oTableFixTd_thead; // 고정시킬 td의 thead 객체입니다.
	var bFixLeftTd; // FixLeftTd 이면 true 입니다.
	var iFixLeftTdLen; // 왼쪽에 몇개를 fix 하는지 갯수입니다.

	var sViewSource_src = "/common/php/com_page/ajaxJS/SourceView.php"; // ajax 소스 보여주는 페이지.
	
	var bAppend_use; // 현재 사용하고 있는 append 변수 설정. scrollLastLoading 이면 false
	var oPanel_use; // 현재 사용하고 있는 transTopPanel.

	var oInterval2; // 출력 후 판넬의 resize를 하기 위해서 interval 한다.
	var iInterval2Num = 0; // 카운터
	var iInterval2Sec= 50; // interval 이 실행되는 밀리초
	var iInterval2Max = 40; // iInterval2Num 의 최대 값. iInterval2Num 이 본 변수 값 이상 되면 interval2 가 멈춤.

	 // 해쉬 객체이다. 키는 로드 완료 후 이벤트('complete1'(쓰기 전), 'complete2'(쓴 후 판넬 있는), 'complete3'(쓴 후 판넬 없는)), 값은 func 이다.
	var aEventFunc = new Array();

	// 현재 상태를 나타낸다. 'start'(시작), 'delayBefore_start', 'delayBefore_end', 'fadeBefore_start', , 'fadeBefore_end', 'fadeAfter_start',  'fadeAfter_end', 'delayAfter_start', 'delayAfter_end', null(끝)  이 들어간다.
	var sState;

	var oRequest; // get(), post() 실행시 리턴되는 XMLHttpRequest 객체.
	var oInterval1; // interval ID
	
	function main() {
		bFixHead = true;
		
		if (piScrollLast_intervalSec){
			iScrollLast_intervalSec = piScrollLast_intervalSec;
		}
	}

	/**
	* 이벤트 등록. 
	*  Pa: psEventType - 로드 완료 후 이벤트 'complete1'(쓰기 전), 'complete2'(쓴 후 판넬 있는), 'complete3'(쓴 후 판넬 없는)
	*/
	function addEventListener(psEventType, poCallBack) {
		aEventFunc[psEventType] = poCallBack;
	}
	this.addEventListener = addEventListener;

	function addTransTopPanel(poTransTopPanel) {
		oPanel_use = poTransTopPanel;
	}
	this.addTransTopPanel = addTransTopPanel;
	
	/**
	* 사용법 : oRequest.responseText
	*  Pa:
	*  Re:
	*/
	function getRequest() {
		return oRequest;
	}
	this.getRequest = getRequest;
	/**
	* poCallBack
	*  Pa:
	*  Re:
	*/
	function loadGet(psURL, paData, psType) {
		th_loadGetPost("get", psURL, paData, psType);
	}
	this.loadGet = loadGet;

	function loadPost(psURL, paData, psType) {
		th_loadGetPost("post", psURL, paData, psType);
	}
	this.loadPost = loadPost;

	function removeEventListener() {
		aEventFunc[psEventType] = null;
	}
	this.removeEventListener = removeEventListener;
	
	/**
	* head 를 이용해서 정렬할 수 있게 합니다.
	*  Pa: poTargetTable - 테이블 객체입니다.
	*/
	function sortHead(poTargetTable) {
		var o1, o2, o3, i1, i2, s1;
		
		iSort_table = poTargetTable;

		o1 = $(iSort_table).find("th span");
			
		o2 = $(iSort_table).find("thead").find("tr")[0];
		
		
		// tr 이 있다면...
		if (o2){
			o3 = $(o2).children("th")[0];
			// th가 있다면 실행합니다..
			if (o3){
				iTableTheadTrHt = $(o2).height(); // thead 의 tr 부분의 height를 저장합니다.

				for (i1 = 0; i1 < o1.length; i1++){
					//alert($(o1[i1]).text());
					$(o1[i1]).attr("value", i1);
					$(o1[i1]).unbind("click", han_mouseClick_headTh);
					$(o1[i1]).click(han_mouseClick_headTh);
					$(o1[i1]).css("cursor", "pointer");
				}	
				
				o1 = $(iSort_table).parent()[0]; // 부모 테그를 저장시킵니다.
				sTableParentPrevPosition = $(o1).css("position");

				setFixHead(bFixHead);
			}
		}
		
	}
	this.sortHead = sortHead;

	function regSortImgSrc(psSortAscImgSrc, psSortDescImgSrc) {
		sSortAscImgSrc = psSortAscImgSrc;
		sSortDescImgSrc = psSortDescImgSrc;
	}
	this.regSortImgSrc = regSortImgSrc;
	
	/**
	* 자동으로 테이블의 width 값을 변경할지 여부를 설정하는 함수입니다.
	   'pbAutoWidth' 값이 'true'이면 자동으로 width를 설정하게 됩니다. 'false'이면 자동 설정 안합니다.
	*  Pa: pbAutoWidth - true 또는 false 
	*/
	function setAutoWidth(pbAutoWidth) {
		bAutoWidth = pbAutoWidth;
	}
	this.setAutoWidth = setAutoWidth;

	function setDelay(piDelayBefore, piDelayAfter) {
		iDelayBefore = piDelayBefore;
		iDelayAfter = piDelayAfter;
	}
	this.setDelay = setDelay;

	function setFade(pbFadeBefore, pbFadeAfter, poFadeSpeed) {
		bFadeBefore = pbFadeBefore;
		bFadeAfter = pbFadeAfter;
		oFadeSpeed = poFadeSpeed;
	}
	this.setFade = setFade;
	
	/**
	* table의 thaed 부분을 스크롤 해도 고정되게 설정하는 함수입니다.
	*  Pa: pbEnable - true 이면 thaed 부분을 고정시키고, false 이면 고정하지 않습니다.
	*/
	function setFixHead(pbEnable) {
		var o1;

		bFixHead = pbEnable;
		
		if (bFixHead){
			if (!oTableTheadColne){
				th_setFixHead();
			}
		}else{
			th_setFixHeadDel();
		}
	}
	this.setFixHead = setFixHead;
	
	/**
	* thead 부분의 width가 변할 때나, th 가 추가 되거나, 줄어 들때 호출하는 함수입니다.
	*/
	function setFixHeadReset() {
		th_setFixHeadDel();
		th_setFixHead();
		th_setFixHeadSizeText();
	}
	this.setFixHeadReset = setFixHeadReset;

	/**
	* table의 tbody 의 왼쪽 td 들을 스크롤 해도 고정되게 설정하는 함수입니다.
	*  Pa: piFixLeftTdLen - 고정시킬 td의 갯수입니다. 1부터 시작합니다..
	*/
	function setFixLeftTd(piFixLeftTdLen) {
		bFixLeftTd = true;
		
		iFixLeftTdLen = piFixLeftTdLen;

		th_setFixLeftTd();

	}
	this.setFixLeftTd = setFixLeftTd;

	function setPage(poPage, piListViewCount, piPageNumCount) {
		oPage = poPage;
		iPage_listViewCount = piListViewCount;
		iPage_pageNumCount = piPageNumCount;
		iPage_nowPage = 1;
		
		// 버튼 이미지 저장 설정
		oPage_pageFirstButton = new Image();
		oPage_pagePrevButton = new Image();
		oPage_pageNextButton = new Image();
		oPage_pageLastButton = new Image();

		oPage_pageFirstButton.src = $(oPage).children(".pageFirstButton").children("img")[0].src;
		oPage_pagePrevButton.src = $(oPage).children(".pagePrevButton").children("img")[0].src;
		oPage_pageNextButton.src = $(oPage).children(".pageNextButton").children("img")[0].src;
		oPage_pageLastButton.src = $(oPage).children(".pageLastButton").children("img")[0].src;

		oPage_pageFirstButton_on = new Image();
		oPage_pagePrevButton_on = new Image();
		oPage_pageNextButton_on = new Image();
		oPage_pageLastButton_on = new Image();
		
		s1 = oPage_pageFirstButton.src;
		i1 = s1.lastIndexOf(".");
		sFilePath = s1.substr(0, i1);
		sFileExtent = s1.substring(i1 + 1, s1.length);
		
		oPage_pageFirstButton_on.src = sFilePath + "_on." + sFileExtent;
		
		s1 = oPage_pagePrevButton.src;
		i1 = s1.lastIndexOf(".");
		sFilePath = s1.substr(0, i1);
		sFileExtent = s1.substring(i1 + 1, s1.length);
		
		oPage_pagePrevButton_on.src = sFilePath + "_on." + sFileExtent;
		
		s1 = oPage_pageNextButton.src;
		i1 = s1.lastIndexOf(".");
		sFilePath = s1.substr(0, i1);
		sFileExtent = s1.substring(i1 + 1, s1.length);
		
		oPage_pageNextButton_on.src = sFilePath + "_on." + sFileExtent;
		
		s1 = oPage_pageLastButton.src;
		i1 = s1.lastIndexOf(".");
		sFilePath = s1.substr(0, i1);
		sFileExtent = s1.substring(i1 + 1, s1.length);
		
		oPage_pageLastButton_on.src = sFilePath + "_on." + sFileExtent;

	}
	this.setPage = setPage;
	
	/**
	* 리스트 보이는 갯수 설정
	*/
	function setPageListViewCount(piListViewCount) {
		iPage_listViewCount = piListViewCount;
	}
	this.setPageListViewCount = setPageListViewCount;

	
	/**
	  - oTArget 객체가 반드시 있어야 한다.
	  - 문서를 로드 전에 이 함수를 호출해야 한다.
	* - bAppend 가 자동으로 true 가 된다.
	*  Pa: poScrollTarget - 보통은 테이블의 부모 객체이다. window 일수 있다. window 일경우 poTarget 사이에 form 객체가 있어도 무방하다.
		 psLoadingImgSrc - 로딩 이미지 url
		piLoadingHeight - height. 꼭 해줘야 한다.
		piTableColspan - table colspan 을 지정한다.
	*  Re:
	*/
	function setScrollLastLoading(poScrollTarget, poTarget, piViewContentLen, psLoadingImgSrc, piLoadingHeight, piTableColspan) {
		oScrollLast_scrollTarget = poScrollTarget;
		oScrollLast_target = poTarget;
		iScrollLast_viewLen = piViewContentLen;
		sScrollLast_loadingImgSrc = psLoadingImgSrc;
		iScrollLast_loadingheight = piLoadingHeight;

		iScrollLast_page = 0;
		
		if (piTableColspan){
			iScrollLast_tableColspan = piTableColspan;
		}else{
			var o1 = $(oScrollLast_target).find("thead").children("tr").children("th");
			iScrollLast_tableColspan = o1.length;
		}
		//alert(iScrollLast_tableColspan);

		oScrollLast_loadingImg = new Image();
		oScrollLast_loadingImg.src = sScrollLast_loadingImgSrc;

		sScrollLast_end = true;
	
		$(poScrollTarget).scroll(han_scroll_scrollTarget);
	}
	this.setScrollLastLoading = setScrollLastLoading;

	function setTarget(poTarget) {	
		oTarget = poTarget;
	}
	this.setTarget = setTarget;
	
	/**
	* ajax 부분의 소스를 보여줍니다.
	*  Pa: psTargetId - 소스보기 할 id 값.
		 psIframeName - iframe 이름
	*/
	function viewSource(psTargetId, psIframeName) {
		var oWin;

		if (!psIframeName){
			psIframeName = "";
		}
		
		oWin = window.open(sViewSource_src + "?id=" + psTargetId + "&iframeName=" + psIframeName, "_blank");
		oWin.focus();
	}
	this.viewSource = viewSource;

	function th_ajaxComplete() {
		var i1, i2, s1, o1;

		if (oScrollLast_target && !bScrollLast_intervalFinish){
			return;
		}

		if (sState == "fadeBefore_end" && oRequest && oRequest.readyState == 4 && oRequest.status == 200){

			if (aEventFunc["complete1"])	aEventFunc["complete1"]();

			if (oTarget){
				s1 = oRequest.responseText;				
				i1 = s1.search("<!-- __Ajax contents start__ -->");
				i2 = s1.search("<!-- __Ajax contents end__ -->");
				if (bAppend_use === true){
					$(oTarget).append(s1.slice(i1 + 32, i2));
				}else if (bAppend_use === false) {
					//alert("html");
					$(oTarget).html(s1.slice(i1 + 32, i2));
				}
				// resize 하기 위해서 interval 한다.
				oInterval2 = setInterval(han_intervalTime_resize, iInterval2Sec);
			}	

			if (aEventFunc["complete2"])	aEventFunc["complete2"]();

			if (oTarget){
				if (bFadeAfter && oFadeSpeed){
					sState = "fadeAfter_start";
					$(oTarget).css("opacity", 0);
					$(oTarget).fadeTo(oFadeSpeed, 1, han_fadeComplete_after);
					if (!iDelayAfter){
						if (oPanel_use) oPanel_use.hide();
					}
								
				}else if (iDelayAfter){
					sState = "delayAfter_start";
					oInterval1 = setInterval(han_intervalTime_after, iDelayAfter);
					if (oPanel_use) oPanel_use.hide();
				}else{
					sState = "delayAfter_end";
					if (oPanel_use) oPanel_use.hide();
					fo_completeLast();
				}
			}else{
				fo_completeLast();
			}
			
		}
	}

	function th_load(psMethod, psURL, paData, psType) {
		//alert(psURL);

		if (sState)
			return;

		sState = "start";

		if (oPanel_use) {
			oPanel_use.removeEventListener("hide");
			oPanel_use.addEventListener("hide", han_hide_transTopPanel);
			oPanel_use.showLoading();
		}

		if (oTarget){
			if (iDelayBefore){
				oInterval1 = setInterval(han_intervalTime_before, iDelayBefore);
				sState = "delayBefore_start";
			}else if (bFadeBefore && oFadeSpeed){
				$(oTarget).fadeTo(oFadeSpeed, 0, han_fadeComplete_before);
				sState = "fadeBefore_start";
			}else{
				sState = "fadeBefore_end";
			}
		}
			
		if (psMethod == "get")
			oRequest = $.get(psURL, paData, han_ajaxComplete, psType);
		else
			oRequest = $.post(psURL, paData, han_ajaxComplete, psType);


	}

	function th_loadGetPost(psSubmitType, psURL, paData, psType) {
		if(!sState){
			sLastSubmitType = psSubmitType;
			bAppend_use = bAppend;

			ten_clearInterval2();

			if (iSort_table){
				sortHead(iSort_table); // head 부분이 동적으로 변할 수 있으므로, 다시 설정해 줍니다.
			}

			if (oScrollLast_scrollTarget){
				ten_setScrollLast_first();
			}else if (oPage){
				iPage_nowPage = 1;
			}

			psURL = ten_setLoad1(psURL, paData, psType);
			
			// ## 활성화 되지 않은 탭의 리스트일 경우 width가 작아지는 현상이 있어서 hide 하고, 판넬이 사라질때 show 합니다.
			$(oTableTheadColne).hide();
			
			th_load(psSubmitType, psURL, paData, psType);
			
			th_setSortDefault(oSortTarget, iSortNum);

		}
		
	}

	function th_setClickPage(piPage_nowPage) {
		
		bAppend_use = bAppend;

		if(!sState && sLastURL){
			
			oPanel_use = oPanel;
			
			iPage_nowPage = piPage_nowPage;

			if (sLastURL_sort){
				tsURL = ten_setPageURL(sLastURL_sort);
			}else{
				tsURL = ten_setPageURL(sLastURL);
			}
			
			th_load(sLastSubmitType, tsURL, sLastData, sLastType);

		}
	}

	function th_setFixHead() {
		var o1, o2, i1, i2, s1;

		o1 = $(iSort_table).parent()[0]; // 부모 테그를 저장시킵니다.

		$(o1).css("position", "relative"); // position  설정합니다.
		$(o1).scroll(han_scroll_parent); // scroll 이벤트 설정합니다.

		oTableTheadColne = $(iSort_table).clone(true); // 복사합니다.

		$(o1).append(oTableTheadColne); // parent 에 붙입니다.

		$(oTableTheadColne).children("tbody").remove(); // tbody, tfoot 을 지웁니다.
		$(oTableTheadColne).children("tfoot").remove();

		$(oTableTheadColne).css("position", "absolute"); // position을 absolute로 합니다.
		$(oTableTheadColne).css("left", "0"); // 좌표를 설정합니다.
		$(oTableTheadColne).css("top", $(o1).scrollTop()); // 좌표를 설정합니다.

		// == window 이벤트 등록
		$(window).resize(han_resize_window);

		//======== 탭 안에 있다면 이벤트 핸들러를 등록합니다.
		// ## new TabContentsView($(".mTab1"), $(".mTab1_contents")); 이 생성 함수가 코드가 ajax 생성 코드 보다 먼저 와야 합니다..
		a1 = new Array("mTab1", "mTab2", "mTab3");

		for (i1 = 0; i1 < a1.length; i1++){
			in_setTabEvent(a1[i1]);
		}

		function   in_setTabEvent(psTabClass) {
			var o1, o2, i1, i2, s1;

			o1 = $("body").find("." + psTabClass);

			for (i1 = 0; i1 < o1.length; i1++){
				o2 = $(o1[i1]).children("li");

				for (i2 = 0; i2 <o2 .length; i2++){
					s1 = $(o2[i2]).attr("class");

					if (s1 == "on" || s1 == "off" || s1 == "offLast"){
						$(o2[i2]).click(han_click_tab);
					}
				}
			}
		}
		
	}

	function th_setFixHeadDel() {
		var o1;

		if (oTableTheadColne){
			o1 = $(iSort_table).parent()[0]; // 부모 테그를 저장시킵니다.
			
			$(o1).css("position", sTableParentPrevPosition);
			$(o1).unbind("scroll", han_scroll_parent); // 이벤트를 제거합니다.
			
			$(oTableTheadColne).remove(); // 제거합니다.

			oTableTheadColne = null;
		}
	}

	function th_setFixHeadSizeText() {
		//alert("test");
		var o1, o2, o3, o4, i1, i2;

		o1 = $(iSort_table).children("thead").children("tr");
		o2 = $(oTableTheadColne).children("thead").children("tr");

		$(oTableTheadColne).width($(iSort_table).width());

		for (i1 = 0; i1 < o1.length; i1++){
			o3 = $(o1[i1]).children("th");
			o4 = $(o2[i1]).children("th");
			for (i2 = 0; i2 < o3.length; i2++){
				//alert($(o3[i2]).width());
				$(o4[i2]).width($(o3[i2]).width()); // width를 설정합니다.

				if ($(o3[i2]).text() != $(o4[i2]).text()){ // 동적으로 text를 바꾸었다면 text를 설정합니다.
					$(o4[i2]).text($(o3[i2]).text());
				}
			}
		}
	}

	function th_setFixLeftTd() {
		var o1, o2, i1, i2, i3, s1, s2, colspan;
		
		in_delFixLeftTd();

		if (getListCount(oTarget) == 0){ // 리스트가 없으면 return 합니다.
			return;
		}

		o1 = $(iSort_table).parent()[0]; // 부모 테그를 저장시킵니다.

		$(o1).css("position", "relative"); // position  설정합니다.
		$(o1).scroll(in_han_scroll_parentFixLeftTd); // scroll 이벤트 설정합니다.

		oTableFixTd = $(iSort_table).clone(true); // 복사합니다.
		//oTableFixTd_thead = $(iSort_table).clone(true); // 복사합니다.

		$(o1).prepend(oTableFixTd); // parent 의 앞에 붙입니다. (thead가 append 로 했기 때문입니다.)
		//$(o1).append(oTableFixTd_thead); // parent 의 앞에 붙입니다. (thead가 append 로 했기 때문입니다.)

		$(oTableFixTd).children("thead").remove(); // 지웁니다.
		$(oTableFixTd).children("tfoot").remove();

		//$(oTableFixTd_thead).children("tbody").remove(); // 지웁니다.
		//$(oTableFixTd_thead).children("tfoot").remove();

		$(oTableFixTd).css("position", "absolute"); // position을 absolute로 합니다.
		$(oTableFixTd).css("left", $(o1).scrollLeft());

		//$(oTableFixTd_thead).css("position", "absolute"); // position을 absolute로 합니다.
		//$(oTableFixTd_thead).css("top", $(o1).scrollTop());
		//$(oTableFixTd_thead).css("left", $(o1).scrollLeft());
		
		// top 설정입니다.(thead의 tr이 2개 이상일 수 있기 때문에...)
		o1 = $(iSort_table).children("tbody").position();
		/*=== 이전 코드
		o1 = $(iSort_table).children("thead").children("tr");
		for (i1 = 0; i1 < o1.length; i1++){
			//i2 += Number($(o1[i1]).outerHeight());
			o2 = $(o1[i1]).children("th")[0];
			i2 += Number($(o2).outerHeight());
		}*/
		$(oTableFixTd).css("top", o1.top);
		
		//=== oTableFixTd 에서 td를 삭제 ====
		o1 = $(oTableFixTd).children("tbody").children("tr");

		for (i1 = 0; i1 < o1.length; i1++){
			/* 출력 완료 후 width 조정하기 때문에 안됨..
			i2_1 = 0;
			if (iFixLeftTdLen == 1){
				if (i1 % 2 == 0){
					//$(o1[i1]).remove();
					i2_1 = 1;
				}else{
					i2_1 = 0;
				}
			}*/

			o2 = $(o1[i1]).children("td");

			for (i2 = 0; i2 < o2.length; i2++){
				if (i2 < iFixLeftTdLen){
					s1 = $(o2[i2]).css("background-color"); // 
					if (!s1 || s1 == "transparent" || s1 == "rgba(0, 0, 0, 0)"){  // 크롬에서는 'rgba(0, 0, 0, 0) 로 표시됨
						$(o2[i2]).css("background-color", "#ffffff"); // 백그라운드 색을 설정합니다.
					}
				}

				if (i2 >= iFixLeftTdLen){
					$(o2[i2]).remove(); // 안쓰는 td를 삭제합니다.
				}
			}
			
			/*
			for (i2 = 0; i2 < iFixLeftTdLen; i2++){
				s1 = $(o2[i2]).css("background-color"); // 
				if (!s1 || s1 == "transparent"){ 
					$(o2[i2]).css("background-color", "#ffffff"); // 백그라운드 색을 설정합니다.
				}
			}

			for (i2 = iFixLeftTdLen; i2 < o2.length; i2++){
				$(o2[i2]).remove(); // 안쓰는 td를 삭제합니다.
			}*/
		}
		
		//=== oTableFixTd_thead 에서 td를 삭제 ====
		/*
		i3 = iFixLeftTdLen;
		o1 = $(oTableFixTd_thead).children("thead").children("tr");
		colspan = 0;
		for (i1 = 0; i1 < o1.length; i1++){
			o2 = $(o1[i1]).children("th");

			i2 = 0;
			while (i2 < o2.length){
				if (colspan > 0){
					colspan--;
					i3--;
					continue;
				}else{
					// ### 여기에서 무한 루프 문제 발생.. ##
					s1 = $(o2[i2]).attr("colspan");
					if (s1){
						colspan = Number(s1);
						//i2 += Number(s1);
						continue;
					}
				}

				if (i2 >= i3){
					$(o2[i2]).remove();
					
				}
				i2++;
			}
		}*/

		function   in_delFixLeftTd() {
			if (oTableFixTd){
				o1 = $(iSort_table).parent()[0]; // 부모 테그를 저장시킵니다.
				
				$(o1).css("position", sTableParentPrevPosition);
				$(o1).unbind("scroll", in_han_scroll_parentFixLeftTd); // 이벤트를 제거합니다.
				
				$(oTableFixTd).remove();
				//$(oTableFixTd_thead).remove();

				oTableFixTd = null;
				//oTableFixTd_thead = null;
			}
		}

		function   in_han_scroll_parentFixLeftTd() {
			$(oTableFixTd).css("left", $(this).scrollLeft());

			//$(oTableFixTd_thead).css("top", $(this).scrollTop());
			//$(oTableFixTd_thead).css("left", $(this).scrollLeft());
			
		}
	}


	function th_setSortDefault(poTarget, piNum) {
		if (poTarget){
			s3 = $(poTarget).text();
			$(poTarget).text(s3);
			$(poTarget).attr("class", "");
		}
		sSortType[piNum] = "";
	}
	
	function fo_completeLast() {
		var otTarget, itHeight, itWidth;
		var i1, i2, i3, o1, o2, o3, o4, b1;
		
		if (!oPanel_use){
			han_hide_transTopPanel();
		}
		
		if (oScrollLast_scrollTarget){
			fi_completeScrollLast();
		}else if (oPage){
			fi_completePage();
		}
		
		if (aEventFunc["complete3"])	aEventFunc["complete3"]();

		sState = null;
		oRequest = null;
	}

	function fi_completePage() {
		var sValue;
		var o1;
		o1 = $(oTarget).find("._lastTr_");

		iPage_listTotalCount = $(o1).find("._totalListCount_").text();

		$(o1).remove();

		//==== page 설정.	
		//총 페이지 수
		iPage_totalPage = Math.floor(iPage_listTotalCount / iPage_listViewCount);

		if (iPage_listTotalCount % iPage_listViewCount != 0){
			iPage_totalPage++;
		}
		// 현재 페이지 블록. 0부터 시작.
		iPage_blockNow = Math.floor((iPage_nowPage - 1) / iPage_pageNumCount);

		// 페이지 번호 출력
		//alert(iPage_totalPage);
		sValue = "";
		i1 = iPage_blockNow * iPage_pageNumCount + 1;
		while (i1 < (iPage_blockNow + 1) * iPage_pageNumCount + 1 && i1 < iPage_totalPage + 1){
			//alert("b");
			if (i1 == iPage_nowPage){
				s1 = "class=\"on\"";
			}else{
				s1 = "";
			}
			
			sValue += "<span " + s1  +">" + i1 + "</span>";

			i1++;
		}

		$(oPage).children(".pageNum").html(sValue);
		
		$(oPage).children(".pageNum").children("span").click(han_mouseClick_pageNum);

		// === 버튼 설정
		//처음 버튼 설정
		if (iPage_nowPage > 1){
			in_setPageButton("pageFirstButton", "1", true, oPage_pageFirstButton_on.src);
		}else{
			in_setPageButton("pageFirstButton", null, false, oPage_pageFirstButton.src);
		}

		// 이전 버튼 설정
		if (iPage_nowPage > iPage_pageNumCount){
			i1 = iPage_nowPage - iPage_pageNumCount;
			if (i1 < 1){
				i1 = 0;
			}
			in_setPageButton("pagePrevButton", i1, true, oPage_pagePrevButton_on.src);		
		}else{
			in_setPageButton("pagePrevButton", null, false, oPage_pagePrevButton.src);
		}
		
		// 마지막 버튼 설정
		if (iPage_nowPage < iPage_totalPage){
			in_setPageButton("pageLastButton", iPage_totalPage, true, oPage_pageLastButton_on.src);
		}else{
			in_setPageButton("pageLastButton", null, false, oPage_pageLastButton.src);
		}

		//다음 버튼 설정
		if (iPage_blockNow < Math.floor((iPage_totalPage - 1) / iPage_pageNumCount)){
		
			i1 = Number(iPage_nowPage) + Number(iPage_pageNumCount);
			if (i1 > iPage_totalPage){
				i1 = iPage_totalPage;
			}
			in_setPageButton("pageNextButton", i1, true, oPage_pageNextButton_on.src);
		}else{
			in_setPageButton("pageNextButton", null, false, oPage_pageNextButton.src);
		}


		function   in_setPageButton(psClassName, psPageNum, pbOn, psImgSrc) {
			var o1;

			o1 = $(oPage).children("." + psClassName);
			
			$(o1).children("img")[0].src = psImgSrc;

			$(o1).children("img").unbind("click", han_mouseClick_pageButton);

			if (pbOn == true){
				$(o1).removeClass("pageButton");
				$(o1).addClass("pageButtonOn");
				$(o1).attr("page", psPageNum);
				
				$(o1).children("img").click(han_mouseClick_pageButton);
			}else{
				$(o1).removeClass("pageButtonOn");
				$(o1).addClass("pageButton");
			}
		}
	}

	function fi_completeScrollLast() {
		
		if (!sScrollLast_end){
			iScrollLast_page++;
			
			// 로딩 이미지 삭제
			o1 = $(oTarget).find("." + sScrollLast_loadingImgClassName);

			if (o1[0]){
				$(o1[0]).remove();
			}

			o1 = $(oTarget).find("." + sScrollLast_endClassName);
			// 마지막까지 로딩 되었다면.
			if (o1[0]){
				//alert("end");
				iScrollLast_page = 0;
				$(o1[0]).remove();
				$(oScrollLast_scrollTarget).unbind("scroll", han_scroll_scrollTarget);
				sScrollLast_end = true;
			}

		}
	}
	
	/**
	* resize()호출하는 interval을 멈춤.
	*/
	function ten_clearInterval2() {
		if (oInterval2){
			clearInterval(oInterval2);
			oInterval2 = null;
			iInterval2Num = 0;
		}		
	}

	function ten_setLoad1(psURL, paData, psType) {
		var s1;

		sLastURL = psURL;
		sLastData = paData;
		sLastType = psType;
		sLastURL_sort = null;

		oPanel_use = oPanel;

		if (oScrollLast_scrollTarget){
			psURL = ten_setScrollLastURL(psURL);
		}else if (oPage){
			psURL = ten_setPageURL(psURL);
		}
		

		return psURL;
	}
	function ten_setPageURL(psURL) {
		if (psURL.indexOf("?") == -1){
			s1 = "?";
		}else{
			s1 = "&";
		}
		psURL +=  s1 + "page_listViewCount=" + iPage_listViewCount + "&page_nowPage=" + iPage_nowPage;

		return psURL;
		
	}

	function ten_setScrollLast_first() {
		bScrollLast_intervalFinish = true;
		iScrollLast_page = 0;
		sScrollLast_end = false;
		$(oScrollLast_scrollTarget).scroll(han_scroll_scrollTarget);

	}
	function ten_setScrollLastURL(psURL) {
		if (psURL.indexOf("?") == -1){
			s1 = "?";
		}else{
			s1 = "&";
		}
		psURL +=  s1 + "scrollLast_viewLen=" + iScrollLast_viewLen + "&scrollLast_page=" + iScrollLast_page;

		return psURL;
	}

	function han_ajaxComplete() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_ajaxComplete()";
		th_ajaxComplete();
	}

	function han_click_tab() {
		//alert("a");
		th_setFixHeadSizeText();
	}
	
	function han_fadeComplete_after() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_fadeComplete_after()";
		sState = "fadeAfter_end";

		 if (iDelayAfter){
			sState = "delayAfter_start";
			if (oPanel_use) oPanel_use.hide();
			oInterval1 = setInterval(han_intervalTime_after, iDelayAfter);
		}else{
			sState = "delayAfter_end";
			fo_completeLast();
		}
	}

	function han_fadeComplete_before() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_fadeComplete_before()";
		sState = "fadeBefore_end";
		th_ajaxComplete();
	}

	function han_hide_transTopPanel() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_hide_transTopPanel()";
		var otTarget, itHeight, itWidth;
		var i1, i2, i3, o1, o2, o3, o4, b1;

		// ### 톱판넬 때문에 y스크롤이 있다가 없어질 경우가 있어서, 톱판넬이 사라진 후 아래의 코드를 실행 시키게 되었습니다.
		//=== thead 부분의 height 가 처음 보다 높아졌을 경우 table의 width 값을 '50'씩 넓혀져서 height를 원래대로 복원시킵니다.
		if (bAutoWidth){
			otTarget = $(iSort_table).find("thead").find("tr")[0];
			//alert(otTarget);
			itHeight = $(otTarget).height();
			
			// ### '0'으로 되는 경우는, 안보이는 탭 안에 리스트가 있을 경우이라서, while 문이 무한루프 되기 때문에 'if (iTableTheadTrHt != 0 && itHeight != 0){' 를 추가했습니다.
			if (iTableTheadTrHt != 0 && itHeight != 0){

				if (iTableTheadTrHt + 10< itHeight){
					while (iTableTheadTrHt + 10< itHeight){
						itWidth = $(iSort_table).width();
						
						$(iSort_table).width(itWidth + 50);

						itHeight = $(otTarget).height();
					}

					$(iSort_table).width(itWidth + 50);
				}			

			}
		}

		//===  FixHead 설정합니다.
		if (bFixHead){
			// ### 사라진 thead를 보이게 설정합니다.
			$(oTableTheadColne).show();

			o1 = $(iSort_table).children("thead").children("tr");
			o2 = $(oTableTheadColne).children("thead").children("tr");

			if (o1.length != o2.length){ // tr의 갯수가 틀렸으면...
				setFixHeadReset(); // 다시 초기화 합니다.
			}

			for (i1 = 0; i1 < o1.length; i1++){
				o3 = $(o1[i1]).children("th");
				o4 = $(o2[i1]).children("th");

				if (o3.length != o4.length){ // th 갯수가 틀려졌으면.
					setFixHeadReset(); // 다시 초기화 합니다.
				}
			}

			th_setFixHeadSizeText();
		}
		
		//===  FixLeftTd,  oTableFixTd_thead 를 설정 코드입니다. 
		if (bFixLeftTd){
			th_setFixLeftTd();

			//== FixLeftTd 설정입니다.
			o1 = $(iSort_table).children("tbody").children("tr");
			o2 = $(oTableFixTd).children("tbody").children("tr");
			
			i3 = 0;
			b1 = false;

			for (i1 = 0; i1 < o1.length; i1++){
				o3 = $(o1[i1]).children("td");
				o4 = $(o2[i1]).children("td");
				for (i2 = 0; i2 < o4.length; i2++){
					$(o4[i2]).width($(o3[i2]).width()); // width 설정합니다.
					//$(o4[i2]).height($(o3[i2]).height()); // height 설정합니다.
					if (!b1){
						if (i2 == 0){
							i3 += Number($(o3[i2]).css("border-left-width").replace(/px/g, "")); // TableFixTd table의 총 width를 저장합니다.
						}
						i3 += Number($(o3[i2]).width());
						i3 += Number($(o3[i2]).css("padding-left").replace(/px/g, ""));
						i3 += Number($(o3[i2]).css("padding-right").replace(/px/g, ""));
						i3 += Number($(o3[i2]).css("padding-right").replace(/px/g, ""));
						i3 += Number($(o3[i2]).css("border-right-width").replace(/px/g, ""));
					}
				}

				b1 = true;
			}
			
			// table의 총넓이를 설정합니다.
			$(oTableFixTd).width(i3);

			//== oTableFixTd_thead 설정입니다.
			/*o1 = $(iSort_table).children("thead").children("tr");
			o2 = $(oTableFixTd_thead).children("thead").children("tr");
			
			i3 = 0;
			b1 = false;

			for (i1 = 0; i1 < o1.length; i1++){
				o3 = $(o1[i1]).children("th");
				o4 = $(o2[i1]).children("th");
				for (i2 = 0; i2 < o4.length; i2++){
					$(o4[i2]).width($(o3[i2]).width()); // width 설정합니다.
					if (!b1){
						if (i2 == 0){
							i3 += Number($(o3[i2]).css("border-left-width").replace(/px/g, "")); // TableFixTd table의 총 width를 저장합니다.
						}
						i3 += Number($(o3[i2]).width());
						i3 += Number($(o3[i2]).css("padding-left").replace(/px/g, ""));
						i3 += Number($(o3[i2]).css("padding-right").replace(/px/g, ""));
						i3 += Number($(o3[i2]).css("padding-right").replace(/px/g, ""));
						i3 += Number($(o3[i2]).css("border-right-width").replace(/px/g, ""));
					}
				}

				b1 = true;
			}
			
			// table의 총넓이를 설정합니다.
			$(oTableFixTd_thead).width(i3);*/
		}
	}

	function han_intervalTime_resize() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_intervalTime_resize()";
		if (oPanel_use){
			oPanel_use.resize();
		}
		iInterval2Num++;
		//alert("a");

		if (iInterval2Num >= iInterval2Max){
			ten_clearInterval2();
		}
	}

	function han_intervalTime_after() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_intervalTime_after()";
		sState = "delayAfter_end";
		clearInterval(oInterval1);
		fo_completeLast();
	}

	function han_intervalTime_before() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_intervalTime_before()";
		sState = "delayBefore_end";
		clearInterval(oInterval1);

		if (bFadeBefore && oFadeSpeed){
			sState = "fadeBefore_start";
			$(oTarget).fadeTo(oFadeSpeed, 0, han_fadeComplete_before);
		}else{
			sState = "fadeBefore_end";
			th_ajaxComplete();
		}
	}

	function han_intervalTime_scrollLastLoading() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_intervalTime_scrollLastLoading()";
		bScrollLast_intervalFinish = true;
		clearInterval(oScrollLast_intervalId);
		th_ajaxComplete();
	}

	function han_mouseClick_headTh() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_mouseClick_headTh()";
		var s1, s2, o1, i1;
		bAppend_use = bAppend;

		i1 = $(this).attr("value");

		if(!sState && sLastURL){
			
			if (iSort_table){
				sortHead(iSort_table); // head 부분이 동적으로 변할 수 있으므로, 다시 설정해 줍니다.
			}

			if (oSortTarget != this){
				oSortTarget_prev = oSortTarget;
				oSortTarget = this;

				iSortNum_prev = iSortNum;
				iSortNum = i1;
			}

			if (sLastURL.indexOf("?") == -1){
				s1 = "?";
			}else{
				s1 = "&";
			}
			
			if (!sSortType[iSortNum] || sSortType[iSortNum] == "desc"){
				sSortType[iSortNum] = "asc";
				if (sSortAscImgSrc){
					s2 = sSortAscImgSrc;
				}
			}else{
				sSortType[iSortNum] = "desc";
				if (sSortDescImgSrc){
					s2 = sSortDescImgSrc;
				}
			}

			if (s2){
				$(oSortTarget).children("img").remove();

				s3 = $(oSortTarget).html();

				$(oSortTarget).html(s3 + "<img src=\"" + s2 + "\">");

			}

			$(oSortTarget).attr("class", "on");

			th_setSortDefault(oSortTarget_prev, iSortNum_prev);

			oPanel_use = oPanel;

			sLastURL_sort = sLastURL + s1 + "sortNum=" + i1 + "&sortType=" + sSortType[i1];
			
			s1 = sLastURL_sort;

			if (oScrollLast_scrollTarget){
				ten_setScrollLast_first();
				s1 = ten_setScrollLastURL(sLastURL_sort);
			}else if (oPage){
				iPage_nowPage = 1;
				s1 = ten_setPageURL(sLastURL_sort);
			}

			//alert(s1);
			
			th_load(sLastSubmitType, s1, sLastData, sLastType);
		}

	}

	function han_mouseClick_pageButton() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_mouseClick_pageButton()";
		i1 = $(this).parent().attr("page");

		th_setClickPage(i1);
	}

	function han_mouseClick_pageNum() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_mouseClick_pageNum()";
		th_setClickPage($.trim($(this).text()));
	}

	function han_resize_window() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_resize_window()";
		if (oTableTheadColne){
			th_setFixHeadSizeText();
		}
	}

	function han_scroll_scrollTarget() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_scroll_scrollTarget()";
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		
		if (this == window){
			i1 = $(this).scrollTop();
			i2 = $(this).height();
			i3 = $(document).height();
		}else{
			i1 = this.scrollTop;
			i2 = this.clientHeight;
			i3 = this.scrollHeight;
		}
		//alert($(this).scrollTop());
		//alert($(this).height());
		//alert($(document).height());

		//if (!sState && !sScrollLast_end && this.scrollTop >= this.scrollHeight - this.clientHeight){
		if (!sState && !sScrollLast_end && i1 >= i3- i2){
			bAppend_use = true;

			if (sLastURL_sort){
				s3 = sLastURL_sort;
			}else{
				s3 = sLastURL;
			}

			if (iScrollLast_tableColspan){
				s2 = " colspan=\"" + iScrollLast_tableColspan + "\" ";
			}

			$(oTarget).append("<tr class = \"" + sScrollLast_loadingImgClassName + "\"><td " + s2 + " height = \"" + iScrollLast_loadingheight + "\"><img src = \"" + sScrollLast_loadingImgSrc + "\" ></td></tr>");
			
			o1 = $(oTarget).find("." + sScrollLast_loadingImgClassName).children("td");
			//$(o1).css("height", iScrollLast_loadingheight);

			o1 = $(o1).children("img");
			$(o1).css("width", oScrollLast_loadingImg.width);
			$(o1).css("display", "block");
			$(o1).css("margin", "0px auto");
			
			oPanel_use = null;

			/*
			if (!oScrollLast_transTopPanel){
				oScrollLast_transTopPanel = new TransTopPanel2("#ffffff", 0, false, o1, sScrollLast_loadingImgSrc);
			}
			oScrollLast_transTopPanel.showLoading();

			oPanel_use = oScrollLast_transTopPanel;
			*/

			s1 = s3;

			if (oScrollLast_scrollTarget){
				s1 = ten_setScrollLastURL(s3);
			}

			oScrollLast_intervalId = setInterval(han_intervalTime_scrollLastLoading, iScrollLast_intervalSec);
			bScrollLast_intervalFinish = false;

			th_load(sLastSubmitType, s1, sLastData, sLastType);	
		}
	}

	function han_scroll_parent() {
		//document.getElementsByName("textarea1")[0].value = document.getElementsByName("textarea1")[0].value + "\n" + "han_scroll_parent()";
		$(oTableTheadColne).css("top", $(this).scrollTop());
	}
	
	main();
}