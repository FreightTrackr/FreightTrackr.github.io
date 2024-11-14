export function toggleSidebar() {
    document.querySelector('.side').classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
}