const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//Envia Email
const gmail = require('./mailTransportantion');
const htmlEmail = require("./mailTemplate");

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

function enviaEmail(data, payload) {
  //console.log(data)
  const interessados = data.processos_interessados;
  //console.log(interessados)
  interessados.forEach(function(item) {
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
    gmail.enviaEmail(email,message, assunto);
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
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.post("/hook", function(req, res) {
  console.log(req.body.event.data.new);
  const payload = req.body.event.data.new;
  const port = process.env.PORT;
  //console.log("Your port is " + process.env.HASURA_GRAPHQL_ADMIN_SECRET);
  consulta(payload);
  res.end("Recebido -> " + JSON.stringify(req.body.event.data.new));
});

//Launch listening server on port 8081
app.listen(8081, function() {
  console.log("app listening on port 8081!");
});
