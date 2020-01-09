const { request, GraphQLClient } = require("graphql-request");
const gmail = require("./mailTransportantion");
const htmlEmail = require("./mailTemplate");

//Monta URL do Hasura
const graphql_url = "localhost:8080";
const url = "http://" + graphql_url + "/v1/graphql";

const payload = {
  historico_tipo_id: 1,
  name: "TESTE DE NOTI",
  created_at: "2019-10-14T16:21:25.716539+00:00",
  id: 372,
  user_id: "auth0|5d5c2cbc6d90f90c81a8309d",
  processo_id: 3
};

const query_historico = `query getHistorico($processo_id: Int!, $id:Int!) {
  historicos(where: {processo_id: {_eq: $processo_id}, id: {_eq: $id}}) {
    created_at
    historico_tipo {
      id
      name
      type
    }
    historico_tipo_id
    id
    name
    processo {
      id
      name
    }
    user_id
  }
}  
`;

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

function enviaEmail(data) {
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
    console.log(message);
  });
}

function main() {
  const variables = { processo_id: payload.processo_id };
  const headers = {
    "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET
  };
  const client = new GraphQLClient(url, { headers: headers });

  client
    .request(query_processointeressado, variables)
    .then(data => {
      enviaEmail(data);
    })
    .catch(err => {
      console.log(err);
      console.log(err.response.errors); // GraphQL response errors
      console.log(err.response.data); // Response data if available
    });
}

main();
