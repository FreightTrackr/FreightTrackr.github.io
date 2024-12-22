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
    const arrowContainer = document.createElement('button');
    arrowContainer.classList.add('pagination-button');
    
    if (isDisabled) {
        arrowContainer.classList.add('pointer-events-none', 'text-gray-300');
    } else {
        arrowContainer.classList.add('hover:bg-gray-100');
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

    if (isDisabled) {
        arrowContainer.innerText = icon;
    } else {
        const link = document.createElement('a');
        link.href = href;
        link.innerText = icon;
        arrowContainer.appendChild(link);
    }
    
    return arrowContainer;
}

export function createPaginationNumber(page, href, isActive) {
    const numberContainer = document.createElement('button');
    numberContainer.classList.add('pagination-button');
    
    if (isActive) {
        numberContainer.classList.add('z-10', 'bg-blue-600', 'border-blue-600', 'text-white');
    } else {
        numberContainer.classList.add('hover:bg-gray-100');
    }

    const link = document.createElement('a');
    link.href = href;
    link.innerText = page;

    if (!isActive) {
        numberContainer.appendChild(link);
    } else {
        numberContainer.innerText = page;
    }

    return numberContainer;
}