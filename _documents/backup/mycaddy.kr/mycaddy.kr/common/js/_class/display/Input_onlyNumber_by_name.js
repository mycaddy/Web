/**
<script type="text/javascript" src="/common/js/_class/display/Input_onlyNumber_by_name.js"></script>
*/

function Input_onlyNumber_by_name(psTargetName) {
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

	function setTextAlign(psValue) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		for (i1 = 0; i1 < oTargets.length; i1++){
			$(oTargets[i1]).css("text-align", psValue);	
		}
	}
	this.setTextAlign = setTextAlign;

	/**
	* 소숫점, ',(쉼표)'도 되도록 설정했다.
	*/
	function han_keydown_target(poEvent) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		var i1 = poEvent.keyCode;
		//alert(event.keyCode);

		// ',' - 188
		// '.' - 190, 110
		// 방향키_좌우 - 37, 39
		//  F5 - 116
		if ((i1 > 34 && i1 < 41) || (i1 > 47 && i1 < 58) || (i1 > 95 && i1 < 106) || i1 == 8 || i1 == 9 || i1 == 13 || i1 == 46 || i1 == 190 || i1 == 110 ||  i1 == 116 ||  i1 == 188) {
			  window.event.returnValue = true; 
		}else if (poEvent.ctrlKey || poEvent.ctrlLeft || poEvent.altKey || poEvent.altLeft){// 복사, 불어넣기, 전체 선택 되도록.
			//if (i1 == 86 || i1 == 67 || i1 == 65){
			  window.event.returnValue = true; 
		}else{
			window.event.returnValue = false; 
		}
	}

	function reg_Event() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		for (i1 = 0; i1 < oTargets.length; i1++){
			$(oTargets[i1]).unbind("keydown", han_keydown_target);

			$(oTargets[i1]).keydown(han_keydown_target);
		}
	}

	main();
}