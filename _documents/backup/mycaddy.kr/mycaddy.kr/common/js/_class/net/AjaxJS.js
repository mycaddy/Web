/**
* <설명>
	- (적용안함. target 에 하면 에러 발생하는것 같다.)
		target 객체는 꼭 있어야 한다. ajax 이벤트를 이곳에 등록하기 때문이다.
	- delay, fade 순서 : delayBefore -> fadeBefor-> fadeAfter -> delayAfter.
	- 로드 될 문서 시작 문자열은 '<!-- __Ajax contents start__ -->', 이고 끝 문자열은 '<!-- __Ajax contents end__ -->' 이다.
	- 타겟 객체에 문자열을 넣고, 판넬의 resize()를 하면 크기가 정확히 안되므로, interval로 2초 정도 계속 resize()를 호출한다.

*/
function AjaxJS(poTarget, pbAppend, poPanel, pbFadeBefore, pbFadeAfter, poFadeSpeed, piDelayBefore, piDelayAfter) {
	var oTarget = poTarget; // 로드 후 문자열을 넣을 객체
	var bAppend = pbAppend; // oTarget에 append()를 할 것인지 여부, true이면 append()로, false 면 html()로 새로이 넣고, null 이면 쓰지 않는다.
	var oPanel = poPanel;  // transTopPanel 객체 
	var bFadeBefore = pbFadeBefore; // 로드 전 객체에 fade 할 것인지 여부
	var bFadeAfter = pbFadeAfter;  // 로드 후 객체에 fade 할 것인지 여부
	var oFadeSpeed = poFadeSpeed;
	var iDelayBefore = piDelayBefore; // 로드 전 딜레이 밀리초.
	var iDelayAfter = piDelayAfter; // 로드 후 딜레이 밀리초.

	var sViewSource_src = "/common/php/com_page/ajaxJS/SourceView.php";  // ajax 소스 보여주는 페이지.

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

	var iReadLine_idx = 0; //getLine() 함수로 읽을 때 쓰이는 몇번째 라인인지
	var bReadLine_finish = false; // getLine() 함수로 모두 읽었다면 true.

	var bResultTextSlice = true; // <!-- __Ajax contents start__ --> 부분으로 자를지 여부

	function main() {
		
		jQuery.support.cors = true; // ajax 사용시 사용

		$(poTarget).ajaxError(han_ajax_error);
		/*$(poTarget).ajaxComplete(han_ajax_complete);
		$(poTarget).ajaxError(han_ajax_error);
		$(poTarget).ajaxSend(han_ajax_send);
		$(poTarget).ajaxStart(han_ajax_start);
		$(poTarget).ajaxStop(han_ajax_stop);
		$(poTarget).ajaxSuccess(han_ajax_success);*/
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
		oPanel = poTransTopPanel;
	}
	this.addTransTopPanel = addTransTopPanel;
	
	/**
	* 라인 한줄씩 리턴 한다.
		예)
		s1 = oAjaxJS.getLine(); // s1의 값이 없을 수 있기 때문에 'null' 로 채크한다.
		while (s1 !== null){

			alert(":" + $.trim(s1) + ":");
			
			s1 = oAjaxJS.getLine();
		}
	*  Pa:
	*  Re:
	*/
	function getLine() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		var sValue;

		if (bReadLine_finish){
			return null;
		}

		s1 = getText();
		//alert(s1);
		sValue = "";

		for (i1 = iReadLine_idx; i1 < s1.length; i1++){
			//alert(s1[i1] + s1[i1 + 1]);
			i2 = s1[i1].charCodeAt();
			if (s1[i1 + 1]){
				i3 = s1[i1 + 1].charCodeAt();
			}else{
				i3 = "";
			}

			if (i2 == 13 && i3 == 10){
				//alert("a1");
				sValue = s1.substring(iReadLine_idx, i1);
				iReadLine_idx = i1 + 2;
				return sValue;

			}else if (i2 == 13){
				//alert("a2");
				sValue = s1.substring(iReadLine_idx, i1);
				iReadLine_idx = i1 + 1;
				return sValue;
			}else if (i2 == 10){
				//alert("a3");
				sValue = s1.substring(iReadLine_idx, i1);
				iReadLine_idx = i1 + 1;
				//alert(sValue);
				return sValue;
			}
		}
		
		iReadLine_idx = 0;
		bReadLine_finish = true;

		return null;

	}
	this.getLine = getLine;

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
	* <!-- __Ajax contents start__ --> 와 <!-- __Ajax contents end__ --> 사이에 있는 text를 리턴.
	*  Pa:
	*  Re:
	*/
	function getText() {
		var i1, i2, s1;

		s1 = oRequest.responseText;		
		
		if (bResultTextSlice){
			i1 = s1.indexOf("<!-- __Ajax contents start__ -->"); // 제일 처음에 나오는 것
			i2 = s1.lastIndexOf("<!-- __Ajax contents end__ -->"); // 제일 마지막에 나오는 것

			s1 = s1.slice(i1 + 32, i2)
		}

		
		return s1;
	}
	this.getText = getText;

	/**
	*  Pa: psType - (xml, json, script, or html)
	*  Re:
	*/
	function loadGet(psURL, paData, psType) {
		th_load("get", psURL, paData, psType);
	}
	this.loadGet = loadGet;

	/**
	*  Pa: psType - (xml, json, script, or html)
	*  Re:
	*/
	function loadPost(psURL, paData, psType) {
		//alert(psURL);
		th_load("post", psURL, paData, psType);
	}
	this.loadPost = loadPost;

	function removeEventListener() {
		aEventFunc[psEventType] = null;
	}
	this.removeEventListener = removeEventListener;

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
	* <!-- __Ajax contents start__ -->' 부분을 잘라서 읽을지 여부. false 이면 자르지 않는다.
	*  Pa: pbValue - true, false
	*  Re:
	*/
	function setResultTextSlice(pbValue) {
		bResultTextSlice = pbValue;
	}
	this.setResultTextSlice = setResultTextSlice;

	function setTarget(poTarget) {
		oTarget = poTarget;
	}
	this.setTarget = setTarget;
	
	/**
	* 로드를 중지한다.
	*/
	function stopLoad() {
		if (oRequest){
			oRequest.abort();
		}
	}
	this.stopLoad = stopLoad;

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

	function th_ajax_success() {
		var i1, i2, s1;


		if (sState == "fadeBefore_end" && oRequest && oRequest.readyState == 4 && oRequest.status == 200){
			if (aEventFunc["complete1"])	aEventFunc["complete1"]();
			
			/*
			s1 = oRequest.responseText;		
			i1 = s1.indexOf("<!-- __Ajax contents start__ -->"); // 제일 처음에 나오는 것
			i2 = s1.lastIndexOf("<!-- __Ajax contents end__ -->"); // 제일 마지막에 나오는 것

			alert(s1.slice(i1 + 32, i2));
			*/

			if (oTarget){
				s1 = oRequest.responseText;				
				i1 = s1.indexOf("<!-- __Ajax contents start__ -->"); // 제일 처음에 나오는 것
				i2 = s1.lastIndexOf("<!-- __Ajax contents end__ -->"); // 제일 마지막에 나오는 것

				if (bResultTextSlice){
					s1 = s1.slice(i1 + 32, i2);
				}

				if (bAppend === true){
					$(oTarget).append(s1);
				}else if (bAppend === false) {
					$(oTarget).html(s1);
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
					if (!iDelayAfter)
						if (oPanel) oPanel.hide();
								
				}else if (iDelayAfter){
					sState = "delayAfter_start";
					oInterval1 = setInterval(han_intervalTime_after, iDelayAfter);
					if (oPanel) oPanel.hide();
				}else{
					sState = "delayAfter_end";
					if (oPanel) oPanel.hide();
					fo_completeLast();
				}
			}else{
				fo_completeLast();
			}
		}
	}

	function th_load(psMethod, psURL, paData, psType) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		// [14.04.14] 수정
		/*if (sState){
			return;
		}*/

		sState = "start";

		if (oPanel) oPanel.show();

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
		}else{
			// ## 14.03.09 추가
			sState = "fadeBefore_end";
		}
			
		if (!psType){
			psType = "html";
		}

		oRequest = $.ajax({
			cache:false, //ie에서 캐시를 잡고 있어서 요청이 잘 안되는경우가 있어서 사용.
			type: psMethod,
			url: psURL,
			data: paData,
			dataType: psType,
			success : han_ajax_success
		});


		/*
		jQuery(function() {
		oRequest = $.ajax({
			crossDomain : true,
			cache:false, //ie에서 캐시를 잡고 있어서 요청이 잘 안되는경우가 있어서 사용.
			type: psMethod,
			url: psURL,
			data: paData,
			success : han_ajax_success
		    });
		});
		*/
		/*
		if (psMethod == "get")
			oRequest = $.get(psURL, paData, han_ajax_success, psType);
		else
			oRequest = $.post(psURL, paData, han_ajax_success, psType);
		*/

	}
	
	function fo_completeLast() {
		
		sState = null;
		//oRequest = null;
		iReadLine_idx = 0;
		bReadLine_finish = false;

		if (aEventFunc["complete3"])	aEventFunc["complete3"]();

	}

	function han_ajax_success() {
		//alert("han_ajax_success");
		th_ajax_success();
	}

	function han_ajax_complete() {
		//alert("han_ajax_complete");
	}

	function han_ajax_error() {
		//alert("han_ajax_error");
	}
	function han_ajax_stop() {
		//alert("han_ajax_stop");
	}
	function han_ajax_send() {
		//alert("han_ajax_send");
	}
	function han_ajax_start() {
		//alert("han_ajax_start");
	}

	function han_intervalTime_resize() {
		if (oPanel){
			oPanel.resize();
		}
		iInterval2Num++;

		if (iInterval2Num >= iInterval2Max){
			clearInterval(oInterval2);
			iInterval2Num = 0;
		}
	}

	function han_intervalTime_after() {
		sState = "delayAfter_end";
		clearInterval(oInterval1);
		fo_completeLast();
	}

	function han_intervalTime_before() {
		sState = "delayBefore_end";
		clearInterval(oInterval1);

		if (bFadeBefore && oFadeSpeed){
			sState = "fadeBefore_start";
			$(oTarget).fadeTo(oFadeSpeed, 0, han_fadeComplete_before);
		}else{
			sState = "fadeBefore_end";
			th_ajax_success();
		}
	}

	function han_fadeComplete_after() {
		sState = "fadeAfter_end";
		 if (iDelayAfter){
			sState = "delayAfter_start";
			if (oPanel) oPanel.hide();
			oInterval1 = setInterval(han_intervalTime_after, iDelayAfter);
		}else{
			sState = "delayAfter_end";
			fo_completeLast();
		}
	}

	function han_fadeComplete_before() {
		sState = "fadeBefore_end";
		th_ajax_success();
	}

	main();
}