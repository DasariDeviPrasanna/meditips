if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

}
const darkModeBtn =
document.getElementById("darkModeBtn");

// Apply saved theme
if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

}

darkModeBtn?.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

    }

    else{

        localStorage.setItem("theme","light");

    }

});