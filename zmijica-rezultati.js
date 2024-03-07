$(document).ready(function() {
    let igraci = [];

    function dodajIgraca() {
        let s = parseInt(localStorage.getItem("rezultat"));
        let igrac = localStorage.getItem("igrac");

        for (let i = 0; i < igraci.length; i++) {
            if (igraci[i].username == igrac) {
                if (igraci[i].score < s) {
                    igraci[i].score = s;
                    localStorage.setItem("igraci", JSON.stringify(igraci));
                }
                return;
            }
        }
        
        igraci.push({
            username : igrac,
            score : s
        })
        localStorage.setItem("igraci", JSON.stringify(igraci));
    }

    function inicijalizujPodatke() {
        if (localStorage.getItem("igraci") == null) {
            localStorage.setItem("igraci", JSON.stringify(igraci));
        } else {
            igraci = JSON.parse(localStorage.getItem("igraci"));
        }
        if (localStorage.getItem("igrac") != null) {
            dodajIgraca();
        }
    }

    function sortirajIgrace() {
        for (let i = 0; i < igraci.length; i++) {
            for (let j = i; j < igraci.length; j++) {
                if (igraci[j].score > igraci[i].score) {
                    let tmp = igraci[i];
                    igraci[i] = igraci[j];
                    igraci[j] = tmp;
                }
            }
        }
    }

    function napraviTabelu() {
        sortirajIgrace();
        let tabela = $("#tabela");
        for (let i = 0; i < 5; i++) {
            if (i >= igraci.length) break;
            let red = $("<tr></tr>");
            let igrac = $("<td></td>");
            igrac.append(igraci[i].username);

            let score = $("<td></td>");
            score.append(igraci[i].score);

            red.append(igrac);
            red.append(score);
            tabela.append(red);
        }
    }

    function dodajDugme() {

    }

    function prikaziPoslednjeg() {
        if (localStorage.getItem("igrac") == null) {
            return;
        }
        let igrac = localStorage.getItem("igrac");
        let rezultat = localStorage.getItem("rezultat");

        document.getElementById("poslednjiIme").innerHTML = igrac;
        document.getElementById("poslednjiScore").innerHTML = rezultat;
    }

    $("#pocetna").click(function(){
        window.location.replace("zmijica-uputstvo.html");
    });

    //main
    inicijalizujPodatke();
    napraviTabelu();
    prikaziPoslednjeg();
    dodajDugme();
})