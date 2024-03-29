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

### Setup DB

You need to enable Replication on your mongo db

On Debian/Ubuntu:

- add this to mongod.conf

```
replication:
   replSetName: rs0
```

-restart mongod
`service mongod restart`
-run a mongo shell and turn on replication
`rs.initiate()`

### Turn on https

Put your RSA private key in `Sasuke/ssl/privkey.pem`<br/>
and your SSL certificate in `Sasuke/ssl/fullchain.pem` (you can get one free with letsencrypt)

### Configure your server

ex:

```
# create /Sasuke/.env

# mongodb connection url
DB_URL=mongodb://127.0.0.1:27017/Iris

# jswon web token's secret key
JWT_SECRET=putalongrandomlygeneratedstringthere

# running port
HTTPS_PORT=443
HTTP_PORT=80
```

#### Install required dependencies

Linux: `sudo sh install.sh`
Windows: `install.sh`

### Build client and run server

Linux: `sudo sh start.sh`
Windows: `start.sh`
