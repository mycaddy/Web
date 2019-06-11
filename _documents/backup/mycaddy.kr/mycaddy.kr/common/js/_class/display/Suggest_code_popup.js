/**
   <필요 파일들> 
<link rel="stylesheet" type="text/css" href="/common/style/suggest/suggest.css" >

<script type="text/javascript" src="/common/js/[function]/event/mf_eventHadlerSet.js"></script>
<script type="text/javascript" src="/common/js/[function]/display/mf_getTotalWtHt.js"></script>
<script type="text/javascript" src="/common/js/[function]/display/mf_getTotalOuterWtHt.js"></script>
<script type="text/javascript" src="/common/js/[class]/display/TransTopPanel2.js"></script>
<script type="text/javascript" src="/common/js/[class]/net/AjaxJS.js"></script>
<script type="text/javascript" src="/common/js/[class]/display/Suggest_code_popup.js"></script>

* <설명>
	<결과 리스트의 처음, 마지막에 리스트를 추가하는 경우>
		- var oGndms = new Suggest_code_popup(TheForm.도매간납처, TheForm.도매간납처명,"AA10", "", "", 200, 150); // 쿼리도 같이 사용하는 경우
		- var oGndms = new Suggest_code_popup(TheForm.도매간납처, TheForm.도매간납처명,"", "", "", 200, 150); // 쿼리가 필요 없는 경우.
		-oGndms.prependValue(["zz", "zzz", "zzzzz"]); // 처음에 리스트를 추가합니다.
		- oGndms.appendValue(["aa", "bb", "cc"]); // 마지막에 리스트를 추가합니다.
	<input 이 array 일 경우>
		- 하나의 suggest를 만들어서, input array에 공유한다.
		- 예)  // 아래 처럼 document.getElementsByName(..)으로 input을 넘긴다.
			new Suggest_code_popup(document.getElementsByName("SA12005[]"), document.getElementsByName("SA12005_name[]") ...);
	<검색 리스크가 많을 때>
		- setEnterEnable(true)를 호출해서 엔터 누를때마다 리스트를 로드하게 합니다.
			- order by를 처음에 설정하지 않아도 됩니다. 자동으로 order by 됩니다.
			- 리스트가 많기 때문에, setEnterMinStrLen(...) 함수를 호출해서 입력되는 최소 문자길이를 설정하는 것이 좋습니다.
	<실행 순서 예.>
		1. 컬럼 추가 삭제.
			oSw.addColumnAndInput("TAB0.SA05003", document.getElementById("yasw3")); // sugget에 컬럼이 추가되고, input 을 추가합니다.
			oSw.addColumnAndWriteInput("TAB0.SA05003", TheForm.yasw3); // sugget에 컬럼이 추가되고, 쓰기만 하는 input 을 추가합니다.
			oSw.addColumn("TAB0.SA05004"); // 등록
			oSw.delColumn("TAB0.SA05004");  // 삭제
			oSw.delColumnAndInput("TAB0.SA05003", document.getElementById("yasw3")); // 삭제
			oSw.load();
		2. where 절 수정 할 경우. (SSUB01003.php에 적용)
			oSw.delWhereAll();
			oSw.addWhere("SUBSTRING(SA05003,3,2) = '" + this.value + "'");
			oSw.load();
		3. enter 모드로 설정할 경우
			oSw.setEnterMinStrLen(2);
			oSw.setEnterEnable();

	- ajax 가 로드 중일 때, 중복 로드가 안됩니다. 로드가 끝나야 다시 로드를 시작할 수 있습니다.
	- load() 함수를 호출해야 로드 시작합니다. setEnterEnable(true) 일때는 enter 를 눌렀을 때 자동 로드 되기때문에 load() 메서드를 호출 안합니다.
	- addColumn() 메서드는 다른 addColumn...() 메서드를 모두 호출한 뒤 나중에 호출합니다.
	  그래야, column과 input 이 쌍을 이루기 때문에, 리스트 결과를 클릭했을때 input 에 값이 정확히 들어갑니다.
	  삭제 할때도.. delColumn() 부터 먼저 삭제하고 delColumn...() 을 호출합니다.
	- 모든 숫자는 0부터 시작합니다.
	- select 절의 컬럼의 순서는 input 순서와 동일합니다. 단, addColumn(...)으로 컬럼을 추가했을때는 틀려집니다.
*  param : psGubun - 
			- deptcode : (테이블 : deptmaster) 
*			- empcode : (테이블 : empmaster) 
*			- acccode : (테이블 : accmaster)
*			- 숫자일 경우 : (테이블 : codemaster) codemaster 의 codeid 값으로 설정됩니다.
			- 기타 여러가지 경우가 있습니다.  th_setQuery() 함수에 보시면 if 문으로 설정된것을 보실 수 있으십니다..
*/
function Suggest_code_popup(poInput1, poInput2, psGubun, psWhere, psOrderby , piWidth , piHeight) {
	
	var aInputs = new Array(); // 입력 input 들. 1차원이나 2차원 배열이다.
	var aInputs_original = new Array(); 
	var aInputs_temp = new Array(); 
	var aInputs_isInput = new Array();  // 1차원 배열로 입력과 출력을 하는 input 이면 true, 출력만 받는 input 이면 false. 
	var aInputs_event_focus = new Array(); // 입력 input 에 포커드 되있다면 true.
	var aInputs_2DimenIdx; // input 테그가 배열일 경우, 'aInputs' 변수의 2차 index 번호 저장. 포커스 받을 때 저장된다.
	var aInputs_lastFocusInput; // 마지막으로 focus 된 input 객체를 저장하는 변수.
	//var aInputs_prevValue = new Array(); // input에 입력된 이전 값들. 1차원이나 2차원 배열이다.

	var sQuery_gubun = psGubun;  //구분 : deptcode, empcode, 01,02 ...........................
	var sQuery_select = ""; // select 절 저장 변수 (original + temp 를 더한 문자열)
	var sQuery_select_original;  // 기본 select 문
	var sQuery_select_original_new;  // 기본 select 문을 새롭게 변경한 것입니다.
	var sQuery_select_temp = new Array(); // add...() 함수로 추가한 것들
	var sQuery_from = ""; 
	var sQuery_from_original; 
	var sQuery_from_temp = new Array(); 
	var sQuery_where = ""; 
	var sQuery_where_original = psWhere;
	var sQuery_where_temp = new Array();
	var sQuery_orderby = "";
	var sQuery_orderby_original = psOrderby;
	var sQuery_orderby_temp = new Array();

	var iResultMaxNum = 100000; // suggest의 최대 결과값 출력 갯수입니다.

	var bEnable = true; // 활성화, 비활성화 
	
	var sQuery ;   //sQuery 전체 문.
	var sQuery_columnLen; // query 문의 컬럼수(select 절의 column 갯수)

	var bInWhere = false; // sql 문에 where 가 들어가 있다면 true.
	var bInOrderby = false; // sql 문에 order by 가 들어가 있다면 true.
	
	//var sPhpSrc = "/common/php/suggest/suggest_code_popup.php";
	var sPhpSrc = "/common/php/suggest/suggest_code_popup.php";
	var sResultIdFirst = "__suggest_code_popup_result_";
	var sIdFirst = "__suggest_code_popup_";
	
	var oListener_complete; // DB에서 결과값을 모두 로드 완료하면 호출합니다.
	var oListener_enter; // input 에 엔터를 눌렀을 때 호출되는 함수 저장. (input 객체를 인자값으로 넘겨줌)
	var oListener_keyup; // keyup
	var oListener_resultClick; // 결과 리스트를 클릭했을때(input에 모두 쓰고 난 후) 호출되는 함수 저장. (this를 인자값으로 넘겨줌)
	var oListener_resultFound; //결과 리스트가 있을 때 호출되는 함수 저장.
	var oListener_resultNoFound; // 결과 리스트가 없을 때  호출되는 함수 저장.
	var oListener_writeInput; //input 테그에 결과 값을 쓰고 난 후  호출되는 함수 저장. (input 객체를 인자값으로 넘겨줌)

	var bEnter_Enable = false; // enter 키를 눌렀을 때 문서를 로드하는 방식이면 true.
	var iEnter_minStrLen = 0; // 최소 글자 수.
	var iEnter_minStrLen_showAlert = true;
	var sEnter_inputPrevValue = new Array();
	var iEnter_enterInputIdx; // 마지막 엔터 누른 input 의 idx
	var bEnter_ajax_complete = new Array();
	var sEnter_query_where = new Array(); // where 절 query
	var sEnter_query_orderby = new Array(); // order by 절 query

	var bKeyup_enable = false;

	var bDirectLoad = false;

	var bAutoWriteInput = false; // 결과 갯수가 하나일 경우 자동으로 input 에 결과 값을 출력할지 여부. true이면 자동 출력합니다.

	var bCompleted = false; // DB에서 결과값을 모두 로드 완료되었다면 true.

	var iWidth = 160;
	var iHeight = 100;
	var iMinWidth = 100; // resize 의 최소 넓이
	var iMinHeight = 100;

	var aThis = new Array(); // sugget 객체를 가지고 있는 1차원 배열. 
	var aThis_childWrap = new Array(); // sugget wrap 객체를 가지고 있는 1차원 배열. 
	var aThis_id = new Array(); // suggest 객체의 id를 가지고 있는 1차원 배열. 
	var aThis_event_mouseOver = new Array(); // sugget 객체가 mouseOver 되있다면 true;
	var aThis_event_resizing = new Array(); // sugget 객체가 resize 중이라면 true;
	//var aThis_hasResult = new Array(); // suggest 객체에 값이 있다면 true.
	var aThis_thead_columnName; // thead 의 컬럼명들
	var sThis_class; // class 명

	var aValue_append = new Array(); // 결과 리스트의 마지막에 쓰여질 값입니다. 2차원 배열입니다.
	var aValue_prepend = new Array(); // 결과 리스트의 처음에 쓰여질 값입니다.2차원 배열입니다.

	var aWhereLikeColumnName = new Array(); // 검색 되어지는 where 문의 like 절의 컬럼 명입니다.

	var bLocation_top = false; //suggest를 위에 보이게 할 경우 true로 설정됩니다.

	var bListCountOneAutoClick = false; // 리스트가 하나일때 자동 click 하는지 여부

	var oTopPanel = new Array(); // TransTopPanel2 객체이다.
	var oTopPanel_loadingImgSrc = "/common/img/viewLoading_small.gif";

	var bNotResult; // 결과 값이 없다면 false, 있다면 true.
	var sNotResultStr = "결과값이 없습니다."; // 결과 값이 없을 때 보여지는 문자열입니다.
	var bNoResultValueStr = true; // 'sNotResultStr' 변수를 보일지 여부

	var oResult; // ajax로 쓰여지는 div 객체
	
	var aColumn = new Array(); // result 객체에서 column을 저장. 2차원 배열로 저장된다.
	var aColumn_isView = new Array(); // suggest의 컬럼이 보여지는 true, 숨겨져 있으면 false.
	var aColumn_only = new Array(); // suggest의 컬럼만 추가하는 경우(addColumn() 함수로 한 경우) true, 아니면 false;

	var oArrowUpDown_selectTr; // 키보드 위아래 눌렀을때 마우스 오버 된 tr 객체 저장변수.
	var oArrowUpDown_selectTr_css_td_bgColor = "#48C3D3";
	var oArrowUpDown_selectTr_css_td_span_color = "#FFFFFF";

	var iCookie_expires = 30; // 쿠키 유효기간 날짜

	var oAjax;
	var bAjax_complete = true; // ajax가 문서 로드 완료되면 true.
	
	function main() {
		if ( piWidth != 0 )
			iWidth = piWidth;
		if (  piHeight != 0 )
			iHeight = piHeight;

		aInputs_original.push(poInput1);
		aInputs_original.push(poInput2);

		aInputs.push(poInput1);
		aInputs.push(poInput2);

		//alert(poInput1.length + ", " +poInput2.length);

		aInputs_isInput.push(true);
		aInputs_isInput.push(true);

		aColumn_isView.push(true);
		aColumn_isView.push(true);

		aColumn_only.push(false);
		aColumn_only.push(false);
		
		th_setQuery();
		

		th_makeThis(0);
		th_makeThis(1);

		th_makeResult();

		reg_event(0);
		reg_event(1);
		
		oAjax = new AjaxJS(oResult, false);
		oAjax.addEventListener("complete3", han_ajaxComplete3);
		//th_loadGet();
	}
	
	/**
	* sugget에 컬럼만  추가됩니다.(input은 추가 안할 경우 사용합니다.)
	*  예) addColumn("TAB0.SA05003");
	*/
	function addColumn(psColumnName) {
		// 컬럼만 추가하는지 여부, 순서대로 input에 넣어야 되기 때문입니다.
		th_setColumnOnly(true);

		th_setColumnViewAndQuery(true, psColumnName);
	}
	this.addColumn = addColumn;

	/**
	* sugget에 컬럼이 추가되고, input 을 추가합니다.
	*  예) addColumnAndInput("TAB0.SA05003", TheForm.yasw);
	*/
	function addColumnAndInput(psColumnName, poInput) {
		// 컬럼만 추가하는지 여부, 순서대로 input에 넣어야 되기 때문입니다.
		th_setColumnOnly(false);

		th_setColumnViewAndQuery(true, psColumnName);

		th_setInputs(poInput, true);
		
		th_makeThis(aInputs.length - 1);

		if (bEnter_Enable || bKeyup_enable){
			th_makeTopPanel(aInputs.length - 1);
			bEnter_ajax_complete[aInputs.length - 1] = true;
		}
		reg_event(aInputs.length - 1);
	}	this.addColumnAndInput = addColumnAndInput;

	/**
	* sugget에 컬럼이 추가되고, 쓰기만 하는 input 을 추가합니다.
	   쓰기만 하는 input 이기 때문에 suggest가 생기지 않습니다.
	*  예) addColumnAndWriteInput("TAB0.SA05003", TheForm.yasw3);
	*/
	function addColumnAndWriteInput(psColumnName, poInput) {
		// 컬럼만 추가하는지 여부, 순서대로 input에 넣어야 되기 때문입니다.
		th_setColumnOnly(false);

		th_setColumnViewAndQuery(true, psColumnName);

		th_setInputs(poInput, false);
	}
	this.addColumnAndWriteInput = addColumnAndWriteInput;

	/**
	* sugget에 안보이는 컬럼이 추가되고, input 을 추가합니다.
	*  예) addHideColumnAndInput("TAB0.SA05003", TheForm.yasw3);
	*/
	function addHideColumnAndInput(psColumnName, poInput) {
		// 컬럼만 추가하는지 여부, 순서대로 input에 넣어야 되기 때문입니다.
		th_setColumnOnly(false);

		th_setColumnViewAndQuery(false, psColumnName);

		th_setInputs(poInput, true);

		th_makeThis(aInputs.length - 1);

		if (bEnter_Enable || bKeyup_enable){
			th_makeTopPanel(aInputs.length - 1);
			bEnter_ajax_complete[aInputs.length - 1] = true;
		}

		reg_event(aInputs.length - 1);
	}
	this.addHideColumnAndInput = addHideColumnAndInput;

	/**
	* sugget에 안보이는 컬럼이 추가되고, 쓰기만 하는 input 을 추가합니다.
	   쓰기만 하는 input 이기 때문에 suggest가 생기지 않습니다.
	*  예) addHideColumnAndWriteInput("TAB0.SA05003", TheForm.yasw3);
	*/
	function addHideColumnAndWriteInput(psColumnName, poInput) {
		// 컬럼만 추가하는지 여부, 순서대로 input에 넣어야 되기 때문입니다.
		th_setColumnOnly(false);

		th_setColumnViewAndQuery(false, psColumnName);

		th_setInputs(poInput, false);
	}
	this.addHideColumnAndWriteInput = addHideColumnAndWriteInput;


	/**
	* 콜백 함수를 등록합니다.
	*  Pa: psType - 
			'complete' (DB에서 결과값을 모두 로드 완료하면 호출합니다.)
			'enter'(엔터 눌렀을때 등록한 콜백함수를 호출합니다.) (input 를 인자값으로 넘겨줌)
			'keyup'(keyup 눌렀을때 등록한 콜백함수를 호출합니다.) (input 를 인자값으로 넘겨줌)
			'resultClick'(결과 리스트를 클릭했을때(input에 모두 쓰고 난 후) 등록한 콜백함수를 호출합니다.),  (this를 인자값으로 넘겨줌)
				- this 인자값의 html은 "...<td><span value="ABC">ABC</span></td><td><span value="def">def</span></td>..." 이런 식입니다.
			'resultFound'(결과 리스트가 있을 때 등록한 콜백함수를 호출합니다.),
			'resultNoFound'(결과 리스트가 없을 때 등록한 콜백함수를 호출합니다.)
			'writeInput'(input 테그에 결과 값을 쓰고 난 후 콜백함수를 호출합니다.) (input 객체를 인자값으로 넘겨줌)
		poListener - 등록할 콜백 함수.
	*/
	function addEventListener(psType, poListener) {
		if (psType == "complete"){
			oListener_complete = poListener;
		}else if (psType == "enter"){
			oListener_enter = poListener;
		}else if (psType == "keyup"){
			oListener_keyup = poListener;
		}else if (psType == "resultClick"){
			oListener_resultClick = poListener;
		}else if (psType == "resultFound"){
			oListener_resultFound = poListener;
		}else if (psType == "resultNoFound"){
			oListener_resultNoFound = poListener;
		}else if (psType == "writeInput"){
			oListener_writeInput = poListener;
		}
	}
	this.addEventListener = addEventListener;
	
	/**
	* 쿼리문의 from 절에 문자열을 추가합니다.
	   'inner join', 'outer join' 같은 콤마로 연결되는 것이 아닌경우에 이 함수를 사용합니다.
	*/
	function addFrom(psFrom) {
		sQuery_from_temp.push(" " + psFrom);

		th_setQuery();
	}
	this.addFrom = addFrom;

	/**
	* 쿼리문의 from 절에 문자열을 추가합니다.
	  ',(콤마)'로 연결합니다.
	    예) addFromByComma(" SA01, SA02 "); // SA01과 SA02 테이블을 추가합니다.
	*/
	function addFromByComma(psFrom) {
		sQuery_from_temp.push(" , " + psFrom);

		th_setQuery();
	}
	this.addFromByComma = addFromByComma;
	/**
	* 쿼리문의 order by 절을 추가합니다. 
	*  예) suggest1.addOrderBy("KB03005");
	*/
	function addOrderBy(psOrderBy) {
		sQuery_orderby_temp.push(psOrderBy);

		th_setQuery();
	}
	this.addOrderBy = addOrderBy;

	/**
	* 쿼리문의 where 절에 문자열을 추가합니다. and로 연결됩니다.
	*  예) addWhere("SUBSTRING(SA05003,3,2) = 't'");
	*/
	function addWhere(psWhere) {
		sQuery_where_temp.push(psWhere);

		th_setQuery();
	}
	this.addWhere = addWhere;
	
	/**
	* 결과 리스트의 제일 마지막에 리스트를 추가하는 함수입니다.
	*  Pa: paValue - 결과 리스트 뒤에 넣을 값(Array 객체)입니다.
		예) suggest.appendValue(["aa", "bb", "cc"]);
	*/
	function appendValue(paValue) {
		aValue_append.push(paValue);
	}
	this.appendValue = appendValue;
	
	/**
	* 쿼리문에서 기본적인 select 절을 변경합니다.
	   기본적인 select 문이란.. sQuery_gubun 에 따라서.. 기본적으로 select 절이 저절로 생성되는 것을 말합니다.
	  sQuery_gubun 이 'AA10' 이라면 기본적으로 select 절은 'ITEMCODE, ITEMNAME' 으로 설정됩니다.
	*  Pa: psSelect - 변경할 select 절입니다.
		예) 1. changeBasicSelectQuery("SA41003, ITEMNAME");
		       (적용 파일 : SSUB01036.php 에 적용했습니다.)
		   2. 
			var 사원suggest = new Suggest_code_popup(TheForm.작성자, TheForm.부서명,"empcode", "EmpStatus <> 'RETR' AND DefaultDept = DEPTCODE", "",320,200);
			사원suggest.changeBasicSelectQuery("EMPNAME, DEPTNAME");
			사원suggest.addFromByComma("DeptMaster");
			사원suggest.addColumnAndInput("EMPCODE", TheForm.사원번호);
			사원suggest.addColumnAndInput("DEPTCODE", TheForm.부서코드);
			사원suggest.setEnterMinStrLen(1);
			사원suggest.setEnterEnable();
		       (적용 파일 : SSUB19006.php 에 적용했습니다.)
	*/
	function changeBasicSelectQuery(psSelect) {
		sQuery_select_original_new = psSelect;
		
		th_setQuery();
	}
	this.changeBasicSelectQuery = changeBasicSelectQuery;
	
	
	/**
	키보드 위아래 눌렀을때 마우스 오버 된 tr 객체 저장변수를 지웁니다.
	*/
	function clearArrowUpDownSelectTr() {
		$(oArrowUpDown_selectTr).removeClass("arrowSelect");

		oArrowUpDown_selectTr = null;
	}
	this.clearArrowUpDownSelectTr = clearArrowUpDownSelectTr;

	/**
	* 결과 리스트를 모두 지웁니다.
	*/
	function clearList() {
		var i1;
		
		// 결과 값을 지웁니다.
		for (i1 = 0; i1 < aThis_childWrap.length; i1++){
			$(aThis_childWrap[i1]).html("");
		}

		// 톱판넬을 hide 합니다.
		for (i1 = 0; i1 < aInputs_event_focus.length; i1++){
			if (aInputs_event_focus[i1] == true){
				// toptranspanel 객체가 aThis 의 자식으로 만들어 지기 때문에...
				if (oTopPanel[i1]){
					oTopPanel[i1].hide();	
				}
				break;
			}
		}
	}
	this.clearList = clearList;
	
	/**
	* suggest 와 input 에 관련된 것을 모두 삭제합니다.
	*/
	function delAll() {
		var i1;

		// aInputs 관련
		for (i1 = 0; i1 < aInputs.length; i1++){
			del_event(i1);
		}
		aInputs = new Array();
		
		// aThis 관련
		for (i1 = 0; i1 < aThis.length; i1++){
			$(aThis[i1]).remove();
		}
		aThis = new Array();
		
		// bEnter_Enable 관련
		//if (bEnter_Enable){
		for (i1 = 0; i1 < oTopPanel.length; i1++){
			$(oTopPanel[i1]).remove();
		}
		//}
		oTopPanel = new Array();

	}
	this.delAll = delAll;
	
	/**
	* 결과 리스트의 제일 마지막에 넣는 리스트를 모두 삭제합니다.
	*/
	function delAllAppendValue() {
		aValue_append = new Array();
	}
	this.delAllAppendValue = delAllAppendValue;

	
	/**
	* 결과 리스트의 제일 상단에 넣는 리스트를 모두 삭제합니다.
	*/
	function delAllPrependValue() {
		aValue_prepend = new Array();
	}
	this.delAllPrependValue = delAllPrependValue;

	
	/**
	* suggest의 column 만 삭제합니다. (addColumn(...) 함수로 등록한 column을 삭제할 때 쓰입니다.)
	*  예) delColumn("TAB0.SA05004");
	*/
	function delColumn(psColumnName) {
		var i1, a1, a2, o1;

		// sQuery_select_temp 삭제.
		for (i1 = 0; i1 < sQuery_select_temp.length; i1++){
			//alert(sQuery_select_temp);
			if (sQuery_select_temp[i1] == psColumnName){
				//alert(i1);
				if (i1 == 0){
					sQuery_select_temp.shift();
					break;
				}else{
					a1 = sQuery_select_temp.splice(0, i1);
					a2 =  sQuery_select_temp.splice(i1, sQuery_select_temp.length - i1);
					sQuery_select_temp = a1.concat(a2);
					break;
				}
			}
		}
		// 오브젝트 저장.
		o1 = aInputs_temp[i1];

		// aColumn_isView 삭제.
		for (i1 = 0; i1 < aColumn_isView.length; i1++){
			//alert(aInputs);
			if (aColumn_isView[i1] == o1){
				//alert(i1);
				if (i1 == 0){
					aColumn_isView.shift();
					break;
				}else{
					a1 = aColumn_isView.splice(0, i1);
					a2 =  aColumn_isView.splice(i1, aColumn_isView.length - i1);
					aColumn_isView = a1.concat(a2);
					break;
				}
			}
		}
	}
	this.delColumn = delColumn;
	 
	/**
	* suggest의 column 과 input 의 관한 것들을 삭제합니다.  (addColumn... (...) 함수로 등록한 column과 input 을 삭제할 때 쓰입니다.)
	*  예) delColumnAndInput("TAB0.SA05003", document.getElementById("yasw3"));
	*/
	function delColumnAndInput(psColumnName, poInput) {
		var o1, i1, a1, a2;

		// sQuery_select_temp 삭제.
		for (i1 = 0; i1 < sQuery_select_temp.length; i1++){
			//alert(sQuery_select_temp);
			if (sQuery_select_temp[i1] == psColumnName){
				//alert(i1);
				if (i1 == 0){
					sQuery_select_temp.shift();
					break;
				}else{
					a1 = sQuery_select_temp.splice(0, i1);
					a2 =  sQuery_select_temp.splice(i1, sQuery_select_temp.length - i1);
					sQuery_select_temp = a1.concat(a2);
					break;
				}
			}
		}
		// 오브젝트 저장.
		o1 = aInputs_temp[i1];

		// aInputs_temp 삭제.
		in_delArray(i1, aInputs_temp);

		// aInputs 삭제
		for (i1 = 0; i1 < aInputs.length; i1++){
			//alert(aInputs);
			if (aInputs[i1] == o1){
				//이벤트 삭제
				del_event(i1);
				if (i1 == 0){
					aInputs.shift();
					break;
				}else{
					a1 = aInputs.splice(0, i1);
					a2 =  aInputs.splice(i1, aInputs.length - i1);
					aInputs = a1.concat(a2);
					break;
				}
			}
		}

		// aColumn_isView 삭제.
		in_delArray(i1, aColumn_isView);

		// This 삭제
		$(aThis[i1]).remove();

		
		// aThis_id 삭제.
		in_delArray(i1, aThis_id);

		// aThis_event_mouseOver 삭제.
		in_delArray(i1, aThis_event_mouseOver);

		// aThis_event_resizing 삭제.
		in_delArray(i1, aThis_event_resizing);

		if (bEnter_Enable || bKeyup_enable){
			in_delArray(i1, sEnter_inputPrevValue);
			in_delArray(i1, bEnter_ajax_complete);
			in_delArray(i1, sEnter_query_where);
			in_delArray(i1, sEnter_query_orderby);
			
		}
		$(oTopPanel[i1]).remove();

		th_setQuery();

		function   in_delArray(piIdx, paArray) {
			if (piIdx == 0){
				paArray.shift();
			}else{
				a1 = paArray.splice(0, i1);
				a2 =  paArray.splice(i1, paArray.length - i1);
				paArray = a1.concat(a2);
			}			
		}
	}
	this.delColumnAndInput = delColumnAndInput;

	/**
	* 쿼리문의 임시 from 절을 삭제합니다. (addFrom(), addFromByComma() 함수로 추가한 것들만 삭제할 수 있습니다.)
	*/
	function delFromAll() {
		sQuery_from_temp = new Array();
		th_setQuery();		
	}
	this.delFromAll = delFromAll;
	
	/**
	* 쿼리문의 임시 order by 절을 삭제합니다. (addOrderBy(...)함수로 추가한 것들만 삭제할 수 있습니다.)
	*  예) 
	*/
	function delOrderByAll() {
		sQuery_orderby_temp = new Array();
		th_setQuery();
	}
	this.delOrderByAll = delOrderByAll;

	/**
	* 쿼리문의 임시 where 절의 문자를 삭제합니다. (addWhere(...)함수로 추가한 것들만 삭제할 수 있습니다.)
	*  예) delWhere("SUBSTRING(SA05003,3,2) = 't'");
	*/
	function delWhere(psWhere) {
		var i1, a1, a2;

		for (i1 = 0; i1 < sQuery_where_temp.length; i1++){
			if (sQuery_where_temp[i1] == psWhere){
				if (i1 == 0){
					sQuery_where_temp.shift();
					break;
				}else{
					a1 = sQuery_where_temp.splice(0, i1);
					a2 =  sQuery_where_temp.splice(i1, sQuery_where_temp.length - i1);
					sQuery_where_temp = a1.concat(a2);
					break;
				}
			}
		}

		th_setQuery();
	}
	this.delWhere = delWhere;
	

	/**
	* 쿼리문의 임시 where 절을 삭제합니다. (addWhere(...)함수로 추가한 것들만 삭제할 수 있습니다.)
	*  예) delWhereAll();
	*/
	function delWhereAll() {
		sQuery_where_temp = new Array();
		th_setQuery();
	}
	this.delWhereAll = delWhereAll;

	/**
	* 쿼리문의 임시 where 절의 문자를 index 숫자로 삭제합니다.  (addWhere(...)함수로 추가한 것들만 삭제할 수 있습니다.)
	  예) delWhereByNum(0);
	*  Pa: piIdx - 0부터 시작.
	*/
	function delWhereByNum(piIdx) {
		var a1, a2;
		if (sQuery_where_temp.length){
			if (piIdx == 0){
				sQuery_where_temp.shift();
			}else{
				a1 = sQuery_where_temp.splice(0, piIdx);
				a2 =  sQuery_where_temp.splice(piIdx, sQuery_where_temp.length - piIdx);
				sQuery_where_temp = a1.concat(a2);
			}

			th_setQuery();
		}
	}
	this.delWhereByNum = delWhereByNum;
	
	/**
	* suggest를 '비활성화' 시킵니다.
	*/
	function disable() {
		var i1;

		bEnable = false;

		// ## 이벤트를 해제하면 현재 focus 된 input을 알수 없기 때문에 사용안합니다.
		/*
		for (i1 = 0; i1 < aInputs.length; i1++){
			del_event(i1);
		}*/
		
		for (i1 = 0; i1 < aInputs_event_focus.length; i1++){
			if (aInputs_event_focus[i1] == true){
				$(aThis[i1]).hide();
				// toptranspanel 객체가 aThis 의 자식으로 만들어 지기 때문에...
				if (oTopPanel[i1]){
					oTopPanel[i1].hide();	
				}
				break;
			}
		}
	}
	this.disable = disable;


	/**
	* suggest를 '활성화' 시킵니다.
	*/
	function enable() {
		var i1;

		bEnable = true;	
		// ## 이벤트를 해제하면 현재 focus 된 input을 알수 없기 때문에 사용안합니다.
		/*
		for (i1 = 0; i1 < aInputs.length; i1++){
			reg_event(i1);
		}*/
		
		for (i1 = 0; i1 < aInputs_event_focus.length; i1++){
			if (aInputs_event_focus[i1] == true){
				th_showThis(i1);
				break;
			}
		}

	}
	this.enable = enable;
	
	/**
	* DB에서 결과값을 모두 로드 완료되었는지 여부 리턴합니다.
	*  Re: true 또는 false
	*/
	function getCompleted() {
		return bCompleted;
	}
	this.getCompleted = getCompleted;

	/**
	* suggest의 좌표를 리턴합니다.
	*  Pa:piSuggetNum - 만들어진 suggest의 번호 입니다. 0부터 시작합니다.
	*  Re: left, top 값을 가진 Array 변수입니다. (숫자만 리턴합니다.)
	*/
	function getLocation(piSuggetNum) {
		var a1 = new Array();

		a1[0] = $(aThis[piSuggetNum]).css("left");
		a1[1] = $(aThis[piSuggetNum]).css("top");

		a1[0] = a1[0].slice(0, a1[0].length - 2);
		a1[1] = a1[1].slice(0, a1[1].length - 2);

		return a1;
	}
	this.getLocation = getLocation;
	
	/**
	* 선택한 input의 row 행 숫자를 반환합니다.
	*  Re: 선택한 input의 row 행 숫자. 행이 없다면 '-1'를 리턴합니다.
	*/
	function getSelectRowNum() {
		return aInputs_2DimenIdx;
	}
	this.getSelectRowNum = getSelectRowNum;

	/**
	* 마지막으로  focus 된 input 객체를 리턴합니다.
	   없으면 null을 리턴합니다.
	*/
	function getLastFocusInput() {
		var oInput;
		var i1;

		if (aInputs_lastFocusInput){
			oInput = aInputs_lastFocusInput;
		}

		if (!oInput){
			oInput = null;
		}

		return oInput;
		
	}
	this.getLastFocusInput = getLastFocusInput;

	/**
	* 마지막으로 input에 focus된 부모인, tr 객체를 리턴합니다.
	   없으면 null을 리턴합니다.
	*/
	function getLastFocusTr() {
		var oTr;
		var i1;
		
		if (aInputs_lastFocusInput){
			oTr = $(aInputs_lastFocusInput).parents("tr")[0];
		}

		if (!oTr){
			oTr = null;
		}

		return oTr;
	}
	this.getLastFocusTr = getLastFocusTr;


	function hide() {
		var i1;
		
		for (i1 = 0; i1 < aThis.length; i1++){
			$(aThis[i1]).hide();
		}
	}
	this.hide = hide;
	
	/**
	* 출력 리스트를 안보이게 설정합니다.
	*/
	function hideList() {
		var i1;
		
		for (i1 = 0; i1 < aThis_childWrap.length; i1++){
			$(aThis_childWrap[i1]).hide();
		}
	}
	this.hideList = hideList;

	/**
	* ajax로 문서를 로드합니다. setEnterEnable()을 호출한 경우는 아무것도 실행되지 않습니다.
	*/
	function load() {
		if (bEnter_Enable || bKeyup_enable){
			return;
		}else{	
			
			if (!bDirectLoad && !bAjax_complete){
				//alert("Suggest 로드 중입니다.\n잠시만 기다려 주세요.");
				return;
			}
			for (i1 = 0; i1 < aThis.length; i1++){
				if (!oTopPanel[i1]){
					th_makeTopPanel(i1);
				}
				fo_showTopPanel(i1);
			}
			th_loadGet();
		}
	}
	this.load = load;
	
	/**
	* thead 부분을 만듭니다.		
		예) oSuggest_introduce_member.makeThead(["고객코드", "이름", "전화번호", "이메일"]);
	*  Pa:
	*  Re:
	*/
	function makeThead(paTheadColumnName) {
		aThis_thead_columnName = paTheadColumnName;
	}
	this.makeThead = makeThead;
	
	/**
	* 결과 리스트의 제일 상단에 리스트를 추가하는 함수입니다.
	*  Pa: paValue - 결과 리스트 상단에 넣을 값(Array 객체)입니다.
		예) suggest.prependValue(["aa", "bb", "cc"]);
	*/
	function prependValue(paValue) {
		aValue_prepend.push(paValue);
	}
	this.prependValue = prependValue;
	
	/**
	* sugget의 첫번째 결과 값을 선택(클릭)하는 함수입니다.
	*  Pa: piInputNum - input 의 차례 순서 number 입니다. 어떤 input의 첫번째 결과 값을 선택할지 선택하는 변수입니다. 0부터 시작합니다.
				  이 인자값을 안 주면 자동으로 '0'으로 됩니다.
				 예) 작성자suggest = new Suggest_code_popup(TheForm.작성자, TheForm.부서명,"empcode", "", "",320,200); 
				   ## 위와 같은 경우 TheForm.작성자 는 '0'이고, TheForm.부서명 은 '1'이 됩니다. ##

	*   예) 작성자suggest.selectFirstValue(); // 작성자suggest 에서 첫번째 input의 첫번째 결과 값을 선택(클릭)하는 코드입니다.
		  작성자suggest.selectFirstValue(1); // 작성자suggest 에서 두번째 input의 첫번째 결과 값을 선택(클릭)하는 코드입니다.
	*/
	function selectFirstValue(piInputNum) {
		if (piInputNum === null || piInputNum === undefined ){
			piInputNum = 0;
		}
		th_writeThisForSearch(piInputNum);

		var FirstTr = $(aThis_childWrap[piInputNum]).find("tr");

		for (i1 = 0; i1 < FirstTr.length; i1++){
			if ($(FirstTr[i1]).css("display") != "none"){
				$(FirstTr[i1]).click();
				return;
			}
		}		
	}
	this.selectFirstValue = selectFirstValue;

	/**
	* value 값으로 서제스트를 선택합니다.
	*  Pa: piInputNum - input 의 차례 순서 number 입니다. 어떤 input의 첫번째 결과 값을 선택할지 선택하는 변수입니다. 0부터 시작합니다.
				  이 인자값을 안 주면 자동으로 '0'으로 됩니다.
				 예) 작성자suggest = new Suggest_code_popup(TheForm.작성자, TheForm.부서명,"empcode", "", "",320,200); 
				   ## 위와 같은 경우 TheForm.작성자 는 '0'이고, TheForm.부서명 은 '1'이 됩니다. ##
		psValue - 선택할 값입니다.

	*   예) 작성자suggest.selectFirstValue(0, "오뚜기물류"); // 작성자suggest 에서 첫번째 input의 '오뚜기물류' 값인 tr을 클릭합니다.
	*/
	function selectValue(piInputNum, psValue) {
		var toTd, orgValue;

		if (piInputNum === null || piInputNum === undefined ){
			piInputNum = 0;
		}
		th_writeThisForSearch(piInputNum);

		var toTr = $(aThis_childWrap[piInputNum]).find("tr");

		for (i1 = 0; i1 < toTr.length; i1++){
			if ($(toTr[i1]).css("display") != "none"){
				toTd = $(toTr[i1]).find("td")[piInputNum];
				toSpan = $(toTd).find("span")[0];

				// '__notResult__' 클래스 객체가 있으므로.
				if (toSpan){
					orgValue = $(toSpan).attr("value");

					if (psValue == orgValue){
						$(toTr[i1]).click();
						return;
					}
				}			
			}
		}		
	}
	this.selectValue = selectValue;
	
	/**
	* 결과 갯수가 하나일 경우 자동으로 input 에 결과 값을 출력할지 여부를 결장하는 함수입니다.
	*  Pa: pbValue - true 나 false. (true이면 input에 자동으로 출력하게 됩니다.)
	*/
	function setAutoWriteInput(pbValue) {
		bAutoWriteInput = pbValue;
	}
	this.setAutoWriteInput = setAutoWriteInput;

	function setClass(psValue) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		for (i1 = 0; i1 < aThis.length; i1++){
			$(aThis[i1]).attr("class", psValue);
		}
	}
	this.setClass = setClass;
	
	/**
	* 로드 중이어도 다시 강제적으로 로드 하게 설정
	*/
	function setDirectLoad() {
		bDirectLoad = true;
	}
	this.setDirectLoad = setDirectLoad;

	/**
	* suggest를 enter 눌렀을 때 문서를 로드하는 방식으로 변경합니다.
	*/
	function setEnterEnable() {
		var i1;

		bEnter_Enable = true;
		
		for (i1 = 0; i1 < aThis.length; i1++){
			if (!oTopPanel[i1]){
				th_makeTopPanel(i1);
				bEnter_ajax_complete[i1] = true;
			}
		}
		
		//alert("a: " + sQuery);
	}
	this.setEnterEnable = setEnterEnable;
	
	/**
	* sugget가 enter 모드일 때, input에 입력하는 최소 문자 갯수를 설정합니다.
	*  Pa: piLen - 최소 문자의 갯수
	*/
	function setEnterMinStrLen(piLen) {
		iEnter_minStrLen = piLen;
	}
	this.setEnterMinStrLen = setEnterMinStrLen;
	
	/**
	* 최소 문자 갯수 미만일때 alert 문 나올지 여부. false이면 alert 문이 나오지 않는다.
	*  Pa:
	*  Re:
	*/
	function setEnterMinStrLenShowAlert(pbValue) {
		iEnter_minStrLen_showAlert = pbValue
	}
	this.setEnterMinStrLenShowAlert = setEnterMinStrLenShowAlert;
	
	/**
	* keyup 일때 load 되는 모드
	*/
	function setKeyUpEnable() {
		var i1;

		bKeyup_enable = true;
		
		for (i1 = 0; i1 < aThis.length; i1++){
			if (!oTopPanel[i1]){
				th_makeTopPanel(i1);
				bEnter_ajax_complete[i1] = true;
			}
		}
		
	}
	this.setKeyUpEnable = setKeyUpEnable;
	
	/**
	* suggest의 위치를 변경합니다.
	*  Pa: piSuggetNum - 만들어진 suggest의 번호 입니다. 0부터 시작합니다.
		 piX - 변경할 x 좌표입니다.
		 piY - 변경할 y 좌표입니다.
		예) 	oGrk1.setLocation(0, 100, 100); 
			oGrk1.setLocation(1, 120, 100);
	*/
	function setLocation(piSuggetNum, piX, piY) {
		$(aThis[piSuggetNum]).css({"left" : piX, "top" : piY});
	}
	this.setLocation = setLocation;
	
	/**
	* suggest를 위에 보이게 합니다.
	  iframe 때문에 아래로 보일 경우 짤려보이면 이 함수를 호출해서 위쪽에 보이게 합니다. 
	*/
	function setLocationToTop() {
		bLocation_top = true;
	}
	this.setLocationToTop = setLocationToTop;
	
	/**
	* 결과값이 없을때 '결과값이 없습니다.' 라는 문구 출력 여부
	*  Pa:
	*  Re:
	*/
	function setNoResultValueStr(pbShow) {
		bNoResultValueStr = pbShow;
	}
	this.setNoResultValueStr = setNoResultValueStr;

	/**
	* suggest의 크기를 변경합니다.
	*  Pa: piWidth - 변경할 넓이.
		 piHeight - 변경할 높이.
	*/
	function setSize(piWidth, piHeight) {
		var i1;

		iWidth = piWidth;
		iHeight = piHeight;

		for (i1 = 0; i1 < aThis.length; i1++){
			$(aThis[i1]).width(iWidth);
			$(aThis[i1]).height(iHeight);
		}
		
		fo_cookie_writeHeight(i1, iHeight);
	}
	this.setSize = setSize;
	
	/**
	* 검색 되어지는 where 문의 like 절의 컬럼 명을 설정합니다.
	*/
	function setWhereLikeColumnName(paColumnName) {
		aWhereLikeColumnName = paColumnName;
	}
	this.setWhereLikeColumnName = setWhereLikeColumnName;

	function show() {
		var i1;
		
		for (i1 = 0; i1 < aThis.length; i1++){
			$(aThis[i1]).show();
		}
		
	}
	this.show = show;
	
	/**
	* 출력 리스트를 보이게 합니다.
	*/
	function showList() {
		var i1;
		
		for (i1 = 0; i1 < aThis_childWrap.length; i1++){
			$(aThis_childWrap[i1]).show();
		}
		
	}
	this.showList = showList;
	
	function th_getQueryColumn(piIdx) {
		var taResult = new Array();
		var a1, a2, i1;

		a1 = sQuery_select.split(",");

		for (i1 = 0; i1 < a1.length; i1++){
			a1[i1] = ten_trim(a1[i1]);

			a2 = a1[i1].split(" ");

			taResult[i1] = a2[0];
			//taResult[i1] = a2[a2.length - 1];
		}
		
		return taResult[piIdx];
	}



	function th_loadGet() {
		bCompleted = false;

		//alert("th_loadGet");
		if (bEnter_Enable || bKeyup_enable){
			bEnter_ajax_complete[iEnter_enterInputIdx] = false;
		}else{
			bAjax_complete = false;
		}	

		oArrowUpDown_selectTr = null;

		//alert(sQuery);
		//oAjax.loadGet(sPhpSrc + "?sql=" + sQuery + "&columnLen=" + sQuery_columnLen);
		//alert("테스트중입니다." + sQuery);
		oAjax.loadPost(sPhpSrc, "sql=" + encodeURIComponent(sQuery) + "&columnLen=" + sQuery_columnLen);
	}
	
	function th_makeResult() {
		var i1, o1;

		i1 = 1;
		while (true){
			o1 = document.getElementById(sResultIdFirst + i1);
			if (!o1){
				$("body").append("<div id=\""+ sResultIdFirst  + i1 + "\"></div>");
				oResult = document.getElementById(sResultIdFirst + i1);
				$(oResult).hide();
				break;
			}
			i1++;
		}

	}


	function th_makeThis(piInputIdx) {
		var tsId, toThis, toThisChildWrap, tiLeft;
		var b1, b2, a1, a2, i1, i2, s1, s2, s3, o1, o2;

		i1 = 1;

		while (true){
			tsId = sIdFirst + i1 + "__";
			o1 = document.getElementById(tsId);

			if (!o1){
				$("body").append("<div id=\""+ tsId + "\" class=\"suggest\"><div class=\"childWrap\"></div></div>");
				toThis = document.getElementById(tsId);
				toThisChildWrap = $(toThis).children(".childWrap")[0];
				a1 = document.cookie.split(";");

				for (i2 = 0; i2 < a1.length; i2++){
					a2 = a1[i2].split("=");
					/*if (a2[0] == (location.pathname + tsId + "width")){
						b1 = true;
						$(toThis).width(a2[1]);
					}else*/	
					if (a2[0] == (location.pathname + tsId + "height")){
						b2= true;
						$(toThis).height(a2[1]);
					}
				}
				//if (!b1){
				$(toThis).width(iWidth);				
				//}
				if (!b2){
					$(toThis).height(iHeight);				
				}

				$(toThis).css({"position" : "absolute"});


				//$(toThisChildWrap).width($(toThis).width() - 2);
				//$(toThisChildWrap).height($(toThis).height() - 2);
				
				$(toThis).resizable();

				o1 = $(toThis).children(".ui-resizable-se");
				$(o1).attr("class", "ui-resizable-handle ui-resizable-se");

				$(toThis).resizable("option", "minWidth", iMinWidth);
				$(toThis).resizable("option", "minHeight", iMinHeight);
				$(toThis).resizable({"start" : han_resizeStart});
				$(toThis).resizable({"stop" : han_resizeStop});
				$(toThis).resizable({"resize" : han_resizeResize});
				$(toThis).hide();
				
				aThis.push(toThis);
				aThis_childWrap.push(toThisChildWrap);
				aThis_id.push(tsId);

				//fo_setLocation_this(piInputIdx);

				break;
			}
			i1++;
		}
	}

	
	function th_makeTopPanel(piIdx) {
		oTopPanel[piIdx] = new TransTopPanel2("#ffffff", "0.8", false, aThis[piIdx], oTopPanel_loadingImgSrc, false);
		oTopPanel[piIdx].setAutoSize(false);
	}

	function th_showThis(piIdx) {
		var oReadOnly;

		if (bEnable){
			if (aInputs[piIdx].length){
				oReadOnly = $(aInputs[piIdx][aInputs_2DimenIdx]).attr("readonly");
			}else{
				oReadOnly = $(aInputs[piIdx]).attr("readonly");
			}
			// readonly 이면 suggest가 나오지 않습니다..
			if (oReadOnly != "readonly"){
				fo_setLocation_this(piIdx);
				$(aThis[piIdx]).show();				
			}
		}
	}

	function th_setColumnOnly(pbColumnOnly) {
		aColumn_only.push(pbColumnOnly);
	}

	function th_setColumnViewAndQuery(pbColumnView, psColumnName) {
		aColumn_isView.push(pbColumnView);
		sQuery_select_temp.push(psColumnName);

		th_setQuery();	
	}

	function th_setInputs(poInput, pbIsInput) {
		aInputs_temp.push(poInput);
		aInputs = aInputs_original.concat(aInputs_temp);
		aInputs_isInput.push(pbIsInput);
	}

	function th_setResultColumn() {
		var i1;
		//alert($(oResult).html());
		for (i1 = 0; i1 < sQuery_columnLen; i1++){
			aColumn[i1] = $(oResult).find(".column" + i1);
			//alert($(aColumn[i1]).html());
		}
		//alert($(oResult).html());
	}

	function th_setQuery()
	{
		var tsDate;
		var a1, i1;

		sQuery_select = "";
		sQuery_from = ""; 
		sQuery_where = "";
		sQuery_orderby = "";

		bInWhere = false;
		bInOrderby = false;
		
		if (sQuery_gubun.toUpperCase() == "COMMON_CODE" ){	
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " cc2_name, '' ";
			}
			sQuery_from_original = "  FROM common_code ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "CUSTOMER_COMPANY" ){	
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " cc_name, '' ";
			}
			sQuery_from_original = "  FROM customer_company ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "CUSTOMER_COMPANY_STORE" ){
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " ccs_name, '' ";
			}
			sQuery_from_original = "  FROM customer_company_store ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "CUSTOMER_COMPANY_AREA" ){
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " cca_name, '' ";
			}
			sQuery_from_original = "  FROM customer_company_area ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "CUSTOMER_PERSON_CHARGE1" ){
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " mb_name, '' ";
			}
			sQuery_from_original = "  FROM customer_company_store LEFT JOIN g4_member ON mb_no = ccs_person_charge_idx";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "CUSTOMER_PERSON_CHARGE2" ){
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " mb_name, '' ";
			}
			sQuery_from_original = "  FROM customer_company_area LEFT JOIN g4_member ON mb_no = cca_person_charge_idx";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		// ## 빈 FROM 절
		}else if (sQuery_gubun.toUpperCase() == "ETC" )
		{
			sQuery_select_original = "";
			sQuery_from_original = " FROM ";
			in_th_setQuery_from();
			in_th_setQuery_select();	

			sQuery = "select " + sQuery_select + sQuery_from ;
		// ## 빈 FROM 절
		}else if (sQuery_gubun === "" || sQuery_gubun === null){
			sQuery_select_original = " value1, value2 "; // 빈 select를 생성합니다.
			sQuery_from_original = ""; // 빈 from 절을 생성합니다.
			
			in_th_setQuery_from();
			in_th_setQuery_select();
			
			sQuery = "select " + sQuery_select + sQuery_from;		
		}
		/*else if (sQuery_gubun.toUpperCase() == "CUSTOMER" ) {
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " idx, company_name ";
			}
			sQuery_from_original = "  FROM user_salecontrol_customer ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "PRODUCT" ){
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " no, item ";
			}
			sQuery_from_original = "  FROM user_salecontrol_product_all ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "PRODUCT_EX" ){
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " no, item ";
			}
			sQuery_from_original = "  FROM user_salecontrol_product_all_ex ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "SUBDEALER" ){
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " no, sub_dealer ";
			}
			sQuery_from_original = "  FROM user_salecontrol_subdealer ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "SELECT " + sQuery_select + sQuery_from ;
		}*/
		/*
		if (sQuery_gubun.toUpperCase() == "AA10" ) 
		{
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " ITEMCODE, ITEMNAME ";
			}
			sQuery_from_original = "  from AA10 ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "select " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "FA01" ) 
		{
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " FA01001, FA01007 ";
			}
			sQuery_from_original = "  from FA01 ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "select " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun.toUpperCase() == "GF03" )
		{
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " TAB0.GF03002,TAB1.CsName  ";
			}
			sQuery_from_original = "  from  GF03 TAB0 , CSMASTER TAB1 ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			sQuery = "select " + sQuery_select + sQuery_from + " WHERE TAB1.CSCODE = TAB0.GF03004 " ; 
			bInWhere = true;   
		}else if (sQuery_gubun.toUpperCase() == "ETC" )
		{
			sQuery_select_original = "";
			sQuery_from_original = " FROM ";
			in_th_setQuery_from();
			in_th_setQuery_select();	

			sQuery = "select " + sQuery_select + sQuery_from ;
		}else if (sQuery_gubun === "" || sQuery_gubun === null){
			sQuery_select_original = " value1, value2 "; // 빈 select를 생성합니다.
			sQuery_from_original = ""; // 빈 from 절을 생성합니다.
			
			in_th_setQuery_from();
			in_th_setQuery_select();
			
			sQuery = "select " + sQuery_select + sQuery_from;		
		}else {
			if (sQuery_select_original_new){
				sQuery_select_original = " " + sQuery_select_original_new + " ";
			}else{
				sQuery_select_original = " codecode,  codename ";
			}
			sQuery_from_original = "  from codemaster ";
			in_th_setQuery_from();
			in_th_setQuery_select();

			//sQuery = "select " + sQuery_select + "  from codemaster where codeid = '"  + psGubun + "' and CodeUse = 'Y'" ;
			sQuery = "select " + sQuery_select + sQuery_from + "  where codeid = '"  + psGubun + "' and CodeUse = 'Y'" ;
			bInWhere = true;
		}
		*/

		// 컬럼 수 저장.
		a1 = sQuery_select.split(",");
		sQuery_columnLen = a1.length;
		//alert(sQuery_columnLen);
		//alert("a: " + sQuery_columnLen);
		
		if (sQuery_where_original){
			in_th_setQuery_where(sQuery_where_original);
		}
		
		for (i1 = 0; i1 < sQuery_where_temp.length; i1++){
			in_th_setQuery_where(sQuery_where_temp[i1]);
		}

		if ((bEnter_Enable || bKeyup_enable)&& sEnter_query_where[iEnter_enterInputIdx]){
			in_th_setQuery_where(sEnter_query_where[iEnter_enterInputIdx]);
		}
			
		if (sQuery_orderby_original){
			in_th_setQuery_orderby(sQuery_orderby_original);
			//alert(sQuery_orderby);
		}
		
		for (i1 = 0; i1 < sQuery_orderby_temp.length; i1++){
			in_th_setQuery_orderby(sQuery_orderby_temp[i1]);
		}
		
		if ((bEnter_Enable || bKeyup_enable) && sEnter_query_orderby[iEnter_enterInputIdx]){
			//in_th_setQuery_orderby(sEnter_query_orderby[iEnter_enterInputIdx]);
			// enter 모드에서는 order by 를 초기화 합니다.
			sQuery_orderby = " order by " + sEnter_query_orderby[iEnter_enterInputIdx];
		}

		sQuery += sQuery_where + sQuery_orderby;

		
		fo_setCommon();
		
		//alert("test: " + sQuery);

		function in_th_setQuery_select() {
			var i1;

			sQuery_select = sQuery_select_original;
			if (sQuery_select){
				for (i1 = 0; i1 < sQuery_select_temp.length; i1++){
					sQuery_select += ", " + sQuery_select_temp[i1] ;
				}
			}else{
				for (i1 = 0; i1 < sQuery_select_temp.length; i1++){
					sQuery_select += sQuery_select_temp[i1] + ", ";
				}
				sQuery_select = sQuery_select.substr(0, sQuery_select.length - 2);
			}

		}

		function in_th_setQuery_from() {
			var i1;

			sQuery_from = sQuery_from_original;
			for (i1 = 0; i1 < sQuery_from_temp.length; i1++){
				sQuery_from += sQuery_from_temp[i1];
			}
		}

		function in_th_setQuery_where(psWhere) {
			var s1;

			if (bInWhere){
				s1 = " and ";
			}else{
				s1 = " where ";
				bInWhere = true;	
			}		
			sQuery_where += s1 + psWhere;
		}

		function in_th_setQuery_orderby(psOrderby) {
			var s1;

			if (bInOrderby){
				s1 = " , ";
			}else{
				s1 = " order by ";
				bInOrderby = true;	
			}		
			sQuery_orderby += s1 + psOrderby;
		}
	}
	
	function th_writeThis(piIdx) {
		var toChildWrap, taColumn;
		var iMaxNum;
		var s1, s2, s3, s4, s5, s6, b1, i1, i2, i3, i4, o1;
		
		if (((bEnter_Enable || bKeyup_enable) && bEnter_ajax_complete[iEnter_enterInputIdx]) || ((!bEnter_Enable && !bKeyup_enable) && bAjax_complete)){
			toChildWrap = aThis_childWrap[piIdx];
			taColumn = aColumn[piIdx];
			s5 = "<table>\n";

			if (aThis_thead_columnName){
				s5 += "<thead>"
				for (i1 = 0; i1 < aThis_thead_columnName.length; i1++){
					s5 += "<th>" + aThis_thead_columnName[i1] + "</th>";
				}
				s5 += "</thead>"
			}
			
			s5 += "<tbody>"
				
			// 리스트의 앞에 넣을 리스트를 출력합니다.
			for (i1 = 0; i1 < aValue_prepend.length; i1++){
				s5 += "<tr>\n";

				for (i3 = 0; i3 < aValue_prepend[i1].length; i3++){
					b1 = aColumn_isView[i3];
					
					if (!b1){
						s6 = " style=\"display:none\" ";
					}else{
						s6 = "";
					}
					//if (aValue_prepend[i1][i3]){
						s5 += "<td " + s6 + " ><span value=\"" + aValue_prepend[i1][i3] + "\">" + aValue_prepend[i1][i3] +  "</span></td>\n";
					//}
				}
				
				s5 += "</tr>\n";				
			}	
			iMaxNum = 0;

			for (i1 = 0; i1 < taColumn.length; i1++){

				s5 += "<tr>\n";

				for (i3 = 0; i3 < sQuery_columnLen; i3++){
					b1 = aColumn_isView[i3];
					
					if (!b1){
						s6 = " style=\"display:none\" ";
					}else{
						s6 = "";
					}

					s5 += "<td " + s6 + " ><span value=\"" + $(aColumn[i3][i1]).text() + "\">" + $(aColumn[i3][i1]).text() +  "</span></td>\n";
				}
				
				s5 += "</tr>\n";
				
				// [13.09.30] 출력 갯수가 많을 경우 멈춰버리는 형상이 있어서, 최대 출력 갯수를 설정했습니다..
				if (iMaxNum >= iResultMaxNum){
					alert("서제스트 결과 갯수가 '" + iResultMaxNum + "'개를 초과했습니다.\n'" + iResultMaxNum + "'개만 출력합니다.");

					break;
				}

				iMaxNum++;
			} // for

			// 리스트의 뒤에 넣을 리스트를 출력합니다.
			for (i1 = 0; i1 < aValue_append.length; i1++){
				s5 += "<tr >\n";

				for (i3 = 0; i3 < aValue_append[i1].length; i3++){
					b1 = aColumn_isView[i3];
					
					if (!b1){
						s6 = " style=\"display:none\" ";
					}else{
						s6 = "";
					}
					//if (aValue_append[i1][i3]){
						s5 += "<td " + s6 + " ><span value=\"" + aValue_append[i1][i3] + "\">" + aValue_append[i1][i3] +  "</span></td>\n";
					//}
				}
				
				s5 += "</tr>\n";				
			}

			if (bNoResultValueStr){
				s1 = sNotResultStr;
			}else{
				s1 = "";
			}

			s5 += "<tr class=\"__notResult__\" ><td style=\"text-align:center; width:100%;\" colspan=\"" + sQuery_columnLen +  "\" >" + s1 +"</td></tr>";
			//s5 += "<tr class=\"__notResult__\" ><td style=\"text-align:center; width:100%;\" colspan=\"" + sQuery_columnLen +  "\" >" + sNotResultStr +"</td></tr>";
			
			s5 += "</tbody>"
			s5 += "</table>";

			$(toChildWrap).html(s5);
			o1= $(toChildWrap).find("tr");
			$(o1).click(han_mouseClick_resultContent);
		}
	}

	function th_writeThisForSearch(piIdx, pbEnterKeyUp) {
		var tsInputValue, toTr, toTd, toSpan, orgValue;
		var b1, s1, s2, s3, s4, s5, s6, b1, i1, i2, i3, i4, o1;
		var iViewValueCount = 0; // 보여지는 결과 tr의 갯수입니다.
		var oFirstViewTr; // 처음 보여지는 tr 객체입니다.

		// ### 한개만 있을 때, 백스페이스 바 눌렀을 때 계속 같은 값이 되는 현상이 있어서 주석처리했습니다..
		//var findcnt = 0; //RYU
		//var findid = 0; //RYU
		
		//alert("th_writeThisForSearch(piIdx)");

		if (((bEnter_Enable || bKeyup_enable) && bEnter_ajax_complete[iEnter_enterInputIdx]) || ((!bEnter_Enable && !bKeyup_enable) && bAjax_complete)){
			
			if (oArrowUpDown_selectTr){
				$(oArrowUpDown_selectTr).removeClass("arrowSelect");
				oArrowUpDown_selectTr = null;
			}

			//alert("a");

			if (aInputs[piIdx].length){
				tsInputValue = aInputs[piIdx][aInputs_2DimenIdx].value;
			}else{
				tsInputValue = aInputs[piIdx].value;
			}

			toTr = $(aThis_childWrap[piIdx]).find("tr");
			
			/*if (bKeyup_enable){
				iViewValueCount = toTr.length;
			}else{*/
				for (i1 = 0; i1 < toTr.length; i1++){
					toTd = $(toTr[i1]).find("td")[piIdx];
					toSpan = $(toTd).find("span")[0];

					// '__notResult__' 클래스 객체가 있으므로.
					if (toSpan){
						orgValue = $(toSpan).attr("value");
						s1 =   $(toSpan).attr("value").toUpperCase();
						i2 = s1.indexOf(tsInputValue.toUpperCase());

						s5 = cString_search_lastWord_get(tsInputValue.toUpperCase());
						try{
							i3 = s1.search(eval("/^[" + tsInputValue.toUpperCase() + "-" + s5 +"]/i"));
						}catch(e){
							i3 = -1;

						}
						//alert(tsInputValue + ", " +s1);
						//if (i3 >= 0){ // 일치하는 문자열이 있을 경우
						if (i2 >= 0){ // 일치하는 문자열이 있을 경우
						//if (i2 == 0){ // 맨 앞에 일치하는 문자열이 있는 경우.
							$(toTr[i1]).removeAttr("style");

							s2 = orgValue.slice(0, i2);
							s3 = orgValue.slice(i2, i2 + tsInputValue.length);
							s4 = orgValue.slice(i2 + tsInputValue.length, orgValue.length);
							
							$(toSpan).html( s2 + "<strong>" + s3 + "</strong>" + s4);

							if (!oFirstViewTr){ // 첫번째 tr을 저장합니다.
								oFirstViewTr = toTr[i1];
							}

							iViewValueCount++;
						}else{
							$(toTr[i1]).attr("style", "display:none");
						}
					}
				} // for
			//}
			
			o1 = $(aThis_childWrap[piIdx]).find(".__notResult__")[0];
			if (iViewValueCount > 0){
				$(o1).hide();
				/* ### 한개만 있을 때, 백스페이스 바 눌렀을 때 계속 같은 값이 되는 현상이 있어서 주석처리했습니다..
				if ( findcnt == 1){  //한건만 발견 되었을떈   //RYU
					$(toTr[findid]).click(); //RYU
					$(o1).show(); //RYU
				}
				else
					{ $(o1).hide();}*/
			}else{
				$(o1).show();
			}
			
			// ## 엔터를 눌렀경우 이면서, 결과 값이 1개일 경우, 첫번째 보여지는 tr에 click 이벤트를 발생시킵니다. (14.03.03)
			if (pbEnterKeyUp && iViewValueCount == 1 && bListCountOneAutoClick){
				
				//alert("z");
				$(oFirstViewTr).click();


				return true; // ## 추가했습니다. (14.03.03)
			}
		} // ((bEnter_Enable && bEnter_ajax_complete[iEnter_enterInputIdx]) || (!bEnter_Enable && bAjax_complete))
	}


	function fo_cookie_writeHeight(piIdx, piHeight) {
		var o1;

		o1 = new Date();
		o1.setDate(o1.getDate() + iCookie_expires);

		document.cookie = location.pathname + aThis_id[piIdx] + "height=" + piHeight + "; expires=" + o1.toGMTString();
	}

	function fo_cookie_writeWidth(piWidth) {
		var o1;

		o1 = new Date();
		o1.setDate(o1.getDate() + iCookie_expires);

		document.cookie = location.pathname + sId1 + "width=" + piWidth + "; expires=" + o1.toGMTString();
		
	}
	/**
	* 
	*  Pa: poTarget - 현재의 input 객체이다.
	    Re: Array 객체
			- [0]은 1차 idx
			- [1]은 2차 idx, 2차가 없다면 -1 리턴.
	*/
	function fo_getInputIdxs(poTarget) {
		var a1, b1, i1, i2;
		a1 = new Array();

		for (i1 = 0; i1 < aInputs.length; i1++){
			if (aInputs[i1].length){
				for (i2 = 0; i2 < aInputs[i1].length; i2++){
					if (poTarget == aInputs[i1][i2]){
						a1[0] = i1;
						a1[1] = i2;
						b1 = true;
						break;
					}
				}
				if (b1){
					break;
				}
			}else{
				if (poTarget == aInputs[i1]){
					a1[0] = i1;
					a1[1] = -1;
					break;
				}
			}
		}

		return a1;
	}
	

	function fo_setCommon() {
		var i1, i2;

		//=== 'autocomplete' 속성을 'off'로 설정합니다.
		for (i1 = 0; i1 < aInputs.length; i1++){
			if (aInputs[i1].length){
				for (i2 = 0; i2 < aInputs[i1].length; i2++){
					in_fo_setCommon(aInputs[i1][i2]);
				}
			}else{
				in_fo_setCommon(aInputs[i1]);
			}
		}

		function   in_fo_setCommon(poInput) {
			var s1;

			s1 = $(poInput).attr("autocomplete");

			if (s1 != "off"){
				$(poInput).attr("autocomplete", "off");
			}
		}
	}

	function fo_setLocation_this(piIdx) {
		var tiLeft
		var s1, s2, s3, s4, o1;
		
		if (aInputs[piIdx].length){
			s1 = $(aInputs[piIdx][aInputs_2DimenIdx]).css("border-top-width");
			s2 = $(aInputs[piIdx][aInputs_2DimenIdx]).css("padding-top");
			s3 = $(aInputs[piIdx][aInputs_2DimenIdx]).css("padding-bottom");
			s4 = $(aInputs[piIdx][aInputs_2DimenIdx]).css("border-bottom-width");
		}else{
			s1 = $(aInputs[piIdx]).css("border-top-width");
			s2 = $(aInputs[piIdx]).css("padding-top");
			s3 = $(aInputs[piIdx]).css("padding-bottom");
			s4 = $(aInputs[piIdx]).css("border-bottom-width");
		}
		//alert(piIdx + ", " + aInputs_2DimenIdx);
		s1 = s1.slice(0, s1.length -2);
		s2 = s2.slice(0, s2.length -2);
		s3 = s3.slice(0, s3.length -2);
		s4 = s4.slice(0, s4.length -2);

		if (aInputs[piIdx].length){
			tiLeft = $(aInputs[piIdx][aInputs_2DimenIdx]).offset().left;
		}else{
			tiLeft = $(aInputs[piIdx]).offset().left;
		}
		o1 = document.getElementById("mRightSection");

		if (!o1){
			o1 = $("body")[0];
		}

		if (tiLeft +  $(aThis[piIdx]).width() + 20 > $(o1).width()){
			tiLeft = $(o1).width() - $(aThis[piIdx]).width() - 20;
		}

		if (aInputs[piIdx].length){
			if (!bLocation_top){
				$(aThis[piIdx]).css({"top" : $(aInputs[piIdx][aInputs_2DimenIdx]).offset().top  + Number(s1) + $(aInputs[piIdx][aInputs_2DimenIdx]).height() + Number(s2) + Number(s3) + Number(s4), "left" : tiLeft});
			}else{
				$(aThis[piIdx]).css({"top" : $(aInputs[piIdx][aInputs_2DimenIdx]).offset().top  - $(aThis[piIdx]).outerHeight(), "left" : tiLeft});
			}
		}else{
			if (!bLocation_top){
				$(aThis[piIdx]).css({"top" : $(aInputs[piIdx]).offset().top  + Number(s1) + $(aInputs[piIdx]).height() + Number(s2) + Number(s3) + Number(s4), "left" : tiLeft});
			}else{
				$(aThis[piIdx]).css({"top" : $(aInputs[piIdx]).offset().top  - $(aThis[piIdx]).outerHeight(), "left" : tiLeft});
			}
		}
	}

	function fo_showTopPanel(piIdx) {
		/*oTopPanel[piIdx].hide();
		oTopPanel[piIdx].setSize($(aThis[piIdx]).innerWidth(), $(aThis[piIdx]).innerHeight());
		oTopPanel[piIdx].show();*/
		
		//$(oTopPanel[piIdx]).css({"top" : $(aThis[piIdx]).position().top, "left" : $(aThis[piIdx]).position().left);
		oTopPanel[piIdx].resize($(aThis[piIdx]).innerWidth(), $(aThis[piIdx]).innerHeight());
		oTopPanel[piIdx].show();
	}

	/**
	* ymd 형식으로 날짜를 반환합니다.
		예) '20130512' 리턴
	*/
	function ten_getDate_ymd() {
		var o1, s1, s2, s3;

		o1 = new Date();

		s1 = new String(o1.getFullYear());
		s2 = new String(o1.getMonth() + 1);
		s3 = new String(o1.getDate());

		if (s2.length == 1){
			s2 = "0" + s2;
		}

		if (s3.length == 1){
			s3 = "0" + s3;
		}

		return s1 + s2 + s3;	
	}

	function ten_trim(ps1) {
		return ps1.replace(/(^\s*)|(\s*$)/gi, ""); 
	}

	function han_ajaxComplete3() {
		var i1, o1, b1;

		th_setResultColumn();

		if (aColumn[0][0]){
			bNotResult = false;
		}else	if (!aColumn[0][0]){
			bNotResult = true;
		}

		//alert(aColumn[0].length);

		if (bEnter_Enable || bKeyup_enable){
			oTopPanel[iEnter_enterInputIdx].hide();
			bEnter_ajax_complete[iEnter_enterInputIdx] = true;
			//th_writeResult(iEnter_enterInputIdx);
			th_writeThis(iEnter_enterInputIdx);
			th_writeThisForSearch(iEnter_enterInputIdx);
			th_showThis(iEnter_enterInputIdx);
			//$(aThis[iEnter_enterInputIdx]).show();
		}else{
			bAjax_complete = true;
			for (i1 = 0; i1 < aInputs.length; i1++){
				if (oTopPanel[i1]){
					oTopPanel[i1].hide();
				}
				//th_writeResult(i1);
				th_writeThis(i1);
				if (!aInputs_2DimenIdx){
					aInputs_2DimenIdx = 0; // 처음 로딩시 이 변수를 0으로 해줍니다.
				}
				th_writeThisForSearch(i1);
			}
		}
		
		/* 결과 값이 1 이고, 엔터모드 일때 자동 출력되는 코드입니다. (14.03.07) */
		if (aColumn[0].length == 1 && (bEnter_Enable || bKeyup_enable)){
			o1= $(aThis_childWrap[iEnter_enterInputIdx]).find("tr");
			
			if (bListCountOneAutoClick){
				$(o1[0]).click();
			}

		}
		
		/*== 이전 코드(14.03.07) ==
		if (aColumn[0].length == 1 && bAutoWriteInput){
			if (bEnter_Enable){
			}else{
				for (i1 = 0; i1 < aInputs_event_focus.length; i1++){
					// aInputs_event_focus 변수로 확인해야 합니다. 
					// 다른 input에 값이 다르게 적여 있을 경우 aThis_childWrap 변수에 결과가 없기 때문입니다.
					if (aInputs_event_focus[i1] == true){
						o1= $(aThis_childWrap[i1]).find("tr");
						b1 = true;
						break;
					}
				}
				// 처음 문서 로딩시에는 'aInputs_event_focus' 변수가 모두 false 이므로...
				if (!b1){
					o1= $(aThis_childWrap[0]).find("tr");
				}
			}
			$(o1[0]).click();
		}*/


		if (aColumn[0][0] && oListener_resultFound){
			oListener_resultFound();				

		}else	if (!aColumn[0][0] && oListener_resultNoFound){
			oListener_resultNoFound();	
		}

		if (oListener_complete){
			bCompleted = true;
			oListener_complete();
		}
	}

	function han_mouseClick_resultContent() {
		var o1, i1, i2;

		//o1 = $(this).parent().parent().find("span");
		o1 = $(this).find("span");
		
		i2 = 0;
		for (i1 = 0; i1 < o1.length; i1++){
			if (aColumn_only[i1] == false){
				if (aInputs[i2].length){
					aInputs[i2][aInputs_2DimenIdx].value = $(o1[i1]).attr("value");
					// 리스너 호출.
					if (oListener_writeInput){
						oListener_writeInput(aInputs[i2][aInputs_2DimenIdx]);
					}
				}else{
					aInputs[i2].value = $(o1[i1]).attr("value");
					// 리스너 호출.
					if (oListener_writeInput){
						oListener_writeInput(aInputs[i2]);
					}
				}
				i2++;
			}

		}

		for (i1 = 0; i1 < aThis.length; i1++){
			$(aThis[i1]).hide();
		}

		if (bEnter_Enable || bKeyup_enable){
			oTopPanel[iEnter_enterInputIdx].hide();
		}else{
			for (i1 = 0; i1 < oTopPanel.length; i1++){
				oTopPanel[i1].hide();
			}			
		}

		if (oListener_resultClick){
			oListener_resultClick(this);
		}
	}

	function han_mouseOut_this() {
		//alert("han_mouseOut_this");
		var i1;

		for (i1 = 0; i1 < aThis.length; i1++){
			if (this == aThis[i1]){
				break;
			}
		}
		
		aThis_event_mouseOver[i1] = false;

		if(!aInputs_event_focus[i1] && !aThis_event_resizing[i1]){
			$(aThis[i1]).hide();	
			//if (bEnter_Enable){
			oTopPanel[i1].hide();
			//}
		}

	}

	function han_mouseOver_this() {
		var i1;
		for (i1 = 0; i1 < aThis.length; i1++){
			if (this == aThis[i1]){
				break;
			}
		}

		aThis_event_mouseOver[i1] = true;

	}

	function han_resizeResize(poEvent, poUI) {
		var i1;
		for (i1 = 0; i1 < aThis.length; i1++){
			if (this == aThis[i1]){
				break;
			}
		}
		if (oTopPanel[i1] && oTopPanel[i1].getIsShow()){
			fo_showTopPanel(i1);
		}
	}

	function han_resizeStart() {
		var i1;
		for (i1 = 0; i1 < aThis.length; i1++){
			if (this == aThis[i1]){
				break;
			}
		}

		aThis_event_resizing[i1] = true;
	}

	function han_resizeStop(poEvent, poUI) {
		var i1;
		for (i1 = 0; i1 < aThis.length; i1++){
			if (this == aThis[i1]){
				break;
			}
		}

		$(aInputs[i1]).focus();
		aThis_event_resizing[i1] = false;

		fo_cookie_writeHeight(i1, poUI.size.height);
		//fo_cookie_writeWidth(poUI.size.width);
	}

	function han_focus_target() {
		var a1;
		//alert("han_focus_target");
		
		if (oArrowUpDown_selectTr){
			$(oArrowUpDown_selectTr).removeClass("arrowSelect");
			oArrowUpDown_selectTr = null;
		}

		a1 = fo_getInputIdxs(this);

		aInputs_lastFocusInput = this;

		aInputs_2DimenIdx = a1[1];
		//alert(a1);
		aInputs_event_focus[a1[0]] = true;

		th_showThis(a1[0]);

		if (bEnter_Enable || bKeyup_enable){
			//$(aThis[i1]).show();
			if (!bEnter_ajax_complete[a1[0]]){
				fo_showTopPanel(a1[0]);
			}
		}

		th_writeThisForSearch(a1[0]);
		
		/* 		   
		if (aInputs[a1[0]].length){
			if (!aInputs_prevValue[a1[0]]){
				aInputs_prevValue[a1[0]] = new Array();
			}
			
			if (aInputs[a1[0]][aInputs_2DimenIdx].value != aInputs_prevValue[a1[0]][aInputs_2DimenIdx]){
				th_writeThisForSearch(a1[0]);
				aInputs_prevValue[a1[0]][aInputs_2DimenIdx] = aInputs[a1[0]][aInputs_2DimenIdx].value;
			}
		}else{					
			if (aInputs[a1[0]].value != aInputs_prevValue[a1[0]]){
				th_writeThisForSearch(a1[0]);
				aInputs_prevValue[a1[0]] = aInputs[a1[0]].value;
			}
		}*/
	}

	function han_blur_target() {
		var a1;

		a1 = fo_getInputIdxs(this);

		aInputs_event_focus[a1[0]] = false;

		if (!aThis_event_mouseOver[a1[0]]){
			$(aThis[a1[0]]).hide();
			if (bEnter_Enable || bKeyup_enable){
				oTopPanel[a1[0]].hide();	
			}
		}
	}

	function han_keyup_target(poEvent) {
		var a1, a2, a2_1, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		//alert("han_keyup_target()");
		var i1, i2, s1, s2;
		a1 = fo_getInputIdxs(this);

		aInputs_2DimenIdx = a1[1];

		//alert("a");

		//alert(poEvent.keyCode);
		// 화살표 위, 아래 일 경우
		if (poEvent.keyCode == 38 || poEvent.keyCode == 40){
			//alert(aThis_childWrap[a1[0]].outerHTML);

			a2 = $(aThis_childWrap[a1[0]]).children("table").children("tbody").children("tr");
			//alert(aThis_childWrap[a1[0]]);
			a2_1 = new Array();
			for (i1 = 0; i1 < a2.length; i1++){
				// 제외 시키기
				b1 = $(a2[i1]).hasClass("__notResult__"); 
				b2 = $(a2[i1]).is(":hidden");

				if (b1 || b2){
					continue;
				}
				a2_1.push(a2[i1]);
			}

			a2 = a2_1;
			
			//alert(a1.length);
			if (a2.length == 0){
				return;
			}

			if (!oArrowUpDown_selectTr && poEvent.keyCode == 40){
				//alert(a2[0].outerHTML);
				//$(a2[0]).mouseover();
				oArrowUpDown_selectTr = a2[0];
				$(oArrowUpDown_selectTr).addClass("arrowSelect");
			}else{
				$(oArrowUpDown_selectTr).removeClass("arrowSelect");

				for (i1 = 0; i1 < a2.length; i1++){
					if (oArrowUpDown_selectTr == a2[i1]){
						if (poEvent.keyCode == 38){ // 위일 경우
							if (i1 == 0){
								oArrowUpDown_selectTr = null;
								break;
							}else	if (a2[i1 -1]){
								oArrowUpDown_selectTr = a2[i1 -1];
								$(oArrowUpDown_selectTr).addClass("arrowSelect");
								break;
							}else{
								$(oArrowUpDown_selectTr).addClass("arrowSelect");
								break;
							}
						}else if (poEvent.keyCode == 40){ // 아래일 경우
							if (a2[i1 + 1]){
								oArrowUpDown_selectTr = a2[i1 + 1];
								$(oArrowUpDown_selectTr).addClass("arrowSelect");
								break;
							}else{
								$(oArrowUpDown_selectTr).addClass("arrowSelect");
								break;
							}
						}
					}
				}
			}
		}else if (oArrowUpDown_selectTr && poEvent.keyCode == 13){
			$(oArrowUpDown_selectTr).click();
			$(oArrowUpDown_selectTr).removeClass("arrowSelect");
			oArrowUpDown_selectTr = null;
		}else{
			// 키눌러면 무조건 
			if (oArrowUpDown_selectTr){
				$(oArrowUpDown_selectTr).removeClass("arrowSelect");
				oArrowUpDown_selectTr = null;
			}

			if (bEnter_Enable || bKeyup_enable){
				if ((bEnter_Enable && poEvent.keyCode == 13) || bKeyup_enable){
					//alert("z");
					//s2 = encodeURIComponent(this.value);
					
					/* ## 엔터모드에서도 결과값과 일치하는 input 값을 입력했을때, 출력되도록 수정했습니다. (14.03.03)
						잘못된 코드라서 주석처리 했습니다. (14.03.07)*/
					/*if (th_writeThisForSearch(a1[0], true)){
						return;
					}*/
					
					/* ## 최소 글짜수를 0이 아닐 경우에만 문자갯수를 체크하고, 0이면 바로 출력되도록 수정했습니다. ## */
					s2 = this.value;


					if (iEnter_minStrLen > 0){
						 if (s2.length < iEnter_minStrLen){
							if (iEnter_minStrLen_showAlert){
								alert("최소한 " + iEnter_minStrLen + " 자리는 입력하세요.");
								this.focus();
							}
							return;
						 }
					}

					/* == 이전 코드 ==
					s2 = this.value;
					if (!s2){
						alert("글짜를 입력하세요.");
						this.focus();
						return;
					}else if (s2.length < iEnter_minStrLen){
						alert("최소한 " + iEnter_minStrLen + " 자리는 입력하세요.");
						this.focus();
						return;					
					}*/
					
					if (!bDirectLoad){
						for (i2 = 0; i2 < bEnter_ajax_complete.length; i2++){
							if (!bEnter_ajax_complete[i2]){
								alert("Suggest 로드 중입니다.\n잠시 후 다시 시작하세요.");
								this.focus();
								return;
							}
						}
					}

					iEnter_enterInputIdx = a1[0];
					sEnter_inputPrevValue[a1[0]] = s2;
					
					if (aWhereLikeColumnName.length > 0){
						sEnter_query_where[a1[0]] = "";

						for (i1 = 0; i1 < aWhereLikeColumnName.length; i1++){
							sEnter_query_where[a1[0]] += " upper(" + aWhereLikeColumnName[i1] + ") like upper('%" + s2 + "%') OR";	// 대소문자 구별하지 않기.
						}

						sEnter_query_where[a1[0]] = sEnter_query_where[a1[0]].substr(0, sEnter_query_where[a1[0]].length - 3);
						
						sEnter_query_orderby[a1[0]] = "";
					}else{
						s1 = th_getQueryColumn(a1[0]);

						s3 = cString_search_lastWord_get(s2);
						if (s2){

							sEnter_query_where[a1[0]] = " upper(" + s1 + ") like upper('%" + s2 + "%') ";	// 대소문자 구별하지 않기.
							//sEnter_query_where[a1[0]] = " UPPER(" + s1 + ") REGEXP UPPER('^[" + s2 + "-" + s3 + "]') ";	// 대소문자 구별하지 않기.
						}else{
							sEnter_query_where[a1[0]] = " UPPER(" + s1 + ") LIKE UPPER('%%') ";	// 대소문자 구별하지 않기.
						}

						//sEnter_query_where[a1[0]] = " upper(" + s1 + ") like upper('%" + s2 + "%') ";	// 대소문자 구별하지 않기.
						//sEnter_query_where[a1[0]] = " upper(" + s1 + ") like upper('" + s2 + "%') ";	// 대소문자 구별하지 않기.

						//alert(sEnter_query_where[a1[0]]);

						sEnter_query_orderby[a1[0]] = s1;
					}

					/*== 이전 ===
					if (aWhereLikeColumnName.length > 0){
						sEnter_query_where[a1[0]] = "";

						for (i1 = 0; i1 < aWhereLikeColumnName.length; i1++){
							sEnter_query_where[a1[0]] += " upper(" + aWhereLikeColumnName[i1] + ") like upper('%" + s2 + "%') OR";	// 대소문자 구별하지 않기.
						}

						sEnter_query_where[a1[0]] = sEnter_query_where[a1[0]].substr(0, sEnter_query_where[a1[0]].length - 3);
						
						sEnter_query_orderby[a1[0]] = "";
					}else{
						s1 = th_getQueryColumn(a1[0]);

						sEnter_query_where[a1[0]] = " upper(" + s1 + ") like upper('%" + s2 + "%') ";	// 대소문자 구별하지 않기.
						//sEnter_query_where[a1[0]] = " upper(" + s1 + ") like upper('" + s2 + "%') ";	// 대소문자 구별하지 않기.

						sEnter_query_orderby[a1[0]] = s1;
					}*/

					/*
					if (sQuery_gubun.toUpperCase() == "HEAD_SEARCH" ) { // 해드 검색일 경우에만 적용되게 했습니다..;;
						s1 = th_getQueryColumn(a1[0]);

						sEnter_query_where[a1[0]] = " upper(member_name) like upper('%" + s2 + "%') OR  upper(member_tel) like upper('%" + s2 + "%') ";	// 대소문자 구별하지 않기.

						sEnter_query_orderby[a1[0]] = "";
					}else{
					}*/


					th_setQuery();

					th_showThis(a1[0]);
					//$(aThis[a1[0]]).show();
					fo_showTopPanel(a1[0]);

					th_loadGet();				
				}else{	
					th_showThis(a1[0]);

					//$(aThis[a1[0]]).show();
					if (!bEnter_ajax_complete[a1[0]]){
						fo_showTopPanel(a1[0]);
					}else{
						
						th_writeThisForSearch(a1[0]);
						//th_writeResult(a1[0]);
					}
				}
			}else{ // if (bEnter_Enable)
				th_showThis(a1[0]);
				//$(aThis[a1[0]]).show();

				if (poEvent.keyCode == 13){// 엔터 눌렀을때 입니다.
					th_writeThisForSearch(a1[0], true);
				}else{
					th_writeThisForSearch(a1[0]);
				}
				// 엔터 눌렀을때, 결과 값이 없다면. alert 문 출력.
				/*if (poEvent.keyCode == 13){
					if (!aColumn[0] || !aColumn[0][0]){
						alert("해당하는 suggest가 없습니다.");
					}
				}*/
			}

			if (oListener_enter && poEvent.keyCode == 13){// 엔터 눌렀을 때.
				oListener_enter(this);
			}
			if (bKeyup_enable && oListener_keyup){// 엔터 눌렀을 때.
				oListener_keyup(this);
			}

		}


	}
	
	function del_event(piIdx) {
		var i1;

		$(aThis[piIdx]).unbind("mouseenter"); // hover 로 등록된 이벤트 제거
		$(aThis[piIdx]).unbind("mouseleave"); // hover 로 등록된 이벤트 제거
		
		if (aInputs[piIdx].length){
			for (i1 = 0; i1 < aInputs[piIdx].length; i1++){
				$(aInputs[piIdx][i1]).unbind("focus", han_focus_target);
				$(aInputs[piIdx][i1]).unbind("blur", han_blur_target);
				$(aInputs[piIdx][i1]).unbind("keyup", han_keyup_target);
			}
		}else{
			$(aInputs[piIdx]).unbind("focus", han_focus_target);
			$(aInputs[piIdx]).unbind("blur", han_blur_target);
			$(aInputs[piIdx]).unbind("keyup", han_keyup_target);
		}


	}

	function reg_event(piIdx) {
		var i1;
		
		$(aThis[piIdx]).hover(han_mouseOver_this, han_mouseOut_this);
		//$(aThis[piIdx]).mouseover(han_mouseOver_this);
		//$(aThis[piIdx]).mouseout(han_mouseOut_this);

		if (aInputs[piIdx].length){
			for (i1 = 0; i1 < aInputs[piIdx].length; i1++){
				$(aInputs[piIdx][i1]).focus(han_focus_target);
				$(aInputs[piIdx][i1]).blur(han_blur_target);
				$(aInputs[piIdx][i1]).keyup(han_keyup_target);
				//$(aInputs[piIdx][i1]).bind('vkeyup', han_blur_target);

				//$(document).on('input paste', aInputs[piIdx][i1], han_keyup_target);
				//$(aInputs[piIdx][i1]).live('input paste', han_keyup_target);


			}
		}else{
			$(aInputs[piIdx]).focus(han_focus_target);
			$(aInputs[piIdx]).blur(han_blur_target);
			$(aInputs[piIdx]).keyup(han_keyup_target);
			//$(aInputs[piIdx]).bind('keyup', han_keyup_target);
			
			//$(document).on('keyup', aInputs[piIdx], han_keyup_target);
			//$(document).delegate(aInputs[piIdx], 'keyup', han_keyup_target);
			//$(document).on('input paste', aInputs[piIdx], han_keyup_target);
			//$(aInputs[piIdx][i1]).live('input paste', han_keyup_target);
			//$(aInputs[piIdx]).live('keyup', han_keyup_target);
			//$(aInputs[piIdx]).bind('vkeyup', han_keyup_target);
			//$(aInputs[piIdx][i1]).bind('vkeyup', han_keyup_target);
			//$(aInputs[piIdx][i1]).live('keyup', han_keyup_target);
			//$(aInputs[piIdx]).change(han_change);

			/*function han_change() {
				alert("aa");
			}*/

		}
	}

	main();
}