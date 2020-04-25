// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var map, infoWindow, geocoder, marker, latLon;
//geocoder = new google.maps.Geocoder();
function initMap() {
	var input = document.getElementById('address');
	var autocomplete = new google.maps.places.Autocomplete(input);
	google.maps.event.addListener(autocomplete, 'place_changed', function () {
		var place = autocomplete.getPlace();
		console.log(place.formatted_address);
		fetchAddress()
	});


	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -34.397, lng: 150.644 },
		zoom: 6
	});

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			latLon = pos;
			//ptlnlat = pos;
			//console.log(pos)
			marker = new google.maps.Marker({
				position: pos,
				map: map,
				draggable: true,
				animation: google.maps.Animation.DROP,

			});
			map.setCenter(latLon);
			map.setZoom(10);
			console.log(latLon);

			getcurrentweather(latLon.lat, latLon.lng);
			codeLatLng(latLon.lat, latLon.lng);

			google.maps.event.addListener(marker, 'dragend', function () {
				// geocodePosition(marker.getPosition());
				var lm = marker.getPosition().lat();
				var ln = marker.getPosition().lng();
				var pos2 = {
					lat: lm,
					lng: ln
				};
				latLon = pos2
				console.log(latLon)
				codeLatLng(latLon.lat, latLon.lng);
				getcurrentweather(latLon.lat, latLon.lng);
				
			});

		},

			function () {
				handleLocationError(true, infoWindow, map.getCenter());
			});
	}
	else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}


}
function fetchAddress() {
	//console.log(latLon)
	var address = document.getElementById('address').value;
	printAddress(address)
	geocoder.geocode({ 'address': address }, function (results, status) {
		if (status == 'OK') {
			var positionLn = results[0].geometry.location.lng()
			var positionLt = results[0].geometry.location.lat()
			var geolocation = {
				lat: positionLt,
				lng: positionLn
			};
			latLon = geolocation
			console.log(latLon)
			map.setCenter(latLon);
			marker.setPosition(latLon);
			getcurrentweather(latLon.lat, latLon.lng);
			//codeLatLng(latLon.lat, latLon.lng);
			// return (geolocation)

		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}


function codeLatLng(lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({
		'latLng': latlng
	}, function (results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				var add = results[1].formatted_address
				printAddress(add)
				console.log(results[1].formatted_address);
			} else {
				alert('No results found');
			}
		} else {
			alert('Geocoder failed due to: ' + status);
		}
	});
}

function printAddress(addre){
	document.getElementById("TheAddress").innerHTML = addre

}
		
		
var lat = '32.5813686';
var lon = '-85.4922819';
var currentweather = {};
var oneday={};
var weekweather = [];
var minuteweatherforthishour;
var day1 = [];
var day2 = [];
var day3 = [];
var day4 = [];
var day5 = [];
var day6 = [];
var day7 = [];
function getcurrentweather(lat,lon)
{
	var i=0;
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "?exclude=[minutely,hourly,alerts,flags]";
	//console.log(url);
	
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log(this.responseText);
			var result = JSON.parse(this.responseText);
			
			currentweather["temperature"] = result.currently.temperature;
			currentweather["summary"] = result.currently.summary;
			currentweather["feelslike"] = result.currently.apparentTemperature;
			currentweather["windSpeed"] = result.currently.windSpeed;
			currentweather["humidity"] = result.currently.humidity;
			currentweather["dewPoint"] = result.currently.dewPoint;
			currentweather["pressure"] = result.currently.pressure;
			currentweather["visibility"] = result.currently.visibility;
			currentweather["precipProbability"] = result.currently.precipProbability;
			console.log(currentweather);
			
			document.getElementById("currentTemp").innerHTML = result.currently.temperature + " F";
			document.getElementById("currentFeelsliketemp").innerHTML = result.currently.apparentTemperature + " F";
			document.getElementById("currentSummary").innerHTML = result.currently.summary;
			document.getElementById("currentWindspeed").innerHTML = result.currently.windSpeed + " mph";
			document.getElementById("currentHumidity").innerHTML = result.currently.humidity + "%";
			document.getElementById("currentDewpoint").innerHTML = result.currently.dewPoint;
			document.getElementById("currentPressure").innerHTML = result.currently.pressure + " inHG";
			document.getElementById("currentVisibility").innerHTML = result.currently.visibility + " mi";
			document.getElementById("currentPrecipitation").innerHTML = result.currently.precipProbability + "%";
			
			weekweather = result.daily.data;
			console.log(weekweather);
			
			var k=0;
			var day=[];
			var str='';
			var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			for(k=0;k<weekweather.length;k++)
			{
				var daynum = new Date((weekweather[k].time)*1000);
				day.push(days[daynum.getDay()]);
			}
			console.log(day);
			console.log(day.length);
			
			str+='<tr href="thisweek.html?lat="'+lat+'&lon="'+lon+'">';
			for(k=0;k<day.length;k++)
			{
				str += '<td>'+day[k]+'</td>';
			}
			str+='</tr>';		
			document.getElementById("thisweektablehead").innerHTML = str;	
			str='';
			str+='<tr>';
			for(k=0;k<day.length;k++)
			{
				str += '<td>'+weekweather[k].summary+'</td>';
			}
			str+='</tr>';		
			document.getElementById("thisweektablebody").innerHTML = str;
		}
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};

function getminuteweatherforthishour()
{
	var lat = getParameterByName('lat');
	var lon = getParameterByName('lon');
	var q=0; var str='';
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "?exclude=[hourly,currently,daily,alerts,flags]";
	xmlhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200)
		{
			//console.log(this.responseText);
			var result = JSON.parse(this.responseText);
			minuteweatherforthishour = result.minutely.data;
			console.log(result);
			for(q=0;q<60;q++)
			{
				var ttt= new Date(result.minutely.data[q].time*1000);
				str +='<tr><td>'+ttt.getHours()+":"+ttt.getMinutes()+'</td>'+'<td>'+result.minutely.data[q].precipIntensity+'</td>'+'<td>'+result.minutely.data[q].precipIntensityError+'</td>'+'<td>'+result.minutely.data[q].precipType+'</td>'+'<td>'+result.minutely.data[q].precipProbability+'</td></tr>';
				console.log(str);
			}
			document.getElementById("thishourtable").innerHTML = str;
		}
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};

function thishourbuttonclick()
{
	window.location.href = 'thishour.html?lat='+latLon.lat+'&lon='+latLon.lng;
}
function historybuttonclick()
{
	window.location.href = 'history.html?lat='+latLon.lat+'&lon='+latLon.lng;
}
function thisweekbuttonclick()
{
	window.location.href = 'thisweek.html?lat='+latLon.lat+'&lon='+latLon.lng;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function gethourweatherforthisweek()
{
	var lat = getParameterByName('lat');
	var lon = getParameterByName('lon');
	var x=0; var y=0; var str=''; var str1=[];
	var utime,summ,temp,ftemp,pprob,pint,hum,wind;
	var valone=[]; var vall;
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "?exclude=[minutely,currently,daily,alerts,flags]&extend=hourly";
	xmlhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200)
		{
			//console.log(this.responseText);
			var result = JSON.parse(this.responseText);
			console.log(result.hourly.data);
			for(x=0;x<169;x++)
			{
				utime = new Date(result.hourly.data[x].time*1000);
				summ = result.hourly.data[x].summary;
				temp = result.hourly.data[x].temperature
				ftemp = result.hourly.data[x].apparentTemperature
				pprob = result.hourly.data[x].precipProbability
				pint = result.hourly.data[x].precipIntensity
				hum = result.hourly.data[x].humidity
				wind = result.hourly.data[x].windSpeed
				vall = utime.getDate() +" "+ months[utime.getMonth()] +" "+ utime.getHours() +":"+ utime.getMinutes() +","+summ+","+temp+","+ftemp+","+pprob+","+pint+","+hum+","+wind
				console.log(vall);
				valone.push(vall);
				
			}
			console.log(valone);
			console.log(valone[0]);
			for(y=0;y<169;y++)
			{
				var ttt = valone[y].split(",");
				console.log(ttt);
				str +='<tr><td>'+ttt[0]+'</td>'+'<td>'+ttt[1]+'</td>'+'<td>'+ttt[2]+'</td>'+'<td>'+ttt[3]+'</td>'+'<td>'+ttt[4]+'</td>'+'<td>'+ttt[5]+'</td>'+'<td>'+ttt[6]+'</td>'+'<td>'+ttt[7]+'</td></tr>';
				
			}
			document.getElementById("thisweektable").innerHTML = str;
			/* str='<tr><td>'+valone[0]+'</td>'+'<td>'+valone[1]+'</td>'+'<td>'+valone[2]+'</td>'+'<td>'+valone[3]+'</td>'+'<td>'+valone[4]+'</td>'+'<td>'+valone[5]+'</td>'+'<td>'+valone[6]+'</td>'+'<td>'+valone[7]+'</td></tr>'; */
			
			//document.getElementById("thisweektable").innerHTML = str;
			//console.log(day1);
			//console.log(day2);
			//console.log(day3);
			//console.log(day4);
			//console.log(day5);
			//console.log(day6);
			//console.log(day7);
		}
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};




var lastweek = {};
var lastmonth = {};
var lastyear = {};
var lastdecade1 = {};
var lastdecade2 = {};
var lastdecade3 = {};
var lastdecade4 = {};
var lastdecade5 = {};
var lastdecade6 = {};
var lastdecade7 = {};
var lastdecade8 = {};
var lastdecade9 = {};
var lastdecade10 = {};
function getlastweek(lat,lon,tcurrent)
	{
		var tweek = parseInt(tcurrent - 604800);
		var xmlhttp = new XMLHttpRequest();
		var url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tweek + "?exclude=minutely,hourly,daily,alerts";
		console.log(url);
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastweek["temperature"] = result.currently.temperature;
				lastweek["summary"] = result.currently.summary;
				lastweek["feelslike"] = result.currently.apparentTemperature;
				lastweek["windSpeed"] = result.currently.windSpeed;
				lastweek["humidity"] = result.currently.humidity;
				lastweek["dewPoint"] = result.currently.dewPoint;
				lastweek["pressure"] = result.currently.pressure;
				lastweek["visibility"] = result.currently.visibility;
				lastweek["precipProbability"] = result.currently.precipProbability;
				console.log(lastweek);
				document.getElementById("lastweektemp").innerHTML = lastweek["temperature"];
				document.getElementById("lastweekfeelstemp").innerHTML = lastweek["feelslike"];
				document.getElementById("lastweekpprob").innerHTML = lastweek["precipProbability"];
				document.getElementById("lastweekhum").innerHTML = lastweek["humidity"];
				document.getElementById("lastweekwind").innerHTML = lastweek["windSpeed"];
						
						
			}
		};
				
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
				
	}
		
function getlastmonth(lat,lon,tcurrent)
	{
		var tmonth = parseInt(tcurrent - 2419200);
		var xmlhttp = new XMLHttpRequest();
		var url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tmonth + "?exclude=minutely,hourly,daily,alerts";
		console.log(url);
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastmonth["temperature"] = result.currently.temperature;
				lastmonth["summary"] = result.currently.summary;
				lastmonth["feelslike"] = result.currently.apparentTemperature;
				lastmonth["windSpeed"] = result.currently.windSpeed;
				lastmonth["humidity"] = result.currently.humidity;
				lastmonth["dewPoint"] = result.currently.dewPoint;
				lastmonth["pressure"] = result.currently.pressure;
				lastmonth["visibility"] = result.currently.visibility;
				lastmonth["precipProbability"] = result.currently.precipProbability;
				console.log(lastmonth);
				document.getElementById("lastmonthtemp").innerHTML = lastmonth["temperature"];
				document.getElementById("lastmonthfeelstemp").innerHTML = lastmonth["feelslike"];
				document.getElementById("lastmonthpprob").innerHTML = lastmonth["precipProbability"];
				document.getElementById("lastmonthhum").innerHTML = lastmonth["humidity"];
				document.getElementById("lastmonthwind").innerHTML = lastmonth["windSpeed"];
						
						
			}
		};
				
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
				
	}
		
function getlastyear(lat,lon,tcurrent)
	{
		var tyear = parseInt(tcurrent - 31556952);
		var xmlhttp = new XMLHttpRequest();
		var url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tyear + "?exclude=minutely,hourly,daily,alerts";
		console.log(url);
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastyear["temperature"] = result.currently.temperature;
				lastyear["summary"] = result.currently.summary;
				lastyear["feelslike"] = result.currently.apparentTemperature;
				lastyear["windSpeed"] = result.currently.windSpeed;
				lastyear["humidity"] = result.currently.humidity;
				lastyear["dewPoint"] = result.currently.dewPoint;
				lastyear["pressure"] = result.currently.pressure;
				lastyear["visibility"] = result.currently.visibility;
				lastyear["precipProbability"] = result.currently.precipProbability;
				console.log(lastyear);
				document.getElementById("lastyeartemp").innerHTML = lastyear["temperature"];
				document.getElementById("lastyearfeelstemp").innerHTML = lastyear["feelslike"];
				document.getElementById("lastyearpprob").innerHTML = lastyear["precipProbability"];
				document.getElementById("lastyearhum").innerHTML = lastyear["humidity"];
				document.getElementById("lastyearwind").innerHTML = lastyear["windSpeed"];
						
						
			}
		};
				
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
				
	}
		
function getlastdecade(lat,lon,tcurrent)
	{
		var tlastdecade1, tlastdecade2, tlastdecade3, tlastdecade4, tlastdecade5, tlastdecade6, tlastdecade7, tlastdecade8, tlastdecade9, tlastdecade10;
		var str='';
		tlastdecade1 = parseInt(tcurrent - 31556952);
		tlastdecade2 = parseInt(tlastdecade1 - 31556952);
		tlastdecade3 = parseInt(tlastdecade2 - 31556952);
		tlastdecade4 = parseInt(tlastdecade3 - 31556952);
		tlastdecade5 = parseInt(tlastdecade4- 31556952);
		tlastdecade6 = parseInt(tlastdecade5 - 31556952);
		tlastdecade7 = parseInt(tlastdecade6 - 31556952);
		tlastdecade8 = parseInt(tlastdecade7 - 31556952);
		tlastdecade9 = parseInt(tlastdecade8 - 31556952);
		tlastdecade10 = parseInt(tlastdecade9 - 31556952);
		
		var xmlhttp1 = new XMLHttpRequest();
		var url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade1 + "?exclude=minutely,hourly,daily,alerts";
		console.log(url);
		xmlhttp1.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade1["temperature"] = result.currently.temperature;
				lastdecade1["precipProbability"] = result.currently.precipProbability;
				lastdecade1["humidity"] = result.currently.humidity;
				lastdecade1["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade1);
			}
		};
		xmlhttp1.open("GET", url, true);
		xmlhttp1.send();

		var xmlhttp2 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade2 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp2.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade2["temperature"] = result.currently.temperature;
				lastdecade2["precipProbability"] = result.currently.precipProbability;
				lastdecade2["humidity"] = result.currently.humidity;
				lastdecade2["windSpeed"] = result.currently.windSpeed;		
				console.log(lastdecade2);
			}
		};
		xmlhttp2.open("GET", url, true);
		xmlhttp2.send();
			
		var xmlhttp3 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade3 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp3.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade3["temperature"] = result.currently.temperature;	
				lastdecade3["precipProbability"] = result.currently.precipProbability;
				lastdecade3["humidity"] = result.currently.humidity;
				lastdecade3["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade3);
			}
		};
		xmlhttp3.open("GET", url, true);
		xmlhttp3.send();

		var xmlhttp4 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade4 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp4.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade4["temperature"] = result.currently.temperature;	
				lastdecade4["precipProbability"] = result.currently.precipProbability;
				lastdecade4["humidity"] = result.currently.humidity;
				lastdecade4["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade4);
			}
		};
		xmlhttp4.open("GET", url, true);
		xmlhttp4.send();

		var xmlhttp5 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade5 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp5.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade5["temperature"] = result.currently.temperature;	
				lastdecade5["precipProbability"] = result.currently.precipProbability;
				lastdecade5["humidity"] = result.currently.humidity;
				lastdecade5["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade5);
			}
		};
		xmlhttp5.open("GET", url, true);
		xmlhttp5.send();
			
		var xmlhttp6 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade6 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp6.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade6["temperature"] = result.currently.temperature;
				lastdecade6["precipProbability"] = result.currently.precipProbability;
				lastdecade6["humidity"] = result.currently.humidity;
				lastdecade6["windSpeed"] = result.currently.windSpeed;		
				console.log(lastdecade6);
			}
		};
		xmlhttp6.open("GET", url, true);
		xmlhttp6.send();

		var xmlhttp7 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade7 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp7.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade7["temperature"] = result.currently.temperature;	
				lastdecade7["precipProbability"] = result.currently.precipProbability;
				lastdecade7["humidity"] = result.currently.humidity;
				lastdecade7["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade7);
			}
		};
		xmlhttp7.open("GET", url, true);
		xmlhttp7.send();

		var xmlhttp8 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade8 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp8.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade8["temperature"] = result.currently.temperature;	
				lastdecade8["precipProbability"] = result.currently.precipProbability;
				lastdecade8["humidity"] = result.currently.humidity;
				lastdecade8["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade8);
			}
		};
		xmlhttp8.open("GET", url, true);
		xmlhttp8.send();

		var xmlhttp9 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade9 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp9.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade9["temperature"] = result.currently.temperature;	
				lastdecade9["precipProbability"] = result.currently.precipProbability;
				lastdecade9["humidity"] = result.currently.humidity;
				lastdecade9["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade9);
			}
		};
		xmlhttp9.open("GET", url, true);
		xmlhttp9.send();

		var xmlhttp10 = new XMLHttpRequest();
		url = "https://api.darksky.net/forecast/cbfd106084dc0cc0f13b59db51351203/" + lat + "," + lon + "," + tlastdecade10 + "?exclude=minutely,hourly,daily,alerts";
		xmlhttp10.onreadstatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				var result = JSON.parse(this.responseText);
						
				lastdecade10["temperature"] = result.currently.temperature;	
				lastdecade10["precipProbability"] = result.currently.precipProbability;
				lastdecade10["humidity"] = result.currently.humidity;
				lastdecade10["windSpeed"] = result.currently.windSpeed;	
				console.log(lastdecade10);
			}
		};
		xmlhttp10.open("GET", url, true);
		xmlhttp10.send();
	
	var str = '<tr><td>'+lastdecade1["temperature"]+'</td><td>'+lastdecade1["precipProbability"]+'</td><td>'+lastdecade1["humidity"]+'</td><td>'+lastdecade1["windSpeed"]+'</td></tr>';
	document.getElementById("decadetable").innerHTML = str;
	
	}
function history(lat,lon)
	{
		var lat = '32.5813686';
		var lon = '-85.4922819';
		const now = new Date();
		var tcurrent = now.getTime()/1000;
		getlastweek(lat,lon,tcurrent);
		getlastmonth(lat,lon,tcurrent);
		getlastyear(lat,lon,tcurrent);
		getlastdecade(lat,lon,tcurrent);
			
	}
