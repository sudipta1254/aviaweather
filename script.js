type = 'metar', id = 'vebs'
function user() {
   const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
   const apiUrl = `https://beta.aviationweather.gov/cgi-bin/data/${type}.php?ids=${id}&format=json`;
   const url = proxyUrl + apiUrl;
   
   fetch(url)
   .then(response => response.json())
   .then(data => {
      console.log(data[0]);
      main(data[0]);
   })
   .catch(err => {
      console.log(`Error:`, err.message);
   })
}
function main(data) {
   dateIST = new Date(data.reportTime+"Z").toLocaleString("en-US", {timeZone: 'Asia/Kolkata'}).split(' ')[1];
   strongs = document.querySelectorAll('strong');
   strongs[0].innerHTML = data.metarType;
   strongs[1].innerHTML = data.name;
   strongs[2].innerHTML = data.icaoId;
   strongs[3].innerHTML = `${data.reportTime} UTC (${dateIST})`;
   strongs[4].innerHTML = data.temp+'°C';
   strongs[5].innerHTML = data.dewp+'°C';
   strongs[6].innerHTML = data.wspd+' Knot(s) ('+(data.wspd*1.85).toFixed(1)+' KM/H - '+data.wdir+'°)';
   da = ''+data.visib;
   if(da.charAt(da.length-1) == '+')
      da = +da.split('+')[0];
   strongs[7].innerHTML = data.visib+' SM ('+(da*1.609).toFixed(1)+' KM)';
   strongs[8].innerHTML = data.altim+' hPa';
   strongs[9].innerHTML = data.wxString;
   strongs[11].innerHTML = data.rawOb;
   strongs[10].innerHTML = '';
   for(i = 0; i < data.clouds.length; i++) {
      st = document.createElement('span');
      st = data.clouds[i].cover+' at '+data.clouds[i].base+' ft';
      strongs[10].innerHTML += st +' | ';
   }
}
function get() {
   value = document.querySelectorAll('input')
   type = value[1].checked ? value[1].value : value[2].value
   inpVal = value[0].value
   if(inpVal == '') {
      alert('Please enter Id!')
      return
   }
   id = inpVal
   d3d = document.querySelector('.d3').style;
   d4d = document.querySelector('.d4').style;
   if(value[3].checked) {
      user();
      d3d.display = 'block';
   } else
      d3d.display = 'none';
   if(value[4].checked) {
      user2();
      d4d.display = 'block';
   } else
      d4d.display = 'none';
}
input = document.querySelector("input");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("button").click();
  }
});
user()



function user2() {
   const url = `https://api.checkwx.com/${type}/${id}/decoded?x-api-key=c7e806f2a82843d88129362226`;
   
   fetch(url)
   .then(response => response.json())
   .then(data => {
      //console.log(data);
      main2(data.data[0]);
   })
   .catch(err => {
      console.log(`Error:`, err.message);
   })
}
function main2(data) {
   dateIST = new Date(data.observed+'Z').toLocaleString("en-US", {timeZone: 'Asia/Kolkata'}).split(' ')[1];
   strongs = document.querySelectorAll('strong');
   strongs[12].innerHTML = type.toUpperCase();
   strongs[13].innerHTML = data.station.name+', '+data.station.location;
   strongs[14].innerHTML = data.icao;
   strongs[15].innerHTML = `${data.observed} UTC (${dateIST})`;
   strongs[16].innerHTML = data.temperature.celsius+'°C';
   strongs[17].innerHTML = data.dewpoint.celsius+'°C';
   strongs[18].innerHTML = data.humidity.percent+'%';
   strongs[19].innerHTML = data.wind.speed_kts+' Knot(s) ('+data.wind.speed_kph+' KM/H - '+data.wind.degrees+'°)';
   strongs[20].innerHTML = data.visibility.miles+' Mi ('+data.visibility.meters_float/1000+' KM)';
   strongs[21].innerHTML = data.barometer.hpa+' hPa';
   if(data.conditions != null)
      strongs[22].innerHTML = data.conditions[0].text;
   strongs[24].innerHTML = data.raw_text;
   strongs[23].innerHTML = '';
   for(i = 0; i < data.clouds.length; i++) {
      st = document.createElement('span');
      st = data.clouds[i].text+' at '+data.clouds[i].feet+' ft';
      strongs[23].innerHTML += st +' | ';
   }
   strongs[25].innerHTML = data.flight_category;
}
