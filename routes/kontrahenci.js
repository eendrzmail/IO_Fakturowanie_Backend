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

// GET
router.get("/kontrahenci", (req,res) => {

    //console.dir(req.query);

    if (req.query.nazwa){
        let nazwa=req.query.nazwa;

        const sql = `Select * from kontrahenci where nazwa like '%${nazwa}%'`; 
        
        request(sql).then((val) => {
            val=val.filter(k => {return k.id_kontrahent!=1});
            res.send(val);
        })

    }
    else if (req.query.self){

        const sql = `Select * from kontrahenci where id_kontrahent=1`;
        
        request(sql).then((val) => {
            
            res.send(val);
        })

    }
    else{
        const sql = `Select * from kontrahenci`;

        request(sql).then((val) => {

            val=val.filter(k => {return k.id_kontrahent!=1});

            res.send(val);
        })
    }

    //let a={"nazwa":"Asd"};
    //res.send(a);
})
router.get('/kontrahenci/self/', (req,res) => {
    const sql = `Select * from kontrahenci where id_kontrahent=1`;
        
        request(sql).then((val) => {
            res.send(val[0]);
        })
})

router.get('/kontrahenci/:id', (req,res) => {
    const sql = `Select * from kontrahenci where id_kontrahent=${req.params.id}`;

    request(sql).then((val) => {
        res.send(val);
    })
})





module.exports = router