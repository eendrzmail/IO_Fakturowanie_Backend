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

                const sqlsprzedajacy = `Select * from kontrahenci where id_kontrahent=1`;
                const sqlkupujacy = `Select * from kontrahenci where id_kontrahent=2`;
                //console.log("poskladaj")

                const sprzedajacytab = request(sqlsprzedajacy);     //get sprzedajacy
                const kupujacytab = request(sqlkupujacy);           //get kupujacy

                Promise.all([sprzedajacytab,kupujacytab]).then((h)=>{
                    let kont = {'sprzedajacy' : h[0][0], 'kupujacy' : h[1][0]};       
                    //console.dir(h);
                    let mergedObject2 = Object.assign(mergedObject,kont);   //przypisz kontrahentow

                    //console.dir(mergedObject2);
                    console.log("Wysylanie danych");
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
    else if (req.query.data) {

        const sql = `Select * from faktury where data_wystawienia=${req.query.data}`;

        //console.log(sql);
        let h = new Promise((resolve,reject)=>{

        })
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

                                    //koniec 1 obiektu
                                    console.log(`faktura nr. ${faktura.id_faktura}`)
                                    resolve(faktury)
                                                
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
    // ------------- odrzucenie pozostalych
    else{
        res.status(500);
        res.send("Bad request");
    }

    //let a={"nazwa":"Asd"};
    //res.send(a);
});

//POST
router.post("/faktury", (req,res) => {
    let faktura=parsePOST(req);
    console.dir(faktura);
});


module.exports = router