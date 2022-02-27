// Global selections and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const adjustBtn = document.querySelectorAll('.adjust');
const closeAdjust= document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
const lockBtn = document.querySelectorAll('.lock');
let initialColors; // Using this to reference always to the original color

// Local Storage
let savedPalettes = [];

// Event Listeners
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUI(index);
    });
});

currentHexes.forEach(hex =>{
    hex.addEventListener('click', () => { // Adding callback because if not we cannot invoke it
        copyToClipboard(hex);
    });
});
// Popup Listener
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
});

adjustBtn.forEach((button, index) => {
    button.addEventListener('click', () => {
        openAdjustmentPanel(index);
    });
});

closeAdjust.forEach((button, index) => {
    button.addEventListener('click', () => {
        closeAdjustmentPanel(index);
    });
});

lockBtn.forEach((button, index) => {
    button.addEventListener('click', () => {
        addLock(index);
    })
})

generateBtn.addEventListener('click', randomColors);
// Functions method
// Generates our colors using Chroma Js
function generateHex() {
 const hexColor = chroma.random();
 return hexColor;
}

function randomColors() {
    initialColors = []; // Resets when page is refreshed

    colorDivs.forEach((div, index) => { // Provides a callback function once for each element // Loops
        const hexText = div.children[0];
        const randomColor = generateHex();
        // Add it to the array
        if (div.classList.contains('locked')) {
            initialColors.push(hexText.innerText);
            return;
        } else {
                initialColors.push(chroma(randomColor).hex()); // Pushing in all the colors
        }
        // Adds color to background
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        // Checks for contast
        checkTextContrast(randomColor, hexText);
        // Initialize Color Sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });

    // Reset
    resetInputs();
    // Check for button constrast 
    adjustBtn.forEach((button, index) => {
        checkTextContrast(initialColors[index], button);
        checkTextContrast(initialColors[index], lockBtn[index]);
    });
};

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();  // Chroma methods
    if(luminance > 0.5){
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

function colorizeSliders(color, hue, brightness, saturation){
    // Saturation Scale
     const noSat = color.set('hsl.s', 0); // Begining satuation
     const fullSat = color.set('hsl.s', 1); // End of saturation
     const scaleSat = chroma.scale([noSat, color, fullSat]); // Visualize the color sclae from 0 - 1
    // Brighness Scale
     const midBright = color.set('hsl.l', 0.5);
     const scaleBright = chroma.scale(['black', midBright, 'white'])

 //Update Input Colors
 saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)} ,${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, 
    rgb(204,75,75),rgb(204,204,75),
    rgb(75,204,75),rgb(75,204,204),
    rgb(75,75,204),rgb(204,75,204),
    rgb(204,75,75))`;
}

// Slider adjusts colors
function hslControls(e) {
    // Grabs our attributes 
    const index = 
     e.target.getAttribute('data-bright') 
     || e.target.getAttribute('data-sat') 
     || e.target.getAttribute('data-hue');
    
     let sliders = e.target.parentElement.querySelectorAll('input[type="range"');

     const hue = sliders[0];
     const brightness = sliders[1];
     const saturation = sliders[2];

     const bgColor = initialColors[index];

     let color = chroma(bgColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value);
   
    colorDivs[index].style.backgroundColor = color;
    // Colorize inputs

      //Colorize inputs/sliders
  colorizeSliders(color, hue, brightness, saturation);
}


function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');
    textHex.innerText = color.hex();
    //Check Contrast
    checkTextContrast(color, textHex);
    for (icon of icons) {
      checkTextContrast(color, icon);
    }
  }
function resetInputs(){
    const sliders = document.querySelectorAll('.sliders input'); // Grabs all of our input elements
    sliders.forEach(sliders => {
        if(sliders == 'hue'){  // if sliders is equal to hue then..
            const hueColor = initialColors[slider.getAttribute('data-hue')]; // go by current color
            const hueValue = chroma(hueColor).hsl()[0]; 
            slider.value = Math.floor(hueValue); // Removes the decimals
        }
        if(sliders == 'brightness'){  // if sliders is equal to brightness then..
            const brightColor = initialColors[slider.getAttribute('data-bright')]; //go by current color
            const brightValue = chroma(brightColor).hsl()[2]; 
            slider.value = Math.floor(brightValue * 100 / 100); // Removes the decimals
            console.log(brightValue)
        }
        if(sliders == 'saturation'){  // if sliders is saturation to hue then..
            const satColor = initialColors[slider.getAttribute('data-sat')]; // go by current color
            const satValue = chroma(satColor).hsl()[1]; 
            slider.value = Math.floor(satValue); // Removes the decimals
        }
    })
}

function copyToClipboard(hex) {
    const el = document.createElement('textarea');
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // pop-up animation
    const popupBox = popup.children[0];
    popup.classList.add('active');
    popupBox.classList.add('active');

}

function openAdjustmentPanel(index) {
    sliderContainers[index].classList.toggle('active');
}
function closeAdjustmentPanel(index) {
    sliderContainers[index].classList.remove('active');
}

function addLock(index) {
    colorDivs[index].classList.toggle('locked');
    lockBtn[index].firstChild.classList.toggle(`fa-lock-open`);
    lockBtn[index].firstChild.classList.toggle(`fa-lock`);
}


// Saved Palette & Local Storage
const saveBtn = document.querySelector('.save');
const submitSave = document.querySelector('.submit-save');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input')

saveBtn.addEventListener('click', openPalette);

function openPalette(e){
   const popup = saveContainer.children[0];
   saveContainer.classList.add('active');
   popup.classList.add('active');
}
 
randomColors();


// Find the bug somewhere in sliders
// Update Found bug