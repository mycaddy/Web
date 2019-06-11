
/**
* input text 에 기본 value를 설정하는 클래스입니다.
*  Pa: poInput - input 객체입니다.
	psBgValue - 기본 value(String) 입니다.
*/
function Input_bg_value(poInput, psBgValue) {
	var oInput = poInput;
	var sBgValue = psBgValue;

	function main() {
		$(oInput).focus(han_input_focus);
		$(oInput).blur(han_input_blur);

		th_firstSetValue();
	}
	
	/**
	* bg value 값을 지웁니다. (form 을 submit 하기 전에 쓰입니다.)
	*/
	function delBgValue() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		
		if (oInput.length){
			for (i1 = 0; i1 < oInput.length; i1++){
				if (oInput[i1].value == sBgValue){
					$(oInput[i1]).removeClass("mInput_bg_value_on");
					oInput[i1].value = "";
				}
			}
		}else{
			if (oInput.value == sBgValue){
				$(oInput).removeClass("mInput_bg_value_on");
				oInput.value = "";
			}
		}
	}
	this.delBgValue = delBgValue;
	
	/**
	* 'mInput_bg_value_on' class 를 지웁니다.
	  동적으로 value 값을 변경했을때 이 함수를 호출합니다.
	*  Pa: poInput- class를 지울 input 객체입니다.(없어도 됩니다.)
	*/
	function delBgValueClass(poInput) {
		if (poInput){
			$(poInput).removeClass("mInput_bg_value_on");
		}else{
			$(oInput).removeClass("mInput_bg_value_on");
		}
	}
	this.delBgValueClass = delBgValueClass;
	
	/**
	* bg value 값과 css를 다시 설정합니다. (동적으로 input 값이 변했을때 호출합니다.)
	*/
	function reset() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		
		if (oInput.length){
			for (i1 = 0; i1 < oInput.length; i1++){
				if (oInput[i1].value === "" || oInput[i1].value == sBgValue){
					$(oInput[i1]).addClass("mInput_bg_value_on");
					oInput[i1].value = sBgValue;
				}else{
					$(oInput[i1]).removeClass("mInput_bg_value_on");
				}
			}
		}else{
			if (oInput.value === "" || oInput.value == sBgValue){
				$(oInput).addClass("mInput_bg_value_on");
				oInput.value = sBgValue;
			}else{
				$(oInput).removeClass("mInput_bg_value_on");
			}
		}
	}
	this.reset = reset;
	
	/**
	* bg value 값을 써줍니다. (form 을 submit 한 후에 쓰입니다.)
	*/
	function setBgValue() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;
		
		if (oInput.length){
			for (i1 = 0; i1 < oInput.length; i1++){
				if (oInput[i1].value === "" || oInput[i1].value == sBgValue){
					$(oInput[i1]).addClass("mInput_bg_value_on");
					oInput[i1].value = sBgValue;
				}
			}
		}else{
			if (oInput.value === "" || oInput.value == sBgValue){
				$(oInput).addClass("mInput_bg_value_on");
				oInput.value = sBgValue;
			}
		}
	}
	this.setBgValue = setBgValue;

	function th_firstSetValue() {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		if (oInput.length){
			for (i1 = 0; i1 < oInput.length; i1++){
				if (oInput[i1].value === "" || oInput.value == sBgValue){
					fo_setValue(oInput[i1]);
				}
			}
		}else{
			if (oInput.value === "" || oInput.value == sBgValue){
				fo_setValue(oInput);
			}
		}
	}

	function fo_setValue(poInput) {
		poInput.value = sBgValue;
		$(poInput).addClass("mInput_bg_value_on");
	}

	function han_input_focus(poEvent) {
		var a1, a2, a3, b1, b2, b3, i1, i2, i3, o1, o2, o3, s1, s2 ,s3;

		$(this).removeClass("mInput_bg_value_on");

		if (this.value === sBgValue){
			this.value = "";
		}
	}

	function han_input_blur(poEvent) {
		if (this.value === "" || this.value === sBgValue){
			fo_setValue(this)
		}else{
			$(this).removeClass("mInput_bg_value_on");
		}
		
	}

	main();
}