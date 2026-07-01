const darkModeBtn = document.getElementById("darkModeBtn");

// Apply saved theme on every page
function applyTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark");

    }else{

        document.body.classList.remove("dark");

    }

}

// Apply immediately when page loads
applyTheme();

// Toggle only if Dark Mode button exists
darkModeBtn?.addEventListener("click",()=>{

    if(document.body.classList.contains("dark")){

        document.body.classList.remove("dark");

        localStorage.setItem("theme","light");

    }else{

        document.body.classList.add("dark");

        localStorage.setItem("theme","dark");

    }

});