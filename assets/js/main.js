import { toggleSidebar } from './sidebar.js';
import { toggleAccount } from './account.js';

document.getElementById('toggle-button').addEventListener('click', toggleSidebar);
document.getElementById('account-button').addEventListener('click', toggleAccount);