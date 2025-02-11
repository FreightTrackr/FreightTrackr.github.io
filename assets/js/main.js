import { toggleSidebar } from './sidebar.js';
import { toggleAccount } from './account.js';
import { AutofillForm } from './autofill.js';
import { onClickPreventDefault, redirectForm, redirectFormLacak } from './element.js';
import { deleteUser } from './deleteUser.js';
import { Logout } from './logout.js';
import Login from './api/login.js';
import Register from './api/register.js';
import EditUser from './api/putUser.js';
import GetUsers from './api/getUsers.js';
import GetTransaksi from './api/getTransaksi.js';
import ExportCSV from './api/exportcsv.js';
import GetProgressTotalBiaya from './api/getProgressTotalBiaya.js';
import GetVisualSLAPelanggan from './api/getVisualSLAPelanggan.js';
import GetVisualSLALayanan from './api/getVisualSLALayanan.js';
import GetVisualSLAAge from './api/getVisualSLAAge.js';
import GetVisualCODSetor from './api/getVisualCODSetor.js';
import GetTransaksiDetail from './api/getSatuTransaksi.js';
import GetLacak from './api/getLacak.js';
import GetKantor from './api/getKantor.js';
import GetPelanggan from './api/getPelanggan.js';
import { container, runAfterDOM, onClick } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";

window.Logout = Logout;
window.deleteUser = deleteUser;

runAfterDOM(EffectButton);

function EffectButton(){
    const loginButton = container('login-button');
    const registerButton = container('register-button');
    const editUserButton = container('edit-user-button');
    const toggleButton = container('toggle-button');
    const accountButton = container('account-button');
    const tableUsers = container('table-users');
    const tableTransaksi = container('table-transaksi');
    const tableKantor = container('table-kantor');
    const tablePelanggan = container('table-pelanggan');
    const formUser = container('form-user');
    const logoutButton = container('logout-button');
    const tableDetail = container('transaksi-detail');
    const lacakButton = container('lacak-button');

    if (loginButton) {
        onClick("login-button", Login);
    } else {
        console.log('Element with ID "login-button" not found.');
    }
    
    if (registerButton) {
        onClick("register-button", Register);
    } else {
        console.log('Element with ID "register-button" not found.');
    }

    if (editUserButton) {
        onClick("edit-user-button", EditUser);
    } else {
        console.log('Element with ID "edit-user-button" not found.');
    }

    if (toggleButton) {
        onClick("toggle-button", toggleSidebar);
    } else {
        console.log('Element with ID "toggle-button" not found.');
    }

    if (accountButton) {
        onClick("account-button", toggleAccount);
    } else {
        console.log('Element with ID "account-button" not found.');
    }

    if (logoutButton) {
        onClick("logout-button", Logout);
    } else {
        console.log('Element with ID "logout-button" not found.');
    }

    if (lacakButton) {
        AutofillForm();
        redirectFormLacak();
        GetLacak();
    } else {
        console.log('Element with ID "logout-button" not found.');
    }
    
    if (tableUsers) {
        GetUsers();
    }
    if (tableTransaksi) {
        GetTransaksi();
        AutofillForm();
        redirectForm();
        onClickPreventDefault("export-csv", ExportCSV)
        onClickPreventDefault("tampilkan-pendapatan", GetProgressTotalBiaya)
        onClickPreventDefault("tampilkan-swp-pelanggan", GetVisualSLAPelanggan)
        onClickPreventDefault("tampilkan-swp-layanan", GetVisualSLALayanan)
        onClickPreventDefault("tampilkan-sla-age", GetVisualSLAAge)
        onClickPreventDefault("tampilkan-cod-setor", GetVisualCODSetor)
    }
    if (tableDetail) {
        GetTransaksiDetail();
    }
    if (tableKantor) {
        GetKantor();
    }
    if (tablePelanggan) {
        GetPelanggan();
    }
    if (formUser) {
        AutofillForm();
    }
}