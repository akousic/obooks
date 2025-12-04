// ===================================
// Main Application Logic
// ===================================

class OBooksApp {
    constructor() {
        this.currentView = 'library';
        this.currentBook = null;
        this.currentPage = 1;
        this.selectedTemplate = null;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('OBooksApp initializing...');
        
        // Hide splash screen after 2.5 seconds
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            const mainApp = document.getElementById('main-app');
            console.log('Hiding splash screen');
            if (splash) splash.style.display = 'none';
            if (mainApp) mainApp.classList.remove('hidden');
        }, 2500);

        // Create sample books if none exist
        console.log('Checking for existing books...');
        const books = Storage.getBooks();
        console.log('Books found:', books.length);
        
        if (books.length === 0) {
            console.log('No books found, creating sample books...');
            Storage.createSampleBooks();
            const newBooks = Storage.getBooks();
            console.log('Sample books created:', newBooks.length);
        }

        // Initialize views
        console.log('Initializing views...');
        this.initLibraryView();
        this.initTemplateView();
        this.initBookViewer();
        this.initPageEditor();
        
        // Set up navigation
        this.setupNavigation();
        
        // Load library view
        console.log('Loading library view...');
        this.loadLibraryView();
        console.log('OBooksApp initialization complete');
    }

    /**
     * Set up navigation handlers
     */
    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
                
                // Update active nav button
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Switch between views
     */
    switchView(viewName) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }
    }

    /**
     * Initialize library view
     */
    initLibraryView() {
        // Create book button - opens drawer
        const fabBtn = document.getElementById('create-book-btn');
        console.log('FAB button found:', fabBtn);
        
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                console.log('FAB clicked! Opening drawer...');
                this.openDrawer();
            });
        } else {
            console.error('FAB button not found!');
        }

        // Sort functionality
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.loadLibraryView(e.target.value);
            });
        }
    }

    /**
     * Load library view with books
     */
    loadLibraryView(sortBy = 'recent') {
        console.log('loadLibraryView called with sortBy:', sortBy);
        const booksGrid = document.getElementById('books-grid');
        console.log('Books grid element:', booksGrid);
        
        if (!booksGrid) {
            console.error('Books grid element not found!');
            return;
        }
        
        booksGrid.innerHTML = '';
        
        let books = Storage.getBooks();
        console.log('Books to display:', books);
        
        // Sort books
        switch(sortBy) {
            case 'alphabetical':
                books.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'created':
                books.sort((a, b) => b.createdAt - a.createdAt);
                break;
            default: // recent
                books.sort((a, b) => b.updatedAt - a.updatedAt);
        }
        
        // Create book cards
        books.forEach(book => {
            console.log('Creating card for book:', book.title);
            const card = Components.createBookCard(book);
            booksGrid.appendChild(card);
        });
        
        // Add empty state if no books
        if (books.length === 0) {
            console.log('No books, showing empty state');
            booksGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl);">
                    <h3 style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">
                        No books yet
                    </h3>
                    <p style="color: var(--color-text-tertiary);">
                        Click the + button to create your first book
                    </p>
                </div>
            `;
        }
        
        console.log('loadLibraryView complete, books rendered:', books.length);
    }

    /**
     * Initialize template drawer
     */
    initTemplateView() {
        const drawer = document.getElementById('template-drawer');
        
        // Close button
        document.getElementById('drawer-close-btn').addEventListener('click', () => {
            this.closeDrawer();
        });

        // Cancel button
        document.getElementById('drawer-cancel-btn').addEventListener('click', () => {
            this.closeDrawer();
        });

        // Continue button - shows book details modal
        document.getElementById('drawer-continue-btn').addEventListener('click', () => {
            this.showBookDetailsModal();
        });

        // Click outside to close
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) {
                this.closeDrawer();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                this.closeDrawer();
            }
        });
    }

    /**
     * Open template drawer
     */
    openDrawer() {
        console.log('openDrawer called');
        const drawer = document.getElementById('template-drawer');
        console.log('Drawer element:', drawer);
        
        if (!drawer) {
            console.error('Drawer element not found!');
            return;
        }
        
        const templateList = document.getElementById('template-list');
        console.log('Template list:', templateList);
        templateList.innerHTML = '';
        
        const templates = Storage.getTemplates();
        console.log('Templates:', templates);
        
        templates.forEach(template => {
            const item = Components.createTemplateItem(template);
            templateList.appendChild(item);
        });
        
        // Select first template by default
        if (templates.length > 0) {
            this.selectedTemplate = templates[0];
            templateList.firstChild.classList.add('selected');
        }

        // Show drawer
        console.log('Adding active class to drawer');
        drawer.classList.add('active');
        console.log('Drawer classes:', drawer.className);
    }

    /**
     * Close template drawer
     */
    closeDrawer() {
        const drawer = document.getElementById('template-drawer');
        drawer.classList.remove('active');
    }

    /**
     * Show book details modal
     */
    showBookDetailsModal() {
        if (!this.selectedTemplate) {
            Components.showToast('Please select a template', 'error');
            return;
        }

        // Check if premium template
        if (this.selectedTemplate.isPremium) {
            Components.showToast('Premium templates require upgrade', 'warning');
            return;
        }

        const modalContent = `
            <div style="margin-bottom: var(--space-lg);">
                <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-surface); border-radius: var(--border-radius-md); margin-bottom: var(--space-lg);">
                    <div style="width: 48px; height: 48px; background: var(--color-bg-primary); border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center;">
                        ${Components.getTemplateIcon(this.selectedTemplate.type)}
                    </div>
                    <div>
                        <div style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">${this.selectedTemplate.name}</div>
                        <div style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${this.selectedTemplate.description}</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="modal-book-title" style="display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-secondary); margin-bottom: var(--space-sm);">Book Title</label>
                    <input type="text" id="modal-book-title" class="input" placeholder="My Awesome Book" style="width: 100%; padding: var(--space-md); background: var(--color-surface); border: 1px solid transparent; border-radius: var(--border-radius-md); color: var(--color-text-primary); font-size: var(--font-size-base);">
                </div>
                
                <div class="form-group" style="margin-top: var(--space-lg);">
                    <label for="modal-page-count" style="display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-secondary); margin-bottom: var(--space-sm);">Number of Pages</label>
                    <select id="modal-page-count" class="input" style="width: 100%; padding: var(--space-md); background: var(--color-surface); border: 1px solid transparent; border-radius: var(--border-radius-md); color: var(--color-text-primary); font-size: var(--font-size-base); cursor: pointer;">
                        <option value="20">20 pages</option>
                        <option value="50" selected>50 pages</option>
                        <option value="100">100 pages</option>
                        <option value="150">150 pages</option>
                        <option value="200">200 pages</option>
                    </select>
                </div>
            </div>
        `;

        const modal = Components.createModal(
            'Book Details',
            modalContent,
            [
                {
                    text: 'Cancel',
                    className: 'btn btn-secondary',
                    onClick: () => {}
                },
                {
                    text: 'Create Book',
                    className: 'btn btn-primary',
                    onClick: () => this.createNewBook()
                }
            ]
        );

        document.getElementById('modal-container').appendChild(modal);

        // Focus title input after modal appears
        setTimeout(() => {
            const titleInput = document.getElementById('modal-book-title');
            if (titleInput) titleInput.focus();
        }, 100);
    }

    /**
     * Create new book
     */
    createNewBook() {
        const title = document.getElementById('modal-book-title').value.trim();
        const pageCount = parseInt(document.getElementById('modal-page-count').value);
        
        if (!title) {
            Components.showToast('Please enter a book title', 'error');
            return;
        }
        
        const newBook = Storage.createBook(title, this.selectedTemplate.id, pageCount);
        
        Components.showToast('✨ Book created successfully!', 'success');
        
        // Close drawer
        this.closeDrawer();
        
        // Refresh library
        this.loadLibraryView();
    }

    /**
     * Open a book
     */
    openBook(bookId) {
        const book = Storage.getBook(bookId);
        if (!book) return;
        
        this.currentBook = book;
        this.currentPage = book.currentPage || 1;
        
        this.switchView('book-viewer');
        this.loadBookViewer();
    }

    /**
     * Initialize book viewer
     */
    initBookViewer() {
        // Back button
        document.getElementById('viewer-back-btn').addEventListener('click', () => {
            this.switchView('library');
            this.currentBook = null;
        });

        // Edit button
        document.getElementById('edit-page-btn').addEventListener('click', () => {
            this.openPageEditor();
        });

        // Navigation buttons
        document.getElementById('prev-page-btn').addEventListener('click', () => {
            this.navigatePages(-2);
        });

        document.getElementById('next-page-btn').addEventListener('click', () => {
            this.navigatePages(2);
        });

        // Table of contents button
        document.getElementById('toc-btn').addEventListener('click', () => {
            this.showTableOfContents();
        });
    }

    /**
     * Load book viewer
     */
    loadBookViewer() {
        if (!this.currentBook) return;
        
        // Update title
        document.getElementById('viewer-book-title').textContent = this.currentBook.title;
        
        // Load pages (showing 2-page spread)
        const leftPageNum = this.currentPage % 2 === 0 ? this.currentPage : this.currentPage + 1;
        const rightPageNum = leftPageNum + 1;
        
        this.loadPage('left-page', leftPageNum);
        this.loadPage('right-page', rightPageNum);
        
        // Update page indicator
        document.getElementById('page-indicator').textContent = 
            `Pages ${leftPageNum}-${rightPageNum} of ${this.currentBook.pageCount}`;
        
        // Update page numbers
        document.querySelectorAll('.page-number')[0].textContent = leftPageNum;
        document.querySelectorAll('.page-number')[1].textContent = rightPageNum;
        
        // Disable prev/next buttons at boundaries
        document.getElementById('prev-page-btn').disabled = leftPageNum <= 2;
        document.getElementById('next-page-btn').disabled = rightPageNum >= this.currentBook.pageCount;
    }

    /**
     * Load a single page
     */
    loadPage(elementId, pageNumber) {
        const pageElement = document.getElementById(elementId);
        const pageContent = pageElement.querySelector('.page-content');
        
        const page = Storage.getPage(this.currentBook.id, pageNumber);
        
        if (page && page.lines) {
            const content = page.lines.filter(line => line).join('<br>');
            pageContent.innerHTML = content || '<em style="color: #999;">Empty page</em>';
        } else {
            pageContent.innerHTML = '<em style="color: #999;">Empty page</em>';
        }
    }

    /**
     * Navigate pages
     */
    navigatePages(delta) {
        const newPage = this.currentPage + delta;
        
        if (newPage >= 1 && newPage <= this.currentBook.pageCount) {
            this.currentPage = newPage;
            Storage.updateBook(this.currentBook.id, { currentPage: newPage });
            this.loadBookViewer();
        }
    }

    /**
     * Show table of contents
     */
    showTableOfContents() {
        const modal = Components.createModal(
            'Table of Contents',
            '<p style="color: var(--color-text-secondary);">Table of contents will be automatically generated from H1, H2, and H3 headings in your book.</p><p style="color: var(--color-text-tertiary); margin-top: var(--space-md);">Start adding headings to see them here!</p>',
            [
                {
                    text: 'Close',
                    className: 'btn btn-primary',
                    onClick: () => {}
                }
            ]
        );
        
        document.getElementById('modal-container').appendChild(modal);
    }

    /**
     * Initialize page editor
     */
    initPageEditor() {
        // Back button
        document.getElementById('editor-back-btn').addEventListener('click', () => {
            this.saveCurrentPage();
            this.switchView('book-viewer');
            this.loadBookViewer();
        });

        // Save button
        document.getElementById('save-page-btn').addEventListener('click', () => {
            this.saveCurrentPage();
            Components.showToast('Page saved!', 'success');
        });

        // Shortcuts help button
        document.getElementById('shortcuts-help-btn').addEventListener('click', () => {
            this.showShortcutsHelp();
        });

        // Toolbar buttons
        document.getElementById('insert-heading-btn').addEventListener('click', () => {
            this.insertBlock('heading');
        });

        document.getElementById('insert-table-btn').addEventListener('click', () => {
            this.insertBlock('table');
        });

        document.getElementById('insert-list-btn').addEventListener('click', () => {
            this.insertBlock('list');
        });

        document.getElementById('insert-image-btn').addEventListener('click', () => {
            Components.showToast('Image upload coming soon!', 'info');
        });
    }

    /**
     * Open page editor
     */
    openPageEditor() {
        this.switchView('page-editor');
        this.loadPageEditor();
    }

    /**
     * Load page editor
     */
    loadPageEditor() {
        if (!this.currentBook) return;
        
        // Update page info
        const pageNum = this.currentPage % 2 === 0 ? this.currentPage : this.currentPage + 1;
        document.getElementById('editor-page-info').textContent = 
            `Page ${pageNum} of ${this.currentBook.pageCount}`;
        
        // Load page lines
        const pageLines = document.getElementById('page-lines');
        pageLines.innerHTML = '';
        
        const linesContainer = Components.createPageLines(33);
        pageLines.appendChild(linesContainer);
        
        // Load existing content
        const page = Storage.getPage(this.currentBook.id, pageNum);
        if (page && page.lines) {
            const lines = pageLines.querySelectorAll('.page-line');
            page.lines.forEach((lineData, index) => {
                if (lines[index] && lineData) {
                    if (typeof lineData === 'string') {
                        // Simple text content
                        lines[index].textContent = lineData;
                    } else if (typeof lineData === 'object') {
                        // Complex content with formatting
                        lines[index].textContent = lineData.text || '';
                        if (lineData.blockType) {
                            lines[index].dataset.blockType = lineData.blockType;
                            if (lineData.blockType.startsWith('h')) {
                                const level = lineData.blockType.charAt(1);
                                lines[index].classList.add(`heading-${level}`);
                            }
                        }
                    }
                    
                    if (lines[index].textContent.trim()) {
                        lines[index].classList.add('has-content');
                    }
                }
            });
        }
        
        // Focus first line
        const firstLine = pageLines.querySelector('.page-line');
        if (firstLine) {
            setTimeout(() => firstLine.focus(), 100);
        }
    }

    /**
     * Save current page
     */
    saveCurrentPage() {
        if (!this.currentBook) return;
        
        const pageNum = this.currentPage % 2 === 0 ? this.currentPage : this.currentPage + 1;
        const lines = document.querySelectorAll('.page-line');
        
        const content = {
            lines: Array.from(lines).map(line => {
                const text = line.textContent.trim();
                const blockType = line.dataset.blockType;
                
                // If line has special formatting, save as object
                if (blockType || line.classList.contains('heading-1') || 
                    line.classList.contains('heading-2') || line.classList.contains('heading-3')) {
                    return {
                        text: text,
                        blockType: blockType || 
                                  (line.classList.contains('heading-1') ? 'h1' : 
                                   line.classList.contains('heading-2') ? 'h2' : 
                                   line.classList.contains('heading-3') ? 'h3' : null)
                    };
                }
                
                // Otherwise just save text
                return text;
            })
        };
        
        Storage.updatePage(this.currentBook.id, pageNum, content);
        
        // Update book's last modified time
        Storage.updateBook(this.currentBook.id, { updatedAt: Date.now() });
    }

    /**
     * Insert block
     */
    insertBlock(type) {
        const focusedLine = document.querySelector('.page-line:focus');
        if (!focusedLine) {
            Components.showToast('Please click on a line first', 'warning');
            return;
        }
        
        switch(type) {
            case 'heading':
                Components.insertHeading(focusedLine, 1);
                break;
            case 'table':
                Components.insertTable(focusedLine, 3, 3);
                break;
            case 'list':
                Components.insertList(focusedLine, 'bullet');
                break;
        }
    }

    /**
     * Show shortcuts help
     */
    showShortcutsHelp() {
        const shortcuts = `
            <div style="color: var(--color-text-secondary); line-height: 1.8;">
                <p style="margin-bottom: var(--space-lg);">Type these shortcuts at the start of a line followed by space:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);"><strong>H1</strong></td><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);">Large heading</td></tr>
                    <tr><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);"><strong>H2</strong></td><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);">Medium heading</td></tr>
                    <tr><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);"><strong>H3</strong></td><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);">Small heading</td></tr>
                    <tr><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);"><strong>T1</strong></td><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);">Insert table</td></tr>
                    <tr><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);"><strong>L1</strong></td><td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-surface);">Bulleted list</td></tr>
                    <tr><td style="padding: var(--space-sm);"><strong>L2</strong></td><td style="padding: var(--space-sm);">Numbered list</td></tr>
                </table>
            </div>
        `;
        
        const modal = Components.createModal(
            'Keyboard Shortcuts',
            shortcuts,
            [
                {
                    text: 'Got it!',
                    className: 'btn btn-primary',
                    onClick: () => {}
                }
            ]
        );
        
        document.getElementById('modal-container').appendChild(modal);
    }
}

// Initialize app immediately when script loads
console.log('=== APP.JS LOADED ===');
console.log('Creating OBooksApp instance...');

// Create app instance immediately
window.app = new OBooksApp();
console.log('App instance created:', window.app);

// Also initialize on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CONTENT LOADED ===');
    if (!window.app) {
        console.log('App not initialized yet, creating now...');
        window.app = new OBooksApp();
    } else {
        console.log('App already initialized');
    }
});

console.log('=== APP.JS SCRIPT END ===');
