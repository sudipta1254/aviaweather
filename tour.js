/* Driver.js */
const driverG = window.driver.js.driver;
var key = 'aviaWeather', val = localStorage.getItem(key)

/* Highlight searchbar on focus
$('#inp').on("focus", () => {
    driverG({
        overlayColor: 'transparent',
    }).highlight({
        element: '#inp',
        popover: {
           title: "Info",
           description: "<h3>Enter ICAO followed by hours to get history '[query]10'</h3>",
        },
        side: 'bottom',
        align: 'start'
    });
}); */

/* Welcome message on load */
/*driverG({
    animate: true, // Enable animations
    opacity: 0.75, // Set overlay opacity
    showButtons: ['next', 'close'],
    doneBtnText: 'Lessss go!',
    steps: [
        {
            popover: {
                title: 'Welcome!',
                description: "<img src='https://i.imgur.com/EAQhHu5.gif' style='height: 202.5px; width: 270px;'><p>Welcome to my website!</p>",
                //description: "<p>Welcome to my website!<br>You can track live flights here.</p>",
                position: 'center'
            },
            highlight: false // Disable highlighting
        },
    ]
}).drive();*/

const driver2 = driverG({
      overlayOpacity: 0.75,
      onNextClick: () => {
         driver2.destroy();
      },
      onCloseClick: () => {
         driver2.destroy();
      },
   });
   
   if(!val) {
       alert(1)
      setLocal(key, 2)
      startDriver(driver2)
   } else
      if(val != 3) {
         val = +val
         setLocal(key, ++val)
         startDriver(driver2)
      }


function setLocal(k, v) {
   localStorage.setItem(k, v)
}
function startDriver(driver) {
   driver.highlight({
      popover: {
         title: 'Welcome!',
         description: "<img src='https://i.imgur.com/EAQhHu5.gif' style='height: 202.5px; width: 270px;'><p>Welcome to my website!</p>",
         position: 'center',
         showButtons: ['next', 'close'],
         nextBtnText: 'Lessss go!',
      }
   })
}
