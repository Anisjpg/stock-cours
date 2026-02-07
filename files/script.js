// Données de l'application (stockées dans localStorage)
let coursesData = [];
let currentYear = '';

// Éléments du DOM
const elements = {
    yearTabs: document.getElementById('yearTabs'),
    coursesGrid: document.getElementById('coursesGrid'),
    emptyState: document.getElementById('emptyState'),
    addCourseBtn: document.getElementById('addCourseBtn'),
    addYearBtn: document.getElementById('addYearBtn'),
    searchBtn: document.getElementById('searchBtn'),
    searchBar: document.getElementById('searchBar'),
    searchInput: document.getElementById('searchInput'),
    courseModal: document.getElementById('courseModal'),
    viewModal: document.getElementById('viewModal'),
    courseForm: document.getElementById('courseForm'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    closeViewModalBtn: document.getElementById('closeViewModalBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    editCourseBtn: document.getElementById('editCourseBtn'),
    deleteCourseBtn: document.getElementById('deleteCourseBtn')
};

// État de l'application
let editingCourseId = null;
let viewingCourseId = null;

// Initialisation de l'application
function init() {
    loadDataFromStorage();
    if (coursesData.length === 0) {
        // Ajouter des données de démonstration
        coursesData = [
            {
                id: Date.now() + 1,
                name: 'Analyse Mathématique',
                subject: 'mathematiques',
                year: '2023-2024',
                description: 'Cours d\'analyse incluant les limites, dérivées, intégrales et séries.',
                files: 'https://example.com/notes-analyse.pdf\nhttps://example.com/exercices.pdf'
            },
            {
                id: Date.now() + 2,
                name: 'Mécanique Quantique',
                subject: 'physique',
                year: '2023-2024',
                description: 'Introduction aux principes fondamentaux de la mécanique quantique.',
                files: 'https://example.com/mecanique-quantique.pdf'
            },
            {
                id: Date.now() + 3,
                name: 'Programmation Orientée Objet',
                subject: 'informatique',
                year: '2024-2025',
                description: 'Concepts avancés de POO en Java et Python.',
                files: 'https://github.com/example/poo-cours\nhttps://example.com/slides.pdf'
            }
        ];
        saveDataToStorage();
    }
    
    renderYearTabs();
    attachEventListeners();
}

// Chargement des données depuis localStorage
function loadDataFromStorage() {
    const stored = localStorage.getItem('coursesData');
    if (stored) {
        coursesData = JSON.parse(stored);
    }
}

// Sauvegarde des données dans localStorage
function saveDataToStorage() {
    localStorage.setItem('coursesData', JSON.stringify(coursesData));
}

// Récupérer toutes les années uniques
function getYears() {
    const years = [...new Set(coursesData.map(course => course.year))];
    return years.sort().reverse();
}

// Rendu des onglets d'années
function renderYearTabs() {
    const years = getYears();
    
    if (years.length === 0) {
        elements.yearTabs.innerHTML = '<div class="year-tab active" data-year="all">Toutes les années</div>';
        currentYear = 'all';
    } else {
        if (!currentYear || !years.includes(currentYear)) {
            currentYear = years[0];
        }
        
        elements.yearTabs.innerHTML = years.map(year => `
            <div class="year-tab ${year === currentYear ? 'active' : ''}" data-year="${year}">
                ${year}
            </div>
        `).join('');
        
        // Ajouter les événements de clic
        document.querySelectorAll('.year-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                currentYear = tab.dataset.year;
                renderYearTabs();
                renderCourses();
            });
        });
    }
    
    renderCourses();
}

// Rendu des cours
function renderCourses(searchQuery = '') {
    let filteredCourses = coursesData;
    
    // Filtrer par année
    if (currentYear && currentYear !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.year === currentYear);
    }
    
    // Filtrer par recherche
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
            course.name.toLowerCase().includes(query) ||
            course.subject.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
        );
    }
    
    // Afficher l'état vide si nécessaire
    if (filteredCourses.length === 0) {
        elements.coursesGrid.innerHTML = '';
        elements.emptyState.classList.add('visible');
    } else {
        elements.emptyState.classList.remove('visible');
        elements.coursesGrid.innerHTML = filteredCourses.map(course => `
            <div class="course-card" data-id="${course.id}">
                <span class="course-subject">${getSubjectLabel(course.subject)}</span>
                <h3 class="course-name">${course.name}</h3>
                <p class="course-description">${course.description || 'Aucune description'}</p>
                <div class="course-meta">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${course.year}
                </div>
            </div>
        `).join('');
        
        // Ajouter les événements de clic sur les cartes
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', () => {
                viewCourse(parseInt(card.dataset.id));
            });
        });
    }
}

// Obtenir le label de la matière
function getSubjectLabel(subject) {
    const labels = {
        'mathematiques': 'Mathématiques',
        'physique': 'Physique',
        'chimie': 'Chimie',
        'biologie': 'Biologie',
        'informatique': 'Informatique',
        'francais': 'Français',
        'anglais': 'Anglais',
        'histoire': 'Histoire',
        'geographie': 'Géographie',
        'philosophie': 'Philosophie',
        'economie': 'Économie',
        'autre': 'Autre'
    };
    return labels[subject] || subject;
}

// Visualiser un cours
function viewCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    viewingCourseId = courseId;
    
    document.getElementById('viewCourseName').textContent = course.name;
    document.getElementById('viewSubject').textContent = getSubjectLabel(course.subject);
    document.getElementById('viewYear').textContent = course.year;
    document.getElementById('viewDescription').textContent = course.description || 'Aucune description disponible.';
    
    // Afficher les fichiers
    const filesContainer = document.getElementById('viewFiles');
    if (course.files && course.files.trim()) {
        const fileLines = course.files.split('\n').filter(line => line.trim());
        filesContainer.innerHTML = `
            <h3>Fichiers et Ressources</h3>
            <div class="file-list">
                ${fileLines.map(file => {
                    const isUrl = file.match(/^https?:\/\//);
                    if (isUrl) {
                        return `<div class="file-item"><a href="${file}" target="_blank">${file}</a></div>`;
                    } else {
                        return `<div class="file-item">${file}</div>`;
                    }
                }).join('')}
            </div>
        `;
    } else {
        filesContainer.innerHTML = '';
    }
    
    elements.viewModal.classList.add('active');
}

// Ouvrir le modal d'ajout/édition
function openCourseModal(courseId = null) {
    editingCourseId = courseId;
    
    if (courseId) {
        const course = coursesData.find(c => c.id === courseId);
        if (course) {
            document.getElementById('modalTitle').textContent = 'Modifier le cours';
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseSubject').value = course.subject;
            document.getElementById('courseYear').value = course.year;
            document.getElementById('courseDescription').value = course.description || '';
            document.getElementById('courseFiles').value = course.files || '';
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Ajouter un cours';
        elements.courseForm.reset();
        if (currentYear && currentYear !== 'all') {
            document.getElementById('courseYear').value = currentYear;
        }
    }
    
    elements.courseModal.classList.add('active');
}

// Fermer les modals
function closeModals() {
    elements.courseModal.classList.remove('active');
    elements.viewModal.classList.remove('active');
    elements.courseForm.reset();
    editingCourseId = null;
    viewingCourseId = null;
}

// Sauvegarder un cours
function saveCourse(e) {
    e.preventDefault();
    
    const courseData = {
        name: document.getElementById('courseName').value.trim(),
        subject: document.getElementById('courseSubject').value,
        year: document.getElementById('courseYear').value.trim(),
        description: document.getElementById('courseDescription').value.trim(),
        files: document.getElementById('courseFiles').value.trim()
    };
    
    if (editingCourseId) {
        // Mise à jour
        const index = coursesData.findIndex(c => c.id === editingCourseId);
        if (index !== -1) {
            coursesData[index] = { ...coursesData[index], ...courseData };
        }
    } else {
        // Nouveau cours
        const newCourse = {
            id: Date.now(),
            ...courseData
        };
        coursesData.push(newCourse);
    }
    
    saveDataToStorage();
    renderYearTabs();
    closeModals();
}

// Supprimer un cours
function deleteCourse() {
    if (!viewingCourseId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
        coursesData = coursesData.filter(c => c.id !== viewingCourseId);
        saveDataToStorage();
        renderYearTabs();
        closeModals();
    }
}

// Ajouter une nouvelle année
function addYear() {
    const year = prompt('Entrez l\'année scolaire (ex: 2024-2025):');
    if (year && year.trim()) {
        currentYear = year.trim();
        renderYearTabs();
    }
}

// Toggle barre de recherche
function toggleSearch() {
    elements.searchBar.classList.toggle('active');
    if (elements.searchBar.classList.contains('active')) {
        elements.searchInput.focus();
    } else {
        elements.searchInput.value = '';
        renderCourses();
    }
}

// Attacher les événements
function attachEventListeners() {
    elements.addCourseBtn.addEventListener('click', () => openCourseModal());
    elements.addYearBtn.addEventListener('click', addYear);
    elements.searchBtn.addEventListener('click', toggleSearch);
    elements.closeModalBtn.addEventListener('click', closeModals);
    elements.closeViewModalBtn.addEventListener('click', closeModals);
    elements.cancelBtn.addEventListener('click', closeModals);
    elements.courseForm.addEventListener('submit', saveCourse);
    elements.editCourseBtn.addEventListener('click', () => {
        closeModals();
        setTimeout(() => openCourseModal(viewingCourseId), 100);
    });
    elements.deleteCourseBtn.addEventListener('click', deleteCourse);
    
    // Recherche en temps réel
    elements.searchInput.addEventListener('input', (e) => {
        renderCourses(e.target.value);
    });
    
    // Fermer les modals en cliquant en dehors
    elements.courseModal.addEventListener('click', (e) => {
        if (e.target === elements.courseModal) {
            closeModals();
        }
    });
    
    elements.viewModal.addEventListener('click', (e) => {
        if (e.target === elements.viewModal) {
            closeModals();
        }
    });
    
    // Raccourci clavier pour la recherche
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearch();
        }
        if (e.key === 'Escape') {
            closeModals();
            if (elements.searchBar.classList.contains('active')) {
                toggleSearch();
            }
        }
    });
}

// Initialiser l'application au chargement de la page
document.addEventListener('DOMContentLoaded', init);
