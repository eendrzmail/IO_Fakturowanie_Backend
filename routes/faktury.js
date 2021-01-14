const { query } = require('express');
const express= require('express');
const router = express.Router();

db = require('../db');

async function request(sql){
    return new Promise((resolve,reject) => {
        db.query(sql,(err,res) => {
            if (err)
                reject(err);
            resolve(res);
        })
    })
}

function parsePOST(req){
    let dane=JSON.parse(req.body.object);
        if (typeof(dane)=='string'){
            dane=JSON.parse(dane);
        }
    return dane;
}

// GET
router.get("/faktury", (req,res) => {

    console.dir(req.query);

    if (req.query.nr_faktury){

        console.log('Zapytanie o fakture');
        const sql1 = `Select * from faktury where nr_faktury=${req.query.nr_faktury}`;
        
        request(sql1).then((val1) => {
            
            console.log("Pobrano Fakture, zapytania o wiersze");
            let a= val1[0].id_faktura;
            let mergedObject;
            
            const sql2 = `Select * from wiersze_faktury where id_faktury=${a}`;
            //console.log(sql2);
            
            request(sql2).then(val2 => {
                console.log("Przypisywanie wierszy do faktury");

                let temp = {'wiersze':val2.map( ob => {
                    return {
                        'produkt': {
                            'nazwa':ob.nazwa,
                            'jednostka':ob.jednostka,
                            'wartosc_VAT':ob.vat,
                            'cena_netto':ob.cena_netto
                        },
                        'ilosc':ob.ilosc
                    }
                            
                })};                    //WIERSZE
                mergedObject = Object.assign(val1[0],temp);        //przypisz wiersze

                //res.send(mergedObject);
                //console.dir(mergedObject);

            }).then(()=>{
                console.log("Przypisywanie kontrahentow");

                //console.dir(val1);
                const sqlsprzedajacy = `Select * from kontrahenci where id_kontrahent=1`;
                const sqlkupujacy = `Select * from kontrahenci where id_kontrahent=${val1[0].id_sprzedajacy}`;
                //console.log("poskladaj")

                const sprzedajacytab = request(sqlsprzedajacy);     //get sprzedajacy
                const kupujacytab = request(sqlkupujacy);           //get kupujacy

                Promise.all([sprzedajacytab,kupujacytab]).then((h)=>{
                    let kont = {'sprzedajacy' : h[0][0], 'kupujacy' : h[1][0]};       
                    //console.dir(h);
                    let mergedObject2 = Object.assign(mergedObject,kont);   //przypisz kontrahentow

                    //console.dir(mergedObject2);
                    console.log("Wysylanie danych");

                    // usunac zbedne atrybuty
                    delete mergedObject.id_faktura;
                    delete mergedObject.id_kupujacy;
                    delete mergedObject.id_sprzedajacy;
                    delete mergedObject.id_kontrahent;

                    res.status(200);
                    res.send(mergedObject2);

                }).catch(err => {
                    console.log("Neprawidlowi kontrahenci");
                    res.status(500);
                    res.send("ERROR");
                })
                //console.dir(h);
            }).catch(err => {
                console.log("Cos nie tak z wierszami");
                res.status(500);
                res.send("ERROR");
            })

            //res.send(val1);
        }).catch(err => {
            console.log("Cos nie tak z faktura");
            res.status(500);
            res.send("ERROR");
        })

    }
    // ------------- Wyszukiwanie po dacie
    else if (req.query.data2) {

        const sql = `Select * from faktury where data_wystawienia=${req.query.data}`;

        request(sql)
            .then( faktury => {
                
                let z = new Promise((resolve,reject) => 
                    
                    faktury.map(faktura => {

                    const sqlsprzedajacy = `Select * from kontrahenci where id_kontrahent=1`;
                    const sqlkupujacy = `Select * from kontrahenci where id_kontrahent=${faktura.id_kupujacy}`;
                    //console.log(sqlkupujacy);

                    const sprzedajacy= request(sqlsprzedajacy);
                    const kupujacy= request(sqlkupujacy);

                    Promise.all([sprzedajacy,kupujacy])
                        .then( kontrahenci => {
                            //console.dir(kontrahenci[0]);
                            let k ={'kupujacy':kontrahenci[1][0], 'sprzedajacy':kontrahenci[0][0]};
                            faktura= Object.assign(faktura,k);

                            //res.send(faktury);
                            let sqlwiersze = `Select * from wiersze_faktury where id_faktury=${faktura.id_faktura}`;
                            //console.log(sqlwiersze);

                            request(sqlwiersze)
                                .then( wiersze => {
                                    
                                    let temp = {'wiersze':wiersze.map(ob =>{
                                        return {
                                            'produkt': {
                                                'nazwa':ob.nazwa,
                                                'jednostka':ob.jednostka,
                                                'wartosc_VAT':ob.vat,
                                                'cena_netto':ob.cena_netto
                                            },
                                            'ilosc':ob.ilosc
                                        }
                                    })}

                                    faktura= Object.assign(faktura,temp);

                                    //--------- opoznienie
                                    let mnm = new Promise((resolve,reject) => {
                                        setTimeout(()=> {
                                            resolve(faktury)
                                        },100)
                                    })
                                    mnm.then((a)=>{
                                        resolve(a);
                                    })
                                    // ----------------------
                                    
                                    //koniec 1 obiektu
                                    console.log(`faktura nr. ${faktura.id_faktura}`)
                                    
                                    //resolve(faktury)
                                    
                                                
                                })
                                .catch(err => {
                                    console.log("Cos nie tak z pobieraniem kontrahenwierszy")
                                    res.status(500);
                                    res.send("Error")
                                })

                        })
                        
                        .catch(err => {
                            console.log("Cos nie tak z pobieraniem kontrahentow")
                            res.status(500);
                            res.send("Error")
                        })
                    //res.send(faktury);

                })
                    
                )
                z.then((g)=>{
                    console.log("wyslano")
                    res.send(g);
                })

                    
                
                    
                
                
                
                
                
            })
            

            .catch((err) => {
                res.status(500);
                res.send("Zla data")
            })
    }
    // --------------------------------------- NIP
    else if (req.query.nip) {
        let nip=req.query.nip;
        
        let sqlfaktury = "SELECT * FROM `fakturyponip` where NIP="+nip+" order by data_wystawienia desc";
        console.log(sqlfaktury);
        
        request(sqlfaktury).then(nipfaktury => {

            if (nipfaktury.length==0){
                res.send([]);
                return;
            }

            let zlozfaktury=nipfaktury;
            let counter=0;

            for (let f of zlozfaktury){

                let t_arr=[];
                let nsqlkupujacy="SELECT * FROM kontrahenci where id_kontrahent="+f.id_kupujacy;
                let nsqlsprzedajacy="SELECT * from kontrahenci where id_kontrahent=1";
                //console.log(nsqlkupujacy);

                t_arr.push(request(nsqlkupujacy));
                t_arr.push(request(nsqlsprzedajacy));

                

                Promise.all(t_arr).then(kontr => {
                    //console.dir(kontr);
                    f=Object.assign(f,{"kupujacy":kontr[0][0]});
                    f=Object.assign(f,{"sprzedajacy":kontr[1][0]});
                    counter++;

                    if (counter==nipfaktury.length){
                        assignwiersze(nipfaktury);
                    }
                    //console.log("assigned");
                })
                
            }  
            //console.log("after for")
            


        })

        function assignwiersze(faktury){
            let counter=0;
            //console.dir(faktury);

            for (let f of faktury){
                let wierszsql="SELECT * from wiersze_faktury where id_faktury="+f.id_faktura;

                request(wierszsql).then(wiersze => {
                    counter++;

                    wiersze=wiersze.map(w => {
                        return {
                            "produkt": {
                                "nazwa":w.nazwa,
                                "jednostka": w.jednostka,
                                "wartosc_VAT": w.vat,
                                "cena_netto": w.cena_netto
                            },
                            "ilosc":w.ilosc
                        }
                    })
                    f=Object.assign(f,{
                        "wiersze":wiersze});

                    if (counter==faktury.length){
                        sendfaktury(faktury);
                    }
                })

            }

        }

        function sendfaktury(faktury){
            for (let f of faktury) {
                // usunac zbedne atrybuty
                delete f.nazwa;
                delete f.adres;
                delete f.NIP;
                delete f.id_faktura;
                delete f.id_kupujacy;
                delete f.id_sprzedajacy;
                delete f.id_kontrahent;
            }
            
            
            res.send(faktury);
        }

    }
    //                           -------------------- DATA POPRAWIONA
    else if(req.query.data) {
        let dat=req.query.data;
        
        let sqlfaktury = "SELECT * FROM `faktury` where `data_wystawienia`="+dat+" order by data_wystawienia desc";
        console.log(sqlfaktury);
        
        request(sqlfaktury).then(nipfaktury => {

            if (nipfaktury.length==0){
                res.send([]);
                return;
            }

            let zlozfaktury=nipfaktury;
            let counter=0;

            for (let f of zlozfaktury){

                let t_arr=[];
                let nsqlkupujacy="SELECT * FROM kontrahenci where id_kontrahent="+f.id_kupujacy;
                let nsqlsprzedajacy="SELECT * from kontrahenci where id_kontrahent=1";

                t_arr.push(request(nsqlkupujacy));
                t_arr.push(request(nsqlsprzedajacy));

                

                Promise.all(t_arr).then(kontr => {
                    f=Object.assign(f,{"kupujacy":kontr[0][0]});
                    f=Object.assign(f,{"sprzedajacy":kontr[1][0]});
                    counter++;

                    if (counter==nipfaktury.length){
                        assignwiersze(nipfaktury);
                    }
                    //console.log("assigned");
                })
            }  
            //console.log("after for")
        })

        function assignwiersze(faktury){
            let counter=0;
            //console.dir(faktury);

            for (let f of faktury){
                let wierszsql="SELECT * from wiersze_faktury where id_faktury="+f.id_faktura;

                request(wierszsql).then(wiersze => {
                    counter++;
                    wiersze=wiersze.map(w => {
                        return {
                            "produkt": {
                                "nazwa":w.nazwa,
                                "jednostka": w.jednostka,
                                "wartosc_VAT": w.vat,
                                "cena_netto": w.cena_netto
                            },
                            "ilosc":w.ilosc
                        }
                    })
                    f=Object.assign(f,{"wiersze":wiersze});

                    if (counter==faktury.length){
                        sendfaktury(faktury);
                    }
                })

            }

        }

        function sendfaktury(faktury){
            for (let f of faktury) {
                // usunac zbedne atrybuty
                delete f.nazwa;
                delete f.adres;
                delete f.NIP;
                delete f.id_faktura;
                delete f.id_kupujacy;
                delete f.id_sprzedajacy;
                delete f.id_kontrahent;
            }
            
            
            res.send(faktury);
        }



    }
    // ------------- odrzucenie pozostalych
    else{
        res.status(500);
        res.send("Bad request");
    }

    //let a={"nazwa":"Asd"};
    //res.send(a);
});

router.get("/api/faktury", (req,res) => {
    if (req.query.nip && req.query.Data_od && req.query.Data_do) {

        console.log('Zapytanie o fakture');
        const sql1 = `Select * from fakturyponip where nip=${req.query.nip} and data_wystawienia between ${req.query.Data_od} and ${req.query.Data_do}`;
        console.log(sql1);

        request(sql1).then(nipfaktury => {

            if (nipfaktury.length==0){
                res.send([]);
                return;
            }

            let zlozfaktury=nipfaktury;
            let counter=0;

            for (let f of zlozfaktury){

                let t_arr=[];
                let nsqlkupujacy="SELECT * FROM kontrahenci where id_kontrahent="+f.id_kupujacy;
                let nsqlsprzedajacy="SELECT * from kontrahenci where id_kontrahent=1";
                //console.log(nsqlkupujacy);

                t_arr.push(request(nsqlkupujacy));
                t_arr.push(request(nsqlsprzedajacy));

                

                Promise.all(t_arr).then(kontr => {
                    //console.dir(kontr);
                    f=Object.assign(f,{"kupujacy":kontr[0][0]});
                    f=Object.assign(f,{"sprzedajacy":kontr[1][0]});
                    counter++;

                    if (counter==nipfaktury.length){
                        assignwiersze(nipfaktury);
                    }
                    //console.log("assigned");
                })
                
            }  
            //console.log("after for")
            


        })
        function assignwiersze(faktury){
            let counter=0;
            //console.dir(faktury);

            for (let f of faktury){
                let wierszsql="SELECT * from wiersze_faktury where id_faktury="+f.id_faktura;

                request(wierszsql).then(wiersze => {
                    counter++;

                    wiersze=wiersze.map(w => {
                        return {
                            "produkt": {
                                "nazwa":w.nazwa,
                                "jednostka": w.jednostka,
                                "wartosc_VAT": w.vat,
                                "cena_netto": w.cena_netto
                            },
                            "ilosc":w.ilosc
                        }
                    })
                    f=Object.assign(f,{
                        "wiersze":wiersze});

                    if (counter==faktury.length){
                        sendfaktury(faktury);
                    }
                })

            }

        }

        function sendfaktury(faktury){
            /*
            for (let f of faktury) {
                // usunac zbedne atrybuty
                delete f.nazwa;
                delete f.adres;
                delete f.NIP;
                delete f.id_faktura;
                delete f.id_kupujacy;
                delete f.id_sprzedajacy;
                delete f.id_kontrahent;
            }
            */
            let form = faktury.map(f => {
                let sum_arr=f.wiersze.map(w => {
                    return w.produkt.cena_netto+(w.produkt.cena_netto*w.produkt.wartosc_VAT/100);
                })
                //console.dir(sum_arr);
                let sum = sum_arr.reduce((pr,cr) => {return pr+cr});

                return {
                    ID:f.id_faktura,
                    Numer_faktury:f.nr_faktury,
                    NIP:f.NIP,
                    Status:f.status,
                    Data_platnosci:f.data_platnosci,
                    Wartosc_faktury_brutto:+sum.toFixed(2)
                }
            })
            
            
            res.send(form);
        }


    }
    else{
        res.status(500);
        res.send();
    }
})





//POST
router.post("/faktury", (req,res) => {
    let faktura=parsePOST(req);
    console.dir(faktura);

    //INSERT INTO `fakturowanie`.`faktury` (`id_kupujacy`, `id_sprzedajacy`, `nr_faktury`, `data_wystawienia`, `data_sprzedazy`, `status`, `forma platnosci`, `data_platnosci`) 
    //VALUES ('2', '1', '1000', '3030-11-27', '2020-10-10', 'done', 'karta', '2020-11-23');

    //INSERT INTO `fakturowanie`.`faktury` (`id_kupujacy`, `id_sprzedajacy`, `data_wystawienia`, `data_sprzedazy`, `status`, `forma platnosci`, `data_platnosci`) 
    //VALUES ('2', '1', '2020-11-27', '2020-11-11', 'done', 'karta', '2020-11-12');

    let data_wystawienia=new Date(faktura.data_wystawienia);
    let data_wystawienia_str= data_wystawienia.getFullYear()+'-'+(+data_wystawienia.getMonth()+1)+'-'+data_wystawienia.getDate();

    let data_sprzedazy=new Date(faktura.data_sprzedazy);
    let data_sprzedazy_str= data_sprzedazy.getFullYear()+'-'+(+data_sprzedazy.getMonth()+1)+'-'+data_sprzedazy.getDate();

    let data_platnosci=new Date(faktura.data_platnosci);
    let data_platnosci_str= data_platnosci.getFullYear()+'-'+(+data_platnosci.getMonth()+1)+'-'+data_platnosci.getDate();

    
    //console.dir(faktura);

    // DODAJ KONTRAHENTA JESLI NIE MA
    let kupujacy_id=faktura.kupujacy.id_kontrahent;
    let sqlkupujacy=`Select * from kontrahenci where id_kontrahent=${faktura.kupujacy.id_kontrahent}`;
    if (!faktura.kupujacy.id_kontrahent) {
        //INSERT INTO `fakturowanie`.`kontrahenci` (`nazwa`, `adres`, `nip`) VALUES ('Lokalna3', 'Tarnów', '9991112223');
        sqlkupujacy = "INSERT INTO `kontrahenci` (`nazwa`, `adres`, `NIP`) VALUES "+`('${faktura.kupujacy.nazwa}','${faktura.kupujacy.adres}','${faktura.kupujacy.NIP}')`;
    }
    request(sqlkupujacy).then(kontrahent => {
        //console.log(kontrahent.insertId);
        
        if (kupujacy_id===undefined)
            kupujacy_id=kontrahent.insertId;

        let generatenr=data_wystawienia_str.split('-').join('');
        generatenr+=Math.round(new Date().getTime()%10000)+"";
        //data_wystawienia_str+'-'+Math.round(Math.random()*1000);

        let sqlfakturak= "INSERT INTO `faktury` (`id_kupujacy`, `id_sprzedajacy`, `data_wystawienia`, `data_sprzedazy`, `status`, `forma_platnosci`, `data_platnosci`, `nr_faktury`)";
        let sqlfakturav=              ` VALUES ('${kupujacy_id}', '${faktura.sprzedajacy.id_kontrahent}','${data_wystawienia_str}', '${data_sprzedazy_str}', '${faktura.status}', '${faktura.forma_platnosci}', '${data_platnosci_str}', '${generatenr}' )`
        //console.log(sqlfakturak+sqlfakturav);
        console.log("dodano fakture");

        request(sqlfakturak+sqlfakturav).then(f => {
            console.log(f.insertId);
            console.log(generatenr);

            for (wiersz of faktura.wiersze){
                let sqlwiersz = "insert into `wiersze_faktury` (`id_faktury`, `nazwa`, `jednostka`, `ilosc`, `cena_netto`, `vat`) VALUES ";
                sqlwiersz+= `( '${f.insertId}' , '${wiersz.produkt.nazwa}', '${wiersz.produkt.jednostka}', '${wiersz.ilosc}', '${wiersz.produkt.cena_netto}','${wiersz.produkt.wartosc_VAT}' )`;
                
                //console.log(sqlwiersz);
                console.log("dodano wiersz");

                request(sqlwiersz).then(w => {

                    
                    let mnm = new Promise((resolve,reject) => {
                        setTimeout(()=> {
                            resolve({"nr_faktury":generatenr})
                        },50)
                    })
                    mnm.then((wa)=>{
                        res.send(wa)
                    }).catch(err => {
                        //console.error(err);
                    })
                    

                })
            
            }

        })

    })


});

router.put("/faktury", (req,res) => {
    //console.dir(req)
    let faktura=parsePOST(req);
    //console.dir(faktura);

    // PArsowanie dat
    let data_wystawienia=new Date(faktura.data_wystawienia);
    let data_wystawienia_str= data_wystawienia.getFullYear()+'-'+(+data_wystawienia.getMonth()+1)+'-'+data_wystawienia.getDate();

    let data_sprzedazy=new Date(faktura.data_sprzedazy);
    let data_sprzedazy_str= data_sprzedazy.getFullYear()+'-'+(+data_sprzedazy.getMonth()+1)+'-'+data_sprzedazy.getDate();

    let data_platnosci=new Date(faktura.data_platnosci);
    let data_platnosci_str= data_platnosci.getFullYear()+'-'+(+data_platnosci.getMonth()+1)+'-'+data_platnosci.getDate();

    let sqlupdate= "UPDATE `faktury` set `data_wystawienia`='"+data_wystawienia_str+"', `data_sprzedazy`='"+data_sprzedazy_str+"', `status`=\""+faktura.status+"\", `forma_platnosci`='"+faktura.forma_platnosci+"', `data_platnosci`='"+data_platnosci_str+"' where `nr_faktury`='"+faktura.nr_faktury+"'";
    //console.log(sqlupdate);

    request(sqlupdate).then((f)=> {

        let sql2=`select * from faktury where nr_faktury='${faktura.nr_faktury}'`;
        //console.log(sql2);

        request(sql2).then( f => {
            //console.dir(f);
            let id=f[0].id_faktura;

            let sql3 = "Delete from wiersze_faktury where id_faktury="+id;
            request(sql3).then(()=> {       //tu usunąć poprzednie wiersze
                console.log("Usuwam poprzednie wiersze");

                let t_w=[];

                for (wiersz of faktura.wiersze){
                    let sqlwiersz = "insert into `wiersze_faktury` (`id_faktury`, `nazwa`, `jednostka`, `ilosc`, `cena_netto`, `vat`) VALUES ";
                    sqlwiersz+= `( '${id}' , '${wiersz.produkt.nazwa}', '${wiersz.produkt.jednostka}', '${wiersz.ilosc}', '${wiersz.produkt.cena_netto}','${wiersz.produkt.wartosc_VAT}' )`;

                    t_w.push(request(sqlwiersz));

                }

                Promise.all(t_w).then(t => {
                    res.send({"status":"ok"});
                })
                .catch(err => {
                    res.status(500);
                    res.send({"error":"cos poszlo nie tak"});
                    console.throw(err);
                    throw Error(err);
                })


            })
            .catch(err => {
                res.status(500);
                res.send({"error":"cos poszlo nie tak"});
                console.throw(err);
                throw Error(err);
            })

        })
        .catch(err => {
            res.status(500);
            res.send({"error":"cos poszlo nie tak"});
            console.throw(err);
            throw Error(err);
        })

    })
    .catch(err => {
        res.status(500);
        res.send({"error":"cos poszlo nie tak"});
        console.throw(err);
        throw Error(err);
    })

    //res.send("heelo");
})


module.exports = router