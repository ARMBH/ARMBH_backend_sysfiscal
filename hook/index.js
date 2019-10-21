const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var jwtDecode = require('jwt-decode');
//Envia Email
const gmail = require('./mailTransportantion');
const htmlEmail = require("./mailTemplate");
const roles = require("./roles");

//Para Graphql
const { request, GraphQLClient } = require("graphql-request");

//Monta URL do Hasura
const graphql_url = "sysfiscal_hasura:8080";
const url = "http://" + graphql_url + "/v1/graphql";

const query_processointeressado = `query getProcessoInteressado($processo_id: Int!) {
    processos_interessados(where: {processo_id: {_eq:  $processo_id}}) {
      id
      interessado_id
      interessado {
        email
        id
        name
        tratamento
        origem {
          id
          name
        }
      }
      processo {
        id
        name
      }
    }
  } 
  `;

//Verifica se o JWT contem o papel de ADMIN
function verificaJwt(jwt) {
  try {
    var decoded = jwtDecode(jwt);
    return (decoded['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'].includes("admin"));
  }
  catch (err) {
    console.log(err.message)
    return false
  }
}

function enviaEmail(data, payload) {
  //console.log(data)
  const interessados = data.processos_interessados;
  //console.log(interessados)
  interessados.forEach(function (item) {
    const email = item.interessado.email;
    const assunto = `[ARMBH - Sistema de Fiscalização] Processo ${item.processo.id} - ${item.processo.name}`;
    let message = `Prezado(a) ${item.interessado.tratamento} ${
      item.interessado.name
      },<br>
      O Processo ${item.processo.id} - ${item.processo.name} foi alterado:<br>
      ${payload["name"]}`;
    console.log(message);
    message = htmlEmail.templateMail(
      item.interessado.email,
      item.interessado.tratamento,
      item.interessado.name,
      item.processo.id,
      item.processo.name,
      payload["name"]
    );
    gmail.enviaEmail(email, message, assunto);
  });
}

function consulta(payload) {
  const variables = { processo_id: payload.processo_id };
  const headers = {
    "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET
  };
  const client = new GraphQLClient(url, { headers: headers });

  client
    .request(query_processointeressado, variables)
    .then(data => {
      enviaEmail(data, payload)
    })
    .catch(err => {
      console.log(err);
      console.log(err.response);
      console.log(err.response.errors); // GraphQL response errors
      console.log(err.response.data); // Response data if available
    });
}

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.post("/hook", function (req, res) {
  console.log(req.body.event.data.new);
  const payload = req.body.event.data.new;
  const port = process.env.PORT;
  //console.log("Your port is " + process.env.HASURA_GRAPHQL_ADMIN_SECRET);
  consulta(payload);
  res.end("Recebido -> " + JSON.stringify(req.body.event.data.new));
});

app.post("/roles", function (req, res) {

  const body = req.body;
  const jwt = req.headers.jwt;
  const action = (body.action)
  let user = "";
  let role = "";

  if (req.body.user)
    user = req.body.user;

  if (req.body.role)
    role = req.body.role;

  console.log('Req:' + req.headers.origin + ' => ' + action)

  if (verificaJwt(jwt))
  {

    if (action === "delete") {
      //res.end("Deletar " + body.role + " => " + body.user);
      roles.initToken().then(function (result) {
        roles.initDeleteRole(result, user, role).then(function (status_res) {
          console.log("Add Role =>" + status_res)
          res.end(status_res)
        }, function (err) {
          console.log(err);
        })
      }, function (err) {
        console.log(err);
      })
    }
    
    if (action === "add") {
      //console.log("Adicionar " + body.role + " => " + body.user);
      roles.initToken().then(function (result) {
        roles.initAddRole(result, user, role).then(function (status_res) {
          console.log("Add Role =>" + status_res)
          res.end(status_res)
        }, function (err) {
          console.log(err);
        })
      }, function (err) {
        console.log(err);
      })
    }
    
    if (action === "listall") {
      roles.initToken().then(function (result) {
        roles.initGetRoles(result).then(function (roles) {
          res.end(roles)
        }, function (err) {
          console.log(err);
        })
      }, function (err) {
        console.log(err);
      })
    }
    
    if (action === "listuser") {
      console.log("Listar roles => " + body.user);
      roles.initToken().then(function (result) {
        roles.initGetUserRoles(result, user).then(function (roles) {
          res.end(roles)
        }, function (err) {
          console.log(err);
        })
      }, function (err) {
        console.log(err);
      })
    }
    
    setTimeout(function () { res.end("Parâmetros inválidos. TIMEOUT"); }, 20000);
    //res.end("Parâmetros inválidos.");
  } else res.end("TOKEN INVALIDO")
  });
  
  //Launch listening server on port 8081 <- usar para production
  const port = 8081
  app.listen(port, function () {
    console.log("app listening on port " + port);
  });
  