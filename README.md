# ARMBH_backend_sysfiscal
Backend do Projeto SYSFISCAL

Este Docker Compose roda [Hasura GraphQL Engine](https://github.com/hasura/graphql-engine) junto com Postgres e [pgAdmin4](https://www.pgadmin.org/) utilizando `docker-compose`.

## Pré-requisitos

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

# Utilização
Após [instalado](#instalação), basta digitar o comando em um terminal (se Windows, utilize o PowerShell)
```
docker-compose up -d
``` 

# Instalação

- Clone este repositório em sua máquina
- Edite o arquivo `.envEXEMPLO`
- Renomeie o arquivo `.envEXEMPLO` para `.env`
- Rode o comando em um PowerShell `docker-compose up -d` (se utilizar no Prompt comum não irá funcionar de modo correto)
- Navegue para o pgAdmin em `http://localhost:5050`, faça login e adicione um novo servidor com os seguintes parâmetros:  
  General - Name: Hasura  
  Connection - Host: `armbh_backend_sysfiscal_postgres_1`  
  Username: `postgres`  
  Password: deixe em branco  

## Endpoints importantes

- GraphQL está em [http://localhost:8080/v1/graphql](http://localhost:8080/v1/graphql)
- Hasura Console está em [http://localhost:8080/console](http://localhost:8080/console)
- pgAdmin está em [http://localhost:5050](http://localhost:5050)

# Backup
## Backup do volume de dados
Instale a [ferramenta de backup](https://hub.docker.com/p/loomchild/volume-backup)
```
docker pull loomchild/volume-backup
```

Faça a cópia dentro do container loomchild/volume-backup
```
docker run -v armbh_backend_sysfiscal_db_data:/volume -v /tmp:/backup --rm loomchild/volume-backup backup armbh_backend_sysfiscal_db_data_bk
```

Esta cópia foi pra dentro da imagem loomchild/volume-backup
`Faça o backup da imagem para migrar para outro servidor - !ATENÇÃO - FALTA TESTAR`

## Restore do volume de dados em novo host
Migre a imagem gerada no passo anterior para o novo host

Faça o restore com o comando abaixo no novo host
```
docker run -v armbh_backend_sysfiscal_db_data:/volume -v /tmp:/backup --rm loomchild/volume-backup restore armbh_backend_sysfiscal_db_data_bk
```

O PgAdmin deve ser configurado novamente, porém os dados estarão migrados no postgres.

## Comandos Úteis
- Listar todas as intâncias do Docker 
```docker ps```
- Parar todas as intâncias do Docker 
```docker stop $(docker ps -q)```

# Migração do schema de base de dados para novo servidor

Atenção! - Não utilize o console acima caso esteja modificando o banco de dados. Sem o Hasura Cli não é possível salvar nenhum tipo de alteração feita no banco.

[Consulte a documentação](https://docs.hasura.io/1.0/graphql/manual/migrations/new-database.html)

## Habilitando o console de migração
Em um novo terminal:

Configure a variável ADMIN_SECRET definida em seu arquivo `.env` com o comando
```
set HASURA_GRAPHQL_ADMIN_SECRET=<seu-admin-secret>
```
Entre na pasta contendo o arquivo de configuração da migração
```
cd sysfiscal
```
Inicie o console
```
hasura console
```

O arquivo de configuração `config.yaml` não aceita o uso de `.env`

### Referência
Baseado no Sample localizado no seguinte [repositório](https://github.com/hasura/graphql-engine/tree/master/install-manifests/docker-compose-pgadmin).
