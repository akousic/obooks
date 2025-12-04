// ===================================
// Reusable Components Module
// ===================================

const Components = {
    /**
     * Create a book card component
     */
    createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.bookId = book.id;
        
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        ];
        
        const gradient = gradients[book.id % gradients.length];
        
        card.innerHTML = `
            <div class="book-cover" style="background: ${gradient}">
                <h3 class="book-cover-title">${book.title}</h3>
            </div>
            <div class="book-info">
                <h4 class="book-title">${book.title}</h4>
                <div class="book-meta">
                    <span>${book.pageCount} pages</span>
                    <span>${this.formatDate(book.updatedAt)}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.app.openBook(book.id);
        });
        
        return card;
    },

    /**
     * Create a template card component
     */
    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.dataset.templateId = template.id;
        
        card.innerHTML = `
            <div class="template-preview">
                ${this.getTemplatePreview(template.type)}
            </div>
            <div class="template-name">${template.name}</div>
            ${template.isPremium ? '<span class="template-badge">👑 Premium</span>' : ''}
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            window.app.selectedTemplate = template;
        });
        
        return card;
    },

    /**
     * Create a template item for drawer (list style)
     */
    createTemplateItem(template) {
        const item = document.createElement('div');
        item.className = 'template-item';
        item.dataset.templateId = template.id;
        
        item.innerHTML = `
            <div class="template-icon">
                ${this.getTemplateIcon(template.type)}
            </div>
            <div class="template-info">
                <div class="template-item-name">
                    ${template.name}
                    ${template.isPremium ? '<span class="template-badge">👑 Premium</span>' : ''}
                </div>
                <div class="template-item-desc">${template.description}</div>
            </div>
            <div class="template-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        `;
        
        item.addEventListener('click', () => {
            document.querySelectorAll('.template-item').forEach(c => c.classList.remove('selected'));
            item.classList.add('selected');
            window.app.selectedTemplate = template;
        });
        
        return item;
    },

    /**
     * Get icon for template type (smaller, for drawer)
     */
    getTemplateIcon(type) {
        const icons = {
            ruled: `
                <svg width="32" height="32" viewBox="0 0 32 32">
                    <line x1="4" y1="8" x2="28" y2="8" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="4" y1="14" x2="28" y2="14" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="4" y1="20" x2="28" y2="20" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="4" y1="26" x2="28" y2="26" stroke="#667eea" stroke-width="1.5"/>
                </svg>
            `,
            grid: `
                <svg width="32" height="32" viewBox="0 0 32 32">
                    <line x1="8" y1="4" x2="8" y2="28" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="16" y1="4" x2="16" y2="28" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="24" y1="4" x2="24" y2="28" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="4" y1="8" x2="28" y2="8" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="4" y1="16" x2="28" y2="16" stroke="#667eea" stroke-width="1.5"/>
                    <line x1="4" y1="24" x2="28" y2="24" stroke="#667eea" stroke-width="1.5"/>
                </svg>
            `,
            dot: `
                <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="8" cy="8" r="1.5" fill="#667eea"/>
                    <circle cx="16" cy="8" r="1.5" fill="#667eea"/>
                    <circle cx="24" cy="8" r="1.5" fill="#667eea"/>
                    <circle cx="8" cy="16" r="1.5" fill="#667eea"/>
                    <circle cx="16" cy="16" r="1.5" fill="#667eea"/>
                    <circle cx="24" cy="16" r="1.5" fill="#667eea"/>
                    <circle cx="8" cy="24" r="1.5" fill="#667eea"/>
                    <circle cx="16" cy="24" r="1.5" fill="#667eea"/>
                    <circle cx="24" cy="24" r="1.5" fill="#667eea"/>
                </svg>
            `,
            unruled: `
                <svg width="32" height="32" viewBox="0 0 32 32">
                    <rect x="4" y="4" width="24" height="24" fill="none" stroke="#667eea" stroke-width="1.5" rx="2"/>
                </svg>
            `
        };
        
        return icons[type] || icons.ruled;
    },

    /**
     * Get SVG preview for template type
     */
    getTemplatePreview(type) {
        const previews = {
            ruled: `
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                    <line x1="20" y1="40" x2="180" y2="40" stroke="#667eea" stroke-width="1" opacity="0.3"/>
                    <line x1="20" y1="60" x2="180" y2="60" stroke="#667eea" stroke-width="1" opacity="0.3"/>
                    <line x1="20" y1="80" x2="180" y2="80" stroke="#667eea" stroke-width="1" opacity="0.3"/>
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#667eea" stroke-width="1" opacity="0.3"/>
                    <line x1="20" y1="120" x2="180" y2="120" stroke="#667eea" stroke-width="1" opacity="0.3"/>
                    <line x1="20" y1="140" x2="180" y2="140" stroke="#667eea" stroke-width="1" opacity="0.3"/>
                    <line x1="20" y1="160" x2="180" y2="160" stroke="#667eea" stroke-width="1" opacity="0.3"/>
                </svg>
            `,
            grid: `
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                    ${Array.from({length: 8}, (_, i) => 
                        `<line x1="20" y1="${40 + i * 20}" x2="180" y2="${40 + i * 20}" stroke="#667eea" stroke-width="1" opacity="0.2"/>`
                    ).join('')}
                    ${Array.from({length: 8}, (_, i) => 
                        `<line x1="${20 + i * 20}" y1="40" x2="${20 + i * 20}" y2="180" stroke="#667eea" stroke-width="1" opacity="0.2"/>`
                    ).join('')}
                </svg>
            `,
            dot: `
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                    ${Array.from({length: 8}, (_, i) => 
                        Array.from({length: 8}, (_, j) => 
                            `<circle cx="${20 + j * 20}" cy="${40 + i * 20}" r="1.5" fill="#667eea" opacity="0.3"/>`
                        ).join('')
                    ).join('')}
                </svg>
            `,
            unruled: `
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                    <rect x="20" y="40" width="160" height="120" fill="none" stroke="#667eea" stroke-width="1" opacity="0.2"/>
                </svg>
            `
        };
        
        return previews[type] || previews.ruled;
    },

    /**
     * Create a modal component
     */
    createModal(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 480px;
            max-width: 90vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-xl);
            z-index: 500;
            animation: fadeIn 0.2s ease-out;
        `;\n        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--color-bg-secondary);
            border-radius: var(--border-radius-xl);
            padding: var(--space-2xl);
            width: 100%;
            max-width: 420px;
            box-shadow: var(--shadow-xl);
            animation: slideIn 0.3s ease-out;
        `;
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modalTitle.style.cssText = `
            font-size: var(--font-size-2xl);
            font-weight: var(--font-weight-bold);
            margin-bottom: var(--space-lg);
        `;
        
        const modalBody = document.createElement('div');
        modalBody.innerHTML = content;
        modalBody.style.marginBottom = 'var(--space-xl)';
        
        const modalActions = document.createElement('div');
        modalActions.style.cssText = `
            display: flex;
            gap: var(--space-md);
            justify-content: flex-end;
        `;
        
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = action.className || 'btn btn-secondary';
            btn.textContent = action.text;
            btn.onclick = () => {
                action.onClick();
                modal.remove();
            };
            modalActions.appendChild(btn);
        });
        
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalActions);
        modal.appendChild(modalContent);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    },

    /**
     * Show a toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: var(--space-xl);
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-surface);
            color: var(--color-text-primary);
            padding: var(--space-md) var(--space-xl);
            border-radius: var(--border-radius-full);
            box-shadow: var(--shadow-xl);
            z-index: 600;
            animation: slideIn 0.3s ease-out;
        `;
        
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            warning: 'var(--color-warning)',
            info: 'var(--color-info)'
        };
        
        toast.style.borderLeft = `4px solid ${colors[type]}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Format date helper
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    /**
     * Create page lines for editor
     */
    createPageLines(count = 33) {
        const container = document.createElement('div');
        
        for (let i = 1; i <= count; i++) {
            const line = document.createElement('div');
            line.className = 'page-line';
            line.contentEditable = 'true';
            line.dataset.lineNumber = i;
            line.spellcheck = true;
            
            if (i === 1) {
                line.dataset.placeholder = 'Start typing or use shortcuts (H1, H2, H3, T1, L1, L2)...';
            }
            
            // Track content changes
            line.addEventListener('input', (e) => {
                // Add has-content class if line has text
                if (line.textContent.trim()) {
                    line.classList.add('has-content');
                } else {
                    line.classList.remove('has-content');
                }
                
                // Detect shortcuts at line start
                const text = line.textContent;
                const words = text.split(' ');
                
                // Check if first word is a shortcut (2 chars followed by space)
                if (words.length > 1 && words[0].length === 2) {
                    const shortcut = words[0].toUpperCase();
                    if (this.isValidShortcut(shortcut)) {
                        // Remove the shortcut text
                        line.textContent = text.substring(3); // Remove "XX "
                        this.handleShortcut(shortcut, line);
                    }
                }
            });
            
            // Handle Enter key - move to next line
            line.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const nextLine = line.nextElementSibling;
                    if (nextLine && nextLine.classList.contains('page-line')) {
                        nextLine.focus();
                        // Place cursor at start
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.setStart(nextLine, 0);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
                
                // Handle backspace on empty line - go to previous line
                if (e.key === 'Backspace' && !line.textContent.trim()) {
                    e.preventDefault();
                    const prevLine = line.previousElementSibling;
                    if (prevLine && prevLine.classList.contains('page-line')) {
                        prevLine.focus();
                        // Place cursor at end
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.selectNodeContents(prevLine);
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            });
            
            container.appendChild(line);
        }
        
        return container;
    },

    /**
     * Check if shortcut is valid
     */
    isValidShortcut(shortcut) {
        const validShortcuts = ['H1', 'H2', 'H3', 'T1', 'T2', 'L1', 'L2', 'B1', 'B2'];
        return validShortcuts.includes(shortcut);
    },

    /**
     * Handle shortcut commands
     */
    handleShortcut(shortcut, line) {
        const shortcuts = {
            'H1': () => this.insertHeading(line, 1),
            'H2': () => this.insertHeading(line, 2),
            'H3': () => this.insertHeading(line, 3),
            'T1': () => this.insertTable(line, 2, 2),
            'T2': () => this.insertTable(line, 3, 3),
            'L1': () => this.insertList(line, 'bullet'),
            'L2': () => this.insertList(line, 'number'),
            'B1': () => this.insertBlankSpace(line, 2),
            'B2': () => this.insertBlankSpace(line, 4),
        };
        
        if (shortcuts[shortcut]) {
            shortcuts[shortcut]();
            Components.showToast(`✨ Inserted ${shortcut}`, 'success');
        }
    },

    /**
     * Insert heading
     */
    insertHeading(line, level) {
        line.classList.add(`heading-${level}`);
        line.dataset.blockType = `h${level}`;
        line.dataset.placeholder = `Type your heading here...`;
        line.focus();
        
        // Place cursor at start
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(line, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    },

    /**
     * Insert table
     */
    insertTable(line, rows, cols) {
        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            background: white;
            border: 2px solid #667eea;
            border-radius: 4px;
            overflow: hidden;
        `;
        
        for (let i = 0; i < rows; i++) {
            const row = table.insertRow();
            for (let j = 0; j < cols; j++) {
                const cell = row.insertCell();
                cell.contentEditable = 'true';
                cell.style.cssText = `
                    border: 1px solid #cbd5e1;
                    padding: 8px 12px;
                    min-width: 80px;
                    color: #1f2937;
                    background: ${i === 0 ? '#f1f5f9' : 'white'};
                    font-weight: ${i === 0 ? '600' : '400'};
                `;
                cell.textContent = i === 0 ? `Column ${j + 1}` : '';
            }
        }
        
        line.contentEditable = 'false';
        line.style.height = 'auto';
        line.style.minHeight = 'auto';
        line.style.border = 'none';
        line.appendChild(table);
        
        // Focus first cell
        setTimeout(() => {
            const firstCell = table.rows[0].cells[0];
            firstCell.focus();
        }, 100);
    },

    /**
     * Insert list
     */
    insertList(line, type) {
        const listContainer = document.createElement('div');
        listContainer.dataset.blockType = type;
        listContainer.style.cssText = `
            margin: 12px 0;
            padding-left: 8px;
        `;
        
        for (let i = 0; i < 3; i++) {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                gap: 12px;
                margin-bottom: 8px;
                align-items: flex-start;
            `;
            
            const bullet = document.createElement('span');
            bullet.textContent = type === 'bullet' ? '•' : `${i + 1}.`;
            bullet.style.cssText = `
                min-width: 24px;
                color: #667eea;
                font-weight: 600;
                font-size: 16px;
            `;
            
            const content = document.createElement('div');
            content.contentEditable = 'true';
            content.style.cssText = `
                flex: 1;
                outline: none;
                color: #1f2937;
                min-height: 20px;
            `;
            content.dataset.placeholder = 'Type list item...';
            
            // Add placeholder behavior
            content.addEventListener('focus', function() {
                if (!this.textContent.trim()) {
                    this.style.color = '#9ca3af';
                }
            });
            
            content.addEventListener('blur', function() {
                this.style.color = '#1f2937';
            });
            
            item.appendChild(bullet);
            item.appendChild(content);
            listContainer.appendChild(item);
        }
        
        line.contentEditable = 'false';
        line.style.height = 'auto';
        line.style.minHeight = 'auto';
        line.style.border = 'none';
        line.appendChild(listContainer);
        
        // Focus first list item
        setTimeout(() => {
            const firstItem = listContainer.querySelector('[contenteditable="true"]');
            if (firstItem) firstItem.focus();
        }, 100);
    },

    /**
     * Insert blank space
     */
    insertBlankSpace(line, lines) {
        line.contentEditable = 'false';
        line.style.height = `${lines * 36}px`;
        line.style.background = 'repeating-linear-gradient(transparent, transparent 35px, #cbd5e1 35px, #cbd5e1 36px)';
        line.style.border = '1px dashed #cbd5e1';
        line.dataset.blockType = 'blank';
        line.innerHTML = '<div style="text-align: center; color: #9ca3af; padding-top: 8px; font-size: 12px;">Blank space for sketches or diagrams</div>';
    }
};

// Export for use in other modules
window.Components = Components;
