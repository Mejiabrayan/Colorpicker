// Global selections and variables
const colorDivs = document.querySelectorAll('.color');
const generateButton = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;

// Functions method

// Generates our colors using Chroma Js
function generateHex() {
 const hexColor = chroma.random();
 return hexColor;
}

function randomColor() {
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

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

        slideColors(color,hue, brightness, saturation);
    });
}

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();  // Chroma methods
    if(luminance > 0.5){
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

function slideColors(color, hue, brightness, saturation){
    // Saturation Scale
     const noSat = color.set('hsl.s', 0); // Begining satuation
     const fullSat = color.set('hsl.s', 1); // End of saturation
     const scaleSat = chroma.scale([noSat, color, fullSat]); // Visualize the color sclae from 0 - 1
    // Brighness Scale
     const midBright = color.set('hsl.l', 0.5);
     const scaleBright = chroma.scale(['black', midBright, 'white'])

     // Updates our input colors
     saturation.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(1)})`;

     brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

     hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75, 204, 75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

randomColor();
