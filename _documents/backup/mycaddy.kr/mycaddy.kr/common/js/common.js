/**
* iframe을 생성합니다.
*/
function cIframe_hidden_make() {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;	
	
	$("#HiddenFrame").remove();

	s1 = "<iframe name=\"HiddenFrame\" id=\"HiddenFrame\" width=\"0\" height=\"0\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"0\"></iframe>";
	//s1 = "<iframe name=\"ComFrame\" id=\"ComFrame\" width=\"100\" height=\"100\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"1\"></iframe>";
	$("body").append(s1);
}

/**
* iframe을 삭제합니다.
*/
function cIframe_hidden_remove() {
	$("#HiddenFrame").remove();
}


/**
* 천단위로 콤마를 넣는 함수입니다.
   [13.11.01 수정] commaHide 인자값을 추가했습니다.
   [13.09.16 수정] decPointLen 를 0으로 하면 소숫점이 있을 때 소숫점을 출력 하지 않도록 수정했습니다.
   소숫점, ',(쉼표)', '-', '+' 도 되도록 설정했습니다.
*  Pa: decPointLen - 소숫점 몇자리까지 나오게 할것인지 설정하는 변수입니다
	 decPointUpType - 소숫점을 올림을 어떤 형태로 할 것인지 여부를 나타내는 변수입니다
				  - 'ceil' : 소숫점이 있다면 1을 추가합니다.
				  - 'round' : 소숫점을 반올림 합니다.
	commaHide - true이면 콤마를 지웁니다.
*	예)	cAddComma("12345"); // 12,345 리턴
		cAddComma("12345.678"); // 12,345.678 리턴
		cAddComma("12345.12", 0, "ceil"); // 12346 리턴
		cAddComma("12345.12", 0, "round"); // 12345 리턴
		cAddComma("12345.678", 1); // 12,345.6 리턴
		cAddComma("12345.612", 1, "ceil"); // 12,345.7 리턴
		cAddComma("12345.655", 2, "round"); // 12,345.66 리턴
		cAddComma("12345.655", 2, "round"); // 12,345.66 리턴
		cAddComma("12345.655", 2, "round", true); // 12345.66 리턴
		cAddComma("12345.655", 1, "", true); // 12345.6 리턴
*/
function cAddComma(str, decPointLen, decPointUpType, commaHide) {
	var i, j, i1, i2, i3, s1, s2, s3;
	var decPoint; // 소숫점 저장 변수
	var bDecPoint; // 소숫점이 있다면 true
	var bMinus = false; // + 기호가 있다면 true.
	var bPlus = false; // - 기호가 있다면 true.

	var str=String(str); //우선 스트림으로 바꾸고
	str = str.replace(/,/g, ""); //, 없애기

	if (str.indexOf("+") >= 0){
		str = str.replace(/\+/g, "");
		bPlus = true;
	}

	if (str.indexOf("-") >= 0){
		str = str.replace(/\-/g, "");
		bMinus = true;
	}

	// 소숫점 설정.
	i1 = str.lastIndexOf(".");

	if (i1 > -1){
		decPoint = str.slice(i1 + 1, str.length);
		str = str.slice(0, i1);
		str = str.replace(/\./g, "");
		bDecPoint = true;
		//alert(str + "." + decPoint);
	}
	// decPointUpType 설정
	if (bDecPoint && decPointLen >= 0 && decPointUpType){
		if (decPointLen == 0){
			s1 = str.slice(0, str.length - 1); // 처음
			s2 = str.slice(str.length - 1, str.length); // 끝

			if (decPointUpType == "ceil"){
				if (Number(s2) > 0){
					str = String(s1) + String(Number(s2) + 1);
				}
			}else if (decPointUpType == "round"){
				if (Number(s2) >= 5){					
					str = String(s1) + String(Number(s2) + 1);
				}
			}
		}else{
			s1 = decPoint.slice(0, decPointLen - 1); // 처음
			s2 = decPoint.slice(decPointLen - 1, decPointLen); // 소숫점
			s3 = decPoint.slice(decPointLen, decPointLen + 1); // 다음

			if (s3 !== ""){ // 다음 소숫점이 있다면.
				if (decPointUpType == "ceil"){
					if (Number(s3) > 0){
						decPoint = String(s1) + String(Number(s2) + 1) + String(s3);
					}
				}else if (decPointUpType == "round"){
					if (Number(s3) >= 5){					
						decPoint = String(s1) + String(Number(s2) + 1) + String(s3);
					}
				}
			}
		}
		
	}

	var result="";
	var len=str.length;

	if(len>3){ //세자리 이상일떄만
		for(i=len-1,j=0; i>=0; i--){
			result = str.substring(i, i+1) + result; //끝자리 부터 하나씩 합치다가
			j++;

			if(j==3 && j!=0 && i !=0 ){ //세자리 되면 콤마 추가
				result ="," + result;
				j = 0;
			}
		}
	}else{
		result = str;
	}
	
	// 소숫점 설정.
	if (decPointLen >= 0){
		if (bDecPoint){
			s1 = decPoint.slice(0, decPointLen);

			for (i1 = s1.length; i1 < decPointLen; i1++){
				s1 += String("0");
			}
			if (decPointLen == 0){
				result += String(s1);
			}else{
				result += "." + String(s1);
			}
		}else{
			s1 = "";

			for (i1 = 0; i1 < decPointLen; i1++){
				s1 += String("0");
			}
			if (decPointLen == 0){
				result += String(s1);
			}else{
				result += "." + String(s1);
			}
		}
		
	}else{
		if (bDecPoint){
			result = result + "." + decPoint;
		}
	}

	if (bPlus){
		result = "+" + result;
	}

	if (bMinus){
		result = "-" + result;
	}

	if (commaHide == true){
		result = result.replace(/,/g, "");
	}

	return result;

 }

/**
* alert 과 같은 window 생성
*  Pa: psText - 문자열
	poCloseCallBackFunc - 버튼, close 이미지 클릭시 callback 함수
*  Re:
*/
function cAlertWindow(psText, poCloseCallBackFunc) {
	var oAlertWindow = new AlertWindow(psText, poCloseCallBackFunc);
	oAlertWindow.show();
}

function cAlertWindowPanel(psText, poCloseCallBackFunc) {
	var oTopPanel = new TransTopPanel2("#ffffff", "0.7", false, window, "", false, true, true, "fast");
	var oAlertWindow = new AlertWindow(psText, in_han_close_alertWindow);

	oTopPanel.show();
	oAlertWindow.show();

	function   in_han_close_alertWindow() {
		oTopPanel.hide();

		if (poCloseCallBackFunc){
			poCloseCallBackFunc();
		}
	}
}

/**
* input에 값을 입력후 엔터나, blur 될때 text로 바꾸는 함수.
*  Pa: poInput - input 객체나 input 객체를 담은 array 변수도 가능하다.
	psAlertStr - input 값이 없을 때 보여질 alert 창의 문자열.
*/
function cChangeTextAfterInput(poInput, psAlertStr) {
	$(poInput).keydown(in_han_keydown_input);
	$(poInput).blur(in_han_blur_input);

	$(poInput).select();
	$(poInput).focus();


	function   in_han_blur_input() {
		in_changeToText();
	}

	function   in_han_keydown_input(poEvent) {
		if (poEvent.keyCode == 13){ // 엔터
			in_changeToText();
		}
	}

	function   in_changeToText(poThis) {
		if (poInput.value == ""){
			alert(psAlertStr);
			poInput.focus();
			return;
		}
		$(poInput).replaceWith(poInput.value);
	}
}

/**
* 전체선택, 전체해제 버튼 클릭시 실행되는 함수입니다.

<div class="mImgButton70_2" onclick="cCheckBox_All(true)" >전체선택</div>
<div class="mImgButton70_2" onclick="cCheckBox_All(false)" >전체해제</div>

<TR .... ondblclick=\"cCheckBox_once(this)\">
<input type=\"checkbox\" class=\"__checkBox_view__\" name=\"ApplyChk[]\"  style=\"vertical-align:middle\">

*/
function cCheckBox_All(pbSelect) {
	var i1;
	
	// 이름이 'checkbox[]' 인것을 찾아서 저장합니다.
	//var aCheckBox = document.getElementsByName("checkbox_view[]");
	var aCheckBox = $(document).find(".__checkBox_view__");

	for (i1 = 0; i1 < aCheckBox.length; i1++){
		// 전체선택이면 check 합니다.
		if (pbSelect){
			aCheckBox[i1].checked = true;
		// 전체해제이면 check를 안합니다.
		}else{
			aCheckBox[i1].checked = false;
		}
	}
}


/**
* 체크 박스 있는 리스트를 더블클릭 했을 때 호출되는 함수입니다.
*/
function cCheckBox_once(poTarget) {
	var o1;
	// 더블클릭한 객체의 자식들 중 class 명이 '__checkBox_view__' 인것을 찾습니다.
	o1 = $(poTarget).find(".__checkBox_view__")[0];
	
	//그 자식 객체가 check 되 있다면 uncheck 으로, uncheck 되 있다면 check 로 설정.
	if (o1.checked == false){
		o1.checked = true;
	}else{
		o1.checked = false;
	}
}


/**
* 여러개의 checkbox 중(한개여도 괜찮음)에서 'psValue' 의 값을 가지 checkbox 를 checked 하는 함수입니다.
*  Pa:paCheckbox - checkbox 객체들입니다. 
	psValue - 선택하고자 하는 값입니다.
*  Re:
	예) cCheckedCheckboxByValue(document.getElementsByName("possible_school_year[]"), "학교");
	cCheckedCheckboxByValue(oForm.checkbox1, "학교");
*/
function cCheckedCheckboxByValue(paCheckbox, psValue) {
	var i1;
	//alert(paCheckbox.length);
	if (paCheckbox.length){
		for (i1 = 0; i1 < paCheckbox.length; i1++){
			if (paCheckbox[i1].value == psValue){
				paCheckbox[i1].checked = true;
			}
		}
	}else{
		if (paCheckbox.value == psValue){
			paCheckbox.checked = true;
		}
	}
}

/**
* 인자값 중에 한글이 있다면 true 반환, 없다면 false
*  Pa: psText - 계산할 문자열.
*/
function cCheckStringHangul(psText) {
	var i1, s1, iLen;

	psText = String(psText);

	for (i1 = 0; i1 < psText.length; i1++){
		s1 = psText[i1].charCodeAt();
		if (s1 >= 0x0080 && s1 <= 0xFFFF){
			return true;
		}
	}

	return false;	
}

/**
* form 테그의 모든 input, textarea 은 값을 지우고, checkbox, radio 는 체크를 해제하며, select는 선택을 제일 위에 것으로 선택하는 함수입니다. 
  paNoClearForms 인자값에 해당하는 name 들은 지우지 않습니다.
*  Pa: poForm - 지울 form 객체
	 paNoClearForms - 지우지 않을 name 값들입니다. array 변수여야 합니다. 
  예) 
  cClearForm(oForm); // oForm 의 모든 것들을 지우는 코드입니다.
  cClearForm(oForm, ["입력사원", "사업장주소"]); // oForm 폼에서 "입력사원", "사업장주소" 를 제외하고, 모두 지웁니다.
*/
function cClearForm(poForm, paNoClearForms) {
	var aContents;
	var bFind, i1, i2;

	aContents = $(poForm).find("input, select, textarea");

	for (i1 = 0; i1 < aContents.length; i1++){
		bFind = false;
		
		if (paNoClearForms){
			for (i2 = 0; i2 < paNoClearForms.length; i2++){
				// name이 같다면 넘어 갑니다.
				if ($(aContents[i1]).attr("name") == paNoClearForms[i2]){
					bFind = true;
					break;
				}
			}				
		}

		if (!bFind){
			if ($(aContents[i1]).is("input")){
				// radio, checkbox의 체크를 해제합니다.
				if ($(aContents[i1]).is("input[type='radio']") || $(aContents[i1]).is("input[type='checkbox']")){
					aContents[i1].checked = false;
				}else{
					aContents[i1].value = "";
				}
			}else if ($(aContents[i1]).is("select")){ // 제일 위에 것으로 선택합니다.
				aContents[i1][0].selected = true;
			}else if ($(aContents[i1]).is("textarea")){
				aContents[i1].value = "";
			}
		}
	}
}
/**
* 리스트(table의 tbody 부분)의 행(tr)을 클릭(선택)하는 함수입니다. 
*  Pa: poList - table의 tbody 객체입니다.
	 piRowNum - 행 번호 입니다. 0부터 시작합니다.
	
	예) cClickListTr(document.getElementById("result"), 1); // id가 'result'인 부분의 2번째 행을 선택하는 코드입니다.
*/
function cClickListTr(poList, piRowNum) {
	var tr = $(poList).children("tr");

	if (tr[piRowNum]){
		$(tr[piRowNum]).click();
	}
}

/**
* 클립모드에 복사하기
*  Pa: psText - 복사할 문자열.
*/
function cClipboard_copy(psText) {
	window.clipboardData.setData("Text", psText);
}

/**
* 
* 'rgb(255, 0, 0, 0)' 와 같은 값에서 4번째요소(알파값)를 반환한다. 4번째 요소가 없으면 null를 리턴한다.
*/
function cColor_rgbTotal_getAlpha(psRgbTotal) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	psRgbTotal = psRgbTotal.replace("rgb(", "");
	psRgbTotal = psRgbTotal.replace("rgba(", "");
	psRgbTotal = psRgbTotal.replace(")", "");
	psRgbTotal = psRgbTotal.replace(" ", "");

	a1 = psRgbTotal.split(",");

	if (a1.length == 4){
		return Number(a1[3]);
	}

	return null;
	
}
/**
* 'rgb(255, 0, 0,)' 와 같은 값을 '111111' 로 리턴한다.
*/
function cColor_rgbTotalToHex(psRgbTotal) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
	var sR, sG, sB;

	psRgbTotal = psRgbTotal.replace("rgb(", "");
	psRgbTotal = psRgbTotal.replace("rgba(", "");
	psRgbTotal = psRgbTotal.replace(")", "");
	psRgbTotal = psRgbTotal.replace(" ", "");

	a1 = psRgbTotal.split(",");

	return in_toHex(a1[0]) + in_toHex(a1[1]) + in_toHex(a1[2]);


	function    in_toHex(n) {
		 n = parseInt(n,10);
		 if (isNaN(n)) return "00";
		 n = Math.max(0,Math.min(n,255));
		 return "0123456789ABCDEF".charAt((n-n%16)/16)
		      + "0123456789ABCDEF".charAt(n%16);
	}	
		
	
}
/**
*confirm 과 같은 window 생성
*  Pa: psText - 문자열
	poCloseCallBackFunc - 버튼, close 이미지 클릭시 callback 함수(true, false 리턴)
*  Re:
*/
function cConfirmWindow(psText, poCloseCallBackFunc) {
	var oConfirmWindow = new ConfirmWindow(psText, poCloseCallBackFunc);
	oConfirmWindow.show();
}

function cConfirmWindowPanel(psText, poCloseCallBackFunc) {
	var oTopPanel = new TransTopPanel2("#ffffff", "0.7", false, window, "", false, true, true, "fast");
	var oConfirmWindow = new ConfirmWindow(psText, in_han_close_confirmWindow);

	oTopPanel.show();
	oConfirmWindow.show();

	function   in_han_close_confirmWindow(pbValue) {
		oTopPanel.hide();

		if (poCloseCallBackFunc){
			poCloseCallBackFunc(pbValue);
		}
	}
}

/**
* 현재 날짜를 '년/월/일' 리턴
*/
function cDateSlide() {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	o1 = new Date();
	
	s1 = o1.getFullYear() + "/";
	s1 += cMakeFrontZero(o1.getMonth() + 1, 2) + "/";
	s1 += cMakeFrontZero(o1.getDate(), 2);

	return s1;
	
}

/**
* 날짜에 piAddNum를 더해서 날짜 리턴
*  Pa: psType - day, month, year
	psDate - "2014/01/02"
	piAddNum - -1, 3 등
*  Re: 날짜 '년/월/일' 리턴
*/
function cDate_add_date(psType, psDate, piAddNum) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = psDate.split("/");
	
	o1 = new Date(Number(a1[0]), Number(a1[1]) - 1, Number(a1[2]));

	if (psType == "day"){
		o1.setDate(o1.getDate() + piAddNum);
	}else if (psType == "month"){
		o1.setMonth(o1.getMonth() + piAddNum);
	}else if (psType == "year"){
		o1.setFullYear(o1.getFullYear() + piAddNum);
	}

	
	s1 = o1.getFullYear() + "/";
	s1 += cMakeFrontZero(o1.getMonth() + 1, 2) + "/";
	s1 += cMakeFrontZero(o1.getDate(), 2);

	return s1;
	
}
/**
* array 배열 변수의 요소를 삭제하는 함수입니다.
   그래서, 배열의 length 가 줄어듭니다.
   (요소를 추가 할때는 'cInsertArray()' 함수 사용)
*  Pa: paArray - 삭제할 array 변수입니다.
	 piIndex - 삭제할 요소의 index 번호 입니다. 0부터 시작합니다.
*	
	예) var a1 = new Array(1, 2, 3, 4);
	    cDelArray(a1, 1); // a1 변수는 '1, 3, 4'를 가지게 됩니다.
*/
function cDelArray(paArray, piIndex) {
	var i1;

	if (piIndex > paArray.length - 1){
		return;
	}
	
	// 다음 요소를 앞으로 이동합니다.
	for (i1 = piIndex + 1; i1 < paArray.length; i1++){
		paArray[i1 - 1] = paArray[i1];
	}
	
	// length 값을 1 줄여서 마지막 요소를 제거합니다.
	paArray.length = paArray.length - 1;
}

 /**
  * 쿠키 삭제
  * @param cookieName 삭제할 쿠키명
  */
 function cDeleteCookie( cookieName )
 {
	  var expireDate = new Date();
	  
	  //어제 날짜를 쿠키 소멸 날짜로 설정한다.
	  expireDate.setDate( expireDate.getDate() - 1 );
	  document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
 }

/**
* 파일 path에서 '_on'을 붙여서 리턴한다.
*  Pa: psFilePath - 파일 path
	(예: /folder/file1.txt)
*  Re: (예: /folder/file1_on.txt)
*/
function cFile_name_addStr_on(psFilePath) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = cFile_nameAndExtension_get(psFilePath);

	if (a1[2].indexOf("_on") == -1){
		s1 = a1[0] + a1[2] + "_on." + a1[3];
	}else{
		s1 = a1[0] + a1[2]  + "." + a1[3];
	}

	//alert(s1);

	return s1;
}

/**
* 파일 path에서 '_on'이 있다면 true, 아니면 false
*  Pa: psFilePath - 파일 path
	(예: /folder/file1.txt)
*  Re: 
*/
function cFile_name_checkStr_on(psFilePath) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = cFile_nameAndExtension_get(psFilePath);

	if (a1[2].indexOf("_on") == -1){
		return false;
	}else{
		return true;
	}

}

/**
* 파일 path에서 '_on'을 제거해서 리턴한다.
*  Pa: psFilePath - 파일 path
	(예: /folder/file1_on.txt)
*  Re: (예: /folder/file1.txt)
*/
function cFile_name_delStr_on(psFilePath) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = cFile_nameAndExtension_get(psFilePath);

	a1[2] = a1[2].replace(/_on/g, "");

	s1 = a1[0] + a1[2] + "." + a1[3];

	return s1;
}

/**
* 파일 총 이름, 확장자 뺀 이름, 확장자 을 리턴한다
*  Pa: psFilePath - 파일 path
	(예: /folder/file1.txt)
*  Re: [총 이름, 확장자 뺀 이름, 확장자]
	예: [0] - /folder/
		[1] - file1.txt
		[2] - file1
		[3] - txt
*/
function cFile_nameAndExtension_get(psFilePath) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
	var sFilePath, sFileNameTotal, sFileName, sFileExtension;

	//s1 = o1.src;
	a1 = psFilePath.split("/");

	// path 설정
	sFilePath = "";
	for (i1 = 0; i1 < a1.length - 1; i1++){
		sFilePath += a1[i1] + "/";
	}
	
	// 총이름 설정
	sFileNameTotal = a1[a1.length - 1];

	i1 = sFileNameTotal.lastIndexOf(".");

	if (i1 == -1){
		sFileName = sFileNameTotal;
		sFileExtension = null;
	}else{
		sFileName = sFileNameTotal.substr(0, i1);
		sFileExtension = sFileNameTotal.substr(i1 + 1);
	}

	return [sFilePath, sFileNameTotal, sFileName, sFileExtension];
}

/**
* 즐겨찾기 추가

	예)cFavoriteAdd('타이틀', 'http://www.a.com')"
*/
function cFavoriteAdd(title, url) { 
   // Internet Explorer
   if(document.all)
   {
       window.external.AddFavorite(url, title); 
   }
   // Google Chrome
   else if(window.chrome){
      alert("Ctrl+D키를 누르시면 즐겨찾기에 추가하실 수 있습니다.");
   }
   // Firefox
   else if (window.sidebar) // firefox 
   {
       window.sidebar.addPanel(title, url, ""); 
   }
   // Opera
   else if(window.opera && window.print)
   { // opera 
      var elem = document.createElement('a'); 
      elem.setAttribute('href',url); 
      elem.setAttribute('title',title); 
      elem.setAttribute('rel','sidebar'); 
      elem.click(); 
   }
	
}
//-----------------------------------------------------------------
// 브라우저의 종류와 버전을 리턴한다.
// Re: app 이름과 버전 저장 Array 변수. [0]: app이름, [1]: 버전(버전은 IE에서만 리턴된다.)
//	여기에 없는 브라우저는 'etc'를 리턴한다.
//-----------------------------------------------------------------
function cGetAppNameAndVer() {
	var i1 = 0;
	var i2 = 0;
	var aAppNameVer = new Array();
	var sUserAgent = navigator.userAgent;
	//alert(sUserAgent);

	//---- IE (Microsoft Internet Explorer)
	if( ( i1 = sUserAgent.indexOf( "MSIE" ) ) >= 0 ){
		aAppNameVer[ 0 ] = "IE";
		// 소숫점은 버리고 제일 앞 숫자만 저장.
		i2 = sUserAgent.indexOf( ";", i1 );
		i2 = sUserAgent.slice( i1 + 5, i2 );
		i1 = i2.indexOf( ".", i2 );
		i2 = i2.slice( 0, i1 - 1 );
		aAppNameVer[ 1 ] = i2;
	}
	//---- Cr (Chrome)
	else if( ( i1 = sUserAgent.indexOf( "Chrome" ) ) >= 0 ){
		aAppNameVer[ 0 ] = "Cr";
		aAppNameVer[ 1 ] = "";
	}
	//---- NN (Netscape Navigator)
	else if( ( i1 = sUserAgent.indexOf( "Navigator" ) ) >= 0 ){
		aAppNameVer[ 0 ] = "NN";
		aAppNameVer[ 1 ] = "";
		//aAppNameVer[ 1 ] = sUserAgent.slice( i1 + 10, i1 + 11 );
	}
	//---- FF (Firefox)
	else if( ( i1 = sUserAgent.indexOf( "Firefox" ) ) >= 0 ){
		aAppNameVer[ 0 ] = "FF";
		aAppNameVer[ 1 ] = "";
		//aAppNameVer[ 1 ] = sUserAgent.slice( i1 + 8, sUserAgent.length );
	}
	//---- Op (Opera)
	else if( ( i1 = sUserAgent.indexOf( "Opera" ) ) >= 0 ){
		aAppNameVer[ 0 ] = "Op";
		aAppNameVer[ 1 ] = "";
		//i2 = sUserAgent.indexOf( " ", i1 );
		//aAppNameVer[ 1 ] = sUserAgent.slice( i1 + 6, i2 );
	}
	//---- Sa (Safari)
	else if( ( i1 = sUserAgent.indexOf( "Safari" ) ) >= 0 ){
		aAppNameVer[ 0 ] = "Sa";
		aAppNameVer[ 1 ] = "";
		//i1 = sUserAgent.indexOf( "Version" );
		//aAppNameVer[ 1 ] = sUserAgent.slice( i1 + 8, i1 + 11 );
	}else{
		aAppNameVer[ 0 ] = "etc";
		aAppNameVer[ 1 ] = "";
	}
	//alert(aAppNameVer);
	return aAppNameVer;
}

/**
* 문자열의 byte 수를 리턴합니다. 한글은 2byte 계산.
*  Pa: psText - 계산할 문자열.
*/
 function cGetByteLen(psText) {
	var i1, s1, iLen;

	psText = String(psText);
	iLen = 0;

	for (i1 = 0; i1 < psText.length; i1++){
		s1 = psText[i1].charCodeAt();
		if (s1 >= 0x0080 && s1 <= 0xFFFF){
			iLen += 2;
		}else{
			iLen++;
		}
	}

	return iLen;
 }

/**
* checkbox 객체가 checked 되 있다면 그 checkbox의 값을 리턴한다.
  checked 안되있다면 ""를 반환한다. (ajax 리스트에 값 넘길때 사용)
*  Pa: poCheckbox - checkbox 객체
*/
function cGetCheckboxValue(poCheckbox) {
	var value = "";

	if (poCheckbox.checked){
		value = poCheckbox.value
	}

	return value;
}

 /**
  * 쿠키값 추출
  * @param cookieName 쿠키명
  */
function cGetCookie( cookieName )
{
	var search = cookieName + "=";
	var cookie = document.cookie;

	// 현재 쿠키가 존재할 경우
	if( cookie.length > 0 )
	{
		// 해당 쿠키명이 존재하는지 검색한 후 존재하면 위치를 리턴.
		startIndex = cookie.indexOf( cookieName );

		// 만약 존재한다면
		if( startIndex != -1 )
		{
			// 값을 얻어내기 위해 시작 인덱스 조절
			startIndex += cookieName.length;

			// 값을 얻어내기 위해 종료 인덱스 추출
			endIndex = cookie.indexOf( ";", startIndex );

			// 만약 종료 인덱스를 못찾게 되면 쿠키 전체길이로 설정
			if( endIndex == -1) endIndex = cookie.length;

				// 쿠키값을 추출하여 리턴
				return unescape( cookie.substring( startIndex + 1, endIndex ) );
			}
		else
		{
			// 쿠키 내에 해당 쿠키가 존재하지 않을 경우
			return false;
		}
	}
	else
	{
		// 쿠키 자체가 없을 경우
		return false;
	}
}

/**
* 엑셀 파일 받기 함수입니다.
  <주의점>
	- 체크박스로 출력할 tr을 지정할 경우 :
		- 체크박스 class 명을 '__checkBox_view__' 로 지정해야 한다.
	- 첫번째 td가 숫자이면서 나머지 td가 아무값도 없다면 출력하지 않습니다.
	   만약, 첫번째 td 가 숫자이면서, rowspan 이 적용되었을 경우, 다음 tr 의 첫번째 td가 숫자이면서, 다음 td들이 아무값도 없다면, 그 다음 tr은 출력되지 않습니다..;;
*  Pa: psTitle - 엑셀 파일의 이름입니다.
	 psTableId - 엑셀로 변환할 테이블 id 입니다.
	 psIframeName - 프레임 이름입니다.
	 piFormNum - 폼이름 뒤에 붙는 숫자입니다.
	 psParent - parent 일 경우에는 true입니다.
	 poTheadTable - thead 에 해당하는 table 입니다.
	 poTfootTable - tfoot 에 해당하는 table 입니다.
	 psTopStr - 리스트 위에 출력할 str.
*/
function cGetExcel(psTitle, psTableId, psIframeName, piFormNum, psParent, poTheadTableId, poTfootTableId, psTopStr) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
	var TheForm;
	var sContents;
	var bNumberMode; // table 이 1, 2, 3 처럼 번호가 자동으로 있는 경우 true.
	//var bNumberMode_rowspan;
	var oTable, oTable_temp, aTr,  aTr_org, aTd,  aInput, sTrOnlyStr, sTrTemp
	var iRowSpan, iColSpan,iRowSpan_prevTd0 ;
	var a1, s1, o1, o2, i1, i2, i3;
	var iColspan, iRowspan;
	var oTheadTable, oTfootTable, addsTring;

	if (poTheadTableId){
		oTheadTable = document.getElementById(poTheadTableId);
	}

	if (poTfootTableId){
		oTfootTable = document.getElementById(poTfootTableId);
	}


	if (!piFormNum){
		piFormNum = "";
	}

	TheForm = document.getElementsByName("_excelForm" + piFormNum + "_")[0];

	if (!TheForm){
		s1 = "<form  method=\"post\" name=\"_excelForm" + piFormNum + "_\" class =\"_excelForm_\">";
		s1 += "<input type=\"hidden\" name=\"title\" >";
		s1 += "<input type=\"hidden\" name=\"topHTML\" >";
		s1 += "<input type=\"hidden\" name=\"tableHTML\" >";
		s1 += "</form>";

		$("body").append(s1);
		TheForm = document.getElementsByName("_excelForm" + piFormNum + "_")[0];
	}

	TheForm.title.value = "";
	TheForm.topHTML.value = "";
	TheForm.tableHTML.value = "";
	
	if (psIframeName){
		oTable = eval(psIframeName).document.getElementById(psTableId);	
		
	}else if (psParent){
		oTable = parent.document.getElementById(psTableId);	
	}else{
		oTable = document.getElementById(psTableId);	
	}

	// oTable 객체와 동일한 oTable_temp 객체를 만듭니다. 수정이 필요하기 때문에 temp 객체를 만듭니다.
	oTable_temp = $("body").children(".__getExcel_temp_table__")[0];
	if (!oTable_temp){
		$("body").append("<table class=\"__getExcel_temp_table__ hidden\"></table>");
		oTable_temp = $("body").children(".__getExcel_temp_table__")[0];
	}
	$(oTable_temp).html($(oTable).html());
	
	// table 에 input 이 있다면 temp table의 input 을 input 값으로 대체합니다.
	o1 = $(oTable).find("input:text");
	o2 = $(oTable_temp).find("input:text");
	for (i3 = 0; i3 < o1.length; i3++){
		$(o2[i3]).replaceWith(o1[i3].value);
	}

	// table 에 select 이 있다면 temp table의 select 을 select의 text로 대체합니다.
	o1 = $(oTable).find("select");
	o2 = $(oTable_temp).find("select");
	for (i3 = 0; i3 < o1.length; i3++){
		if (o1[i3].value){
			if ($(o1[i3]).children("option[value='" + o1[i3].value + "']")[0]){
				$(o2[i3]).replaceWith($(o1[i3]).children("option[value='" + o1[i3].value + "']").text());	
			}else{
				$(o2[i3]).replaceWith("");
			}
		}else{
			$(o2[i3]).replaceWith("");
		}
	}

	// a href 테그를 없애줌
	$(oTable_temp).find("a").removeAttr("href");
	
	o1 = $("body").find(".__getExcel_iframe__")[0];
	
	// excel 문서를 출력할 iframe 을 만듭니다.
	if (!o1){
		$("body").append("<iframe class=\"__getExcel_iframe__\" name=\"__getExcel_iframe__\" width=\"0\" height=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"0\">");
		o1 = $("body").find(".__getExcel_iframe__")[0];
	}
	
	// 위 문자열 설정
	if (psTopStr){
		TheForm.topHTML.value = psTopStr;
	}

	TheForm.title.value = encodeURIComponent(psTitle);
	TheForm.target = "__getExcel_iframe__";
	TheForm.action = "/common/php/excel/getExcel.php";

	TheForm.tableHTML.value = "";
	
	// thead 설정
	if (oTheadTable){
		if ($(oTheadTable).find("thead")[0]){
			TheForm.tableHTML.value = "<thead>";
			TheForm.tableHTML.value += $(oTheadTable).find("thead").html();
			TheForm.tableHTML.value += "</thead>";
		}
	}else{
		if ($(oTable_temp).find("thead")[0]){
			TheForm.tableHTML.value = "<thead>";
			TheForm.tableHTML.value += $(oTable_temp).find("thead").html();
			TheForm.tableHTML.value += "</thead>";
		}
	}

	TheForm.tableHTML.value += "<tbody>";

	aTr = $(oTable_temp).find("tbody").find("tr");
	aTr_org = $(oTable).find("tbody").find("tr"); // 원래 table 의 checkbox 의 checked 를 알아야 되므로.
	
	addsTring = "";
	o1 = $(aTr_org[0]).find(".__checkBox_view__")[0];
	if (!o1){
		addsTring += $(oTable_temp).find("tbody").html();
	}else{
		for (i1 = 0; i1 < aTr.length; i1++){
			//## aTr_org 으로 해야합니다. checkbox 검사하기 때문입니다.;;
			o1 = $(aTr_org[i1]).find(".__checkBox_view__")[0];

			// checkbox가 없거나, checkbox가 있을때, checkbox가 체크 되 있다면 실행합니다.
			if (!o1 || (o1 && o1.checked == true)){
				// ## [14.03.28] tr 의 내용을 그대로 가져오는 코드입니다. 그래서, 코드 실행 시간을 줄였습니다.
				addsTring += "<tr>";
				addsTring += $(aTr[i1]).html();
				addsTring += "</tr>";
			}
		}
	}

	TheForm.tableHTML.value += addsTring;	

	// tbody의 tr 객체 갯수만큼 실행합니다.
	/* === 이전 코드 ===
	for (i1 = 0; i1 < aTr.length; i1++){
		//## aTr_org 으로 해야합니다. checkbox 검사하기 때문입니다.;;
		o1 = $(aTr_org[i1]).find(".__checkBox_view__")[0];
		
		// checkbox가 없거나, checkbox가 있을때, checkbox가 체크 되 있다면 실행합니다.
		if (!o1 || (o1 && o1.checked == true)){
			iColspan = $(aTr[i1]).attr("colspan");
			iRowspan = $(aTr[i1]).attr("rowspan");

			if (iColspan === undefined || iColspan === null){
				iColspan = "";
			}else{
				iColspan = "colspan=\"" + iColspan + "\"";
			}
			if (iRowspan === undefined || iRowspan === null){
				iRowspan = "";
			}else{
				iRowspan = "rowspan=\"" + iRowspan + "\"";
			}

			TheForm.tableHTML.value += "<tr " + iColspan + " " + iRowspan + ">";

			aTd = $(aTr[i1]).find("td");
			for (i2 = 0; i2 < aTd.length; i2++){
				iColspan = $(aTd[i2]).attr("colspan");
				iRowspan = $(aTd[i2]).attr("rowspan");

				if (iColspan === undefined || iColspan === null){
					iColspan = "";
				}else{
					iColspan = "colspan=\"" + iColspan + "\"";
				}
				if (iRowspan === undefined || iRowspan === null){
					iRowspan = "";
				}else{
					iRowspan = "rowspan=\"" + iRowspan + "\"";
				}

				TheForm.tableHTML.value += "<td " + iColspan + " " + iRowspan + ">";

				TheForm.tableHTML.value += $(aTd[i2]).text();	

				TheForm.tableHTML.value += "</td>";				
			}

			TheForm.tableHTML.value += "</tr>";
			
			//alert(TheForm.tableHTML.value);
		}
	}*/

	TheForm.tableHTML.value += "</tbody>";
	
	// tfoot 설정
	if (oTfootTable){
		if ($(oTfootTable).find("tfoot")[0]){
			//TheForm.tableHTML.value += "<tfoot>"; // 이렇게 하면 안되었다.
			TheForm.tableHTML.value += $(oTfootTable).find("tfoot").html();
			//TheForm.tableHTML.value += "</tfoot>";
		}
		
	}else{
		if ($(oTable_temp).find("tfoot")[0]){
			//TheForm.tableHTML.value += "<tfoot>"; // 이렇게 하면 안되었다.
			TheForm.tableHTML.value += $(oTable_temp).find("tfoot").html();
			//TheForm.tableHTML.value += "</tfoot>";
		}
	}
	//alert(TheForm.title.value);
	//TheForm.target="_blank";
	TheForm.submit();
	
	// oTable_temp 를 삭제합니다..
	$(oTable_temp).remove();
}

/**
* - 테이블 리스트의 갯수를 리턴하는 함수입니다.
   - '검색 값이 없습니다.' 라는 문구가 있는 tr을 갯수에서 제외 합니다.
   - tr 의 처음 td안에  input이 있는경우, 처음 td의 input 이 ""(null) 이거나,  psIndexInputName 의 input이 ""(null) 이면 리스트 갯수에서 제외 시킵니다.
*  Pa: poTableResult - 리스트 객체(tbody) 입니다. 예) document.getElementById("result")
	 psIndexInputName - 유효 체크할 input 의 name 문자열입니다. 이 인자값이 없으면 첫번째 input 을 유효 체크합니다.
*  Re: 리스트의 갯수를 리턴합니다.
	예) cGetListCount(document.getElementById("result")); // id가 'result' 인 객체의 tr(리스트) 의 갯수를 리턴 받습니다.
	    cGetListCount(document.getElementById("result"), "매출수량[]"); // id가 'result' 인 객체의 tr(리스트) 의 갯수를 새고, 유효 체크할 input의 name은 '매출수량[]' 으로 합니다.
*/
function cGetListCount(poTableResult, psIndexInputName) {
	var tr, td, count;
	var o1, i1;

	tr = $(poTableResult).find("tr");

	count = 0;
	for (i1 = 0; i1 < tr.length; i1++){
		td = $(tr[i1]).children("td");
		tdFirst = td[0];

		if ($(tdFirst).text().indexOf("없습니다") > -1){// '검색된 데이터가 없습니다' 이라면 크기 를 0으로 합니다.
			count = 0;
			break;
		}
		if (psIndexInputName){
			tdFirstInput = $(tr[i1]).find("input[name='" + psIndexInputName + "']")[0];
		}else{
			tdFirstInput = $(tdFirst).find("input")[0];
		}

		if (tdFirstInput && tdFirstInput.value == ""){ // 처음 input의 값이 없다면 넘어갑니다.
			continue;
		}

		count++;
	}

	return count;
}


/**
* radio 테그의 선택한 value를 리턴하는 함수입니다.
*  Pa: poRadio - radio 객체입니다.
*  
	예) cGetRadioValue(TheForm.구분); // 'TheForm.구분' radio 객체의 선택한 value를 리턴하는 코드입니다.

*/
function cGetRadioValue(poRadio)
{
	var i1;	
	
	for (i1 = 0; i1 < poRadio.length; i1++){
		if (poRadio[i1].checked){
			return poRadio[i1].value;
		}
	}

	return null;
}

/**
* radio 테그의 선택한 value의 idx를 리턴하는 함수입니다.
*  Pa: poRadio - radio 객체입니다.
*  
	예) cGetRadioValueIdx(TheForm.구분);

*/
function cGetRadioValueIdx(poRadio) {
	var i1;	
	
	for (i1 = 0; i1 < poRadio.length; i1++){
		if (poRadio[i1].checked){
			return i1;
		}
	}

	return null;
	
}

/**
* 주의점: - '> 테그이름' 이렇게 하면 안될 수 있음.
		- div.div1 {...} 같이 '.', '#' 가 붙어있어도 됨

	예) cGetRealWidth($("#div5")[0], "width");
		cGetRealWidth($("#div5")[0], "margin-top");
	적용파일) \immaker\common\js\MenuLeft_ImMaker.js

 Pa : pbAuto - css나 inline 스타일이 없을 경우 'auto' 로 할것인지 여부
*/
function cGetRealValue(poThat, psType, pbAuto) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	var aRules = document.styleSheets;
	var i0, sRules, i1, sId, sValue, sClass, a1, sTagName;
	var sStyleTypeName;

	//cPrint_d("cGetRealValue()");
	
	// style 이름으로 바꾸기
	sStyleTypeName = psType;

	a2 = psType.match(/-.{1}/g);

	if (a2){
		for (i1 = 0; i1 < a2.length; i1++){
			sStyleTypeName = sStyleTypeName.replace(a2[i1], a2[i1].toUpperCase());
		}
		sStyleTypeName = sStyleTypeName.replace(/-/g, "");

		//alert(sStyleTypeName);
	}
	
	// IE 이라면
	if (poThat.currentStyle){
		//alert(eval("poThat.currentStyle." + sStyleTypeName));
		return eval("poThat.currentStyle." + sStyleTypeName);
	}
	
	for (i0 = 0; i0 <aRules.length; i0++){
		//cPrint_d("i0 : " + i0);
		sRules = aRules[i0].rules || aRules[i0].cssRules;

		if (!sRules){
			continue;
		}
		
		//cPrint_d("sRules : " + sRules);
		//alert(psType);
		i1 = eval("poThat.style." + sStyleTypeName);
		//i1 = poThat.style.width;

		if (i1 !== null && i1 !== "" && i1 !== undefined && isNaN(i1)){
			return i1;
		}

		// id 검사
		sId = $(poThat).attr("id");
		
		if (sId){
			sValue = in_cGetRealValue(poThat, psType, sRules, "#", sId);

			if (sValue !== null && sValue !== "" && sValue !== undefined){
				return sValue;
			}
		}

		//cPrint_d("id 없음");
		// class 검사
		sClass = $(poThat).attr("class");
		if (sClass){
			 a1 = sClass.split(" ");
			 for (i1 = 0; i1 < a1.length; i1++){
				if (a1[i1] == " "){
					continue;
				}
				sValue = in_cGetRealValue(poThat, psType, sRules, ".", a1[i1]);

				if (sValue !== null && sValue !== "" && sValue !== undefined){
					return sValue;
				}
			 }
		}

		//cPrint_d("class 없음");
		// tag 검사
		sTagName = poThat.tagName;

		sValue = in_cGetRealValue(poThat, psType, sRules, "", sTagName);

		if (sValue !== null && sValue !== "" && sValue !== undefined){
			return sValue;
		}

		//cPrint_d("tag 없음");
	}


	if (pbAuto){
		//alert("z");
		/*if ($(poThat).css(psType) == $(poThat).parent().css(psType)){
			alert("a");
			s1 = "auto";
		}else{*/
			s1 = $(poThat).css(psType);	

			if (s1.indexOf("px") > -1){ // 'px' 가 있다면, 없다면 'none' 같은 경우 이다.
				s1 = "auto";
			}
		//}
	}else{
		s1 = $(poThat).css(psType);	
	}

	return s1;

	
	function   in_cGetRealValue(poThat, psType, poRules, psMark, psSchStr) {
		
		var i2, sRule, aSelectorText, bNextArrow, o1, bFind1, i3, s1, b1, o2, bFind2, s2;
		
		psSchStr = psSchStr;


		// css 정의 전체 갯수대로 실행
		for (i2 = 0; i2 < poRules.length; i2++){
			sRule = poRules[i2];
			aSelectorText = $.trim(sRule.selectorText).split(" ");

			// css 마지막 테그가 찾는 테그와 맞다면.
			if (psMark == "#" || psMark == "."){
				if (aSelectorText[aSelectorText.length - 1].toLowerCase() != psMark + psSchStr.toLowerCase() && aSelectorText[aSelectorText.length - 1].toLowerCase() != poThat.tagName + psMark + psSchStr.toLowerCase()){
					continue;
				}
			}else{
				if (aSelectorText[aSelectorText.length - 1].toLowerCase() != psMark + psSchStr.toLowerCase()){
					continue;
				}
			}
			
			//if (aSelectorText[aSelectorText.length - 1].toLowerCase() == psMark + psSchStr.toLowerCase()){
				if (aSelectorText.length == 1){
					return sRule.style.getPropertyValue(psType);
				}
				
				bNextArrow = false;
				//o1 = $(poThat).parent()[0];
				o1 = $(poThat).parent()[0];
				bFind1 = true;
				// css 전체 테그가 맞는지 확인
				for (i3 = aSelectorText.length - 2; i3 >= 0 ; i3--){

					if (bNextArrow){
						s1 = aSelectorText[i3].substr(0, 1);

						if (s1 == "#"){
							s2 = $(o1).attr("id");
							if (aSelectorText[i3] != "#" + s2 && aSelectorText[i3] != o1.tagName + "#" + s2 ){
								bFind1 = false;
								break;
							}
						}else if (s1 == "."){
							b1 = $(o1).hasClass(aSelectorText[i3].replace(".", ""));
							if (!b1){
								bFind1 = false;
								break;
							}
						}else{
							if (aSelectorText[i3].toLowerCase() != o1.tagName.toLowerCase()){
								bFind1 = false;
								break;	
							}
						}

						bNextArrow = false;

						o1 = $(o1).parent()[0];
						continue;
					}

					if (aSelectorText[i3] == " "){
						//o1 = $(o1).parent()[0];
						continue;
					}else if (aSelectorText[i3] == ">"){
						bNextArrow = true;
						//o1 = $(o1).parent()[0];
						continue;
					}else{
						// css의 현재 테그가 찾는 객체의 부모에 있는지 확인
						s1 = aSelectorText[i3].substr(0, 1);
						//o2 = o1;
						bFind2 = false;

						while (true){
							if (o1 == $("body")[0]){
								break;
							}

							if (s1 == "#"){
								s2 = $(o1).attr("id");
								if (aSelectorText[i3] == "#" + s2 && aSelectorText[i3] != o1.tagName + "#" + s2 ){
									bFind2 = true;
									break;
								}
							}else if (s1 == "."){
								b1 = $(o1).hasClass(aSelectorText[i3].replace(".", ""));
								if (b1){
									bFind2 = true;
									break;
								}
							}else{
								if (aSelectorText[i3].toLowerCase() == o1.tagName.toLowerCase()){
									bFind2 = true;
									break;	
								}
							}
							
							o1 = $(o1).parent()[0];
						}// while

						if (!bFind2){
							bFind1 = false;
							break;
						}

					} // else

					if (bFind1){
						return sRule.style.getPropertyValue(psType);
					}
					
					o1 = $(o1).parent()[0];
				} // for
			//} // if
		} // for

		return null;		
	}
}

/**
* 'psSize' 에서 숫자부분과 '%', 'px' 부분을 나누어서 array 형태로 반환
  'auto' 이면 [0] : "", [1] 'auto" 반환
   Pa: psBasicDiv2 - '%', 'px'  가 없을 때 리턴 될 문자,('%', 'px' 이다. 설정안해주면 ""  로 된다.)
*  Re: [0] : 숫자, [1] '%', 'px' 
*/
function cGetSizeDiv(psSize, psBasicDiv2) {
	var aValue = new Array(2);

	if (psSize.indexOf("%") > -1){
		psSize = psSize.replace("%", "");

		aValue[0] = psSize;
		aValue[1] = "%";
	}else if (psSize.indexOf("px") > -1){
		psSize = psSize.replace("px", "");

		aValue[0] = psSize;
		aValue[1] = "px";
	}else if (psSize.toLowerCase() == "auto"){
		aValue[0] = "";
		aValue[1] = "auto";
	}else if (psSize.toLowerCase() == "*"){
		aValue[0] = "";
		aValue[1] = "*";
	}else{
		aValue[0] = psSize;

		if (psBasicDiv2){
			aValue[1] = psBasicDiv2;
		}else{
			aValue[1] = "";
		}
	}

	return aValue;
}

/**
* iframe을 생성합니다.
*/
function cIframe_make() {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;	
	
	$("#ComFrame").remove();

	s1 = "<iframe name=\"ComFrame\" id=\"ComFrame\" width=\"0\" height=\"0\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"0\"></iframe>";
	//s1 = "<iframe name=\"ComFrame\" id=\"ComFrame\" width=\"100\" height=\"100\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"1\"></iframe>";
	$("body").append(s1);
}

/**
* iframe을 삭제합니다.
*/
function cIframe_remove() {
	$("#ComFrame").remove();
}

/**
* array 배열 변수의 요소를 추가하는 함수입니다.
   (요소를 삭제 할때는 'cDelArray()' 함수 사용)
*  Pa: paArray - 추가하는 array 변수입니다.
	 piIndex - 추가하는 요소의 index 번호 입니다. 0부터 시작합니다.
	 poValue - 추가할 값.
*  Re:
*/
function cInsertArray(paArray, piIndex, poValue) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	if (piIndex > paArray.length){
		return;
	}
	
	a1 = new Array();
	for (i1 = 0; i1 < paArray.length; i1++){
		a1[i1] = paArray[i1];
	}

	paArray[piIndex] = poValue;

	for (i1 = piIndex; i1 < a1.length; i1++){
		paArray[i1 + 1] = a1[i1];
	}

}

/**
* mainContent 부분의 width를 window 창 크기로 넓혀주는 함수입니다.
*  Pa: poMainContent - mainContent 에 해당하는 객체입니다.
	poLeftMenu - left 메뉴 객체입니다.
	poWrapTag - left 메뉴와 mainContent를 담고 있는 wrap 객체입니다.

	* 주의 *) poMainContent, poWrapTag 에 min-width 가 적용되 있어야 합니다.

	예) cLayout_mainContent_width_full(document.getElementById("mainContent"), document.getElementById("leftMenu"), $("body")[0]);

	적용파일) 휴먼코아 - \recruit\applyState\index.php
*/
function cLayout_mainContent_width_full(poMainContent, poLeftMenu, poWrapTag) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
	
	/*if (poWrapTag){
		$(poWrapTag).css("width", "100%");
	}*/

	in_mainContent_width_set();

	$(poLeftMenu).change(in_han_leftMenu_change);
	$(window).resize(in_han_window_resize);
	
	function   in_han_leftMenu_change(poEvent) {
		in_mainContent_width_set();
	}

	function   in_han_window_resize(poEvent) {
		in_mainContent_width_set();
	}

	function   in_mainContent_width_set() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		i1 = $(window).width();

		if (poWrapTag){
			$(poWrapTag).css("width", (i1 - 5)+ "px");
		}

		if ($(poLeftMenu).is(":visible")){
			i2 = $(poLeftMenu).outerWidth(true);

			$(poMainContent).css("width", (i1 - i2 - 5) + "px");
		}else{
			$(poMainContent).css("width", "100%");
		}		
	}
}

function cLocation_immaker() {
	location.href = "/immaker";
}

function cLogOut() {
	location.href = "/login/logoutUser.php";
}
/**
* 위, 옆 메뉴 만들때, 3차 depth 페이지가 없을 경우 호출 됨.
*/
function cNothingPage() {
	alert("접근 권한이 없습니다.");
}

/**
* 앞에 '0'을 원하는 갯수만큼 넣습니다.
*  Pa:  poNum - 문자열이나 숫자 입니다.
	  piLen -'0'을 넣을 총 자릿수 입니다.
*  Re: 예) '0000123'
*/
function cMakeFrontZero(poNum, piLen) {
	var i1, i2, i3, s1;
	
	poNum = String(poNum);

	i1 = poNum.length;
	i2 = piLen - i1;
	if (i2 > 0){
		s1 = "";
		for (i3 = 0; i3 < i2; i3++){
			s1 = s1.concat("0");
		}
		value = s1.concat(poNum);
	}else{
		value = poNum;
	}

	return value;
}

function cOpenWindow(psURL, psWinName, piWidth, piHeight, piTop, piLeft) {
	var oWindow;
	
	// 중앙에 위치하도록
	if (piTop === "" || piTop === null || piTop === undefined){
		if (window.screen){
			piTop = (window.screen.height - piHeight) / 2 - 50;

			if (piTop < 0){
				piTop = 0;
			}
			
		}
	}

	// 중앙에 위치하도록
	if (piLeft === "" || piLeft === null || piLeft === undefined){
		if (window.screen){
			piLeft = (window.screen.width - piWidth) / 2;
			
		}
	}

	if (piWidth != ""){
		if (piWidth > window.screen.width){
			piWidth = window.screen.width;
		}
	}

	if (piHeight != ""){
		if (piHeight > window.screen.height){
			piHeight = window.screen.height;
		}
	}


	oWindow = window.open(psURL, psWinName, "width=" + piWidth + ", height=" + piHeight + ", top=" + piTop + ", left=" + piLeft + ", toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, titlebar=no");
	oWindow.focus();

}

/**
* scrollbars no, resizable no
*/
function cOpenWindow2(psURL, psWinName, piWidth, piHeight, piTop, piLeft) {
	var oWindow;

	if (piTop === "" || piTop === null || piTop === undefined){
		if (window.screen){
			piTop = (window.screen.height - piHeight) / 2 - 50;

			if (piTop < 0){
				piTop = 0;
			}
			
		}
	}

	if (piLeft === "" || piLeft === null || piLeft === undefined){
		if (window.screen){
			piLeft = (window.screen.width - piWidth) / 2;
			
		}
	}


	oWindow = window.open(psURL, psWinName, "width=" + piWidth + ", height=" + piHeight + ", top=" + piTop + ", left=" + piLeft + ", toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, titlebar=no");
	oWindow.focus();


}

/**
* '_blank' 타입으로 연다. (무조건 새로운 윈도우 창으로 열리지 않는다)
*/
function cOpenWindow_blank(psURL) {
	var oWindow = window.open(psURL, "_blank");
	oWindow.focus();
}


/**
* PHP 코드의 global 변수를 만든다
*  Pa: poForm - form 객체
	poTextarea - 출력할 textarea 객체
	
	예) cPHP_globalVarCreate(oForm, oForm._temp_textarea_)
*/
function cPHP_globalVarCreate(poForm, poTextarea) {
	var o1 = $(poForm).find("input, select, textarea");
	var a1, s1, i1, i2, b1;
	
	a1 = new Array();
	for (i1 = 0; i1 < o1.length; i1++){
		b1 = false;
		for (i2 = 0; i2 < a1.length; i2++){
			if ($(o1[i1]).attr("name") == a1[i2]){
				b1 = true;
				break;
			}
		}

		if (!b1){
			s1 = $(o1[i1]).attr("name");

			if (s1){
				s1 = s1.replace(/\[\]/g, "");
				b2 = false;
				for (i2 = 0; i2 < a1.length; i2++){
					if (a1[i2] == s1){
						b2 = true;
					}
				}

				if (!b2){
					a1.push(s1);
				}
			}
		}
	}
	
	s1 = "\tglobal ";
	i2 = 0;
	for (i1 = 0; i1 < a1.length; i1++){
		if (i2 >= 10){ // 10개씩 끊어서 출력한다.
			s1 = s1.substr(0, s1.length - 2) + ";\n\tglobal ";
			i2 = 0;
		}

		if (a1[i1] == "__textarea1__"){
			continue;
		}

		s1 += "$" + a1[i1] + ", ";

		i2++;
	}

	s1 = s1.substr(0, s1.length - 2) + ";";

	poTextarea.value = s1;

}

function cPrint_d(psText, pbNew) {
	if (!document.getElementsByName("textarea_debug")[0]){
		return;
	}

	if (pbNew){
		document.getElementsByName("textarea_debug")[0].value = psText;
	}else{
		document.getElementsByName("textarea_debug")[0].value = document.getElementsByName("textarea_debug")[0].value + psText +  "\n";
	}

	$(document.getElementsByName("textarea_debug")[0]).scrollTop(1000000);
	
}

/**
* radio 테그를 value 값으로 선택하는 함수입니다. value 값이 없다면 모두 uncheck 합니다.
*  Pa: poRadio - radio 객체입니다.
	 psValue - 선택할 value 값입니다.
*	
	예) cRadioCheckByValue(TheForm.구분, "전체"); // 'TheForm.구분' radio 객체에서 value 값이 '전체' 인 것을 선택하는 코드입니다.
*/
function cRadioCheckByValue(poRadio, psValue) {
	var i1;	

	for (i1 = 0; i1 < poRadio.length; i1++){
		if (poRadio[i1].value == psValue){
			poRadio[i1].checked = true;
		}else{
			poRadio[i1].checked = false;
		}
	}

	return null;
}

/**
* radio 테그를 모두 체크 해제합니다.
*  Pa: poRadio - radio 객체입니다.
*/
function cRadioAllUncheck(poRadio) {
	var i1;	

	for (i1 = 0; i1 < poRadio.length; i1++){
		poRadio[i1].checked = false;
	}	
}

function cReadyDocument() {
	//cSetButtonAboutMouse();
}

/**
* '검색된 데이터가 없습니다.' 라는 tr 객체를 없앱니다.
*  Pa: poTableResult - 리스트 객체 입니다. 예) document.getElementById("result")
	예) cRemoveSearchNotData(document.getElementById("result"));
*/
function cRemoveSearchNotData(poTableResult) {
	tr = $(poTableResult).find("tr");

	o1 = $(tr[0]).children("td")[0];
	o1 = $(o1).text();
	if (o1.indexOf("없습니다") > -1){ // '검색된 데이터가 없습니다' 이라면 삭제 합니다.
		$(tr[0]).remove();
	}
}

/**
* select 테그의 option 에서 인자값이 있는지 검사. 있으면 true.
*  Pa:
*  Re:
*/
function cSelectBox_checkHasOption(poSelectTag, psValue) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = $(poSelectTag).children("option");
	for (i1 = 0; i1 < a1.length; i1++){
		s1 = $(a1[i1]).attr("value");
		if (s1 == psValue){
			return true;
		}
	}

	return false;
}

/**
* select 테그에서 idx(순서)로 option 객체를 리턴
*  Pa:
*  Re:
*/
function cSelectBox_getOptionByIdx(poSelectTag, piIdx) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = $(poSelectTag).children();
	for (i1 = 0; i1 < a1.length; i1++){
		if (i1 == piIdx){
			return a1[i1];
		}
	}

	return null;	
}

/**
* select 테그에서 selected 된 option 객체를 리턴
*  Pa:
*  Re:
*/
function cSelectBox_getSelectedOptionTag(poSelectTag) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = $(poSelectTag).children("option");
	for (i1 = 0; i1 < a1.length; i1++){
		if (a1[i1].selected){
			return a1[i1];
		}
	}

	return null;	
}

/**
* select 테그에서 selected 된 option 객체의 순서숫자를 리턴(0부터 시작)
*  Pa:
*  Re:
*/
function cSelectBox_getSelectedOptionIdx(poSelectTag) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = $(poSelectTag).children("option");
	for (i1 = 0; i1 < a1.length; i1++){
		if (a1[i1].selected){
			return i1;
		}
	}

	return null;	
	
}

/**
* option 객체로 selected 한다.
*  Pa: poSelectTag- select 객체
	poOptionTag - option 객체
*/
function cSelectBox_selectByOption(poSelectTag, poOptionTag) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = $(poSelectTag).children("option");
	for (i1 = 0; i1 < a1.length; i1++){
		if (a1[i1] == poOptionTag){
			//alert("z");
			poSelectTag[i1].selected = true;
			//$(a1[i1]).attr("selected", "true");
		}else{
			//$(a1[i1]).removeAttr("selected");
		}
	}
	
}

/**
* select 박스 poValue 인자값으로 선택한다. 보통 value로 선택하는것 과 차이점은
  poValue 값이 없다면 선택을 안한다는 점이다.
*  Pa:
*  Re:
*/
function cSelectBox_selectValue(poSelectTag, psValue) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = $(poSelectTag).children("option");
	for (i1 = 0; i1 < a1.length; i1++){
		s1 = $(a1[i1]).attr("value");

		if (s1 == psValue){
			poSelectTag.value = psValue;
			return;
		}
	}
	
}

/**
* select 박스 poValue 인자값으로 선택한다. 보통 value로 선택하는것 과 차이점은
  poValue 값이 없다면 제일 상단의 option을 선택하는 점이다.
*  Pa:
*  Re:
*/
function cSelectBox_selectValueTop(poSelectTag, psValue) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	a1 = $(poSelectTag).children("option");
	for (i1 = 0; i1 < a1.length; i1++){
		s1 = $(a1[i1]).attr("value");

		if (s1 == psValue){
			poSelectTag.value = psValue;
			return;
		}
	}

	s1 = $(a1[0]).attr("value");
	poSelectTag.value = s1;
	
}

/**
* select 테그 객체에 option 를 쓴다. (여러개의 select 인 경우 모두 쓴다)
*/
function cSelectBox_writeOption(poSelectTag, paValue, paText, psFirstOptionText) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	if (!psFirstOptionText){
		psFirstOptionText = "선택하세요";
	}
		
	s2 = "<option value=\"\">" + psFirstOptionText + "</option>";
	for (i1 = 0; i1 < paText.length; i1++){
		s2 += "<option value=\"" + paValue[i1] + "\">" + paText[i1] + "</option>";
	}

	$(poSelectTag).html(s2);
}
function cSetButtonAboutMouse() {
	/*
	var sClickBgUrl = "url('/common/img/bg_trans_black.png') repeat, ";
	var a1 = new Array();
	var i1

	a1.push($(".mImgButton30_70_1"));
	a1.push($(".mImgButton30_2"));
	a1.push($(".mImgButton50_2"));
	a1.push($(".mImgButton70"));
	a1.push($(".mImgButton70_2"));
	a1.push($(".mImgButton70_2_2"));
	a1.push($(".mImgButton100_2"));
	a1.push($(".mImgButton150_2"));
	
	// mousedown 시 padding 이 틀리기 때문에 하지 않음.
	a1.push($(".mImgButton25_ht_15_2"));
	a1.push($(".mImgButton50_ht_15_2"));
	
	// 제거
	for (i1 = 0; i1 < a1.length; i1++){
		$(a1[i1]).unbind("mouseenter");
		$(a1[i1]).unbind("mouseleave");
		// 버튼이 나란이 있을 때 다음 버튼에도 영향을 줌
		//$(a1[i1]).unbind("mousedown", in_han_mousedown);
		//$(a1[i1]).unbind("mouseup", in_han_mouseup);
	}
	// 등록
	for (i1 = 0; i1 < a1.length; i1++){
		$(a1[i1]).hover(in_han_mouseover, in_han_mouseout);
		//$(a1[i1]).mousedown(in_han_mousedown);
		//$(a1[i1]).mouseup(in_han_mouseup);
	}

	function   in_han_mouseover() {
		var sClass = $(this).attr("class");

		if (sClass.indexOf("ImgButton_over") == -1){
			sClass += " ImgButton_over";
			$(this).attr("class", sClass);
		}
	}

	function   in_han_mouseout() {
		var sClass = $(this).attr("class");

		sClass = sClass.replace(/ ImgButton_over/g, "");
		sClass = sClass.replace(/ ImgButton_down/g, "");

		$(this).attr("class", sClass);
	}

	function   in_han_mousedown() {
		var oBackground = $(this).css("background");


		oBackground = sClickBgUrl + oBackground;

		$(this).css("background", oBackground);
	}

	function   in_han_mouseup() {
		var oBackground = $(this).css("background");
		var oRegExp = new RegExp(sClickBgUrl,"g");

		oBackground = oBackground.replace(oRegExp, "");

		$(this).css("background", oBackground);		
	}*/
}

 /**
  * 쿠키 설정
  * @param cookieName 쿠키명
  * @param cookieValue 쿠키값
  * @param expireDay 쿠키 유효날짜 (1, 2, 같은 숫자이다)
  */
 function cSetCookie( cookieName, cookieValue, expireDate )
 {
	  var today = new Date();
	  today.setDate( today.getDate() + parseInt( expireDate ) );
	  document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/; expires=" + today.toGMTString() + ";";
 }


/**
* form의 테그 중에서 disabled 되 있는것들을 해제하고, disabled 되 있던 객체들을 array 타입으로 리턴하는 함수입니다.
*  Pa: poForm - form 객체입니다.
*  Re:  disabled 되 있던 객체들을 array 타입으로 리턴합니다.

	예) aDisabledTags = cSetFormEnable(oForm); // 'TheForm' 객체를 인자값으로 넘겨주고, array 타입의 disabled 되 있던 객체들을 받는 코드입니다.
*/
function cSetFormEnable(poForm) {
	var aResult = new Array();

	in_push($(poForm).find("input[type='text']"));
	in_push($(poForm).find("input[type='radio']"));
	in_push($(poForm).find("input[type='checkbox']"));
	in_push($(poForm).find("select"));
	in_push($(poForm).find("textarea"));
	

	function   in_push(poThat) {
		var i1;

		for (i1 = 0; i1 < poThat.length; i1++){
			if (poThat[i1].disabled == true){
				poThat[i1].disabled = false;
				aResult.push(poThat[i1]);
			}
		}
	}

	return aResult;
}

/**
* 인자값으로 넘겨준 array 타입의 테그 객체들을 disabled 해 주는 함수입니다.
*  Pa: paFormTegArray - array 타입의 enabled 된 테그 객체들입니다.

	예) cSetFormDisable(aDisabledTags);
*/
function cSetFormDisable(paFormTegArray) {
	var i1;

	for (i1 = 0; i1 < paFormTegArray.length; i1++){
		paFormTegArray[i1].disabled = true;
	}
} 

/**
* 출력 함수.
  <주의점>
	- 체크박스로 출력할 tr을 지정할 경우 :
		- 체크박스 class 명을 '__checkBox_view__' 로 지정해야 한다.
	- 첫번째 td가 숫자이면서 나머지 td가 아무값도 없다면 출력하지 않습니다.
	   만약, 첫번째 td 가 숫자이면서, rowspan 이 적용되었을 경우, 다음 tr 의 첫번째 td가 숫자이면서, 다음 td들이 아무값도 없다면, 그 다음 tr은 출력되지 않습니다..;;
*  Pa: psTitle - 엑셀 파일의 이름입니다.
	 psTableId - 엑셀로 변환할 테이블 id 입니다.
	 psIframeName - 프레임 이름입니다.
	 piFormNum - 폼이름 뒤에 붙는 숫자입니다.
	 psParent - parent 일 경우에는 true입니다.
	 poTheadTable - thead 에 해당하는 table 입니다.
	 poTfootTable - tfoot 에 해당하는 table 입니다.
	 psTopStr - 리스트 위에 출력할 str.
	 paSearchTableId - 위 검색 테이블 id(미완성)
	 paSearchTableTempId - 위 검색 임시 테이블 id(미완성)
*/
function cSetPrint(psTitle, psTableId, psIframeName, piFormNum, psParent, poTheadTableId, poTfootTableId, psTopStr, paSearchTableId, paSearchTableTempId) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
	var TheForm;
	var sContents;
	var bNumberMode; // table 이 1, 2, 3 처럼 번호가 자동으로 있는 경우 true.
	//var bNumberMode_rowspan;
	var oTable, oTable_temp, aTr,  aTr_org, aTd,  aInput, sTrOnlyStr, sTrTemp
	var iRowSpan, iColSpan,iRowSpan_prevTd0 ;
	var iColspan, iRowspan;
	var oTheadTable, oTfootTable, addsTring, AppNameAndVer;

	if (poTheadTableId){
		oTheadTable = document.getElementById(poTheadTableId);
	}

	if (poTfootTableId){
		oTfootTable = document.getElementById(poTfootTableId);
	}

	if (!piFormNum){
		piFormNum = "";
	}

	TheForm = document.getElementsByName("_printForm" + piFormNum + "_")[0];

	if (!TheForm){
		s1 = "<form  method=\"post\" name=\"_printForm" + piFormNum + "_\" class =\"_printForm_\">";
		s1 += "<input type=\"hidden\" name=\"title\" >";
		s1 += "<input type=\"hidden\" name=\"searchTableHTML\" >";
		s1 += "<input type=\"hidden\" name=\"topHTML\" >";
		s1 += "<input type=\"hidden\" name=\"tableHTML\" >";
		s1 += "</form>";

		$("body").append(s1);
		TheForm = document.getElementsByName("_printForm" + piFormNum + "_")[0];
	}

	TheForm.title.value = "";
	TheForm.searchTableHTML.value = "";
	TheForm.topHTML.value = "";
	TheForm.tableHTML.value = "";
	
	if (psIframeName){
		oTable = eval(psIframeName).document.getElementById(psTableId);	
		
	}else if (psParent){
		oTable = parent.document.getElementById(psTableId);	
	}else{
		oTable = document.getElementById(psTableId);	
	}

	// searchTable 설정
	if (paSearchTableId){
		for (i1 = 0; i1 < paSearchTableId.length; i1++){

			in_setTemp(paSearchTableId[i1], paSearchTableTempId[i1]);

			TheForm.searchTableHTML.value += paSearchTableTempId[i1].outerHTML;
		}
	}

	// oTable 객체와 동일한 oTable_temp 객체를 만듭니다. 수정이 필요하기 때문에 temp 객체를 만듭니다.
	oTable_temp = $("body").children(".__getExcel_temp_table__")[0];
	if (!oTable_temp){
		$("body").append("<table class=\"__getExcel_temp_table__ hidden\"></table>");
		oTable_temp = $("body").children(".__getExcel_temp_table__")[0];
	}
	$(oTable_temp).html($(oTable).html());
	
	// temp table 설정
	in_setTemp(oTable, oTable_temp);
	
	AppNameAndVer = cGetAppNameAndVer();
	// IE, Opera, 그 밖의 다른 브라우저는 새창을 열어서 출력한다.
	if (AppNameAndVer[0] == "IE" || AppNameAndVer[0] == "Op" || AppNameAndVer[0] == "etc"){
		TheForm.target = "_blank";
		//alert(AppNameAndVer[0]);
	}else{
		o1 = $("body").find(".__getExcel_iframe__")[0];

		// excel 문서를 출력할 iframe 을 만듭니다.
		if (!o1){
			$("body").append("<iframe class=\"__getExcel_iframe__\" name=\"__getExcel_iframe__\" width=\"0\" height=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"0\">");
			o1 = $("body").find(".__getExcel_iframe__")[0];
		}

		TheForm.target = "__getExcel_iframe__";
	}
	
	// 위 문자열 설정
	if (psTopStr){
		TheForm.topHTML.value = psTopStr;
	}

	TheForm.title.value = encodeURIComponent(psTitle);
	TheForm.action = "/common/php/print/setPrint.php";

	TheForm.tableHTML.value = "";
	
	// thead 설정
	if (oTheadTable){
		if ($(oTheadTable).find("thead")[0]){
			TheForm.tableHTML.value = "<thead>";
			TheForm.tableHTML.value += $(oTheadTable).find("thead").html();
			TheForm.tableHTML.value += "</thead>";
		}
	}else{
		if ($(oTable_temp).find("thead")[0]){
			TheForm.tableHTML.value = "<thead>";
			TheForm.tableHTML.value += $(oTable_temp).find("thead").html();
			TheForm.tableHTML.value += "</thead>";
		}
	}

	TheForm.tableHTML.value += "<tbody>";

	aTr = $(oTable_temp).find("tbody").find("tr");
	aTr_org = $(oTable).find("tbody").find("tr"); // 원래 table 의 checkbox 의 checked 를 알아야 되므로.
	
	addsTring = "";
	o1 = $(aTr_org[0]).find(".__checkBox_view__")[0];
	if (!o1){
		addsTring += $(oTable_temp).find("tbody").html();
	}else{
		for (i1 = 0; i1 < aTr.length; i1++){
			//## aTr_org 으로 해야합니다. checkbox 검사하기 때문입니다.;;
			o1 = $(aTr_org[i1]).find(".__checkBox_view__")[0];

			// checkbox가 없거나, checkbox가 있을때, checkbox가 체크 되 있다면 실행합니다.
			if (!o1 || (o1 && o1.checked == true)){
				// ## [14.03.28] tr 의 내용을 그대로 가져오는 코드입니다. 그래서, 코드 실행 시간을 줄였습니다.
				addsTring += "<tr>";
				addsTring += $(aTr[i1]).html();
				addsTring += "</tr>";
			}
		}
	}

	TheForm.tableHTML.value += addsTring;	

	TheForm.tableHTML.value += "</tbody>";
	
	// tfoot 설정
	if (oTfootTable){
		if ($(oTfootTable).find("tfoot")[0]){
			//TheForm.tableHTML.value += "<tfoot>"; // 이렇게 하면 안되었다.
			TheForm.tableHTML.value += $(oTfootTable).find("tfoot").html();
			//TheForm.tableHTML.value += "</tfoot>";
		}
		
	}else{
		if ($(oTable_temp).find("tfoot")[0]){
			//TheForm.tableHTML.value += "<tfoot>"; // 이렇게 하면 안되었다.
			TheForm.tableHTML.value += $(oTable_temp).find("tfoot").html();
			//TheForm.tableHTML.value += "</tfoot>";
		}
	}
	
	//TheForm.target="_blank";
	TheForm.submit();
	
	// oTable_temp 를 삭제합니다..
	$(oTable_temp).remove();

	function   in_setTemp(poTable_org, poTable_temp) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		// table 에 input 이 있다면 temp table의 input 을 input 값으로 대체합니다.
		o1 = $(poTable_org).find("input:text");
		o2 = $(poTable_temp).find("input:text");
		for (i3 = 0; i3 < o1.length; i3++){
			$(o2[i3]).replaceWith(o1[i3].value);
		}

		// table 에 select 이 있다면 temp table의 select 을 select의 text로 대체합니다.
		o1 = $(poTable_org).find("select");
		o2 = $(poTable_temp).find("select");
		for (i3 = 0; i3 < o1.length; i3++){
			if (o1[i3].value){
				if ($(o1[i3]).children("option[value='" + o1[i3].value + "']")[0]){
					$(o2[i3]).replaceWith($(o1[i3]).children("option[value='" + o1[i3].value + "']").text());	
				}else{
					$(o2[i3]).replaceWith("");
				}
			}else{
				$(o2[i3]).replaceWith("");
			}
		}

		// a href 테그를 없애줌
		$(poTable_temp).find("a").removeAttr("href");
		$(poTable_temp).find("input:hidden").remove(); // hidden 필드 없앰
	}
}

/**
* input 나 select 나 textarea 테그에 readonly 설정을 하고, 백그라운드 색을 설정합니다.
  [13.10.10] select 박스는 background-color 만 변하도록 수정했습니다.
*  Pa: poInputOrSelect - input 나 select 나 textarea 객체입니다.
	 pbValue - true 또는 false 입니다. true이면 readonly 하고, false이면 readonly를 해제합니다.
	
	예)cSetReadOnly(TheForm.구분타이틀, true); // '구분타이틀' input 에 readonly로 설정합니다.
	  cSetReadOnly(TheForm.구분타이틀, false); // '구분타이틀' input 에 readonly를 해제합니다.
*/
function cSetReadOnly(poInputOrSelect, pbValue) {
	var style;
	var o1;
	
	if (poInputOrSelect.length){
		o1 = poInputOrSelect[0];
	}else{
		o1 = poInputOrSelect;
	}

	// input 박스 일 경우에만 readonly를 설정해 줍니다.([13.10.22] 정확해 되지 않아서 주석 처리했습니다.;;)
	//if (o1.toString().indexOf("Input") > -1){
		//alert(o1.toString());
		if (pbValue == true){
			$(poInputOrSelect).attr("readonly", true); // 설정
		}else{
			$(poInputOrSelect).removeAttr("readonly"); // 해제.
		}
	//}

	style = $(poInputOrSelect).attr("class");
	
	if (style){
		style = style.replace(/ mBgYellow/g, "");
	}

	if (pbValue == true){
		style += " mBgYellow";
	}

	$(poInputOrSelect).attr("class", style);
}

/**
* 
*  Pa: psDBTableName - table 이름
	paDBAutoIncreaseColumnName - 자동으로 늘어나야 되는 column 이름
	psCompleteCallBackFunc - upload 완료후 호출할 func이름 
		예) 'parent.completeUploadExcel()'
	psParsingEXEFilePath - EXE 파일 path
	psRequiredColumnName - 필수 column 이름들
	pbNowSubmit - 윈도우 창 띄우지 않고 바로 submit 하려면 true.
	psExcelFilePath - excel 파일 path
	psOldDataDel - oldData_del 변수 값
*  Re:
*/
function cSetUploadExcelAndSaveDB(psDBTableName, paDBAutoIncreaseColumnName, psCompleteCallBackFunc, psParsingEXEFilePath, psRequiredColumnName, pbNowSubmit, psExcelFilePath, psOldDataDel) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;	
	var TheForm;
	var sContents;
	var bNumberMode; // table 이 1, 2, 3 처럼 번호가 자동으로 있는 경우 true.
	//var bNumberMode_rowspan;
	var oTable, oTable_temp, aTr,  aTr_org, aTd,  aInput, sTrOnlyStr, sTrTemp
	var iRowSpan, iColSpan,iRowSpan_prevTd0 ;
	var iColspan, iRowspan;
	var oTheadTable, oTfootTable, addsTring;
	
	// form 객체 만들기
	TheForm = document.getElementsByName("_uploadExcelAndSaveDBForm_")[0];

	if (!TheForm){
		s1 = "<form  method=\"post\" name=\"_uploadExcelAndSaveDBForm_\" class =\"_uploadExcelAndSaveDBForm_\">";
		s1 += "<input type=\"hidden\" name=\"tableName\" >";
		s1 += "<input type=\"hidden\" name=\"columnNames\" >";
		s1 += "<input type=\"hidden\" name=\"columnNames_autoIncrease\">";
		s1 += "<input type=\"hidden\" name=\"columnNames_required\">";
		s1 += "<input type=\"hidden\" name=\"excelPath\" >";
		s1 += "<input type=\"hidden\" name=\"oldData_del\" >";
		s1 += "<input type=\"hidden\" name=\"completeCallBackFunc\" >";
		s1 += "</form>";

		$("body").append(s1);
		TheForm = document.getElementsByName("_uploadExcelAndSaveDBForm_")[0];
	}

	// iframe 만들기
	o1 = $("body").find("._uploadExcelAndSaveDBIframe_")[0];
	
	// excel 문서를 출력할 iframe 을 만듭니다.
	if (!o1){
		//$("body").append("<iframe class=\"_uploadExcelAndSaveDBIframe_\" name=\"_uploadExcelAndSaveDBIframe_\" width=\"100\" height=\"100\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"1\">");

		$("body").append("<iframe class=\"_uploadExcelAndSaveDBIframe_\" name=\"_uploadExcelAndSaveDBIframe_\" width=\"0\" height=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"  frameborder=\"0\">");
	}
	
	// columnNames 설정
	/*s1 = "";
	for (i1 = 0; i1 < paDBColumnName.length; i1++){
		s1 += paDBColumnName[i1] + ";%;";
	}

	s1 = s1.substr(0, s1.length - 3);*/
	
	// 자동 증가하는 column 설정
	s2 = "";
	if (paDBAutoIncreaseColumnName){
		for (i1 = 0; i1 < paDBAutoIncreaseColumnName.length; i1++){
			s2 += paDBAutoIncreaseColumnName[i1] + ";%;";
		}

		s2 = s2.substr(0, s2.length - 3);
	}
	
	// 필수 column 이름들 설정
	s3 = "";
	if (psRequiredColumnName){
		for (i1 = 0; i1 < psRequiredColumnName.length; i1++){
			s3 += psRequiredColumnName[i1] + ";%;";
		}

		s3 = s3.substr(0, s3.length - 3);
	}
		
	//alert(s3);
	TheForm.tableName.value = psDBTableName;
	//TheForm.columnNames.value = s1;
	TheForm.columnNames_autoIncrease.value = s2;
	TheForm.columnNames_required.value = s3;
	TheForm.excelPath.value = "";

	if (psCompleteCallBackFunc){
		TheForm.completeCallBackFunc.value = psCompleteCallBackFunc;
	}else{
		TheForm.completeCallBackFunc.value = "";
	}

	TheForm.target = "_uploadExcelAndSaveDBIframe_";
	
	if (psParsingEXEFilePath){
		TheForm.action = psParsingEXEFilePath;
	}else{
		TheForm.action = "/common/php/upload/uploadExcelAndSaveDBEXE.php";
	}
	
	// 바로 submit 한다면
	if (pbNowSubmit){
		if (!psOldDataDel){
			psOldDataDel = "";
		}

		TheForm.excelPath.value = psExcelFilePath;
		TheForm.oldData_del.value = psOldDataDel;

		TheForm.submit();
	}else{
		cOpenWindow2("/common/php/upload/uploadExcelAndSaveDB_popup_fileInputForm.php", "uploadExcelAndSaveDB_popup_fileInputForm", 420, 200);
	}
}
/**
* 한글인지 검사합니다.
*  Re: psValue 인자값의 모든 값이 한글일때만 true 리턴, 아니면 false 리턴
*/
function cString_hangul_check(psValue) {
	var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

	s1 = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; 

	i1 = psValue.search(s1);

	if (i1 == -1){
		b1 = true;
	}else{
		b1 = false;
	}

	return b1;
}

/**
* 검색에서 쓰이는 마지막 검색 단어를 리턴합니다.
   마지막이 한글이 아니면 그대로 리턴합니다.
*  Pa: psSearchWord - 검색할 단어

	예) s1 = cString_search_lastWord_get("김ㄱ"); // 김깋 리턴
	s1 = cString_search_lastWord_get("기"); // 깋 리턴
	s1 = cString_search_lastWord_get("김a"); // 김a 리턴
	s1 = cString_search_lastWord_get("김1"); // 김1 리턴
*/
function cString_search_lastWord_get(psSearchWord) {
	var a1, a2, a3, b1, b2, b3, i0, i1, i2, i3, i4, o1, o2, o3, s0, s1, s2 ,s3;
	var font_cho, font_jung, font_jong;
	var CompleteCode, UniValue, Jong, Jung, Cho;
	var sValue;

	sValue = "";

	if (!psSearchWord){
		return sValue;
	}
		

	font_cho = Array(
	'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
	'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
	'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' );  // 총 19개

	font_jung = Array(
	'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
	'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ',
	'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ',
	'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' );  // 21개

	font_jong = Array(
	'', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ',
	'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ',
	'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ); // 28개

	if (psSearchWord.length == 1){
		s0 = psSearchWord;
	}else{
		sValue = psSearchWord.substr(0, psSearchWord.length - 1);
		s0 = psSearchWord.substr(psSearchWord.length - 1);
	}

	if(!cString_hangul_check(s0)){
		return sValue += String(s0);	
	}

	CompleteCode = s0.charCodeAt(0);
	UniValue = CompleteCode - 0xAC00;

	Jong = UniValue % 28;
	Jung = ( ( UniValue - Jong ) / 28 ) % 21;
	Cho = parseInt (( ( UniValue - Jong ) / 28 ) / 21);

	//alert(Jong);

	s1 = String.fromCharCode(0xAC00 + Cho * 21 * 28 + Jung * 28 + Jong);

	//alert(s1);
	if (Cho < 0){ // 초성 1개이다.
		//alert("a");
		b1 = false;
		for (i1 = 0; i1 < font_cho.length; i1++){
			if (font_cho[i1] == s1){
				b1 = true;
				break;
			}
		}

		if (b1){
			i2 =  i1;
			i3 = font_jung.length - 1; // 중성
			i4 = font_jong.length - 1; // 종성

			
			sValue += String.fromCharCode(0xAC00 + ((i2) * 21 * 28) + ((i3)* 28) + (i4)) ;
		}else{ // 못찾을 경우는 초성이 아닐 경우이다.
			sValue += String(s0);	
		}
	}else{
		if (!Jong){ // 종성이 없다면
			i2 = 0; // 초성
			i3 = 0; // 중성
			i4 = font_jong.length - 1; // 종성
		}else{

			i2 = 0; // 초성
			i3 = 0; // 중성
			i4 = 0; // 종성
		}
		
		sValue += String.fromCharCode(0xAC00 + ((Cho + i2) * 21 * 28) + ((Jung + i3)* 28) + (Jong + i4)) 
	}

	return sValue;
}

/**
* TransTopPanel 을 생성해서 리턴한다.
*  Pa: poThat - TransTopPanel을 보일 객체, null 이면 window 가 된다.
*/
function cTransTopPanel(poThat) {
	var oTopPanel;

	if (!poThat){
		poThat = window;
	}

	oTopPanel = new TransTopPanel2("#ffffff", "0.7", false, poThat, "/common/img/img_loading01.gif", false, true, true, "fast");

	return oTopPanel;
}

/**
* ajax 방식으로 문서를 로드하는 함수입니다.
*  Pa: psTitle - 윈도우 창의 제목입니다.
	 psURL - 로드할 문서의 URL 입니다.
	 poCloseCallBackFunc - '닫기' 버튼을 클릭했을 때 호출할 함수 포인터 입니다.
	 poCompleteFunc - 'complete' 되면 호출할 함수 포인터

   Re : array 변수를 리턴합니다.
	array[0] : WindowJS 객체입니다.
	array[1] : '닫기' 눌렀을 때 호출되는 함수 포인터 입니다.

	 예) array1 = cWindowJS("이름 검색", "studentReg_student_search.php" + sQuery, std_search_pop_close);
*/
function cWindowJS(psTitle, psURL, poCloseCallBackFunc, poCompleteFunc, psShapeType) {
	var oWindowJS = new WindowJS(psTitle, in_han_close_window, psShapeType);
	oWindowJS.addEventListener("complete", poCompleteFunc);
	oWindowJS.showLoadDoc(psURL);
	
	// 리턴 값으로 2가지를 준다.
	return [oWindowJS, in_han_close_window];

	function   in_han_close_window() {
		oWindowJS.hide();

		if (poCloseCallBackFunc){
			poCloseCallBackFunc();
		}
	}

}

/**
* ajax 방식으로 문서를 로드하면서 흰색으로 판넬을 생성하는 함수입니다.
*  Pa: psTitle - 윈도우 창의 제목입니다.
	 psURL - 로드할 문서의 URL 입니다.
	 poCloseCallBackFunc - '닫기' 버튼을 클릭했을 때 호출할 함수 객체입니다.

   Re : array 변수를 리턴합니다.
	array[0] : WindowJS 객체입니다.
	array[1] : TransTopPanel2 객체입니다.
	array[2] : '닫기' 눌렀을 때 호출되는 함수 포인터 입니다.

	 예) array1 = cWindowJSPanel("이름 검색", "studentReg_student_search.php" + sQuery, std_search_pop_close);
*/
function cWindowJSPanel(psTitle, psURL, poCloseCallBackFunc) {
	var oTopPanel = new TransTopPanel2("#ffffff", "0.7", false, window, "", false, true, true, "fast");
	var oWindowJS = new WindowJS(psTitle, in_han_close_window);
	
	oTopPanel.show();
	oWindowJS.showLoadDoc(psURL);
	
	// 리턴 값으로 3가지를 준다.
	return [oWindowJS, oTopPanel, in_han_close_window];

	function   in_han_close_window() {
		oTopPanel.hide();
		oWindowJS.hide();

		if (poCloseCallBackFunc){
			poCloseCallBackFunc();
		}
	}

}
function cWindowClose() {
	window.close();
}

$(document).ready(cReadyDocument);