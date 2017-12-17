class atomicGL2UI {
    constructor() {
        this.menu = document.getElementById("sideMenu");
        this.oglcontainer = document.getElementById("oglcontainer");
        let button = document.getElementById("menubutton");
        button.addEventListener("click", this.closeNav.bind(this));
    }
    openNav() {
        this.menu.style.width = "35%"; //"250px"
        this.oglcontainer.style.marginLeft = "35%"; //"250px"
    }
    closeNav() {
        this.menu.style.width = "0";
        this.oglcontainer.style.marginLeft= "0";
    }
}

export default atomicGL2UI;