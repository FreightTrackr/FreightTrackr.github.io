export function setupPagination(containerId, total, limit) {
    const paginationElement = document.getElementById(containerId);
    if (!paginationElement) {
        console.log(`Element with ID "${containerId}" not found.`);
        return;
    }

    const totalPages = Math.ceil(total / limit);
    const currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
    const allPages = generatePagination(currentPage, totalPages);

    paginationElement.innerHTML = ''; // Clear any existing pagination elements
    paginationElement.appendChild(createPaginationArrow('first', createPageURL(1), currentPage <= 1));
    paginationElement.appendChild(createPaginationArrow('left', createPageURL(currentPage - 1), currentPage <= 1));

    allPages.forEach(page => {
        const isActive = currentPage === page;
        paginationElement.appendChild(createPaginationNumber(page, createPageURL(page), isActive));
    });

    paginationElement.appendChild(createPaginationArrow('right', createPageURL(currentPage + 1), currentPage >= totalPages));
    paginationElement.appendChild(createPaginationArrow('last', createPageURL(totalPages), currentPage >= totalPages));
}

export function generatePagination(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
        return Array.from({ length: Math.min(7, totalPages) }, (_, i) => i + 1);
    }

    if (currentPage > totalPages - 4) {
        return Array.from({ length: 7 }, (_, i) => totalPages - 6 + i);
    }

    return Array.from({ length: 7 }, (_, i) => currentPage - 3 + i);
}

export function createPageURL(pageNumber) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNumber);
    return `${window.location.pathname}?${params.toString()}`;
}

export function createPaginationArrow(direction, href, isDisabled) {
    const arrowContainer = document.createElement('li');
    const button = document.createElement('button');
    button.classList.add('px-3', 'py-1', 'rounded-md', 'focus:outline-none', 'focus:shadow-outline-purple');

    if (isDisabled) {
        button.classList.add('pointer-events-none', 'text-gray-300');
    } else {
        button.classList.add('hover:bg-gray-100');
    }

    let icon;
    switch (direction) {
        case 'left':
            icon = '<';  // You can replace this with actual icons
            break;
        case 'right':
            icon = '>';
            break;
        case 'first':
            icon = '<<';
            break;
        case 'last':
            icon = '>>';
            break;
    }

    button.innerText = icon;

    if (!isDisabled) {
        button.addEventListener('click', () => {
            window.location.href = href;
        });
    }

    arrowContainer.appendChild(button);
    return arrowContainer;
}

export function createPaginationNumber(page, href, isActive) {
    const numberContainer = document.createElement('li');
    const button = document.createElement('button');
    button.classList.add('px-3', 'py-1', 'rounded-md', 'focus:outline-none', 'focus:shadow-outline-purple');

    if (isActive) {
        button.classList.add('text-white', 'bg-purple-600', 'border-purple-600');
    } else {
        button.classList.add('hover:bg-gray-100');
    }

    button.innerText = page;

    if (!isActive) {
        button.addEventListener('click', () => {
            window.location.href = href;
        });
    }

    numberContainer.appendChild(button);
    return numberContainer;
}