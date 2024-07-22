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

![kibana-enrollment-token](kibana-enrollment-token.png)

Cole dentro do quadro o `enrollment token` que foi gerado anteriormente pelo Elasticsearch. Depois de colar click em "Configure Elastic".

O Kibana irá solicitar um código de verificação para permitir dar continuidade na integração entre o seu Elasticsearch e seu Kibana.

![kibana-verification-code](kibana-verification-code.png)

Utilize o comando de log do docker para exibir o seu código de verificação que foi gerado pelo Kibana:

```bash
docker logs Kibana
```

Quando for fornecido o código de verificação o Kibana fará a conclusão das configurações e sua integração com o Elasticsearch.

![Kibana-setup](kibana-setup.png)

Quando o Kibana concluir sua configuração será solicitado o login.

![Kibana-login](kibana-login.png)

O usuário padrão será o `elastic` e a senha desse usuário é a senha que foi gerada anteriormente no container do Elasticsearch junto com o Token.

Essa será a Home do Kibana.

![Kibana-home](kibana-home.png)

### Gerando API Key do Elasticsearch

No menu lateral vá em `Search` e na opção de `Overview`.

![Kibana-search](kibana-search.png)

Na Home de Search a primeira opção que aparecerá é o endpoint do Elasticsearch e logo abaixo dele terá um botão chamado `New`.

![Kibana-search-home](kibana-search-home.png)

Após clicar no botão irá aparecer algumas configurações possíveis para criar a sua API Key do Elasticsearch, quando terminar as configurações que desejar, vá no botão `Create API Key`.

![Kibana-search-create-key](kibana-search-create-key.png)

Irá aparecer os dados da sua API Key, mas o valor que terá que salvar no seu arquivo `.env` é o campo `encoded` que é a sua key.

![Kibana-generated-api-key](kibana-generated-api-key.png)

## Prisma

Para o Prisma reconhecer o banco de dados é necessário adicionar a URL do banco no arquivo `.env`, por exemplo: 

```env
DATABASE_URL="postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample"
```

Estrutura da URL do banco de dados: 

![database-url](database_url.png)

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