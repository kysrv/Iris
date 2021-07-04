# Iris Messenger

## Preview

<img src="https://cdn.discordapp.com/attachments/776612332507496460/861294678897066084/unknown.png"/>

## Structure

| Codebase |       Description       |
| :------- | :---------------------: |
| Batman   |    (React) Front-end    |
| Sasuke   | (express & ws) Back-end |

## How to setup build & run

### Requirement:

- Nodejs
- A MongoDB

### Turn on https

your RSA private key in `Sasuke/ssl/privkey.pem`<br/>
and your SSL certificate in `Sasuke/ssl/fullchain.pem` (you can get one free with letsencrypt)

### Config your server running port and DB url in /Sasuke/.env

ex:

```
DB_URL=mongodb://127.0.0.1:27017/Iris
JWT_SECRET=putalongrandomstringthere
port=443
```

#### Install requiered dependencies

`install.sh`

### Build client and run server

`start.sh`
