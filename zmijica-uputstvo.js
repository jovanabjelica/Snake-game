$(document).ready(function(){
    function inicijalizujStranicu() {
        if (localStorage.getItem("velicina")) { localStorage.removeItem("velicina"); }
        if (localStorage.getItem("brzina")) { localStorage.removeItem("brzina"); }
    }

    function sacuvajVelicinu(vel) {
        localStorage.setItem("velicina", vel);
    }

    function sacuvajBrzinu(brzina) {
        localStorage.setItem("brzina", brzina);
    }

    inicijalizujStranicu();

    $("#10").click(function() { sacuvajVelicinu(10); });
    $("#15").click(function() { sacuvajVelicinu(15); });
    $("#25").click(function() { sacuvajVelicinu(25); });

    $("#easy").click(function() { sacuvajBrzinu("easy"); });
    $("#medium").click(function() { sacuvajBrzinu("medium"); });
    $("#hard").click(function() { sacuvajBrzinu("hard"); }); 
})