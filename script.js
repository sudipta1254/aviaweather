var type = 'metar', id = 'VEBS', c = 0,
p = document.querySelectorAll('p'),
input = document.querySelector("input"),
value = document.querySelectorAll('input'),
strongs = document.querySelectorAll('strong');

function awc() {
    p[1].innerHTML = p[3].innerHTML = '<em>Loading... <i class="fa-solid fa-spinner fa-spin-pulse"></i></em>';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const proxyUrl2 = 'https://corsproxy.io/?';
    const apiUrl = `https://beta.aviationweather.gov/cgi-bin/data/${type}.php?ids=${id}&format=json`;
    const url = proxyUrl2 + apiUrl;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        //console.log(data[0]);
        if(type == 'metar')
            if (data.length != 0)
               awcMain(data[0]);
            else
               alert(`METAR expired for ${id.toUpperCase()}! Showing cached data.`);
        else
            awcTafMain(data[0], 'AWC');
    })
    .catch(err => {
        console.log(`Error: `+ err.message);
    })
}
function awcMain(data) {
    p[1].innerHTML = 'AWC';
    var T = data.temp, D = data.dewp;
    ab = Math.exp((17.625*D)/(243.04+D));
    cd = Math.exp((17.625*T)/(240.04+T));
    ht = ((ab/cd)*100+1).toFixed(0);
    
    strongs[0].innerHTML = data.metarType;
    if(!c) {
        strongs[1].innerHTML = data.name+` <img src="https://flagcdn.com/24x18/in.png">`;
        c++;
    } else
        strongs[1].innerHTML = data.name+` <img src="https://flagcdn.com/24x18/${flag}.png">`;
    strongs[2].innerHTML = data.icaoId;
    strongs[3].innerHTML = getIST(data.reportTime)+' '+time(data.reportTime);
    strongs[4].innerHTML = T+'°C';
    strongs[5].innerHTML = `${D}°C<br>Humidity: ${ht}%`;;
    strongs[6].innerHTML = data.wspd+' Knot(s) ('+(data.wspd*1.85).toFixed(1)+' KM/H - '+data.wdir+'°) ';
    if(data.wspd)
        strongs[6].innerHTML += `<i class="fa-solid fa-location-arrow" style='rotate:${data.wdir+135}deg'></i>`;
    if(data.wgst)
       strongs[6].innerHTML += `<br> Gust: ${(data.wgst*1.85).toFixed(1)} KM/H`;
    da = ''+data.visib;
    if(da.charAt(da.length-1) == '+')
        da = +da.split('+')[0];
    strongs[7].innerHTML = data.visib+' SM ('+(da*1.609).toFixed(1)+' KM)';
    strongs[8].innerHTML = data.altim+' hPa';
    strongs[9].innerHTML = data.wxString;
    strongs[11].innerHTML = data.rawOb;
    strongs[10].innerHTML = '';
    if(!data.clouds[0].base)
      strongs[10].innerHTML = 'Clear skies';
    else {
      ul = document.createElement('ul');
      for(i = 0; i < data.clouds.length; i++) {
         li = document.createElement('li');
         li.innerHTML = data.clouds[i].cover+' at '+data.clouds[i].base+' ft AGL';
         ul.appendChild(li);
      }
      strongs[10].appendChild(ul);
    }
}
async function get() {
    p[1].innerHTML = p[2].innerHTML = p[3].innerHTML = '<em>Loading... <i class="fa-solid fa-spinner fa-spin-pulse"></i></em>';
    type = value[1].checked ? value[1].id : value[2].id
    inpVal = value[0].value.trim();
    if(!inpVal) {
        alert('Please enter Id!');
        return;
    }
    var a1 = +inpVal.substring(inpVal.length-3,inpVal.length),
    a2 = +inpVal.substring(inpVal.length-2, inpVal.length),
    a3 = +inpVal.substring(inpVal.length-1, inpVal.length);
    hrs = a1 > a2 ? a1 : a2 > a3 ? a2 : a3 > a1 ? a1 : a3;
    if(a1 > 0)
       inpVal = inpVal.substring(0, inpVal.length-3);
    else if(a2 > 0)
       inpVal = inpVal.substring(0, inpVal.length-2);
    else if(a3 > 0)
       inpVal = inpVal.substring(0, inpVal.length-1);
    
    const url = `https://avwx.rest/api/search/station?text=${inpVal}&token=2r_H32HZ2AzCZDotC-1GetnWkIZhkBMpdq2W3rLRabI`;
    const res = await fetch(url);
    if(!res.ok)
       alert('Search error: '+res.status+' '+res.type);
    const data = await res.json();
    id = data[0].icao;
    flag = data[0].country.toLowerCase();
  
    /*var hrs = +inpVal.substring(4, inpVal.length);
    id = inpVal.substring(0, 4).toUpperCase();
    
    var gh = +inpVal.substring(3, inpVal.length);
    if(gh > 0 || !inpVal.charAt(3)) {
       var hrs = gh;
       avwx(inpVal.substring(0, 3).toUpperCase());
    } else {
       var hrs = +inpVal.substring(4, inpVal.length);
       id = inpVal.substring(0, 4).toUpperCase();
    }*/
    
    d3d = document.querySelector('.d3').style;
    d4d = document.querySelector('.d4').style;
    d5d = document.querySelector('.d5').style
    d6d = document.querySelector('.d6').style;
    if(value[5].checked) {
       d3d.display = d4d.display = d5d.display = 'none';
       d6d.display = 'block';
       search(id);
    } else {
        if(value[3].checked) {
            awc();
            d3d.display = 'block';
        } else
            d3d.display = 'none';
        if(value[4].checked) {
            cwx();
            d4d.display = 'block';
        } else
            d4d.display = 'none';
        
        if(type == 'taf') {
            d3d.display = d4d.display = 'none';
            d5d.display = 'block';
        } else
            d5d.display = 'none';
    
        if (hrs > 0) {
          metarH(hrs);
          d6d.display = 'block';
       } else
          d6d.display = 'none';
   }
}
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector("button").click();
    }
});

function cwx() {
    p[2].innerHTML = p[3].innerHTML = '<em>Loading... <i class="fa-solid fa-spinner fa-spin-pulse"></i></em>';
    const url = `https://api.checkwx.com/${type}/${id}/decoded?x-api-key=c7e806f2a82843d88129362226`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        if(type == 'metar')
            cxwMain(data.data[0]);
        else
            cwxTafMain(data.data[0], 'CWX');
    })
    .catch(err => {
        console.log(`Error:`+ err.message);
    })
}
function cxwMain(data) {
    p[2].innerHTML = 'CWX';
    strongs[12].innerHTML = type.toUpperCase();
    strongs[13].innerHTML = data.station.name+', '+data.station.location+` <img src="https://flagcdn.com/24x18/${flag}.png">`;
    strongs[14].innerHTML = data.icao;
    strongs[15].innerHTML = getIST(data.observed)+' '+time(data.observed);
    strongs[16].innerHTML = data.temperature.celsius+'°C';
    strongs[17].innerHTML = data.dewpoint.celsius+'°C';
    strongs[18].innerHTML = data.humidity.percent+'%';
    if(data.wind) {
        strongs[19].innerHTML = data.wind.speed_kts+` Knot(s) (${data.wind.speed_kph} KM/H - ${data.wind.degrees}°) <i class="fa-solid fa-location-arrow" style='rotate:${data.wind.degrees+135}deg'></i>`;
        if(data.wind.gust_kph)
           strongs[19].innerHTML += `<br>Gust: ${data.wind.gust_kph} KM/H`;
    } else
        strongs[19].innerHTML = '0 Knot';
    strongs[20].innerHTML = data.visibility.miles+' Mi ('+data.visibility.meters_float/1000+' KM)';
    if(data.barometer)
        strongs[21].innerHTML = data.barometer.hpa+' hPa';
    if(data.conditions)
        strongs[22].innerHTML = data.conditions[0].text;
    strongs[24].innerHTML = data.raw_text;
    strongs[23].innerHTML = '';
    if(!data.clouds[0].feet)
      strongs[23].innerHTML = data.clouds[0].text;
    else {
      ul = document.createElement('ul');
      for(i = 0; i < data.clouds.length; i++) {
         li = document.createElement('li');
         li.innerHTML = data.clouds[i].text+' at '+data.clouds[i].feet+' ft AGL';
         ul.appendChild(li);
      }
      strongs[23].appendChild(ul);
    };
    let flc = data.flight_category;
    strongs[25].innerHTML = flc;
    document.querySelector('#fl').style.background =
        flc == 'VFR' ? 'Green': flc == 'MVFR' ? 'Blue' : flc == 'LIFR' ? 'Magenta' : 'Red';
}


function awcTafMain(data, comp) {
    var frst = data.fcsts;
    p[3].innerHTML = comp;
    strongs[26].innerHTML = type.toUpperCase();
    if (data.remarks)
        strongs[27].innerHTML = data.remarks;
    strongs[28].innerHTML = data.name+` <img src="https://flagcdn.com/24x18/${flag}.png">`;
    strongs[29].innerHTML = data.icaoId;
    strongs[30].innerHTML = getIST(data.issueTime)+' '+time(data.issueTime);
    strongs[31].innerHTML = `${getIST(data.validTimeFrom)} until ${getIST(data.validTimeTo)}`
    strongs[32].innerHTML = '';
    for(i = 0; i < frst.length; i++) {
        span = document.createElement('span');
        span2 = document.createElement('span');
        if (frst[i].fcstChange) {
            span.innerHTML = `${frst[i].fcstChange} from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} <br>`;
            if (frst[i].probability)
                span.innerHTML = `${frst[i].fcstChange} from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} (${frst[i].probability}% likely)<br>`;
        } else
            span.innerHTML = `Forecast from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} <br>`;
        if (frst[i].wspd) {
            li = document.createElement('li');
            li.innerHTML += `Wind: ${frst[i].wspd} Knot(s) (${(frst[i].wspd*1.85).toFixed(1)} KM/H - ${frst[i].wdir}°) <i class="fa-solid fa-location-arrow" style='rotate:${frst[i].wdir+135}deg'></i><br>`;
            span2.appendChild(li);
        } if (frst[i].wxString) {
            li = document.createElement('li');
            li.innerHTML += `Weather: ${frst[i].wxString} <br>`;
            span2.appendChild(li);
        } if (frst[i].visib) {
            li = document.createElement('li');
            if(frst[i].visib == '6+')
               li.innerHTML += `Visibility: ${frst[i].visib} mile(s) (10 Km)`;
            else
               li.innerHTML += `Visibility: ${frst[i].visib} mile(s) (${(frst[i].visib*1.609).toFixed(1)} Km)`;
            span2.appendChild(li);
        } if (frst[i].clouds.length != 0) {
            var clouds = frst[i].clouds;
            ul = document.createElement('ul');
            for(j = 0; j < clouds.length; j++) {
                li = document.createElement('li');
                li.innerHTML = `${clouds[j].cover} at ${clouds[j].base} ft AGL`;
                if (clouds[j].type)
                   li.innerHTML = `${clouds[j].cover} at ${clouds[j].base} ft (${clouds[j].type}) AGL`;
                ul.appendChild(li);
            }
            span2.appendChild(ul);
        }
        strongs[32].appendChild(span);
        strongs[32].appendChild(span2);
    }
    strongs[33].innerHTML = data.rawTAF;
}
function cwxTafMain(data, comp) {
    var frst = data.forecast;
    p[3].innerHTML = comp;
    strongs[26].innerHTML = type.toUpperCase();
    if (data.remarks)
        strongs[27].innerHTML = data.remarks;
    strongs[28].innerHTML = data.station.name+', '+data.station.location+` <img src="https://flagcdn.com/24x18/${flag}.png">`;
    strongs[29].innerHTML = data.icao;
    strongs[30].innerHTML = getIST(data.timestamp.issued)+' '+time(data.timestamp.issued);
    strongs[31].innerHTML = getIST(data.timestamp.from)+' until '+getIST(data.timestamp.to);
    strongs[32].innerHTML = '';
    for(i = 0; i < frst.length; i++) {
        span = document.createElement('span');
        span2 = document.createElement('span');
        if (frst[i].change && frst[i].change.indicator.code != 'FM') {
            span.innerHTML = `${frst[i].change.indicator.text} from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)} <br>`;
            if (frst[i].change.probability)
                span.innerHTML = `${frst[i].change.indicator.text} from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)} (${frst[i].change.probability}% likely)<br>`;
        } else
            span.innerHTML = `Forecast from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)} <br>`;
        if (frst[i].wind) {
            li = document.createElement('li');
            li.innerHTML += `Wind: ${frst[i].wind.speed_kts} Knot(s) (${frst[i].wind.speed_kph} KM/H - ${frst[i].wind.degrees}°) <i class="fa-solid fa-location-arrow" style='rotate:${frst[i].wind.degrees+135}deg'></i><br>`;
            span2.appendChild(li);
        } if (frst[i].conditions) {
            li = document.createElement('li');
            li.innerHTML += `Weather: ${frst[i].conditions[0].text} <br>`;
            span2.appendChild(li);
        } if (frst[i].visibility) {
            li = document.createElement('li');
            li.innerHTML += `Visibility: ${frst[i].visibility.miles} mile(s) (${(frst[i].visibility.meters_float/1000).toFixed(1)} Km)`;
            span2.appendChild(li);
        } if (frst[i].clouds.length != 0) {
            var clouds = frst[i].clouds;
            ul = document.createElement('ul');
            for(j = 0; j < clouds.length; j++) {
                li = document.createElement('li');
                if (clouds[j].feet == null)
                    li.innerHTML = clouds[j].text;
                else
                    li.innerHTML = `${clouds[j].text} at ${clouds[j].feet} ft AGL`;
                if (clouds[j].type)
                    li.innerHTML = `${clouds[j].cover} at ${clouds[j].base} ft (${clouds[j].type}) AGL`;
                ul.appendChild(li);
            }
            span2.appendChild(ul);
        }
        strongs[32].appendChild(span);
        strongs[32].appendChild(span2);
    }
    strongs[33].innerHTML = data.raw_text;
}

function getIST(date) {
    if (typeof date == 'string')
        return new Date(new Date(date+"Z").getTime()).toLocaleString();
    else
        return new Date(date*1000).toLocaleString();
}


function metarH(hrs) {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://beta.aviationweather.gov/cgi-bin/data/${type}.php?ids=${id}&hours=${hrs}&format=json`;
    const url = proxyUrl + apiUrl;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        awcMetH(data, hrs);
    })
    .catch(err => {
        console.log(`Error: `+ err.message);
    })
}
function awcMetH(data, hrs) {
    var d6 = document.querySelector('.d6');
    d6.innerHTML = '';
    const p = document.createElement('p')
    p.innerHTML = `${type.toUpperCase()} HISTORY`;
    d6.appendChild(p);
    if (data.length != 0) {
       const ol = document.createElement('ol');
       d6.innerHTML += `Name: <strong>${data[0].name}</strong> <img src="https://flagcdn.com/24x18/${flag}.png"> <br>
                        ICAO: <strong>${data[0].icaoId}</strong> <br>`;
       if (type == 'metar') {
          for(i = 0; i < data.length; i++) {
              const li = document.createElement('li');
              li.innerHTML = getIST(data[i].reportTime)+': <strong>'+data[i].rawOb+`<br>`;
              ol.appendChild(li);
          }
       } else {
          for(i = 0; i < data.length; i++) {
              const li = document.createElement('li');
              li.innerHTML = getIST(data[i].issueTime)+': <strong>'+data[i].rawTAF+`<br>`;
              ol.appendChild(li);
          }
       }
       d6.appendChild(ol);
    } else
       d6.innerHTML += `No ${type.toUpperCase()}(s) in previous ${hrs} hour(s)!`;
    d6.innerHTML += '<hr>';
}

function info() {
    let reL = 'https://www.world-airport-codes.com';
    if(confirm(`METAR - Meteorological Aerodrome Report.\nTAF - Terminal Aerodrome Forecast.\nTo get ICAO, click 'OK'.\n(redirects to ${reL})\nYour screen resolution: ${screen.width}×${screen.height}px`))
       window.open(reL);
}
async function search(a) {
   var d6 = document.querySelector('.d6');
   d6.innerHTML = '<p><em>Loading... <i class="fa-solid fa-spinner fa-spin-pulse"></i></em></p>';
   
   const url = `https://avwx.rest/api/search/station?text=${a}&token=2r_H32HZ2AzCZDotC-1GetnWkIZhkBMpdq2W3rLRabI`;
   const res = await fetch(url);
   if(!res.ok)
      alert('AVWX error: '+res.status+' '+res.type);
   const data = await res.json();
   
   var stn = data[0];
   d6.innerHTML = '<p>Station Info</p>';
   d6.innerHTML += `Name: ${stn.name}, ${stn.city}, ${stn.state}, ${stn.country} <img src="https://flagcdn.com/24x18/${flag}.png"> <br>
                     Coordinate: ${stn.latitude.toFixed(2)}, ${stn.longitude.toFixed(2)} <br>
                     IATA: ${stn.iata} <br>
                     ICAO: ${stn.icao} <br>
                     Reporting: ${stn.reporting?'Yes':'No'} <br>`;
   for(j = 0; j < stn.runways.length; j++) {
         var rny = stn.runways[j];
         var span = document.createElement('span');
         var ul = document.createElement('ul');
         span.innerHTML = 'Runway '+(j+1)+':-';
         ul.innerHTML = `<li>Surface: ${rny.surface}</li>
                        <li>Numbers: ${rny.ident1} & ${rny.ident2}</li>
                        <li>Length: ${rny.length_ft} ft</li>
                        <li>Width: ${rny.width_ft} ft</li>
                        <li>Lights: ${rny.lights} </li>`;
         span.appendChild(ul);
         d6.appendChild(span);
   }
   if(stn.wiki)
      d6.innerHTML += `Website: <a href='${stn.wiki}'>Visit</a>`
   d6.innerHTML += '<hr>';
}
function time(t) {
   var tm = ((new Date() - new Date(t+'Z'))/60000).toFixed(0);
   var hb = Math.ceil(tm/60);
   if(hb > 1)
      return `[${hb-1} hour(s) ago]`;
   return `[${tm} min(s) ago]`;
}
function accent() {
   var ob = (a) => {
      a.style.accentColor = value[5].value;
   }
   ob(value[1]); ob(value[2]); ob(value[3]); ob(value[4]);
}


/* https://api.checkwx.com/metar/vebs/decoded?x-api-key=c7e806f2a82843d88129362226 */
