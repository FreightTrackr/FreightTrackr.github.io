import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksiVisual } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetTransaksiVisual(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);

    getJSON(APITransaksiVisual,tokenkey,"Bearer "+tokenvalue,responseFunction);
}