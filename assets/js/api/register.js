import { getValue } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/url.js";
import { APIRegister } from "../endpoint.js"
import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.15.3/+esm'

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
        sweetalert2.fire({
            title: 'Success!',
            text: result.data.message,
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then((resultAlert) => {
            if (resultAlert.isConfirmed) {
                redirect("../login"); 
            }
        });
    } else {
        sweetalert2.fire({
            title: 'Info!',
            text: result.data.message,
            icon: 'info',
            confirmButtonText: 'Ok'
        })
    }
}