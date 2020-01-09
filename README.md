# ARMBH_backend_sysfiscal
Backend do Projeto SYSFISCAL

Este Docker Compose roda [Hasura GraphQL Engine](https://github.com/hasura/graphql-engine) junto com Postgres e [pgAdmin4](https://www.pgadmin.org/) utilizando `docker-compose`.

## Pré-requisitos

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Hasura CLI](https://docs.hasura.io/1.0/graphql/manual/hasura-cli/install-hasura-cli.html#install-hasura-cli)

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
O arquivo de configuração `config.yaml` não aceita o uso de `.env`

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
hasura console --admin-secret=<your-admin-secret>
```
## Dados iniciais
Migre o esquema de banco de dados executando os comandos a partir de
```
cd sysfiscal
```

Comando para aplicar a migração

```
hasura migrate apply
```

Verificar se está ok
```
hasura migrate status
```


Execute as seguintes consultas no Banco de Dados para adição dos dados padrões do sistema:
```
mutation inserirDados {
# Insere todos os dados padrões do Sistema
#Tabela Origems
  insert_origems(objects: [
    {id:1, name: "AGE"},
    {id:2, name: "AL-MG"},
    {id:3, name: "Anônima"},
    {id:4, name: "ARMBH"},
    {id:5, name: "Empreendedor"},
    {id:6, name: "Justiça"},
    {id:7, name: "Meio Ambiente"},
    {id:8, name: "Ministério Público"},
    {id:9, name: "Outros"},
    {id:10, name: "Polícia Ambiental"},
    {id:11, name: "Prefeitura"},
    {id:12, name: "TJ-MG"}
]) {
    affected_rows
  }


#Tabela Status
  insert_status(objects: [
    {id:1, name: "Abertura De Processo",type: "secondary"},
    {id:2, name: "Aguardando Documentação",type: "info"},
    {id:3, name: "Aguardando Pagamento de Multa",type: "info"},
    {id:4, name: "Aguardando Recurso (CAR)",type: "info"},
    {id:5, name: "Aguardando Recurso (DG)",type: "info"},
    {id:6, name: "Aguardando Vistoria",type: "info"},
    {id:7, name: "Anuência Corretiva",type: "warning"},
    {id:8, name: "Assinatura De CAC",type: "warning"},
    {id:9, name: "Assinatura De TAC",type: "warning"},
    {id:10, name: "Comunicação Enviada",type: "warning"},
    {id:11, name: "DAE Encaminhado",type: "warning"},
    {id:12, name: "Descumpriu CAC",type: "danger"},
    {id:13, name: "Mudou Endereço",type: "danger"},
    {id:14, name: "Multa Cancelada Pela CAR",type: "warning"},
    {id:15, name: "Multa Parcialmente Cancelada Pela CAR",type: "warning"},
    {id:16, name: "Não Pagou Multa",type: "danger"},
    {id:17, name: "Processo Encerrado",type: "success"},
    {id:18, name: "Processo Na CAR",type: "warning"},
    {id:19, name: "Protocolado",type: "warning"}
  ]) {
    affected_rows
  }


#Tabela Municipios
  insert_municipios(objects:
    [
    {id:1, name: "Baldim",zone: "RMBH"},
    {id:2, name: "Belo Horizonte",zone: "RMBH"},
    {id:3, name: "Betim",zone: "RMBH"},
    {id:4, name: "Brumadinho",zone: "RMBH"},
    {id:5, name: "Caeté",zone: "RMBH"},
    {id:6, name: "Capim Branco",zone: "RMBH"},
    {id:7, name: "Confins",zone: "RMBH"},
    {id:8, name: "Contagem",zone: "RMBH"},
    {id:9, name: "Esmeraldas",zone: "RMBH"},
    {id:10, name: "Florestal",zone: "RMBH"},
    {id:11, name: "Ibirité",zone: "RMBH"},
    {id:12, name: "Igarapé",zone: "RMBH"},
    {id:13, name: "Itaguara",zone: "RMBH"},
    {id:14, name: "Itatiaiuçu",zone: "RMBH"},
    {id:15, name: "Jaboticatubas",zone: "RMBH"},
    {id:16, name: "Juatuba",zone: "RMBH"},
    {id:17, name: "Lagoa Santa",zone: "RMBH"},
    {id:18, name: "Mário Campos",zone: "RMBH"},
    {id:19, name: "Mateus Leme",zone: "RMBH"},
    {id:20, name: "Matozinhos",zone: "RMBH"},
    {id:21, name: "Nova Lima",zone: "RMBH"},
    {id:22, name: "Nova União",zone: "RMBH"},
    {id:23, name: "Pedro Leopoldo",zone: "RMBH"},
    {id:24, name: "Raposos",zone: "RMBH"},
    {id:25, name: "Ribeirão das Neves",zone: "RMBH"},
    {id:26, name: "Rio Acima",zone: "RMBH"},
    {id:27, name: "Rio Manso",zone: "RMBH"},
    {id:28, name: "Sabará",zone: "RMBH"},
    {id:29, name: "Santa Luzia",zone: "RMBH"},
    {id:30, name: "São Joaquim de Bicas",zone: "RMBH"},
    {id:31, name: "São José da Lapa",zone: "RMBH"},
    {id:32, name: "Sarzedo",zone: "RMBH"},
    {id:33, name: "Taquaraçu de Minas",zone: "RMBH"},
    {id:34, name: "Vespasiano",zone: "RMBH"},
    {id:35, name: "Belo Vale",zone: "Colar"},
    {id:36, name: "Bom Jesus do Amparo",zone: "Colar"},
    {id:37, name: "Bonfim",zone: "Colar"},
    {id:38, name: "Fortuna de Minas",zone: "Colar"},
    {id:39, name: "Funilândia",zone: "Colar"},
    {id:40, name: "Inhaúma",zone: "Colar"},
    {id:41, name: "Itabirito",zone: "Colar"},
    {id:42, name: "Itaúna",zone: "Colar"},
    {id:43, name: "Moeda",zone: "Colar"},
    {id:44, name: "Pará de Minas",zone: "Colar"},
    {id:45, name: "Prudente de Morais",zone: "Colar"},
    {id:46, name: "Santa Bárbara",zone: "Colar"},
    {id:47, name: "São Gonçalo do Rio Abaixo",zone: "Colar"},
    {id:48, name: "São José da Varginha",zone: "Colar"},
    {id:49, name: "Sete Lagoas",zone: "Colar"}
  ]
  ) {
    affected_rows
  }
  
#Tabela Historico_tipos
  insert_historico_tipos(objects: 
    [
      {id:1, name: "Processo",type: "primary"},
      {id:2, name: "Documento",type: "warning"},
      {id:3, name: "Comentário",type: "success"},
      {id:4, name: "Prazo",type: "danger"},
      {id:5, name: "Status",type: "danger"}
    ]) {
    affected_rows
  }
}
```

## Autenticação em Auth0.com

Siga o passo-a-passo [neste endereço](https://learn.hasura.io/graphql/hasura/authentication) para Homologação e Produção.

[JWT Debugger](https://jwt.io/)

Devido às restrições da política CAMG não é possível testar a autenticação em `LOCALHOST` de máquinas da CA.

## Build de uma nova IMG Docker
`
docker build -t conta/img:tag .
`

## Enviando a IMG para a nuvem:

```
docker push conta/img:tag
```


# Produção

O sistema está hospedado na máquina da PRODEMGE.

O arquivo `docker-compose.yaml` e `.env` com as variáveis de configuração estão localizados em:

````
~/sysfiscal
```

Quando uma versão do Backend ou FrontEnd for publicada na nuvem do Docker, basta alterar o arquivo `docker-compose.yaml` e, dentro do diretório, executar o comando:

```
sudo docker-compose up -d
```

---------------------------------

### Referência
Baseado no Sample localizado no seguinte [repositório](https://github.com/hasura/graphql-engine/tree/master/install-manifests/docker-compose-pgadmin).
