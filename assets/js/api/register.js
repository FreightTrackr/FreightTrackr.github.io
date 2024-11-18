import { getValue } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/url.js";
import { APIRegister } from "../endpoint.js"
import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function Register(){
    const tokenkey = "Authorization"
    let tokenvalue = getCookie(tokenkey)
    let datajson = {
        "username": getValue("username"),
        "password": getValue("password"),
        "nama": getValue("nama"),
        "no_telp": getValue("no_telp"),
        "email": getValue("email"),
        "role": getValue("role")
    }
    postJSON(APIRegister,tokenkey,"Bearer "+tokenvalue,datajson,responseFunction);
}

function responseFunction(result) {
    if (result.status == 200) {
        alert(result.data.message);
        redirect("../login"); 
    } else {
        alert(result.data.message);
    }
}