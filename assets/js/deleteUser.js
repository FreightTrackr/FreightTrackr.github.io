import { APIUsers } from "./endpoint.js"
import { deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.15.3/+esm'

export function deleteUser(username) {
    sweetalert2.fire({
        title: 'Are you sure?',
        text: `Do you want to delete user ${username}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const tokenkey = "Authorization";
            let tokenvalue = getCookie(tokenkey);
            const datajson = { username };
            deleteJSON(APIUsers, tokenkey, `Bearer ${tokenvalue}`, datajson, (response) => {
                if (response.status === 200) {
                    sweetalert2.fire(
                        'Deleted!',
                        `User ${username} has been deleted.`,
                        'success'
                    ).then(() => {
                        window.location.reload();
                    });
                } else {
                    sweetalert2.fire(
                        'Error!',
                        `Failed to delete user ${username}: ${response.data.message}`,
                        'error'
                    );
                }
            });
        }
    });
}