/**
   <임포트 파일>
<script type="text/javascript" src="/common/js/_class/net/AjaxJS_autoColumnResult.js"></script>

 <변경사항>
	- 'columnNames' 가 없는 경우도 있어서, count를 따로 얻어옵니다.
* <설명>
	- setSqlAndColumnName(질의문, ""); // 이렇게 컬럼 이름을 안적어 주어도 되며, count 값도 얻어올수 있습니다.
	- 여러개의 query 문을 등록해서, 한번에 로드 할 수 있습니다.
	- 자동으로 DB에서 select 해서 컬럼값들을 가져옵니다.
	- aResult 객체에 저장되는 문자열 
	
<출력 예>
	<div>
		<ul>
			<li>
				<div class="컬럼명">컬럼값</div>
				<div class="컬럼명">컬럼값</div>
				...
			</li>
		</ul>
		<span id="count" >1</span>
		<span id="result" >true</span>
	</div>
  <예>
	- /sample/ajax/DuplicateCheck3.php, /sample/ajax/DuplicateCheck3_1.php 에 예제가 있습니다.
	- SSUB02011.php 에도 있습니다.
	
	예1)
	var oAjaxColumn = new AjaxJS_autoColumnResult();
	var oJSON = new Object();

	oJSON.id = oForm.id.value;

	oAjaxColumn.addEventListener("complete", in_CompleteAjaxColumn);
	oAjaxColumn.removeQuery();
	oAjaxColumn.addQuery("key1", "key2", oJSON);
	oAjaxColumn.load();

	
	// 'empcode1' 의 컬럼값을 array 형태로 받아옵니다.
	var count = oAjaxColumn.getRowCountEach();
	var row = oAjaxColumn.getRow();
	var value = oAjaxColumn.getColumnValue_Once();
	var value = oAjaxColumn.getColumnValue("empcode1");
	var count = oAjaxColumn.getRowCount();
	var result = oAjaxColumn.getResult();
*/
function AjaxJS_autoColumnResult() {
	var aKey2 = new Array();
	var aKey1 =  new Array(); 
	var aJSON = new Array();

	 // 해쉬 객체이다. 
	 // 키는 로드 완료 후 이벤트('complete')
	 // 값은 함수 포인터 이다.
	var aEventFunc = new Array();

	var loadFileSrc = "/common/php/ajaxJS/ajaxJS_autoColumnResult.php";

	var oRequest; // get(), post() 실행시 리턴되는 XMLHttpRequest 객체.
	
	var aResult = new Array(); // 문서를 로드 후 결과값을 갖고 있는 객체 입니다.
	var iResult_countEach_idx = 0; // getRowCountEach() 함수를 호출 때마다 +1 씩 증가된다.
	var iResult_result_idx = 0; // getResult()  함수를 호출 때마다 +1 씩 증가된다.
	var iResult_row_idx = 0; // getRow() 함수를 호출 때마다 +1 씩 증가된다.
	var iLoadIdx = 0; // aKey2, aKey1, aResult 의 index 값입니다.

	function main() {

	}

	/**
	* 이벤트 등록. 
	*  Pa: psEventType - 로드 완료 후 이벤트 'complete'
	*/
	function addEventListener(psEventType, poCallBack) {
		aEventFunc[psEventType] = poCallBack;
	}
	this.addEventListener = addEventListener;

	/**
	* 인자값을 주어진 '컬럼이름' 으로 그 컬럼에 해당하는 모든 값들을 array 형태로 반환 합니다.
	  여러개의 query 문을 등록했을 경우에는, 여러개의 query 문을 검사해서 인자값으로 주어진 '컬럼이름'이 있다면, 모두 저장해서 리턴합니다.
	*  Pa: psColumnName - 컬럼 이름.
	*  Re: 컬럼 값들. (array 변수나 결과 값이 없다면 null 리턴)
	*/
	function getColumnValue(psColumnName) {	
		var atValue= new Array();
		var a1, a2, i1, i2;

		for (i1 = 0; i1 < aResult.length; i1++){
			//alert($(aResult[i1]).html());
			a1 = $(aResult[i1]).find("li").find("div." + psColumnName);

			for (i2 = 0; i2 < a1.length; i2++){
				atValue.push($(a1[i2]).text());
			}			

		}

		if (atValue.length == 0){
			atValue = null;
		}

		return atValue;
	}
	this.getColumnValue = getColumnValue;
	
	/**
	* 가장 처음의 컬럼의 한개의 값만을 반환 합니다.
	*  Re: 컬럼 값 (string 변수나 결과 값이 없다면 null 리턴)
	*/
	function getColumnValue_Once() {
		var tsResult;
		var o1, s1;

		o1 = $(aResult[0]).find("ul").find("div")[0];

		if (o1){
			s1 = $(o1).text()
		}else{
			s1 = null;
		}

		return s1;
	}
	this.getColumnValue_Once = getColumnValue_Once;
	
	/**
	* XMLHttpRequest 객체를 반환합니다.
	*/
	function getRequest() {
		return oRequest;
	}
	this.getRequest = getRequest;

	/**
	* XMLHttpRequest 객체의 결과 문자열을 반환합니다.
	  <!-- __Ajax contents start__ --> 와 <!-- __Ajax contents end__ --> 사이의 문자열을 반환합니다.
	*/
	function getRequestText() {
		return th_getOriginalResponseText();
	}
	this.getRequestText = getRequestText;
	
	/**
	* 쿼리의 결과 값을 리턴합니다. 쿼리가 성공적으로 실행되면 true, 아니면 false를 리턴합니다.
	*/
	function getResult() {
		var value = null;

		if (aResult[iResult_result_idx]){
			value = $(aResult[iResult_result_idx]).find("span#result").text();
			iResult_result_idx++;			
		}

		return value;
	}
	this.getResult = getResult;
	
	/**
	* 
	  - 결과 없어도 빈 하나의 row는 출력하도록 고쳤습니다
	  하나의 행(row)를 리턴합니다. 행이 없거나, 마지막 행이면 'null'를 리턴합니다.
	   여러 개의 쿼리를 실행했을 경우
		- 그 여러 개의 쿼리의 컬럼명이 동일해도 괜찮습니다.
		- 여러 개의 쿼리문 중에 결과 값이 없을때 null를 리턴합니다. (다음 결과값을 리턴하던 부분을 수정했습니다.)
	*  Re: 하나의 행(array 변수)을 리턴합니다. 
		예) result["column1"];// 'column1'의 결과값을 리턴합니다.
		   result[0]; // 첫번째 column 값을 리턴합니다. (index 번호로도 사용할수 있게, 추가 했습니다.)
	*/
	function getRow() {
		var opLi, opIdx, opDiv, apResult, spClassName;
		var i1, i2, i3, b1;
		
		b1 = false;
		opIdx = 0;
		apResult = new Array();
		//alert(iResult_row_idx);
		//alert($(aResult).html());
		for (i1 = 0; i1 < aResult.length; i1++){
			//alert($(aResult[i1]).html());
			opLi = $(aResult[i1]).find("li");
			//alert($(aResult[i1]).html());
			// ### 결과 값이 없을때 리턴값을 null로 설정합니다.
			if (opLi.length == 0){
				if (iResult_row_idx == opIdx){
					apResult = null;
					iResult_row_idx++;
					b1 = true;
					break;
				}			
				opIdx++;	
			}else{
				for (i2 = 0; i2 < opLi.length; i2++){ // 'li' 테그 갯수 만큼 실행합니다.
					if (iResult_row_idx == opIdx){
						//alert("test");
						opDiv = $(opLi[i2]).children("div");
						for (i3 = 0; i3 < opDiv.length; i3++){ // 'div' 테그 갯수 만큼 실행합니다.
							spClassName = $(opDiv[i3]).attr("class");
							apResult[spClassName] = $(opDiv[i3]).text(); // 키를 '컬럼이름'으로 하고, 값을 설정합니다.
							apResult[i3] = $(opDiv[i3]).text(); // 키를 숫자로 하고, 값을 설정합니다.
							b1 = true;
						}
						iResult_row_idx++;
						break;
					}
					
					opIdx++;
				}
				if (b1){ 
					break;
				}				
			}
		}

		if (!b1){
			apResult = null;
		}
		//alert(apResult);
		return apResult;
	}
	this.getRow = getRow;
	
	/**
	* 총 row의 갯수(모든 쿼리들의 row 갯수)를 리턴합니다.
	*  Re: 총 row의 갯수입니다.
	*/
	function getRowCount() {
		var count, opLi ;
		var i1, i2;
		
		count = 0;
		for (i1 = 0; i1 < aResult.length; i1++){
			//alert($(aResult[i1]).html());
			count += Number($(aResult[i1]).find("span#count").text());
		}

		return count;
		
	}
	this.getRowCount = getRowCount;
	
	/**
	   쿼리 순서대로 하나씩 row 의 갯수를 리턴합니다.. (모든 쿼리들의 총 row 갯수를 리턴하는 것이 아닙니다..)
	*  Re: row의 갯수입니다.
	*/
	function getRowCountEach() {
		var count = null;
		
		if (aResult[iResult_countEach_idx]){
			count = $(aResult[iResult_countEach_idx]).find("span#count").text();
			iResult_countEach_idx++;			
		}

		return count;
	}
	this.getRowCountEach = getRowCountEach;

	function load() {
		//alert("load()");
		th_load("post", loadFileSrc, "key1=" + encodeURIComponent(aKey1[iLoadIdx]) + "&key2=" + encodeURIComponent(aKey2[iLoadIdx]) + "&json=" + encodeURIComponent(aJSON[iLoadIdx]));		
		//alert(aKey1[iLoadIdx]);
	}
	this.load = load;

	function removeEventListener() {
		aEventFunc[psEventType] = null;
	}
	this.removeEventListener = removeEventListener;
	/**
	* setSqlAndColumnName() 함수로 등록된 sql 문과 column 이름 등을 모두 삭제합니다.
	*/
	function removeQuery() {
		iLoadIdx = 0;

		aKey1 = new Array();
		aKey2 = new Array();
		aJSON = new Array();

		aResult = new Array();
		iResult_countEach_idx = 0;
		iResult_result_idx = 0;
		iResult_row_idx = 0;
	}	
	this.removeQuery = removeQuery;
	
	/**
	* 쿼리문과 컬럼명을 등록합니다.
	*  Pa: psSQL - 쿼리문입니다.
		  psColumnNames - 쿼리문의 select 절의 컬럼명들입니다. 예) "SA99003, SA99004"
	*/
	function addQuery(psKey1, psKey2, poJSON) {
		//alert(JSON.stringify(poJSON));
		aKey1.push(psKey1)
		aKey2.push(psKey2);
		aJSON.push(JSON.stringify(poJSON));
	}
	this.addQuery = addQuery;

	function th_load(psMethod, psURL, paData, psType) {
		if (psMethod == "get")
			oRequest = $.get(psURL, paData, han_ajax_complete, psType);
		else
			oRequest = $.post(psURL, paData, han_ajax_complete, psType);

	}

	function th_getOriginalResponseText() {
		var s1, i1, i2;

		s1 = oRequest.responseText;				
		i1 = s1.search("<!-- __Ajax contents start__ -->");
		i2 = s1.search("<!-- __Ajax contents end__ -->");

		return s1.slice(i1 + 32, i2);		
	}

	function han_ajax_complete() {
		//alert("han_ajax_complete");
		var i1, i2, s1, s2, s3;

		if (oRequest && oRequest.readyState == 4 && oRequest.status == 200){
			//alert(th_getOriginalResponseText());
			aResult.push(th_getOriginalResponseText());
			if (iLoadIdx == aKey1.length - 1){
				//alert("end");
				if (aEventFunc["complete"])	aEventFunc["complete"]();
			}else{
				iLoadIdx++;
				load();
			}
		}
	}

	main();
}