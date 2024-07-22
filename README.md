# nestjs-with-elasticsearch

## Criando os containers Docker

Crie os containers Docker atraves do `docker-compose` que se encontra na raiz do projeto com o seguinte comando: 

```bash
docker compose up -d --build
```

## Configurando o Elasticsearch e o Kibana

Após a criação dos containers será necessário configurar o Elasticsearch e o Kibana.

### Elasticsearch

O primeiro passo a se fazer é gerar uma senha para o  usuário `elastic` que será necessário para fazer login no Kibana, utilize o seguinte comando para gerar a senha: 

```bash
docker exec -it Elasticsearch /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
```

Agora será necessário gerar o `enrollment token` para poder configurar o Kibana, utilize o seguinte comando:

```bash
docker exec -it Elasticsearch /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

O próximo passo é copiar o certificado SSL do container `Elasticsearch` para a máquina local com o comando:

```bash
docker cp Elasticsearch:/usr/share/elasticsearch/config/certs/http_ca.crt .
```

### Kibana

Com as configurações do Elasticsearch concluída, agora podemos configurar o Kibana, para isso será necessário acessar no seu navegador o Kibana na sua porta padrão:

```
http://localhost:5601
```

Se tudo deu certo até aqui aparecerá essa tela do Kibana.

![kibana-enrollment-token](https://github.com/user-attachments/assets/4c3d6f2d-905e-43bf-99d8-180e72ce4eae)


Cole dentro do quadro o `enrollment token` que foi gerado anteriormente pelo Elasticsearch. Depois de colar click em "Configure Elastic".

O Kibana irá solicitar um código de verificação para permitir dar continuidade na integração entre o seu Elasticsearch e seu Kibana.

![kibana-verification-code](https://github.com/user-attachments/assets/5a7a579a-4fc5-47b4-bdcb-a130b9c24b9c)

Utilize o comando de log do docker para exibir o seu código de verificação que foi gerado pelo Kibana:

```bash
docker logs Kibana
```

Quando for fornecido o código de verificação o Kibana fará a conclusão das configurações e sua integração com o Elasticsearch.

![kibana-setup](https://github.com/user-attachments/assets/a303bd5d-3f04-432f-815a-c1ffeea6c1c9)

Quando o Kibana concluir sua configuração será solicitado o login.

![kibana-login](https://github.com/user-attachments/assets/5b2e7ed8-4336-4ea6-a109-907bdfede8c9)

O usuário padrão será o `elastic` e a senha desse usuário é a senha que foi gerada anteriormente no container do Elasticsearch junto com o Token.

Essa será a Home do Kibana.

![kibana-home](https://github.com/user-attachments/assets/808357c7-b83a-402a-8dd8-0172d0217c83)

### Gerando API Key do Elasticsearch

No menu lateral vá em `Search` e na opção de `Overview`.

![kibana-search](https://github.com/user-attachments/assets/49fcdeb3-e380-496a-84e0-62325bb05db1)

Na Home de Search a primeira opção que aparecerá é o endpoint do Elasticsearch e logo abaixo dele terá um botão chamado `New`.

![kibana-search-home](https://github.com/user-attachments/assets/82bde160-4bc9-4458-99bc-14d2c680e042)

Após clicar no botão irá aparecer algumas configurações possíveis para criar a sua API Key do Elasticsearch, quando terminar as configurações que desejar, vá no botão `Create API Key`.

![kibana-search-create-key](https://github.com/user-attachments/assets/3ec636a7-81ab-4634-9b39-3075490fc9e6)

Irá aparecer os dados da sua API Key, mas o valor que terá que salvar no seu arquivo `.env` é o campo `encoded` que é a sua key.

![kibana-generated-api-key](https://github.com/user-attachments/assets/329edf9e-be51-4bf8-ac4e-5510abb9c998)

## Prisma

Para o Prisma reconhecer o banco de dados é necessário adicionar a URL do banco no arquivo `.env`, por exemplo: 

```env
DATABASE_URL="postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample"
```

Estrutura da URL do banco de dados: 

![database_url](https://github.com/user-attachments/assets/1343cdbf-d4bd-4d45-aa3d-14f9f26f70e1)

### Criando uma migration

```bash
npx prisma migrate dev --name <nome_da_migration>
```
### Executar as Migrations

```bash
npx prisma migrate dev
```

## Instalar as dependências

```bash
npm install
```

## Executar projeto

### development

```bash
npm run start
```

### watch mode

```bash
npm run dev
```

### production mode

```bash
npm run prod
```
