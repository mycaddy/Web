
function data_excel(gubun){
	var Country = encodeURIComponent(oForm.Country.value) ;
	var State = encodeURIComponent(oForm.State.value) ;
	var City = encodeURIComponent(oForm.City.value) ;
	var clubCode = encodeURIComponent(oForm.Code_name.value) ;

	var excel_text = "" ;
	var excel_text2 = "" ;

	if (gubun=="club")
	{
		var gubunTxt = "골프장" ;
	}
	else{
		var gubunTxt = "코스" ;
	}

	if (Country!="")
	{
		var CountryText = $("#Country option:selected").text();
		excel_text+=CountryText ;
		excel_text2+=CountryText ;
	}
	if (State!="")
	{
		var StateText = $("#State option:selected").text();
		excel_text+=" > "+StateText ;
		excel_text2+=" > "+StateText ;
	}
	if (City!="")
	{
		var CityText = $("#City option:selected").text();
		excel_text+=" > "+CityText ;
		excel_text2+=" > "+CityText ;
	}
	if (clubCode!="")
	{
		var clubCodeText = $("#Code_name option:selected").text();
		excel_text2+=CountryText ;
	}
	
	if (gubun=="club")
	{
		var gubunTxt = "골프장" ;
		if (excel_text!="")
		{
			if (confirm(excel_text+" 의 \n\n"+gubunTxt+" 데이터를 엑셀로 받으시겠습니까?"))
			{
				var s1 = "?ACT=club&gubun="+gubun+"&Country="+Country+"&State="+State+"&City="+City+"&clubCode="+clubCode;	
									
				oForm.target = "comFrameEx";
				oForm.action = "excelDownNew.php" + s1;
				oForm.submit();
			}
		}
		else{
			if (confirm("전체 "+gubunTxt+" 데이터를 엑셀로 받으시겠습니까?\n\n전체 자료의 경우 시간이 오래 걸릴 수 있습니다.\n\n파일생성시까지 기다려 주세요."))
			{
				var s1 = "?ACT=club&gubun="+gubun+"&Country="+Country+"&State="+State+"&City="+City+"&clubCode="+clubCode;							
				oForm.target = "comFrameEx";
				oForm.action = "excelDownNew.php" + s1;
				oForm.submit();
			}
		}
	}
	else{
		var gubunTxt = "코스" ;
		if (excel_text2!="")
		{
			if (confirm(excel_text2+" 의 \n\n"+gubunTxt+" 데이터를 엑셀로 받으시겠습니까?"))
			{
				var s1 = "?ACT=course&gubun="+gubun+"&Country="+Country+"&State="+State+"&City="+City+"&clubCode="+clubCode;	
									
				oForm.target = "comFrameEx";
				oForm.action = "excelDownNew.php" + s1;
				oForm.submit();
			}
		}
		else{
			if (confirm("전체 "+gubunTxt+" 데이터를 엑셀로 받으시겠습니까?\n\n전체 자료의 경우 시간이 오래 걸릴 수 있습니다.\n\n파일생성시까지 기다려 주세요."))
			{
				var s1 = "?ACT=course&gubun="+gubun+"&Country="+Country+"&State="+State+"&City="+City+"&clubCode="+clubCode;							
				oForm.target = "comFrameEx";
				oForm.action = "excelDownNew.php" + s1;
				oForm.submit();
			}
		}

	}	
		
}