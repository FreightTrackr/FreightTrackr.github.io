import { toggleSidebar } from './sidebar.js';
import { toggleAccount } from './account.js';
import Login from './api/login.js';
import Register from './api/register.js';
import GetUsers from './api/getUsers.js';
import GetTransaksi from './api/getTransaksi.js';
import GetKantor from './api/getKantor.js';
import GetPelanggan from './api/getPelanggan.js';
import { container, runAfterDOM, onClick } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";

runAfterDOM(EffectButton);

function EffectButton(){
    const loginButton = container('login-button');
    const registerButton = container('register-button');
    const toggleButton = container('toggle-button');
    const accountButton = container('account-button');
    const cariTransaksiButton = container('cari-transaksi');
    const tableUsers = container('table-users');
    const tableKantor = container('table-kantor');
    const tablePelanggan = container('table-pelanggan');

    if (loginButton) {
        onClick("login-button", Login)
    } else {
        console.log('Element with ID "login-button" not found.');
    }
    
    if (registerButton) {
        onClick("register-button", Register)
    } else {
        console.log('Element with ID "register-button" not found.');
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    } else {
        console.log('Element with ID "toggle-button" not found.');
    }

    if (accountButton) {
        accountButton.addEventListener('click', toggleAccount);
    } else {
        console.log('Element with ID "account-button" not found.');
    }

    if (cariTransaksiButton) {
        cariTransaksiButton.addEventListener('click', GetTransaksi);
    } else {
        console.log('Element with ID "cari-transaksi" not found.');
    }

    if (tableUsers) {
        GetUsers();
    }
    if (tableKantor) {
        GetKantor();
    }
    if (tablePelanggan) {
        GetPelanggan();
    }
}