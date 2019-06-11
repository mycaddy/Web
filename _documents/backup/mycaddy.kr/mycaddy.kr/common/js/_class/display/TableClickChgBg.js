/**
  <필요파일>
<script type="text/javascript" src="/common/js/_class/display/TableClickChgBg.js"></script>

* 테이블을 클릭하면 tr 부분이 노랑색으로 바뀌게 하는 객체입니다.
*  Pa: poTable - 테이블 객체입니다.
*/
function TableClickChgBg(poTable) {
	var oTable = poTable;

	var oTr_prev;
	var oTr_now;

	var oInputBlur;

	var sBgColor_prev = "#ffffff";
	//var sBgColor_now = "#F7F7F7";
	var sBgColor_now = "#FFFFE7";
	//var sBgColor_now = "#FAFAD2";

	var oListener_click;

	function main() {
		regEvent();

	}
	/**
	* 
	*  Pa: psType - 'click' (tr을 클릭했을때). (인자값으로 첫번째 : 선택tr, 두번째 : 선택tr num)
	*  Re:
	*/
	function addEventListener(psType, poListener) {
		if (psType == "click"){
			oListener_click = poListener;
		}
	}
	this.addEventListener = addEventListener;

	/**
	* public 함수로 현재 선택된 tr 객체를 리턴합니다.
	*/
	function getSelectTr() {
		var oTr = $(oTable).find("tbody").find("tr");
		
		// tr을 삭제했을 경우가 있으므로 검색합니다..
		for (i1 = 0; i1 < oTr.length; i1++){
			if (oTr[i1] == oTr_now){
				return oTr_now;
			}
		}
		return null;
	}
	this.getSelectTr = getSelectTr;

	/**
	* public 함수로 input 에서 마지막 blur 된 tr 객체를 반환합니다.
	*/
	function getSelectTrAboutInputBlur() {
		var oTr = $(oTable).find("tbody").find("tr");
		var i1, i2;

		// tr을 삭제했을 경우가 있으므로 검색합니다..
		for (i1 = 0; i1 < oTr.length; i1++){
			aInput = $(oTr[i1]).find("input[type='text']");
			for (i2 = 0; i2 < aInput.length; i2++){
				if (aInput[i2] == oInputBlur){
					return oTr[i1];
				}
			}
		}
		return null;
	}
	this.getSelectTrAboutInputBlur = getSelectTrAboutInputBlur;
	
	/**
	* public 함수로 현재 선택된 tr 객체의 행 번호를 리턴합니다. 0부터 시작합니다.
	  선택 tr 이 없으면 null를 리턴합니다.
	*/
	function getSelectTrNum() {
		var oTr = $(oTable).find("tbody").find("tr");
		
		// tr을 삭제했을 경우가 있으므로 검색합니다..
		for (i1 = 0; i1 < oTr.length; i1++){
			if (oTr[i1] == oTr_now){
				return i1;
			}
		}
		return null;
	}
	this.getSelectTrNum = getSelectTrNum;
	
	/**
	* public 함수로 input 에서 마지막 blur 된 tr 객체의 행 번호를 반환합니다. 0부터 시작합니다.
	*/
	function getSelectTrNumAboutInputBlur() {
		var oTr = $(oTable).find("tbody").find("tr");
		var i1, i2;

		// tr을 삭제했을 경우가 있으므로 검색합니다..
		for (i1 = 0; i1 < oTr.length; i1++){
			aInput = $(oTr[i1]).find("input[type='text']");
			for (i2 = 0; i2 < aInput.length; i2++){
				if (aInput[i2] == oInputBlur){
					return i1;
				}
			}
		}
		return null;
	}
	this.getSelectTrNumAboutInputBlur = getSelectTrNumAboutInputBlur;

	/**
	* public 함수로 인자값 객체(tr 객체)를 이용해서 행 번호를 리턴합니다. 0부터 시작합니다.
	  click 이벤트를 다른 곳에서 먼저 등록 했을 때, 이 함수를 사용하시면 됩니다.
	  선택 tr 이 없으면 null를 리턴합니다.
	*/
	function getSelectTrNumByTr(poTr) {
		var oTr = $(oTable).find("tbody").find("tr");
		
		// tr을 삭제했을 경우가 있으므로 검색합니다..
		for (i1 = 0; i1 < oTr.length; i1++){
			if (oTr[i1] == poTr){
				return i1;
			}
		}
		return null;
	}
	this.getSelectTrNumByTr = getSelectTrNumByTr;
	
	/**
	* 완전히 삭제합니다.
	  input의 등록된 click 이벤트를 모두 삭제합니다.
	*/
	function remove() {
		removeEvent();
	}
	this.remove = remove;
	
	/**
	* 다시 table을 읽어와서 다시 설정합니다.
	  테이블을 전체적으로 다시 로드할때 호출하시면 되십니다..
	*/
	function reset() {
		var tr = $(oTable).find("tbody").find("tr");

		removeEvent();
		regEvent();

		oTr_prev = null;
		oTr_now = null;
		
		for (i1 = 0; i1 < tr.length; i1++){
			$(tr[i1]).css("background-color", sBgColor_prev);
		}
	}
	this.reset = reset;

	/**
	 ### 2013.08.13 추가했습니다.
	* 다시 table을 읽어와서 다시 설정합니다.
	  tr 이 추가되거나 삭제될때 이 함수를 호출하시면 되십니다..
	*/
	function resetSmall() {
		removeEvent();
		regEvent();
	}
	this.resetSmall = resetSmall;

	function resetSmallAndBgColorReset() {
		var tr = $(oTable).find("tbody").find("tr");

		removeEvent();
		regEvent();


		for (i1 = 0; i1 < tr.length; i1++){
			$(tr[i1]).css("background-color", sBgColor_prev);
		}
	}
	this.resetSmallAndBgColorReset = resetSmallAndBgColorReset;

	function setSelectTrBgColor(psColor) {
		sBgColor_now = psColor;
	}
	this.setSelectTrBgColor = setSelectTrBgColor;
	
	/**
	* attr 를 사용해서 tr를 선택한다.
	pbResetAboutNoTr - 선택할 tr이 없을때 reset 할것인지 여부
	*/
	function setSelectTrByAttr(psAttrName, psAttrValue, pbResetAboutNoTr) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		var oTr = $(oTable).find("tbody").find("tr");
		b1 = false;
		for (i1 = 0; i1 < oTr.length; i1++){
			s1 = $(oTr[i1]).attr(psAttrName);
			if (s1 == psAttrValue){
				$(oTr[i1]).click();
				b1 = true;
				break;
			}
		}

		if (!b1 && pbResetAboutNoTr){
			reset();
		}
		
	}
	this.setSelectTrByAttr = setSelectTrByAttr;
	
	/**
	* attr 여러개(array 타입)를 사용해서 tr를 선택한다.
	pbResetAboutNoTr - 선택할 tr이 없을때 reset 할것인지 여부
	*/
	function setSelectTrByAttrArray(paAttrName, paAttrValue, pbResetAboutNoTr) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		var oTr = $(oTable).find("tbody").find("tr");
		b1 = false;
		for (i1 = 0; i1 < oTr.length; i1++){
			b2 = false;
			for (i2 = 0; i2 < paAttrName.length; i2++){
				s1 = $(oTr[i1]).attr(paAttrName[i2]);
				if (s1 == paAttrValue[i2]){
					b2 = true;
				}else{
					b2 = false;
					break;
				}
			}

			if (b2){
				$(oTr[i1]).click();

				b1 = true;
				break;
			}
		}

		if (!b1 && pbResetAboutNoTr){
			reset();
		}
		
	}
	this.setSelectTrByAttrArray = setSelectTrByAttrArray;

	function han_blur_input() {
		oInputBlur = this;
	}

	function han_focus_input() {
		oTr_prev = oTr_now;
		oTr_now = $(this).parent().parent()[0];
		//alert(oTr_now);

		if (oTr_prev){
			$(oTr_prev).css("background-color", sBgColor_prev);
		}

		$(oTr_now).css("background-color", sBgColor_now);
		
	}
	
	/**
	* 테이블의 tr 을 클릭했을 때 호출되는 함수입니다.
	*/
	function han_mouseClick_tr() {
		oTr_prev = oTr_now;
		oTr_now = this;		

		if (oTr_prev){
			$(oTr_prev).css("background-color", sBgColor_prev);
		}

		$(oTr_now).css("background-color", sBgColor_now);

		if (oListener_click){
			oListener_click(getSelectTr(), getSelectTrNum());
		}
	}
	

	function regEvent() {
		var tr = $(oTable).find("tbody").find("tr");
		var input;
		var o1, i1;
		
		for (i1 = 0; i1 < tr.length; i1++){
			if (i1 == 0){
				o1 = $(tr[0]).children("td")[0];
				o1 = $(o1).text();
				if (o1.indexOf("없습니다") == -1){ // '검색된 데이터가 없습니다' 가 아니라면 click 이벤트를 등록시킵니다.
					in_regEvent();
				}
			}else{
				in_regEvent();
			}
		}

		function   in_regEvent() {
			$(tr[i1]).css("cursor", "pointer");
			$(tr[i1]).click(han_mouseClick_tr);

			// [13.10.16] checkbox, radio 도 되도록 수정했습니다.
			input = $(tr[i1]).find("input"); 
			
			$(input).focus(han_focus_input);
			$(input).blur(han_blur_input);
		
		}
	}

	function removeEvent() {
		$(oTable).find("tbody").find("tr").unbind("click", han_mouseClick_tr);
		$(oTable).find("tbody").find("tr").find("input").unbind("focus", han_focus_input);
		$(oTable).find("tbody").find("tr").find("input").unbind("blur", han_blur_input);
	}

	main();
}