# ARMBH_backend_sysfiscal
Backend do Projeto SYSFISCAL

Este Docker Compose roda [Hasura GraphQL Engine](https://github.com/hasura/graphql-engine) junto com Postgres e [pgAdmin4](https://www.pgadmin.org/) utilizando `docker-compose`.

## Pré-requisitos

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

# Utilização

- Clone este repositório em sua máquina
- Edite o arquivo `.envEXEMPLO`
- Renomeie o arquivo `.envEXEMPLO` para `.env`
- Rode o comando em um PowerShell `docker-compose up -d` (se utilizar no Prompt comum não irá funcionar de modo correto)
- Navegue para `http://localhost:5050`, faça login e adicione um novo servidor com os seguintes parâmetros:  
  General - Name: Hasura  
  Connection - Host: `armbh_backend_sysfiscal_postgres_1`  
  Username: `postgres`  
  Password: deixe em branco  

## Endpoints importantes

- GraphQL está em `http://localhost:8080/v1/graphql`
- Hasura Console está em `http://localhost:8080/console`
- pgAdmin está em `http://localhost:5050`

## Comandos Úteis
- Listar todas as intâncias do Docker `docker ps`
- Parar todas as intâncias do Docker `docker stop $(docker ps -q)`

### Referência
Baseado no Sample localizado no seguinte [repositório](https://github.com/hasura/graphql-engine/tree/master/install-manifests/docker-compose-pgadmin).