
require('dotenv').config();
const secret = process.env.SECRET;
const md5 = require ('md5');
const rp = require('request-promise');
var moment = require('moment-timezone');


class AdminController {

    /**
     * admin login
     */
    static make_api_request(req, res) {
        try {
            
            let param = AdminController.get_token_from_server();
            
            var options = {
                method: 'POST',
                uri: 'http://open.10000track.com/route/rest',
                form: param,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                },
                json: true
            };
             
            rp(options)
                .then(function (body) {
                    
                    return res.status(200).json({
                        // status: 'success',
                        data: param
                    });
               
                })
                .catch(function (err) {
               
                    console.log(err);
               
                    return res.status(200).json({
                        status: 'err',
                        message: 'request failed'
                    });
               
                });
            
        } catch (e) {
            return res.sendStatus(500)
        }
    }    

    static testParams(req, res) {
        try {
            
            let signed_params = AdminController.get_token_from_server();
                    
            return res.status(200).json({
                status: 'success',
                data: signed_params
            });

        } catch (e) {
            return res.sendStatus(500)
        }
    }  
    
   
    static get_token_from_server(){
        let md5_pass = md5(process.env.PASSWORD).toLowerCase();
        let param = this.get_common_params(process.env.GET_TOKEN);
        param = {...param, ...this.get_token_params(param, md5_pass)};
        let sign = this.sign(param);
        param = this.append_signatur_to_request(sign, param);
        
        return param;

    }
    
    static get_common_params(method){
        let param = {
            method:method,
            timestamp:moment().utc().format("YYYY-MM-DD hh:mm:ss"),
            app_key:process.env.APP_KEY,
            sign:'',
            sign_method:process.env.SIGN_METHOD,
            v:process.env.VERSION,
            format:process.env.FORMAT
        };

        return param;
        
    }

    static append_signatur_to_request(sign, param){
        param.sign = sign;
        return param;
    }

    static get_token_params(param, md5_pass){
        
        param = {
            user_id:process.env.USER_ID,
            user_pwd_md5:md5_pass,
            expires_in:process.env.EXPIRE
        };

        return param;
        
    }
    
    static sign(objArray){

        // let password_md5 = md5(process.env.PASSWORD).toLowerCase();
        let app_secret = process.env.APP_SECRET;

        let ordered = {};
        let key_and_val_joined = '';
        let signed = '';


        //reordering parameters alphabetically
        Object.keys(objArray).sort().forEach(function(key) {
            ordered[key] = objArray[key];
            
        });
        
        //concatenating keys and value
        for(const property in ordered){
            key_and_val_joined += property + ordered[property];
        }

        //appending and prepending app secret to params
        let app_secret_and_param = app_secret + key_and_val_joined + app_secret;
        signed = md5(app_secret_and_param);

        // return app_secret_and_param;
        return signed.toUpperCase();
    }
}




module.exports = AdminController;
