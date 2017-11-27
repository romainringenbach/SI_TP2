'use strict';

function openNav() {
    document.getElementById("sideMenu").style.width = "35%"; //"250px"
    document.getElementById("oglcontainer").style.marginLeft = "35%"; //"250px"
}

function closeNav() {
    document.getElementById("sideMenu").style.width = "0";
    document.getElementById("oglcontainer").style.marginLeft= "0";
}