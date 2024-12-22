import { deleteCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/url.js";
export function Logout(){
    deleteCookie("Authorization");
    redirect("../login");
}