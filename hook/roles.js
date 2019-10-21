'use strict';
require('dotenv').config()
var request = require("request");
var url = process.env.AUTH0_API_URL;
let token = 'Erro de TOKEN';
var jwtDecode = require('jwt-decode');
var axios = require('axios')


module.exports = {
    //Consulta todas as permissoes no Auth0
    initToken: function initToken() {
        // Setting URL and headers for request
        var options = {
            method: 'POST',
            url: process.env.AUTH0_TOKEN_URL,
            headers: { 'content-type': 'application/json' },
            body: '{"client_id":"' + process.env.AUTH0_CLIENTID + '", "client_secret":"' + process.env.AUTH0_CLIENTSECRET + '",' +
                '"audience":"' + process.env.AUTH0_API_URL + '","grant_type":"client_credentials"}'
        };
        // Return new promise 
        return new Promise(function (resolve, reject) {
            // Do async job
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                resolve(JSON.parse(body).access_token);
            });
        })
    },

    initGetRoles: function initGetRoles(token) {
        // Setting URL and headers for request
        var options = {
            method: 'GET',
            url: url + 'roles',
            headers: { authorization: 'Bearer ' + token }
        };
        // Return new promise 
        return new Promise(function (resolve, reject) {
            // Do async job
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                //console.log(JSON.parse(body));
                resolve(body);
            });
        })
    },

    //Consulta todas as permissoes do USER
    initGetUserRoles: function getUserRoles(token, user) {
        //console.log("Roles do User => " + user)
        //console.log(token)
        var options = {
            method: 'GET',
            url: url + 'users/' + user + '/roles',
            headers: { authorization: 'Bearer ' + token }
        };
        // Return new promise 
        return new Promise(function (resolve, reject) {
            // Do async job
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                resolve(body);
            });
        })
    },

    initAddRole: function addRole(token, user, role) {
        console.log("Adiciona " + role + " => " + user)
        const headers = {
            authorization: 'Bearer ' + token,
            "Content-Type": "application/json"
        }
        const urlApi = url + 'users/' + user + '/roles';
        const dataAx = '{"roles": ["' + role + '"]}';
        // Return new promise 
        return new Promise(function (resolve, reject) {
            axios.post(urlApi, dataAx, {
                headers: headers
            })
                .then((response) => { resolve(String(response.status)) })
                .catch(err => {
                    // handle error
                    console.log(err)
                })
        })
    },

    //Remove role de um ID de usuario
    initDeleteRole: function removeRole(token, user, role) {
        console.log("Remove " + role + " => " + user)
        return new Promise(function (resolve, reject) {
            axios.delete(
                url + 'users/' + user + '/roles',
                {
                    data: '{"roles": ["' + role + '"]}',
                    headers: {
                        authorization: 'Bearer ' + token,
                        "Content-Type": "application/json"
                    }
                })
                .then(function (response) {
                    resolve(String(response.status));
                })
                .catch(err => {
                    // handle error
                    console.log(err)
                })
        })
    }

};


//Verifica se o JWT contem o papel de ADMIN
function verificaJwt(jwt) {
    try {
        var decoded = jwtDecode(jwt);
        return (decoded['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'].includes("admin"));
    }
    catch (err) {
        console.log(err)
        return false
    }
}







