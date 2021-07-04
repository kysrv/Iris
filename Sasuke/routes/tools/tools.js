const { default: axios } = require("axios");
const express = require("express");
const { jwtAuth } = require("../jwtAuth");
const router = express.Router();
const https = require("https");
const DiscordAccount = require("../../models/DiscordAccount");

router.use(jwtAuth)

const agent = new https.Agent({ rejectUnauthorized: false })


router.get("/email", async (req, res) => {
    let { data } = await axios.get("https://gpa.lu/?random", { httpsAgent: agent });
    data = data.split('<span class="text-truncate">')[1].split("</span>")[0]
    res.send({ email: data });

})

router.post("/discord", async (req, res) => {
    const { username, email, password, token, discriminator } = req.body;

    const account = await DiscordAccount.create({ username, email, password, token, discriminator });
    await account.save();

    return res.json(account);
})

router.post("/resolveDiscEmail", async (req, res) => {
    const { email } = req.body;
    // vérifier l'email pour empecher les injections !!!!!

    const { data: html1 } = await axios.get(
        `https://gpa.lu/${email}/`, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
    );

    let emailID;
    try {
        // * en premier lieu on récupère l'id du mail de discord dans la boite mail
        const a = `<iframe class="mail-iframe d-block w-100 rounded border-0" src="/${email}/`;
        const b = `?noheader`

        emailID = html1.split(a)[1].split(b)[0];

    } catch (err) {
        return res.json({ error: "no discord mail recieved" })
    }

    // * on récupère l'html du mail maintenant qu'on a son id
    const mailURL = `https://gpa.lu/${email}/${emailID}?noheader`
    const { data: html2 } = await axios.get(mailURL, { httpsAgent: agent });

    try {
        const a = '<td style="word-break:break-word;font-size:0px;padding:10px 25px;padding-top:20px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;" align="center" valign="middle" bgcolor="#5865f2"><a href="https://click.discord.com'
        const b = '" ';

        let link = "https://click.discord.com";
        link += html2.split(a)[1].split('"')[0];
        // return res.json(link);

        const response = await axios.get(link);
        // console.log(response)
        return res.json(response.request.res.responseUrl.split("token=")[1])

    } catch (err) {
        return res.json({ html2 })
    }

})




module.exports = router;
