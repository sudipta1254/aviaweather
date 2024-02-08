/* Driver.js */
const driverG = window.driver.js.driver;

/* Highlight searchbar on focus //
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

/* Remove tooltips when the input is not focused anymore */
driverG({
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
        /*{
            element: '#selects',
            popover: {
                title: 'Options',
                description: 'Wide range of options to choose from.',
                // position: 'bottom',
                side: 'bottom',
                align: 'center'
            },
        },*/
    ]
}).drive();

