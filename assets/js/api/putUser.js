import { getValue } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIUsers } from "../endpoint.js"
import { putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/url.js";
import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.15.3/+esm'

export default function EditUser(){
    const button = document.getElementById("edit-user-button");
    button.disabled = true;
    button.classList.add("opacity-50", "cursor-not-allowed");
    button.classList.remove("active:bg-purple-600", "hover:bg-purple-700", "focus:shadow-outline-purple");
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const password = getValue("password");
    const confirmPassword = getValue("confirm_password");

    if (password !== confirmPassword) {
        console.error("Password dan Confirm Password tidak cocok.");
        sweetalert2.fire({
            title: 'Password Tidak Cocok!',
            text: "Pastikan password ada sama dengan confirm password",
            icon: 'error',
            confirmButtonText: 'Ok'
        }).then((resultAlert) => {
            if (resultAlert.isConfirmed) {
                button.disabled = false;
                button.classList.remove("opacity-50", "cursor-not-allowed");
                button.classList.add("active:bg-purple-600", "hover:bg-purple-700", "focus:shadow-outline-purple");
            }
        });
        return;
    }
    let selectedRole = document.querySelector('input[name="role"]:checked')?.value;
    let datajson = {
        "username": getValue("username"),
        "password": getValue("password"),
        "nama": getValue("nama"),
        "no_telp": getValue("no_telp"),
        "email": getValue("email"),
        "no_pend": getValue("no_pend"),
        "kode_pelanggan": getValue("kode_pelanggan"),
        "role": selectedRole
    }
    putJSON(APIUsers,tokenkey,"Bearer "+tokenvalue, datajson,responseFunction);
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
                redirect("/data-users"); 
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
    const button = document.getElementById("edit-user-button");
    button.disabled = false;
    button.classList.remove("opacity-50", "cursor-not-allowed");
    button.classList.add("active:bg-purple-600", "hover:bg-purple-700", "focus:shadow-outline-purple");
}