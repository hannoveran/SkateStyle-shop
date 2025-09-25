
let searchComponent = null;

function initSearch() {
    if (!searchComponent) {
        searchComponent = new SearchComponent();
        
        window.toggleSearch = function(event) {
            event.preventDefault();
            document.body.classList.toggle('showSearch');
            
            if (document.body.classList.contains('showSearch')) {
                setTimeout(() => {
                    const searchInput = document.querySelector('#search');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 300);
            }
        };
        
        window.closeSearch = function() {
            document.body.classList.remove('showSearch');
            
            const searchInput = document.querySelector('#search');
            if (searchInput) {
                searchInput.value = '';
                const listSearch = document.querySelector('.listSearch');
                if (listSearch) {
                    listSearch.innerHTML = `
                        <div class="search-empty">
                            <p>Введіть запит для пошуку товарів</p>
                        </div>
                    `;
                }
            }
        };
    }
    
    return searchComponent;
}

function getSearchInstance() {
    return searchComponent || initSearch();
}

function quickSearch(query) {
    const search = getSearchInstance();
    if (search && search.openWithQuery) {
        search.openWithQuery(query);
    }
}

function searchByCategory(category) {
    const search = getSearchInstance();
    if (search && search.searchByCategory) {
        search.openSearch();
        setTimeout(() => {
            search.searchByCategory(category);
        }, 300);
    }
}

window.initSearch = initSearch;
window.getSearchInstance = getSearchInstance;
window.quickSearch = quickSearch;
window.searchByCategory = searchByCategory;


document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});