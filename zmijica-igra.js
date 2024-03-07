$(document).ready(function() {
    let velicina; //velicina tabele
    let brzina; //easy, medium, hard
    let crvena; //polje na kom se nalazi hrana
    let zmijicaPocetak; //prvo polje zmije -> zmija[0]
    let id = 1; //koristi se kako bi se dodelio id svim poljima tabele
    let zmija = []; //sva polja na kojima se prostire zmkija
    let trenutniRez = 0; //score
    let maks; // maks score
    let gore = false; 
    let dole = false;
    let desno = false; 
    let levo = false;
    let nitGore;
    let nitDole;
    let nitLevo;
    let nitDesno;
    let interval;
    let zlatnaHrana;
    

    function izgenerisiCrvenu() {
        let t = (velicina - 1)*(velicina - 1);
        crvena = Math.floor(Math.random()*t + 1);
    }

    function izgenerisiZmijicu() {
        let t = (velicina - 1)*(velicina - 1);
        zmijicaPocetak = Math.floor(Math.random()*t + 1);
        while (zmijicaPocetak == crvena) {
            zmijicaPocetak = Math.floor(Math.random()*t + 1);
        }
    }

    function inicijalizujPodatke() {
        velicina = localStorage.getItem("velicina");
        if (!velicina) {
            velicina = 15;
        } else {
            velicina = parseInt(velicina);
        }
        
        brzina = localStorage.getItem("brzina");
        if (!brzina) {
            brzina = "medium";
        } 

        maks = localStorage.getItem("maksimum");
        if (!maks) {
            maks = 0;
            localStorage.setItem("maksimum", maks);
        } else {
            maks = parseInt(maks);
            document.getElementById("najvise").innerHTML = maks;
        }

        if (brzina == "easy") {
            interval = 500;
        } else if (brzina == "medium") {
            interval = 250; 
        } else {
            interval = 100;
        }
        
        izgenerisiCrvenu();
        izgenerisiZmijicu();
    }

    function dodajSliku(podatak, src, bool = true) {
        let v = 750/velicina;
        
        let d = $("<div></div>")//.css({"width" : v + "px", "height" : v + "px"});
        let slika = $("<img>").attr("src", src).addClass("img-fluid").css({"alt" : "Responsive image"});
        
        if (bool == true) {
            d.append(slika);
            d.addClass("crvena");
            podatak.find("div").filter(".zlatna").hide();
            podatak.append(d).show().addClass("imaSliku");
        } else {
            d.append(slika);
            d.addClass("zlatna");
            podatak.find("div").filter(".crvena").hide();
            podatak.append(d).show().addClass("imaZlatnu");
        }

        podatak.css({"width" : v + "px", "height" : v + "px"});
    }

    function napraviTabelu() {
        let tabela = $("#tabela");
        for (let i = 0; i < velicina; i++) {
            let red = $("<tr></tr>");
            
            for (let j = 0; j < velicina; j++) {
                let podatak = $("<td></td>");
                if ((i%2==0 && j%2==0) || (i%2==1 && j%2==1)) {
                    podatak.addClass("svetlo");
                } else {
                    podatak.addClass("tamno");
                }
                podatak.attr("id", id);
                
                if (id == crvena) {
                    dodajSliku(podatak, "zmijica-dodatno/hrana.png");
                } else if (id == zmijicaPocetak) {
                    podatak.addClass("zmijica");
                    zmija.push(id);
                }

                id++;
                red.append(podatak); 
            }

            tabela.append(red);
        }   
    }

    /* up = 38, down = 40, left = 37, right = 39 */ 
    //funckije sa nitima

    function postaviZlatnuHranu() {
        setTimeout(function() {
            do {
                let t  = velicina * velicina;
                zlatnaHrana = Math.floor(Math.random()*t + 1);
            } while (zmija.includes(zlatnaHrana) || crvena == zlatnaHrana)
            let podatak = $("#" + zlatnaHrana);
            if (podatak.hasClass("imaZlatnu")) {
                podatak.find("div").filter(".zlatna").show();
            } else {
                dodajSliku(podatak, "zmijica-dodatno/zlatnaHrana.jpg", false);
            }
            setTimeout(function() {
                $("#" + zlatnaHrana).find("div").hide();
                postaviZlatnuHranu();
            }, 5000);
        }, 13000);
    }

    function kraj() {
        let username = prompt("Unesite ime: ");
        localStorage.setItem("igrac", username);
        localStorage.setItem("rezultat", trenutniRez);
        window.location.replace("zmijica-rezultati.html");
    }

    function postaviNovuHranu(id) {
        $("#" + crvena).find("div").hide();
        while (zmija.includes(crvena)) {
            izgenerisiCrvenu();
        }

        if ($("#" + crvena).hasClass("imaSliku")) {
            $("#" + crvena).find("div").filter(".crvena").show();
        } else {
            let podatak = $("#" + crvena);
            dodajSliku(podatak, "zmijica-dodatno/hrana.png");
        }
    }

    function pogodak(plus) {
        trenutniRez += plus;
        if (trenutniRez > maks) {
            localStorage.setItem("maksimum", trenutniRez);
            maks = trenutniRez;
            document.getElementById("najvise").innerHTML = maks;
        }

        document.getElementById("trenutno").innerHTML = trenutniRez;
    }

    function kretanje(td) {
        if (zmija.includes(td)) {
            kraj();
        }

        zmija.unshift(td);
        $("#" + td).addClass("zmijica");
        
        if (td == crvena) {
            postaviNovuHranu(td);
            pogodak(1);
        } else if (td == zlatnaHrana) {
            $("#" + zlatnaHrana).find("div").filter(".zlatna").hide();
            pogodak(10);
        } else {
            $("#" + zmija[zmija.length - 1]).removeClass("zmijica");
            zmija.pop();
        }
    }

    function strelicaGore() {
        clearTimeout(nitGore);
        clearTimeout(nitDole);
        clearTimeout(nitDesno);
        clearTimeout(nitLevo);

        gore = true;
        dole = levo = desno = false;
        
        let td = zmija[0] - velicina;
        if (td <= 0) {
            kraj();
        }

        kretanje(td);

        nitGore = setTimeout(function() {
            if (gore) {
                strelicaGore();
            }
        }, interval)
        
    }

    function strelicaDole() {
        clearTimeout(nitGore);
        clearTimeout(nitDole);
        clearTimeout(nitDesno);
        clearTimeout(nitLevo);

        dole = true;
        gore = levo = desno = false;

        let td = zmija[0] + velicina;
        if (td > velicina * velicina) {
            kraj();
        }

        kretanje(td);

        nitDole = setTimeout(function() {
            if (dole) {
                strelicaDole();
            }
        }, interval);
    }

    function strelicaDesno() {
        clearTimeout(nitGore);
        clearTimeout(nitDole);
        clearTimeout(nitDesno);
        clearTimeout(nitLevo);

        desno = true;
        gore = levo = dole = false;

        if (zmija[0] % velicina == 0) {
            kraj();
        }

        let td = zmija[0] + 1;
        kretanje(td);

        nitDesno = setTimeout(function() {
            if (desno) {
                strelicaDesno();
            }
        }, interval);
    }

    function strelicaLevo() {
        clearTimeout(nitGore);
        clearTimeout(nitDole);
        clearTimeout(nitDesno);
        clearTimeout(nitLevo);

        levo = true;
        gore = dole = desno = false;

        if (zmija[0] % velicina == 1) {
            kraj();
        }

        let td = zmija[0] - 1;
        kretanje(td);

        nitLevo = setTimeout(function() {
            if (levo) {
                strelicaLevo();
            }
            
        }, interval)
    }

    document.onkeydown = (e) => {
        e = e || window.event;
        if (e.keyCode === 38) {
          strelicaGore();
        } else if (e.keyCode === 40) {
          strelicaDole();
        } else if (e.keyCode === 37) {
          strelicaLevo();
        } else if (e.keyCode === 39) {
          strelicaDesno();
        }
    };

    //main
    inicijalizujPodatke();
    napraviTabelu();
    postaviZlatnuHranu();
})