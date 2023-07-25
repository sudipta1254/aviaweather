type = 'metar', id = 'VEBS';
input = document.querySelector("input");
value = document.querySelectorAll('input');
strongs = document.querySelectorAll('strong');

function awc() {
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
        alert(`Error: `+ err.message);
    })
}
function awcMain(data) {
    strongs[0].innerHTML = data.metarType;
    strongs[1].innerHTML = data.name;
    strongs[2].innerHTML = data.icaoId;
    strongs[3].innerHTML = getIST(data.reportTime);
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
    ul = document.createElement('ul');
    for(i = 0; i < data.clouds.length; i++) {
        li = document.createElement('li');
        li.innerHTML = data.clouds[i].cover+' at '+data.clouds[i].base+' ft AGL';
        ul.appendChild(li);
    }
    strongs[10].appendChild(ul);
}
function get() {
    type = value[1].checked ? value[1].value : value[2].value
    inpVal = value[0].value;
    if(inpVal == '') {
        alert('Please enter Id!');
        return;
    }
    var hrs = +inpVal.substring(4, inpVal.length);
    id = inpVal.substring(0, 4).toUpperCase();
    d3d = document.querySelector('.d3').style;
    d4d = document.querySelector('.d4').style;
    d5d = document.querySelector('.d5').style
    d6d = document.querySelector('.d6').style;;
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
        d3d.display = 'none';
        d4d.display = 'none';
        d5d.display = 'block';
    } else
        d5d.display = 'none';

    if (hrs > 0) {
      metarH(hrs);
      d6d.display = 'block';
   } else
      d6d.display = 'none';
}
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector("button").click();
    }
});
awc()

function cwx() {
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
        alert(`Error:`+ err.message);
    })
}
function cxwMain(data) {
    strongs[12].innerHTML = type.toUpperCase();
    strongs[13].innerHTML = data.station.name+', '+data.station.location;
    strongs[14].innerHTML = data.icao;
    strongs[15].innerHTML = getIST(data.observed);
    strongs[16].innerHTML = data.temperature.celsius+'°C';
    strongs[17].innerHTML = data.dewpoint.celsius+'°C';
    strongs[18].innerHTML = data.humidity.percent+'%';
    if(data.wind != null)
        strongs[19].innerHTML = data.wind.speed_kts+' Knot(s) ('+data.wind.speed_kph+' KM/H - '+data.wind.degrees+'°)';
    else
        strongs[19].innerHTML = '0 Knot';
    strongs[20].innerHTML = data.visibility.miles+' Mi ('+data.visibility.meters_float/1000+' KM)';
    if(data.barometer != null)
        strongs[21].innerHTML = data.barometer.hpa+' hPa';
    if(data.conditions != null)
        strongs[22].innerHTML = data.conditions[0].text;
    strongs[24].innerHTML = data.raw_text;
    strongs[23].innerHTML = '';
    ul = document.createElement('ul');
    for(i = 0; i < data.clouds.length; i++) {
       li = document.createElement('li');
       li.innerHTML = data.clouds[i].text+' at '+data.clouds[i].feet+' ft AGL';
       ul.appendChild(li);
    }
    strongs[23].appendChild(ul);
    let flc = data.flight_category;
    strongs[25].innerHTML = flc;
    document.querySelector('#fl').style.background =
        flc == 'VFR' ? 'Green': flc == 'MVFR' ? 'Blue' : flc == 'LIFR' ? 'Magenta' : 'Red';
}



function awcTafMain(data, comp) {
    var frst = data.fcsts;
    document.querySelectorAll('p')[3].innerHTML = comp;
    strongs[26].innerHTML = type.toUpperCase();
    if (data.remarks != null)
        strongs[27].innerHTML = data.remarks;
    strongs[28].innerHTML = data.name;
    strongs[29].innerHTML = data.icaoId;
    strongs[30].innerHTML = getIST(data.issueTime);
    strongs[31].innerHTML = `${getIST(data.validTimeFrom)} until ${getIST(data.validTimeTo)}`
    strongs[32].innerHTML = '';
    for(i = 0; i < frst.length; i++) {
        span = document.createElement('span');
        span2 = document.createElement('span');
        if (frst[i].fcstChange != null) {
            span.innerHTML = `${frst[i].fcstChange} from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} <br>`;
            if (frst[i].probability)
                span.innerHTML = `${frst[i].fcstChange} from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} (${frst[i].probability}% likely)<br>`;
        } else
            span.innerHTML = `Forecast from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} <br>`;
        if (frst[i].wspd != null) {
            li = document.createElement('li');
            li.innerHTML += `Wind: ${frst[i].wspd} Knot(s) (${(frst[i].wspd*1.85).toFixed(1)} KM/H - ${frst[i].wdir}°) <br>`;
            span2.appendChild(li);
        } if (frst[i].wxString != null) {
            li = document.createElement('li');
            li.innerHTML += `Weather: ${frst[i].wxString} <br>`;
            span2.appendChild(li);
        } if (frst[i].visib != null) {
            li = document.createElement('li');
            li.innerHTML += `Visibility: ${frst[i].visib} mile(s)`;
            span2.appendChild(li);
        } if (frst[i].clouds.length != 0) {
            var clouds = frst[i].clouds;
            ul = document.createElement('ul');
            for(j = 0; j < clouds.length; j++) {
                li = document.createElement('li');
                li.innerHTML = `${clouds[j].cover} at ${clouds[j].base} ft AGL`;
                if (clouds[j].type != null)
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
    document.querySelectorAll('p')[3].innerHTML = comp;
    strongs[26].innerHTML = type.toUpperCase();
    if (data.remarks != null)
        strongs[27].innerHTML = data.remarks;
    strongs[28].innerHTML = data.station.name+', '+data.station.location;
    strongs[29].innerHTML = data.icao;
    strongs[30].innerHTML = getIST(data.timestamp.issued);
    strongs[31].innerHTML = getIST(data.timestamp.from)+' until '+getIST(data.timestamp.to);
    strongs[32].innerHTML = '';
    for(i = 0; i < frst.length; i++) {
        span = document.createElement('span');
        span2 = document.createElement('span');
        if (frst[i].change != null && frst[i].change.indicator.code != 'FM') {
            span.innerHTML = `${frst[i].change.indicator.text} from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)} <br>`;
            if (frst[i].change.probability != null)
                span.innerHTML = `${frst[i].change.indicator.text} from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)} (${frst[i].change.probability}% likely)<br>`;
        } else
            span.innerHTML = `Forecast from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)} <br>`;
        if (frst[i].wind != null) {
            li = document.createElement('li');
            li.innerHTML += `Wind: ${frst[i].wind.speed_kts} Knot(s) (${frst[i].wind.speed_kph} KM/H - ${frst[i].wind.degrees}°) <br>`;
            span2.appendChild(li);
        } if (frst[i].conditions != null) {
            li = document.createElement('li');
            li.innerHTML += `Weather: ${frst[i].conditions[0].text} <br>`;
            span2.appendChild(li);
        } if (frst[i].visibility != null) {
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
                if (clouds[j].type != null)
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


/*setInterval(() => {
    type = value[1].checked ? value[1].value : value[2].value
    if (type == 'taf')
        if (value[3].checked)
            value[4].checked = 'true';
        else
            value[3].checked = 'true';
    else {
        value[3].checked = 'false';
        value[4].checked = 'false';
    }
}, 0);*/
function getIST(date) {
    if (typeof date == 'string') {
        var dt = new Date(new Date(date+"Z").getTime()).toLocaleString();
        if (date.charAt(10) == 'T')
            return `${date.split('T')[0]} ${dt.split(',')[1]}`;
        return `${date.split(' ')[0]} ${dt.split(',')[1]}`;
    } else
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
        alert(`Error: `+ err.message);
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
       d6.innerHTML += `Name: <strong>${data[0].name}</strong> <br>
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


/* https://api.checkwx.com/metar/vebs/decoded?x-api-key=c7e806f2a82843d88129362226 */
