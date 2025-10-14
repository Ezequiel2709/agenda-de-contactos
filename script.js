// Clase para representar un nodo de la lista enlazada
class Node {
    constructor(contact) {
        this.contact = contact;
        this.next = null;
    }
}

// Clase para representar la lista enlazada de contactos
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Añadir un contacto al final de la lista
    add(contact) {
        const newNode = new Node(contact);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        
        this.size++;
        return newNode;
    }

    // Buscar contactos por nombre o teléfono
    search(term, includeSimilar = true) {
        let current = this.head;
        let results = [];
        
        while (current) {
            const nameMatch = includeSimilar 
                ? current.contact.name.toLowerCase().includes(term.toLowerCase())
                : current.contact.name.toLowerCase() === term.toLowerCase();
                
            const phoneMatch = current.contact.phone.includes(term);
            
            if (nameMatch || phoneMatch) {
                results.push(current);
            }
            current = current.next;
        }
        
        return results;
    }

    // Eliminar un contacto por nombre
    removeByName(name) {
        if (!this.head) return false;
        
        // Si el nodo a eliminar es la cabeza
        if (this.head.contact.name === name) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        let previous = null;
        
        while (current && current.contact.name !== name) {
            previous = current;
            current = current.next;
        }
        
        if (!current) return false;
        
        previous.next = current.next;
        this.size--;
        return true;
    }

    // Actualizar un contacto
    update(oldName, newContact) {
        let current = this.head;
        
        while (current) {
            if (current.contact.name === oldName) {
                current.contact = newContact;
                return true;
            }
            current = current.next;
        }
        
        return false;
    }

    // Obtener todos los contactos
    getAll() {
        let contacts = [];
        let current = this.head;
        
        while (current) {
            contacts.push(current.contact);
            current = current.next;
        }
        
        return contacts;
    }

    // Obtener la visualización de la lista enlazada
    getVisualization() {
        let visualization = [];
        let current = this.head;
        
        while (current) {
            visualization.push(current.contact.name);
            if (current.next) {
                visualization.push('→');
            }
            current = current.next;
        }
        
        return visualization;
    }
}

// Instancia de la lista enlazada
const contactList = new LinkedList();

// Elementos del DOM
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const addBtn = document.getElementById('add-btn');
const updateBtn = document.getElementById('update-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchSimilar = document.getElementById('search-similar');
const searchResults = document.getElementById('search-results');
const contactsList = document.getElementById('contacts-list');
const contactCount = document.getElementById('contact-count');
const linkedListViz = document.getElementById('linked-list-viz');

// Variables para el modo de edición
let isEditing = false;
let currentEditName = '';

// Inicializar la aplicación
function init() {
    // Añadir algunos contactos de ejemplo
    contactList.add({ name: 'Juan Pérez', phone: '123-456-7890', email: 'juan@example.com' });
    contactList.add({ name: 'María García', phone: '098-765-4321', email: 'maria@example.com' });
    contactList.add({ name: 'Carlos López', phone: '555-123-4567', email: 'carlos@example.com' });
    contactList.add({ name: 'Ana Martínez', phone: '111-222-3333', email: 'ana@example.com' });
    contactList.add({ name: 'Juan Carlos Ruiz', phone: '444-555-6666', email: 'juanc@example.com' });
    
    renderContacts();
    updateStats();
}

// Renderizar la lista de contactos
function renderContacts() {
    const contacts = contactList.getAll();
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<div class="no-contacts"><i class="fas fa-users"></i><p>No hay contactos en la agenda.</p></div>';
        return;
    }
    
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        contactElement.innerHTML = `
            <div class="contact-info">
                <h3>${contact.name}</h3>
                <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                <p><i class="fas fa-envelope"></i> ${contact.email || 'No proporcionado'}</p>
            </div>
            <div class="contact-actions">
                <button class="edit-btn btn-warning" data-name="${contact.name}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn btn-danger" data-name="${contact.name}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        contactsList.appendChild(contactElement);
    });
    
    // Añadir event listeners a los botones de editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.closest('button').getAttribute('data-name');
            editContact(name);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.closest('button').getAttribute('data-name');
            deleteContact(name);
        });
    });
    
    // Mostrar visualización de la lista enlazada
    showLinkedListVisualization();
}

// Mostrar visualización de la lista enlazada
function showLinkedListVisualization() {
    const visualization = contactList.getVisualization();
    
    if (visualization.length === 0) {
        linkedListViz.innerHTML = '<p class="no-results">Lista vacía</p>';
        return;
    }
    
    linkedListViz.innerHTML = '';
    
    visualization.forEach(item => {
        if (item === '→') {
            const arrow = document.createElement('span');
            arrow.className = 'arrow';
            arrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
            linkedListViz.appendChild(arrow);
        } else {
            const node = document.createElement('span');
            node.className = 'node';
            node.textContent = item;
            linkedListViz.appendChild(node);
        }
    });
}

// Actualizar estadísticas
function updateStats() {
    contactCount.textContent = contactList.size;
}

// Añadir un nuevo contacto
function addContact(event) {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!name || !phone) {
        showNotification('Por favor, completa al menos el nombre y teléfono.', 'warning');
        return;
    }
    
    // Verificar si ya existe un contacto con ese nombre
    const existingContacts = contactList.search(name, false);
    if (existingContacts.length > 0 && !isEditing) {
        showNotification('Ya existe un contacto con ese nombre.', 'warning');
        return;
    }
    
    const newContact = {
        name,
        phone,
        email
    };
    
    if (isEditing) {
        // Actualizar contacto existente
        contactList.update(currentEditName, newContact);
        isEditing = false;
        currentEditName = '';
        resetForm();
        showNotification('Contacto actualizado correctamente.', 'success');
    } else {
        // Añadir nuevo contacto
        contactList.add(newContact);
        resetForm();
        showNotification('Contacto añadido correctamente.', 'success');
    }
    
    renderContacts();
    updateStats();
    clearSearchResults();
}

// Editar un contacto existente
function editContact(name) {
    const contacts = contactList.getAll();
    const contact = contacts.find(c => c.name === name);
    
    if (contact) {
        nameInput.value = contact.name;
        phoneInput.value = contact.phone;
        emailInput.value = contact.email || '';
        
        isEditing = true;
        currentEditName = name;
        
        addBtn.style.display = 'none';
        updateBtn.style.display = 'flex';
        cancelBtn.style.display = 'flex';
        
        nameInput.focus();
        
        showNotification(`Editando contacto: ${name}`, 'info');
    }
}

// Eliminar un contacto
function deleteContact(name) {
    if (confirm(`¿Estás seguro de que quieres eliminar el contacto "${name}"?`)) {
        contactList.removeByName(name);
        renderContacts();
        updateStats();
        clearSearchResults();
        
        // Si estábamos editando este contacto, cancelar la edición
        if (isEditing && currentEditName === name) {
            cancelEdit();
        }
        
        showNotification('Contacto eliminado correctamente.', 'success');
    }
}

// Buscar contactos
function searchContacts() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        clearSearchResults();
        return;
    }
    
    const includeSimilar = searchSimilar.checked;
    const results = contactList.search(searchTerm, includeSimilar);
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No se encontraron contactos.</p>
            </div>
        `;
        return;
    }
    
    let resultsHTML = `
        <div class="search-header">
            <h3>Resultados de búsqueda (${results.length})</h3>
            <button id="clear-search" class="btn-secondary">
                <i class="fas fa-times"></i> Limpiar
            </button>
        </div>
    `;
    
    results.forEach(node => {
        const contact = node.contact;
        const isNameMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
        const isPhoneMatch = contact.phone.includes(searchTerm);
        
        resultsHTML += `
            <div class="contact-item ${isNameMatch ? 'contact-highlight' : ''}">
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                    <p><i class="fas fa-envelope"></i> ${contact.email || 'No proporcionado'}</p>
                </div>
                <div class="contact-actions">
                    <button class="edit-btn btn-warning" data-name="${contact.name}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn btn-danger" data-name="${contact.name}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    });
    
    searchResults.innerHTML = resultsHTML;
    
    // Añadir event listeners a los botones de los resultados
    document.querySelectorAll('#search-results .edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.closest('button').getAttribute('data-name');
            editContact(name);
        });
    });
    
    document.querySelectorAll('#search-results .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.closest('button').getAttribute('data-name');
            deleteContact(name);
        });
    });
    
    document.getElementById('clear-search').addEventListener('click', clearSearchResults);
}

// Limpiar resultados de búsqueda
function clearSearchResults() {
    searchResults.innerHTML = '';
    searchInput.value = '';
    searchInput.focus();
}

// Cancelar edición
function cancelEdit() {
    isEditing = false;
    currentEditName = '';
    resetForm();
    showNotification('Edición cancelada.', 'info');
}

// Resetear formulario
function resetForm() {
    contactForm.reset();
    addBtn.style.display = 'flex';
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Eliminar notificación anterior si existe
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Colores según el tipo
    const colors = {
        success: 'linear-gradient(135deg, #2ecc71, #27ae60)',
        warning: 'linear-gradient(135deg, #f39c12, #e67e22)',
        danger: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        info: 'linear-gradient(135deg, #3498db, #2980b9)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Obtener icono para la notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'exclamation-circle',
        info: 'info-circle'
    };
    
    return icons[type] || 'info-circle';
}

// Añadir estilos de animación para las notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

// Event Listeners
contactForm.addEventListener('submit', addContact);
updateBtn.addEventListener('click', addContact);
cancelBtn.addEventListener('click', cancelEdit);
searchBtn.addEventListener('click', searchContacts);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchContacts();
    }
});

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', init);