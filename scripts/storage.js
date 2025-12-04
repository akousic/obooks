// ===================================
// Local Storage Module
// ===================================

const Storage = {
    /**
     * Initialize storage with default data
     */
    init() {
        if (!localStorage.getItem('obooks_data')) {
            const defaultData = {
                books: [],
                templates: this.getDefaultTemplates(),
                settings: {
                    defaultTemplate: 'ruled',
                    defaultPageCount: 50,
                    theme: 'dark'
                }
            };
            localStorage.setItem('obooks_data', JSON.stringify(defaultData));
        }
    },

    /**
     * Get all data
     */
    getData() {
        const data = localStorage.getItem('obooks_data');
        return data ? JSON.parse(data) : null;
    },

    /**
     * Save all data
     */
    saveData(data) {
        localStorage.setItem('obooks_data', JSON.stringify(data));
    },

    /**
     * Get all books
     */
    getBooks() {
        const data = this.getData();
        return data ? data.books : [];
    },

    /**
     * Get book by ID
     */
    getBook(id) {
        const books = this.getBooks();
        return books.find(book => book.id === id);
    },

    /**
     * Create new book
     */
    createBook(title, templateId, pageCount) {
        const data = this.getData();
        const newBook = {
            id: Date.now(),
            title: title || 'Untitled Book',
            templateId: templateId || 'ruled',
            pageCount: pageCount || 50,
            currentPage: 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            pages: this.createEmptyPages(pageCount)
        };
        
        data.books.push(newBook);
        this.saveData(data);
        return newBook;
    },

    /**
     * Update book
     */
    updateBook(id, updates) {
        const data = this.getData();
        const bookIndex = data.books.findIndex(book => book.id === id);
        
        if (bookIndex !== -1) {
            data.books[bookIndex] = {
                ...data.books[bookIndex],
                ...updates,
                updatedAt: Date.now()
            };
            this.saveData(data);
            return data.books[bookIndex];
        }
        return null;
    },

    /**
     * Delete book
     */
    deleteBook(id) {
        const data = this.getData();
        data.books = data.books.filter(book => book.id !== id);
        this.saveData(data);
    },

    /**
     * Create empty pages
     */
    createEmptyPages(count) {
        const pages = [];
        for (let i = 1; i <= count; i++) {
            pages.push({
                pageNumber: i,
                lines: Array(33).fill(''),
                blocks: []
            });
        }
        return pages;
    },

    /**
     * Get page content
     */
    getPage(bookId, pageNumber) {
        const book = this.getBook(bookId);
        if (book && book.pages) {
            return book.pages.find(page => page.pageNumber === pageNumber);
        }
        return null;
    },

    /**
     * Update page content
     */
    updatePage(bookId, pageNumber, content) {
        const book = this.getBook(bookId);
        if (book && book.pages) {
            const pageIndex = book.pages.findIndex(page => page.pageNumber === pageNumber);
            if (pageIndex !== -1) {
                book.pages[pageIndex] = {
                    ...book.pages[pageIndex],
                    ...content
                };
                this.updateBook(bookId, { pages: book.pages });
            }
        }
    },

    /**
     * Get default templates
     */
    getDefaultTemplates() {
        return [
            {
                id: 'ruled',
                name: 'Ruled',
                type: 'ruled',
                isPremium: false,
                description: 'Classic lined paper'
            },
            {
                id: 'grid',
                name: 'Grid',
                type: 'grid',
                isPremium: false,
                description: 'Perfect for diagrams and sketches'
            },
            {
                id: 'dot',
                name: 'Dot Grid',
                type: 'dot',
                isPremium: false,
                description: 'Subtle dots for flexible layouts'
            },
            {
                id: 'unruled',
                name: 'Blank',
                type: 'unruled',
                isPremium: false,
                description: 'Clean blank pages'
            },
            {
                id: 'study',
                name: 'Study Notes',
                type: 'ruled',
                isPremium: true,
                description: 'Optimized for note-taking'
            },
            {
                id: 'diary',
                name: 'Diary',
                type: 'ruled',
                isPremium: true,
                description: 'Personal journal layout'
            }
        ];
    },

    /**
     * Get templates
     */
    getTemplates() {
        const data = this.getData();
        return data ? data.templates : this.getDefaultTemplates();
    },

    /**
     * Get settings
     */
    getSettings() {
        const data = this.getData();
        return data ? data.settings : {};
    },

    /**
     * Update settings
     */
    updateSettings(settings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        this.saveData(data);
    },

    /**
     * Create sample books for demo
     */
    createSampleBooks() {
        const sampleBooks = [
            {
                title: 'My Journal',
                templateId: 'ruled',
                pageCount: 50
            },
            {
                title: 'Study Notes',
                templateId: 'grid',
                pageCount: 100
            },
            {
                title: 'Project Ideas',
                templateId: 'dot',
                pageCount: 50
            }
        ];

        sampleBooks.forEach(book => {
            this.createBook(book.title, book.templateId, book.pageCount);
        });
    }
};

// Initialize storage
Storage.init();

// Export for use in other modules
window.Storage = Storage;
