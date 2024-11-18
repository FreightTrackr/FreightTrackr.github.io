import { getValue } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";
import { setCookieWithExpireHour } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/url.js";
import { APILogin } from "../endpoint.js"
import { postBiasa } from "../api.js";

export default function Login(){
    let datajson = {
        "username": getValue("username"),
        "password": getValue("password")
    }
    postBiasa(APILogin,datajson,responseFunction);
}

function responseFunction(result) {
    if (result.status == 200) {
        alert(result.data.message);
        setCookieWithExpireHour("Authorization", result.data.token, 2);
        redirect("../"); 
    } else {
        alert(result.data.message);
    }
}