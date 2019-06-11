/**
  <필요파일>
<script type="text/javascript" src="/common/js/[class]/erp/TableClickChgBg_simple.js"></script>

* 테이블을 클릭하면 tr 부분이 노랑색으로 바뀌게 하는 객체입니다.
(## TableClickChgBg.js 와 차이점은 input 테그에 이벤트를 안주어서, 로딩 시간을 단축했습니다. ##)

*  Pa: poTable - 테이블 객체입니다.
*/
function TableClickChgBg_simple(poTable) {
	var oTable = poTable;

	var oTr_prev;
	var oTr_now;

	var sBgColor_prev = "#ffffff";
	var sBgColor_now = "#FDFDEA";

	function main() {
		regEvent();

	}
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
		regEvent();

		oTr_prev = null;
		oTr_now = null;
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
			$(tr[i1]).click(han_mouseClick_tr);
		
		}
	}

	function removeEvent() {
		$(oTable).find("tbody").find("tr").unbind("click", han_mouseClick_tr);
	}

	main();
}