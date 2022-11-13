import express from 'express';
import bodyParser from 'body-parser';
import {body, check, validationResult} from 'express-validator';
import alert from 'alert';


const app = express();
const port = 3000;
const urlEncoded = bodyParser.urlencoded({extended:false});

//setting the view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get('', (req, res)=>{
    res.render('form')
})


app.post('/result', [
    body('ipAddress', 'Type a valid Ip-Address')
        .exists()
        .custom(value =>{if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)){
            return true
        }}      
        ),
    body('maskcode', 'Type a valid subnet mask code')
        .exists()
        .custom(value =>{if(/^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/.test(value)){
            return true
        }}      
        )
], (req, res)=>{  
    const errors = validationResult(req)
    const maskCode = req.body.maskcode;
    const userIpAddress=req.body.ipAddress;
    if (!errors.isEmpty()) {
        console.log(req.body)
        const valores = req.body
        const validaciones = errors.array()
        res.render('form', {validaciones:validaciones, valores: valores})
    }else{
        if(maskCode==='255.255.255.0'){
            res.send(`Dear user your CIDR Ip/mask is: ${userIpAddress}/24`)
        }else{
            res.send(`Dear user, your Ip-Address (${userIpAddress}) is valid but it's mask is not a mask 24 according to the CIDR standar`)
        }
      
    }
});


app.listen(port, ()=>{
    console.log(`App listening  on port ${port}`)
})