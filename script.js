var type = 'metar', id = 'VEBS', c = 0, qry, p = $('p'), divs = $('div'), iframe = $('iframe'), value = $('input'), b = $('b');

function awc() {
    p[1].innerHTML = p[3].innerHTML = '<em>Loading... <i class="fa-solid fa-spinner fa-spin-pulse"></i></em>';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const proxyUrl2 = 'https://corsproxy.io/?';
    const apiUrl = `https://beta.aviationweather.gov/cgi-bin/data/${type}.php?ids=${id}&format=json`;
    const url = proxyUrl2 + apiUrl;
    
    fetch(url)
    .then(response => {
        if(!response.ok)
            alert('AWC error: '+response.status+' '+response.type);
        return response.json();
    })
    .then(data => {
        if(type == 'metar')
            if(data.length)
                awcMain(data[0]);
            else
                alert(`AWC: METAR expired for ${id.toUpperCase()} or airport doesn't exists! Showing cached data.`);
        else
            if(data.length)
                awcTafMain(data[0], 'AWC');
            else
                alert(`AWC: TAF expired for ${id.toUpperCase()} or airport doesn't exists! Showing cached data.`);
    })
    .catch(err => {
        console.log(`Error: `+ err.message);
    })
}
function awcMain(data) {
    p.eq(1).text('AWC');
    var T = data.temp, D = data.dewp;
    ab = Math.exp((17.625*D)/(243.04+D));
    cd = Math.exp((17.625*T)/(240.04+T));
    ht = ((ab/cd)*100+1).toFixed(0);
    
    b.eq(0).text(data.metarType);
   if(!c) {
      b.eq(1).html(data.name+` <img src="https://flagcdn.com/24x18/in.png">`);
      c++;
   } else
      b.eq(1).html(data.name+` <img src="https://flagcdn.com/24x18/${flag}.png">`);
   b.eq(2).text(data.icaoId);
   b.eq(3).text(getIST(data.reportTime)+' '+time(data.reportTime));
   b.eq(4).text(T+'°C');
   b.eq(5).html(`${D}°C<br>Humidity: ${ht}%`);
   b.eq(6).text(data.wspd+' Knot(s) ('+(data.wspd*1.85).toFixed(1)+' KM/H - '+data.wdir+'°) ');
   if(data.rawOb.charAt(24) != 'V') {
      if(data.wspd)
         b.eq(6).append(`<i class="fa-solid fa-location-arrow" style='rotate:${data.wdir+135}deg'></i>`);
   } else {
      var ind = data.rawOb.indexOf('V', 4),
      d1 = +data.rawOb.substr(ind-3, 3),
      d2 = +data.rawOb.substr(ind+1, 3);
      if(d1 && d2)
         b.eq(6).append(`<i class="fa-solid fa-location-arrow arrow"></i>`);
      arrow(d1, d2);
   } if(data.wgst)
      b.eq(6).append(`<br> Gust: ${(data.wgst*1.85).toFixed(1)} KM/H`);
   da = ''+data.visib;
   if(da.charAt(da.length-1) == '+')
      da = +da.split('+')[0];
   b.eq(7).text(data.visib+' SM ('+(da*1.609).toFixed(1)+' KM)');
   if(data.altim)
      b.eq(8).text(data.altim+' hPa');
   b.eq(9).text(data.wxString);
   b.eq(11).text(data.rawOb);
   b.eq(10).text('');
   if(!data.clouds[0].base)
      b.eq(10).text('Clear skies');
   else {
      var ul = $('<ul></ul>');
      for(i = 0; i < data.clouds.length; i++) {
         var li = $('<li></li>');
         li.text(data.clouds[i].cover+' at '+data.clouds[i].base+' ft AGL');
         ul.append(li);
      }
      b.eq(10).append(ul);
   }
}
async function get() {
    type = value[1].checked ? value[1].id : value[2].checked ? value[2].id : '';
    inpVal = value[0].value.trim();
    if(!inpVal) {
        alert('Please enter Id!');
        return;
    }
    p[1].innerHTML = p[2].innerHTML = p[3].innerHTML = divs[8].innerHTML = divs[9].innerHTML = '<em>Loading... <i class="fa-solid fa-spinner fa-spin-pulse"></i></em>';
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
    airp = `${data[0].name}, ${data[0].city}, ${data[0].state}, ${data[0].country}`;
    if(data[0].name != qry)
       iframe.attr('src', `https://maps.google.com/maps?width=600&height=400&hl=en&q=${data[0].name}&t=&z=13&ie=UTF8&iwloc=B&output=embed`);
    qry = data[0].name;
        
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
       search(data, flag);
    } else {
        if(value[3].checked) {
            awc();
            d3d.display = 'block';
        } else
            d3d.display = 'none';
        if(value[4].checked) {
            cwx(id, type, flag);
            d4d.display = 'block';
        } else
            d4d.display = 'none';
        
        if(type == 'taf') {
            d3d.display = d4d.display = 'none';
            d5d.display = 'block';
            if(value[6].checked)
                d5d.display = 'none';
        } else
            d5d.display = 'none';
        if(value[6].checked) {
            divs[9].style.display = 'block';
            avwxMain(id, type, airp, flag);
        } else
            divs[9].style.display = 'none';
    
        if (hrs > 0) {
          metarH(id, type, hrs, flag);
          d6d.display = 'block';
       } else
          d6d.display = 'none';
   }
}
awc();

$('input').on("keypress", function(event) {
    if(event.key === "Enter") {
        event.preventDefault();
        get();
    }
});

function cwx(id, type, flag) {
    p[2].innerHTML = p[3].innerHTML = '<em>Loading... <i class="fa-solid fa-spinner fa-spin-pulse"></i></em>';
    const url = `https://api.checkwx.com/${type}/${id}/decoded?x-api-key=c7e806f2a82843d88129362226`;
    
    fetch(url)
    .then(response => {
        if(!response.ok)
            alert('CWX error: '+response.status+' '+response.type);
        return response.json();
    })
    .then(data => {
        //console.log(data);
        if(!data.error)
            if(type == 'metar')
                if(data.data.length)
                   cxwMain(data.data[0], flag);
                else
                   alert(`CWX: METAR expired for ${id.toUpperCase()} or airport doesn't exists! Showing cached data.`);
             else
                if(data.data.length)
                   cwxTafMain(data.data[0], flag, 'CWX');
                else
                   alert(`CWX: TAF expired for ${id.toUpperCase()} or airport doesn't exists! Showing cached data.`);
        else
            alert('CWX error: '+data.error);
    })
    .catch(err => {
        console.log(`Error:`+ err.message);
    })
}
function cxwMain(data, flag) {
    p.eq(2).text('CWX');
   b[12].innerHTML = type.toUpperCase();
   b[13].innerHTML = data.station.name+', '+data.station.location+` <img src="https://flagcdn.com/24x18/${flag}.png">`;
   b[14].innerHTML = data.icao;
   b[15].innerHTML = getIST(data.observed)+' '+time(data.observed);
   b[16].innerHTML = data.temperature.celsius+'°C';
   b[17].innerHTML = data.dewpoint.celsius+'°C';
   b[18].innerHTML = data.humidity.percent+'%';
   if(data.wind) {
      b[19].innerHTML = data.wind.speed_kts+` Knot(s) (${data.wind.speed_kph} KM/H - ${data.wind.degrees}°) <i class="fa-solid fa-location-arrow" style='rotate:${data.wind.degrees+135}deg'></i>`;
      if(data.wind.gust_kph)
      b[19].innerHTML += `<br>Gust: ${data.wind.gust_kph} KM/H`;
   } else
      b[19].innerHTML = '0 Knot';
   if(data.visibility)
      b[20].innerHTML = data.visibility.miles+' Mi ('+data.visibility.meters_float/1000+' KM)';
   if (data.barometer)
      b[21].innerHTML = data.barometer.hpa+' hPa';
   if(data.conditions)
      b[22].innerHTML = data.conditions[0].text;
   b[24].innerHTML = data.raw_text;
   b[23].innerHTML = '';
   if(!data.clouds[0].feet)
      b[23].innerHTML = data.clouds[0].text;
   else {
      ul = document.createElement('ul');
      for(i = 0; i < data.clouds.length; i++) {
         li = document.createElement('li');
         li.innerHTML = data.clouds[i].text+' at '+data.clouds[i].feet+' ft AGL';
         ul.append(li);
      }
      b[23].append(ul);
   }
   let flc = data.flight_category;
   b[25].innerHTML = flc;
   $('#fl').css('background',
    flc == 'VFR' ? 'Green': flc == 'MVFR' ? 'Blue' : flc == 'LIFR' ? 'Magenta' : 'Red');
}

async function avwxMain(id, type, airp, flag) {
    var url = `https://avwx.rest/api/${type}/${id}?token=2r_H32HZ2AzCZDotC-1GetnWkIZhkBMpdq2W3rLRabI`;
    const res = await fetch(url);
    if(!res.ok)
      alert('AVWX error: '+res.status+' - '+res.type);
    getHeaders(res);
    const data = await res.json();
    
    if(data.meta.warning)
      alert(data.meta.warning);
    var d7 = divs[9], flc = data.flight_rules;
    d7.html(`<p>AVWX</p>
            Type: <b>${type.toUpperCase()}</b> <br>`);
   if(data.remarks)
      d7.append(`Remark: <b>${data.remarks}</b> <br>`);
   d7.append(`Airport: <b>${airp}</b> <img src="https://flagcdn.com/24x18/${flag}.png"> <br>
                    ICAO Code: <b>${data.station}</b> <br>`);
   if(type == 'metar') {
      d7.append(`Reported: <b>${getIST(data.time.dt)} ${time(data.time.dt)}</b> <br>
                 Temperature: <b>${data.temperature.value}°C</b> <br>
                 Dewpoint: <b>${data.dewpoint.value}°C</b> <br>
                 Humidity: <b>${(data.relative_humidity*100).toFixed(0)}%</b> <br>
                 Wind: <b>${data.wind_speed.value} Knot(s) (${(data.wind_speed.value*1.85).toFixed(0)} KM/H - ${data.wind_direction.repr}°)</b>`);
      if(data.wind_variable_direction.length) {
         d7.append(`<i class="fa-solid fa-location-arrow arrow"></i> <br>`);
         arrow(data.wind_variable_direction[0].value, data.wind_variable_direction[1].value);
      } else
         if(data.wind_direction.value)
            d7.append(`<i class="fa-solid fa-location-arrow" style='rotate:${data.wind_direction.value+135}deg'></i> <br>`);
         else
            d7.append(`<i class="fa-solid fa-wind"></i> <br>`);
      if(data.wind_gust)
         d7.append(`Gust: <b>${data.wind_gust.value} Knot(s)</b> <br>`);
      if(data.visibility)
         if(data.units.visibility == 'm')
            d7.append(`Visibility: <b>${(data.visibility.value/1000).toFixed(0)} Km</b> <br>`);
         else
            d7.append(`Visibility: <b>${(data.visibility.value*1.609).toFixed(0)} Km</b> <br>`);
      if(data.units.altimeter == 'hPa')
         d7.append(`Pressure: <b>${data.altimeter.value} hPa</b> <br>`);
      else
         d7.append(`Pressure: <b>${data.altimeter.value} mmHg</b> <br>`);
      if(data.wx_codes.length) {
         d7.append(`Condition: `);
         for(i = 0; i < data.wx_codes.length; i++)
            if(i == data.wx_codes.length-1)
                d7.append('<b>'+data.wx_codes[i].value+'</b> <br>');
            else
                d7.append('<b>'+data.wx_codes[i].value+'</b>, ');
      } d7.append(`Clouds: `);
      if(!data.clouds.length)
         d7.append(' <b>Clear skies</b> <br>');
      else {
         var ul = $('<ul></ul>');
         for(i = 0; i < data.clouds.length; i++) {
            var li = $('<li></li>');
            li.html('<b>'+data.clouds[i].type+' at '+data.clouds[i].altitude*100+' ft AGL</b>');
            if(data.clouds[i].modifier)
               li.append(` <b>(${data.clouds[i].modifier})</b>`);
            ul.append(li);
         }
         d7.append(ul);
      }
      d7.append(`Raw: <b>${data.raw}</b> <br>
                 Category: <b>${flc}</b>`);
      var fl = $('<div></div>');
      fl.attr('id', 'fl');
      fl.css('background',
          flc == 'VFR' ? 'Green': flc == 'MVFR' ? 'Blue' : flc == 'LIFR' ? 'Magenta' : 'Red');
      d7.append(fl);
   } else {
      var frst = data.forecast;
      d7.append(`Issued: <b>${getIST(data.time.dt)} ${time(data.time.dt)} <br>
                 Span: ${getIST(data.start_time.dt)} until ${getIST(data.end_time.dt)}</b> <br>`);
      for(i = 0; i < frst.length; i++) {
         var span = $('<span></span>'),
         span2 = $('<span></span>');
         if(frst[i].type) {
            span.html(`<b>${frst[i].type} from ${getIST(frst[i].start_time.dt)} to ${getIST(frst[i].end_time.dt)}</b>`);
            if (frst[i].probability)
               span.append(`<b> (${frst[i].probability}% likely)</b> <br>`);
         } else
            span.html(`<b>Forecast from ${getIST(frst[i].start_time.dt)} to ${getIST(frst[i].end_time.dt)}</b> <br>`);
         if(frst[i].wind_speed) {
            var li = $('<li></li>');
            li.html(`Wind: <b>${frst[i].wind_speed.value} Knot(s) (${(frst[i].wind_speed.value*1.85).toFixed(1)} KM/H - ${frst[i].wind_direction.value}°)</b> <br>`);
            span2.append(li);
         } if(frst[i].wind_gust) {
            var li = $('<li></li>');
            li.html(`Gust: <b>${frst[i].wind_gust.value} Knot</b> <br>`);
            span2.append(li);
         } if(frst[i].wx_codes.length) {
            var li = $('<li></li>');
            li.text(`Weather: `);
            for(j = 0; j < frst[i].wx_codes.length; j++) {
              if(frst[i].wx_codes[j].value.includes('<BR>'))
                 frst[i].wx_codes[j].value = frst[i].wx_codes[j].value.replace('<BR>', ' ');
               if(j == frst[i].wx_codes.length-1)
                  li.append('<b>'+frst[i].wx_codes[j].value+'</b><br>');
               else
                  li.append('<b>'+frst[i].wx_codes[j].value+'</b>, ');
            } span2.append(li);
         } if (frst[i].visibility) {
            var li = $('<li></li>')
            if(frst[i].visibility.value)
               if(data.units.visibility == 'sm')
                  li.html(`Visibility: <b>${frst[i].visibility.value} mile(s) (${(frst[i].visibility.value*1.609).toFixed(1)} Km)</b> <br>`);
               else
                  li.html(`Visibility: <b>${(frst[i].visibility.value/1000).toFixed(1)} Km</b> <br>`);
            else
               li.html(`Visibility: <b>6+ miles (10+ Km)</b> <br>`);
            span2.append(li);
         } if(frst[i].clouds.length) {
            var li = $('<li></li>');
            li.text('Clouds: ');
            span2.append(li);
         } if (frst[i].clouds.length) {
            var clouds = frst[i].clouds;
            var ul = $('<ul></ul>');
            for(j = 0; j < clouds.length; j++) {
               var li = $('<li></li>');
               li.html(`<b>${clouds[j].type} at ${clouds[j].altitude*100} ft AGL</b>`);
               if (clouds[j].modifier && clouds[j].modifier != '<BR>')
                  li.html(`<b>${clouds[j].type} at ${clouds[j].altitude*100} ft (${clouds[j].modifier}) AGL</b>`);
               ul.append(li);
            }
            span2.append(ul);
         }
         d7.append(span);
         d7.append(span2);
      } if(!data.raw.includes('<br>')) {
         if(data.raw.includes('TEMPO'))
            data.raw = data.raw.replaceAll('TEMPO','<br>TEMPO');
         if(data.raw.includes('BECMG'))
            data.raw = data.raw.replaceAll('BECMG','<br>BECMG');
         if(data.raw.includes('FM'))
            data.raw = data.raw.replaceAll('FM','<br>FM');
      } d7.append('Raw: <b>'+data.raw+'</b>');
   }
   d7.append('<hr>');
}


function awcTafMain(data, comp) {
    var frst = data.fcsts;
    p.eq(3).text(comp);
    b.eq(26).text(type.toUpperCase());
    if(data.remarks)
        b.eq(27).text(data.remarks);
    b.eq(28).html(data.name+` <img src="https://flagcdn.com/24x18/${flag}.png">`);
    b.eq(29).text(data.icaoId);
    b.eq(30).text(getIST(data.issueTime)+' '+time(data.issueTime));
    b.eq(31).text(`${getIST(data.validTimeFrom)} until ${getIST(data.validTimeTo)}`);
    b.eq(32).text('');
    for(i = 0; i < frst.length; i++) {
      var span = $('<span></span>'),
      span2 = $('<span></span>');
      if (frst[i].fcstChange) {
         span.text(`${frst[i].fcstChange} from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)}`);
         if (frst[i].probability)
            span.html(`${frst[i].fcstChange} from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} (${frst[i].probability}% likely)`);
      } else
         span.html(`Forecast from ${getIST(frst[i].timeFrom)} to ${getIST(frst[i].timeTo)} <br>`);
      if (frst[i].wspd) {
         var li = $('<li></li>');
         if(frst[i].wdir == 'VRB')
            li.html(`Wind: ${frst[i].wspd} Knot(s) (${(frst[i].wspd*1.85).toFixed(1)} KM/H - VRB) <i class="fa-solid fa-location-arrow" style='rotate:135deg'></i> <br>`);
         else
            li.html(`Wind: ${frst[i].wspd} Knot(s) (${(frst[i].wspd*1.85).toFixed(1)} KM/H - ${frst[i].wdir}°) <i class="fa-solid fa-location-arrow" style='rotate:${frst[i].wdir+135}deg'></i> <br>`);
         span2.append(li);
      } if (frst[i].wxString) {
         var li = $('<li></li>');
         li.html(`Weather: ${frst[i].wxString} <br>`);
         span2.append(li);
      } if (frst[i].visib) {
         var li = $('<li></li>');
         if(frst[i].visib == '6+')
            li.text(`Visibility: ${frst[i].visib} mile(s) (10+ Km)`);
         else
            li.text(`Visibility: ${frst[i].visib} mile(s) (${(frst[i].visib*1.609).toFixed(1)} Km)`);
         span2.append(li);
      } if(frst[i].clouds.length) {
         var li = $('<li></li>');
         li.text('Clouds: ');
         span2.append(li);
      } if (frst[i].clouds.length) {
         var clouds = frst[i].clouds,
         ul = $('<ul></u>');
         for(j = 0; j < clouds.length; j++) {
            var li = $('<li></li>');
            if(clouds[j].cover == 'NSC')
               li.text('No significant clouds');
            else
               li.text(`${clouds[j].cover} at ${clouds[j].base} ft AGL`);
            if(clouds[j].type)
               li.text(`${clouds[j].cover} at ${clouds[j].base} ft (${clouds[j].type}) AGL`);
            ul.append(li);
         }
         span2.append(ul);
      }
      b.eq(32).append(span);
      b.eq(32).append(span2);
   }
    if(data.rawTAF.includes('TEMPO'))
        data.rawTAF = data.rawTAF.replaceAll('TEMPO','<br>TEMPO');
    if(data.rawTAF.includes('BECMG'))
        data.rawTAF = data.rawTAF.replaceAll('BECMG','<br>BECMG');
    if(data.rawTAF.includes('FM'))
        data.rawTAF = data.rawTAF.replaceAll('FM','<br>FM');
    strongs[33].innerHTML = data.rawTAF;
}
function cwxTafMain(data, flag, comp) {
    var frst = data.forecast;
    p.eq(3).text(comp);
    b.eq(26).text(type.toUpperCase());
    if (data.remarks)
        b.eq(27).text(data.remarks);
    b.eq(27).html(data.station.name+', '+data.station.location+` <img src="https://flagcdn.com/24x18/${flag}.png">`);
    b.eq(29).text(data.icao);
    b.eq(30).text(getIST(data.timestamp.issued)+' '+time(data.timestamp.issued));
    b.eq(31).text(getIST(data.timestamp.from)+' until '+getIST(data.timestamp.to));
    b.eq(32).text('');
    for(i = 0; i < frst.length; i++) {
        var span = $('<span></span>'),
        span2 = $('<span></span>');
        if(frst[i].change && frst[i].change.indicator.code != 'FM') {
            span.text(`${frst[i].change.indicator.text} from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)}`);
            if (frst[i].change.probability)
                span.text(`${frst[i].change.indicator.text} from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)} (${frst[i].change.probability}% likely)`);
        } else
            span.text(`Forecast from ${getIST(frst[i].timestamp.from)} to ${getIST(frst[i].timestamp.to)}`);
        if(frst[i].wind) {
            var li = $('<li></li>');
            li.html(`Wind: ${frst[i].wind.speed_kts} Knot(s) (${frst[i].wind.speed_kph} KM/H - ${frst[i].wind.degrees}°) <i class="fa-solid fa-location-arrow" style='rotate:${frst[i].wind.degrees+135}deg'></i> <br>`);
            span2.append(li);
        } if (frst[i].conditions) {
            var li = $('<li></li>');
            li.html(`Weather: ${frst[i].conditions[0].text} <br>`);
            span2.append(li);
        } if (frst[i].visibility) {
            var li = $('<li></li>');
            li.text(`Visibility: ${frst[i].visibility.miles} mile(s) (${(frst[i].visibility.meters_float/1000).toFixed(1)} Km)`);
            span2.append(li);
        } if(frst[i].clouds.length) {
            var li = $('<li></li>');
            li.text('Clouds: ');
            span2.append(li);
        } if (frst[i].clouds.length) {
            var clouds = frst[i].clouds,
            ul = $('<ul></ul>');
            for(j = 0; j < clouds.length; j++) {
                var li = $('<li></li>');
                if(!clouds[j].feet)
                    li.text(clouds[j].text);
                else
                    li.text(`${clouds[j].text} at ${clouds[j].feet} ft AGL`);
                if(clouds[j].type)
                    li.text(`${clouds[j].cover} at ${clouds[j].base} ft (${clouds[j].type}) AGL`);
                ul.append(li);
            }
            span2.append(ul);
        }
        b.eq(32).append(span);
        b.eq(32).append(span2);
    }
    if(data.raw_text.includes('TEMPO'))
        data.raw_text = data.raw_text.replaceAll('TEMPO','<br>TEMPO');
    if(data.raw_text.includes('BECMG'))
        data.raw_text = data.raw_text.replaceAll('BECMG','<br>BECMG');
    if(data.raw_text.includes('FM'))
        data.raw_text = data.raw_text.replaceAll('FM','<br>FM');
    strongs[33].innerHTML = data.raw_text;
}

function getIST(date) {
    if(typeof date == 'string') {
        if(date.charAt(date.length-1) == 'Z')
           return new Date(new Date(date).getTime()).toLocaleString();
        return new Date(new Date(date+"Z").getTime()).toLocaleString();
    } else
        return new Date(date*1000).toLocaleString();
}


function metarH(id, type, hrs, flag) {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://beta.aviationweather.gov/cgi-bin/data/${type}.php?ids=${id}&hours=${hrs}&format=json`;
    const url = proxyUrl + apiUrl;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        awcMetH(data, hrs, flag);
    })
    .catch(err => {
        console.log(`Error: `+ err.message);
    })
}
function awcMetH(data, hrs, flag) {
    var d6 = $('.d6');
    d6.html(`<p>${type.toUpperCase()} HISTORY</p>`);
    if(data.length) {
       const ol = $('<ol></ol>');
       d6.append(`Name: <strong>${data[0].name}</strong> <img src="https://flagcdn.com/24x18/${flag}.png"> <br>
                        ICAO: <strong>${data[0].icaoId}</strong> <br>`);
       if(type == 'metar') {
          for(i = 0; i < data.length; i++) {
              var li = $('<li></li>');
              li.html(getIST(data[i].reportTime)+': <strong>'+data[i].rawOb+`<br>`);
              ol.append(li);
          }
       } else {
          for(i = 0; i < data.length; i++) {
              var li = $('<li></li>');
              li.html(getIST(data[i].issueTime)+': <strong>'+data[i].rawTAF+`<br>`);
              ol.append(li);
          }
       }
       d6.append(ol);
    } else
       d6.append(`No ${type.toUpperCase()}(s) in previous ${hrs} hour(s)!`);
    d6.append('<hr>');
}

function info() {
    let reL = 'https://www.world-airport-codes.com';
    if(confirm(`METAR - Meteorological Aerodrome Report.\nTAF - Terminal Aerodrome Forecast.\nTo get ICAO, click 'OK'.\n(redirects to ${reL})\nYour screen resolution: ${screen.width}×${screen.height}px`))
       window.open(reL);
}
async function search(data, flag) {
   var d6 = $('.d6');
   d6.html('<p><em>Loading... <i class="fa-solid-spir fa-spin-pulse"></i></em></p>');
   
   var stn = data[0];
   d6.html('<p>Station Info</p>');
   d6.append(`Name: ${stn.name}, ${stn.city}, ${stn.state}, ${stn.country} <img src="https://flagcdn.com/24x18/${flag}.png"> <br>
      Coordinate: ${stn.latitude.toFixed(2)}, ${stn.longitude.toFixed(2)} <br>
                     IATA: ${stn.iata} <br>
                     ICAO: ${stn.icao} <br>
                     Reporting: ${stn.reporting?'Yes':'No'} <br>`);
      for(j = 0; j < stn.runways.length; j++) {
         var rny = stn.runways[j],
         span = $('<span></span>'),
         ul = $('<ul></ul>');
         span.text('Runway '+(j+1)+':-');
         ul.html(`<li>Surface: ${rny.surface}</li>
                        <li>Numbers: ${rny.ident1} & ${rny.ident2}</li>
                        <li>Length: ${rny.length_ft} ft</li>
                        <li>Width: ${rny.width_ft} ft</li>
                        <li>Lights: ${rny.lights} </li>`);
         span.append(ul);
         d6.append(span);
      }
      if(stn.website)
         d6.append(`Website: <a href='${stn.website}'>Visit</a>`);
      else if(stn.wiki)
         d6.append(`Website: <a href='${stn.wiki}'>Visit</a>`);
      d6.append('<hr>');
}
function time(t) {
   var tm;
   if(t.charAt(t.length-1) == 'Z')
      tm = ((new Date() - new Date(t))/60000).toFixed(0);
   else
      tm = ((new Date() - new Date(t+'Z'))/60000).toFixed(0);
   var hb = Math.ceil(tm/60);
   if(hb > 1)
      return `[${hb-1} hour(s) ago]`;
   return `[${tm} min(s) ago]`;
}
function getHeaders(response) {
   const headers = {};
   response.headers.forEach((value, name) => {
      headers[name] = value;
   });
   // console.log(headers);
}

function arrow(strt, end) {
   var i = $('.arrow');
   i.css('--start', (strt+135)+'deg');
   i.css('--end', (end+135)+'deg');
}

const colors = ['olive','teal','indianred','coral','lightcoral','salmon','cromson','turquoise','moccasin','peachpuff','khaki','orchid','darkmagenta','chartreuse','seagreen','mediumaquamarine','lightseagreen','navajowhite','burlywood','rosybrown','peru','sienna','lightcoral','lightseagreen','mistyrose'];
const clrs = colors[Math.floor(Math.random() * colors.length)];
var ob = (e) => {
   e.style.accentColor = clrs;
}
ob(value[1]); ob(value[2]); ob(value[3]); ob(value[4]); ob(value[5]); ob(value[6]);

