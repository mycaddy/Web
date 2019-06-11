/**
<script type="text/javascript" src="/common/js/_class/display/Input_money_by_name.js"></script>
*/
function Input_money_by_name(psTargetName) {
	var sTargetName = psTargetName;

	var oTargets;

	function main() {
		oTargets = document.getElementsByName(sTargetName);

		for (i1 = 0; i1 < oTargets.length; i1++){
			$(oTargets[i1]).css("text-align", "right");	
			// IE10에서 값이 입력된 경우 'text-align' 가 안되서, 다시 값을 저장합니다.
			$(oTargets[i1]).val($(oTargets[i1]).val());
		}

		reg_Event();
	}

	/**
	* 소숫점, ',(쉼표)', '-', '+' 도 되도록 설정했다.
	*/
	function th_changeMoney(str) {
		var i1;
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

		if (bDecPoint){
			result = result + "." + decPoint;
		}

		if (bPlus){
			result = "+" + result;
		}

		if (bMinus){
			result = "-" + result;
		}

		return result;
	}

	/**
	* 소숫점, ',(쉼표)', '-', '+' 도 되도록 설정했다.
	*/
	function han_keydown_target(poEvent) {
		var i1 = poEvent.keyCode;
		//alert(poEvent.keyCode);

		// ',' - 188
		// '.' - 190, 110
		// 방향키_좌우 - 37, 39
		//  F5 - 116
		// + - 187, 107
		// - - 189, 109
		if ((i1 > 34 && i1 < 41) || (i1 > 47 && i1 < 58) || (i1 > 95 && i1 < 106) || i1 == 8 || i1 == 9 || i1 == 13 || i1 == 46 || i1 == 190 || i1 == 110 ||  i1 == 116 ||  i1 == 188||  i1 == 187||  i1 == 107||  i1 == 189||  i1 == 109) {
			  window.event.returnValue = true; 
		}else if (poEvent.ctrlKey || poEvent.ctrlLeft || poEvent.altKey || poEvent.altLeft || poEvent.shiftKey || poEvent.shiftLeft){// 복사, 불어넣기, 전체 선택 되도록.
			//if (i1 == 86 || i1 == 67 || i1 == 65){
			  window.event.returnValue = true; 
		}else{
			window.event.returnValue = false; 
		}
		/* ====== 전체 선택 후 키입력이 안됨. del, 백스페이스 안됨 ===
		 if (poEvent.ctrlKey || poEvent.ctrlLeft || poEvent.altKey || poEvent.altLeft || poEvent.shiftKey || poEvent.shiftLeft){// 복사, 불어넣기, 전체 선택 되도록.
			//this.value = th_changeMoney(this.value)
			//if (i1 == 86 || i1 == 67 || i1 == 65){
			//this.value = th_changeMoney(this.value + String.fromCharCode(i1));
			//this.value = th_changeMoney(this.value);
			  window.event.returnValue = true; 
		}else if ((i1 > 34 && i1 < 41) || (i1 > 47 && i1 < 58) || (i1 > 95 && i1 < 106) || i1 == 8 || i1 == 9 || i1 == 13 || i1 == 46 || i1 == 190 || i1 == 110 ||  i1 == 116 ||  i1 == 188||  i1 == 187||  i1 == 107||  i1 == 189||  i1 == 109) {
			this.value = th_changeMoney(this.value + String.fromCharCode(i1));
			  window.event.returnValue = false; 
		}else{
			window.event.returnValue = false; 
		}*/
	}


	function han_keyup_target(poEvent) {
		var i1 = poEvent.keyCode;

		if ((i1 > 36 && i1 < 41)) {
			  return; 
		}else{
			this.value = th_changeMoney(this.value);
		}
		
	}

	function reg_Event() {
		for (i1 = 0; i1 < oTargets.length; i1++){
			$(oTargets[i1]).unbind("keydown", han_keydown_target);
			$(oTargets[i1]).unbind("keyup", han_keyup_target);
			$(oTargets[i1]).unbind("change", han_keyup_target);

			$(oTargets[i1]).change(han_keyup_target);
			$(oTargets[i1]).keyup(han_keyup_target);
			$(oTargets[i1]).keydown(han_keydown_target);
		}
	}

	main();
}