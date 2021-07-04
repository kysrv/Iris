import axios from "axios"
import API from "../API";


const getChannels = async () => {
    const { data: channels } = await API.get("/channels/@me");
    return channels;
}







export default { getChannels }