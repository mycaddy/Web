/**
  <개선점>
   - 마우스 오버, 아웃 이벤트 핸들러 에서 firefox에서 'event' 객체가 없어서 에러 발생했다. 그래서 'this'로 대체.
* 주의 :
*	- 이 스크립트는 문서 제일 하단에 적는다. id로 객체를 얻어야 되기 때문.
*	- over 이미지 이름은 뒤에 '_over' 글짜나, 인자값으로 설정할 수 있다.
*	- 인자값으로 주어진 ID의 이미지들은 마우스 오버 되었을 때 마우스가 '손' 모양으로 된다.
*	- over 이미지가 없을때는, 보통 이미지가 계속 보여진다. 에러 나지 않는다.
*
* paImgs : 이미지 객체를 담은 Array 객체이다.(이미지 객체이다. id 문자열이 아니다.)
* psOverImgName : over 이미지 이름 뒤에 붙는 글짜. 이 인자값이 null 이거나 '"" 이면 '_over'로 설정된다.

	예) 
	a1 = $("#mainTop > .mainTopLeft1 > ul > li > a > img");
	new ImgOverLoad2(a1, "_on");
*/
function ImgOverLoad2(paImgs, psOverImgName){
	var aImgs = paImgs;
	var sOverImgName = psOverImgName;
	var aOverImgs = new Array(aImgs.length + 1);
	var aBasicImgs = new Array(aImgs.length + 1); // src만 저장한다.

	var oCallBackFunc_mouseout = new Array();
	var oCallBackFunc_mouseover = new Array();

	function addEventListener(psType, poCallBackFunc) {
		if (psType == "mouseout"){
			oCallBackFunc_mouseout.push(poCallBackFunc);
		}else if (psType == "mouseover"){
			oCallBackFunc_mouseover.push(poCallBackFunc)
		}
		
	}
	this.addEventListener = addEventListener;
	
	function setVar1(){
		var i1 = 0;
		while (i1 < aImgs.length){
			aBasicImgs[i1] = new Image();
			aBasicImgs[i1].src = aImgs[i1].src;

			aImgs[i1].style.cursor = "pointer";
			i1++;
		}

		if (sOverImgName == "" || sOverImgName == null){
			sOverImgName = "_over";
		}
	}

	function loadOverImg(){
		var i1, s1, s2, s3;
		i1 = 0;

		while (i1 < aImgs.length){
			s1 = aImgs[i1].src;

			s2 = s1.slice(0, s1.lastIndexOf("."));
			s3 = s1.slice(s1.lastIndexOf("."), s1.length);

			aOverImgs[i1] = new Image();
			aOverImgs[i1].src = s2 + sOverImgName + s3;

			i1++;
		}
	}

	function onMouseOverEvent(){
		var i1, o1;

		i1 = 0;
		try{
			o1 = event.srcElement;
		}catch(oError){
			o1 = this;
		}

		while (i1 < aImgs.length){
			if (o1 == aImgs[i1] && aOverImgs[i1].complete){
				o1.src = aOverImgs[i1].src;
				break;
			}
			i1++;
		}

		for (i1 = 0; i1 < oCallBackFunc_mouseover.length; i1++){
			if (oCallBackFunc_mouseover[i1]){
				oCallBackFunc_mouseover[i1]();
			}
		}
	}

	function onMouseOutEvent(){
		var i1, o1;

		i1 = 0;
		try{
			o1 = event.srcElement;
		}catch(oError){
			o1 = this;
		}

		while (i1 < aImgs.length){
			if (o1 == aImgs[i1] && o1.src == aOverImgs[i1].src){
				o1.src = aBasicImgs[i1].src;
				break;
			}
			i1++;
		}
		for (i1 = 0; i1 < oCallBackFunc_mouseout.length; i1++){
			if (oCallBackFunc_mouseout[i1]){
				oCallBackFunc_mouseout[i1]();
			}
		}
	}

	function regMouseEvent(){
		var i1 = 0;
		while (i1 < aImgs.length){
			if (aImgs[i1].addEventListener){
				aImgs[i1].addEventListener("mouseover", onMouseOverEvent);
				aImgs[i1].addEventListener("mouseout", onMouseOutEvent);
			}else{
				aImgs[i1].attachEvent("onmouseover", onMouseOverEvent);
				aImgs[i1].attachEvent("onmouseout", onMouseOutEvent);
			}	
			i1++;
		}
	}

	setVar1();
	regMouseEvent();
	loadOverImg();
}

