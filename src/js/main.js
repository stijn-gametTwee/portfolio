const boxShadowBox = document.getElementById("Boxshadow3");
const box = document.getElementById("wtf") 

boxShadowBox.style.boxShadow = "20px 20px #0f0f0f";

box.onmousemove = function(){
    let shadowVariableX = (event.clientX - (window.innerWidth / 2)) / window.innerWidth * 2;
    let shadowVariableY = (event.clientY - (window.innerHeight / 2)) / window.innerHeight * 2;

    boxShadowBox.style.boxShadow = `${(shadowVariableX * 50 * -1) + 20}px ${(shadowVariableY * 50 * -1) + 20}px #0f0f0f`;
};