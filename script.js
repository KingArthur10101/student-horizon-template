// Career Path Planner - Main JavaScript File

class CareerPathPlanner {
    constructor() {
        this.currentPage = 'home';
        this.currentStep = 'courses';
        this.userData = {
            courses: [],
            activities: [],
            skills: {},
            preferences: {},
            goals: {},
            savedMajors: [],
            savedColleges: [],
            savedJobs: []
        };
        
        this.majorsData = this.initializeMajorsData();
        this.collegesData = this.initializeCollegesData();
        this.jobsData = this.initializeJobsData();
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.showPage('home');
    }
    
    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            }
        });
        
        // Major finder step navigation
        document.getElementById('next-step')?.addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('prev-step')?.addEventListener('click', () => {
            this.prevStep();
        });
        
        document.getElementById('get-results')?.addEventListener('click', () => {
            this.getMajorResults();
        });
        
        // Course selection
        document.querySelectorAll('input[data-course]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateCourseSelection(e.target);
            });
        });
        
        // Activity input
        document.getElementById('add-activity-btn')?.addEventListener('click', () => {
            this.addActivity();
        });
        
        // Skills rating
        document.querySelectorAll('.star-rating').forEach(rating => {
            rating.addEventListener('click', (e) => {
                if (e.target.classList.contains('star')) {
                    this.rateSkill(rating, e.target);
                }
            });
        });
        
        // Preference sliders
        document.querySelectorAll('.preference-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updatePreference(e.target);
            });
        });
        
        // Goals
        document.getElementById('save-goals')?.addEventListener('click', () => {
            this.saveGoals();
        });
        
        // Priority drag and drop
        this.setupPriorityDragDrop();
        
        // Export functionality
        document.getElementById('export-plan')?.addEventListener('click', () => {
            this.exportPlan();
        });
        
        document.getElementById('print-plan')?.addEventListener('click', () => {
            this.printPlan();
        });
        
        // Hours per week slider
        const hoursSlider = document.getElementById('hours-per-week');
        if (hoursSlider) {
            hoursSlider.addEventListener('input', (e) => {
                document.querySelector('.range-value').textContent = `${e.target.value} hours`;
            });
        }
    }
    
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            
            // Load page-specific data
            this.loadPageData(pageId);
        }
    }
    
    loadPageData(pageId) {
        switch (pageId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'explore-colleges':
                this.loadColleges();
                break;
            case 'jobs-internships':
                this.loadJobs();
                break;
        }
    }
    
    // Major Finder Methods
    nextStep() {
        const steps = ['courses', 'activities', 'skills', 'preferences'];
        const currentIndex = steps.indexOf(this.currentStep);
        
        if (currentIndex < steps.length - 1) {
            this.currentStep = steps[currentIndex + 1];
            this.updateStepDisplay();
        }
    }
    
    prevStep() {
        const steps = ['courses', 'activities', 'skills', 'preferences'];
        const currentIndex = steps.indexOf(this.currentStep);
        
        if (currentIndex > 0) {
            this.currentStep = steps[currentIndex - 1];
            this.updateStepDisplay();
        }
    }
    
    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`[data-step="${this.currentStep}"]`)?.classList.add('active');
        
        // Update step content
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${this.currentStep}-step`)?.classList.add('active');
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const resultsBtn = document.getElementById('get-results');
        
        if (prevBtn) prevBtn.disabled = this.currentStep === 'courses';
        if (nextBtn) nextBtn.style.display = this.currentStep === 'preferences' ? 'none' : 'block';
        if (resultsBtn) resultsBtn.style.display = this.currentStep === 'preferences' ? 'block' : 'none';
    }
    
    updateCourseSelection(input) {
        const course = input.getAttribute('data-course');
        const level = document.querySelector('input[name="level"]:checked')?.value || 'basic';
        
        if (input.checked) {
            this.userData.courses.push({ course, level });
        } else {
            this.userData.courses = this.userData.courses.filter(c => c.course !== course);
        }
        
        this.saveUserData();
    }
    
    addActivity() {
        const nameInput = document.getElementById('activity-name');
        const hoursInput = document.getElementById('hours-per-week');
        
        if (nameInput.value.trim()) {
            const activity = {
                name: nameInput.value.trim(),
                hours: parseInt(hoursInput.value)
            };
            
            this.userData.activities.push(activity);
            this.displayActivities();
            this.saveUserData();
            
            // Clear inputs
            nameInput.value = '';
            hoursInput.value = '5';
            document.querySelector('.range-value').textContent = '5 hours';
        }
    }
    
    displayActivities() {
        const container = document.querySelector('.activities-list');
        container.innerHTML = '';
        
        this.userData.activities.forEach((activity, index) => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <span>${activity.name} (${activity.hours} hours/week)</span>
                <button class="btn-icon" onclick="app.removeActivity(${index})">×</button>
            `;
            container.appendChild(item);
        });
    }
    
    removeActivity(index) {
        this.userData.activities.splice(index, 1);
        this.displayActivities();
        this.saveUserData();
    }
    
    rateSkill(ratingContainer, clickedStar) {
        const skill = ratingContainer.getAttribute('data-skill');
        const rating = parseInt(clickedStar.getAttribute('data-rating'));
        
        this.userData.skills[skill] = rating;
        
        // Update visual display
        ratingContainer.querySelectorAll('.star').forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
        
        this.saveUserData();
    }
    
    updatePreference(slider) {
        const preference = slider.getAttribute('data-preference');
        this.userData.preferences[preference] = parseInt(slider.value);
        this.saveUserData();
    }
    
    getMajorResults() {
        const results = this.calculateMajorMatches();
        this.displayMajorResults(results);
        this.showPage('find-major'); // Stay on same page to show results
    }
    
    calculateMajorMatches() {
        const results = [];
        
        Object.values(this.majorsData).forEach(major => {
            let score = 0;
            let reasons = [];
            
            // Course matching
            const courseScore = this.calculateCourseScore(major);
            score += courseScore.score;
            reasons.push(...courseScore.reasons);
            
            // Skills matching
            const skillsScore = this.calculateSkillsScore(major);
            score += skillsScore.score;
            reasons.push(...skillsScore.reasons);
            
            // Preferences matching
            const prefsScore = this.calculatePreferencesScore(major);
            score += prefsScore.score;
            reasons.push(...prefsScore.reasons);
            
            // Activities matching
            const activitiesScore = this.calculateActivitiesScore(major);
            score += activitiesScore.score;
            reasons.push(...activitiesScore.reasons);
            
            results.push({
                ...major,
                score: Math.min(100, Math.max(0, score)),
                reasons: reasons.slice(0, 3) // Top 3 reasons
            });
        });
        
        return results.sort((a, b) => b.score - a.score);
    }
    
    calculateCourseScore(major) {
        let score = 0;
        const reasons = [];
        
        this.userData.courses.forEach(userCourse => {
            if (major.relatedCourses.includes(userCourse.course)) {
                const multiplier = userCourse.level === 'ap-ib' ? 1.5 : 
                                 userCourse.level === 'honors' ? 1.2 : 1;
                score += 10 * multiplier;
                reasons.push(`You've taken ${userCourse.course} (${userCourse.level})`);
            }
        });
        
        return { score, reasons };
    }
    
    calculateSkillsScore(major) {
        let score = 0;
        const reasons = [];
        
        Object.entries(major.requiredSkills).forEach(([skill, requiredLevel]) => {
            const userLevel = this.userData.skills[skill] || 0;
            if (userLevel >= requiredLevel) {
                score += 15;
                reasons.push(`Strong ${skill} skills`);
            } else if (userLevel > 0) {
                score += 5;
                reasons.push(`Some ${skill} experience`);
            }
        });
        
        return { score, reasons };
    }
    
    calculatePreferencesScore(major) {
        let score = 0;
        const reasons = [];
        
        Object.entries(major.preferences).forEach(([pref, majorValue]) => {
            const userValue = this.userData.preferences[pref] || 50;
            const diff = Math.abs(userValue - majorValue);
            if (diff < 20) {
                score += 10;
                reasons.push(`Matches your ${pref} preference`);
            }
        });
        
        return { score, reasons };
    }
    
    calculateActivitiesScore(major) {
        let score = 0;
        const reasons = [];
        
        this.userData.activities.forEach(activity => {
            if (major.relatedActivities.some(rel => 
                activity.name.toLowerCase().includes(rel.toLowerCase()))) {
                score += 8;
                reasons.push(`Your ${activity.name} experience`);
            }
        });
        
        return { score, reasons };
    }
    
    displayMajorResults(results) {
        const container = document.querySelector('.results-list');
        container.innerHTML = '';
        
        results.slice(0, 8).forEach(major => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `
                <div class="result-header">
                    <div class="result-title">${major.name}</div>
                    <div class="fit-score">${Math.round(major.score)}% Match</div>
                </div>
                <div class="fit-bar">
                    <div class="fit-bar-fill" style="width: ${major.score}%"></div>
                </div>
                <div class="result-details">
                    <div class="result-detail">
                        <strong>Salary Range:</strong> ${major.salaryRange}
                    </div>
                    <div class="result-detail">
                        <strong>Job Growth:</strong> ${major.jobGrowth}
                    </div>
                    <div class="result-detail">
                        <strong>Entry Roles:</strong> ${major.entryRoles.join(', ')}
                    </div>
                </div>
                <div class="result-reasons">
                    <h4>Why this fits:</h4>
                    <ul>
                        ${major.reasons.map(reason => `<li>${reason}</li>`).join('')}
                    </ul>
                </div>
                <div class="result-actions">
                    <button class="btn-primary btn-small" onclick="app.saveMajor('${major.id}')">
                        Save to Dashboard
                    </button>
                    <button class="btn-secondary btn-small" onclick="app.expandMajor('${major.id}')">
                        Learn More
                    </button>
                </div>
            `;
            container.appendChild(item);
        });
        
        document.getElementById('major-results').style.display = 'block';
    }
    
    saveMajor(majorId) {
        const major = this.majorsData[majorId];
        if (!this.userData.savedMajors.find(m => m.id === majorId)) {
            this.userData.savedMajors.push(major);
            this.saveUserData();
            alert('Major saved to dashboard!');
        }
    }
    
    // Goals Methods
    setupPriorityDragDrop() {
        const prioritiesList = document.getElementById('priorities-list');
        if (!prioritiesList) return;
        
        let draggedElement = null;
        
        prioritiesList.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.target.style.opacity = '0.5';
        });
        
        prioritiesList.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
            draggedElement = null;
        });
        
        prioritiesList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        prioritiesList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement && e.target !== draggedElement) {
                const rect = e.target.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    prioritiesList.insertBefore(draggedElement, e.target);
                } else {
                    prioritiesList.insertBefore(draggedElement, e.target.nextSibling);
                }
            }
        });
        
        // Make items draggable
        prioritiesList.querySelectorAll('.priority-item').forEach(item => {
            item.draggable = true;
        });
    }
    
    saveGoals() {
        const priorities = Array.from(document.querySelectorAll('.priority-item')).map(
            (item, index) => ({
                priority: item.getAttribute('data-priority'),
                rank: index + 1
            })
        );
        
        const cityTown = document.querySelector('input[name="city-town"]:checked')?.value;
        const schedule = document.querySelector('input[name="schedule"]:checked')?.value;
        
        this.userData.goals = {
            priorities,
            cityTown,
            schedule
        };
        
        this.updateValuesStatement();
        this.saveUserData();
        alert('Goals saved successfully!');
    }
    
    updateValuesStatement() {
        const priorities = this.userData.goals.priorities || [];
        const topPriority = priorities[0];
        const cityTown = this.userData.goals.cityTown;
        const schedule = this.userData.goals.schedule;
        
        let statement = `You value ${topPriority?.priority.replace('-', ' ')} most highly. `;
        
        if (cityTown && cityTown !== 'either') {
            statement += `You prefer ${cityTown === 'city' ? 'urban' : 'small town'} environments. `;
        }
        
        if (schedule && schedule !== 'either') {
            statement += `You prefer ${schedule} work schedules.`;
        }
        
        document.getElementById('values-statement').textContent = statement;
    }
    
    // Dashboard Methods
    loadDashboard() {
        this.loadSavedMajors();
        this.loadSavedColleges();
        this.loadSavedJobs();
        this.updateProgressChecklist();
    }
    
    loadSavedMajors() {
        const container = document.querySelector('.saved-majors');
        container.innerHTML = '';
        
        this.userData.savedMajors.forEach(major => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            item.innerHTML = `
                <div class="saved-item-info">
                    <div class="saved-item-title">${major.name}</div>
                    <div class="saved-item-details">${major.salaryRange} • ${major.jobGrowth}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="btn-icon" onclick="app.removeSavedMajor('${major.id}')" title="Remove">×</button>
                </div>
            `;
            container.appendChild(item);
        });
    }
    
    loadSavedColleges() {
        const container = document.querySelector('.saved-colleges');
        container.innerHTML = '';
        
        this.userData.savedColleges.forEach(college => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            item.innerHTML = `
                <div class="saved-item-info">
                    <div class="saved-item-title">${college.name}</div>
                    <div class="saved-item-details">${college.location} • ${college.tuition}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="btn-icon" onclick="app.removeSavedCollege('${college.id}')" title="Remove">×</button>
                </div>
            `;
            container.appendChild(item);
        });
    }
    
    loadSavedJobs() {
        const container = document.querySelector('.saved-jobs');
        container.innerHTML = '';
        
        this.userData.savedJobs.forEach(job => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            item.innerHTML = `
                <div class="saved-item-info">
                    <div class="saved-item-title">${job.title}</div>
                    <div class="saved-item-details">${job.company} • ${job.schedule}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="btn-icon" onclick="app.removeSavedJob('${job.id}')" title="Remove">×</button>
                </div>
            `;
            container.appendChild(item);
        });
    }
    
    updateProgressChecklist() {
        const checklist = document.querySelector('.progress-checklist');
        const items = checklist.querySelectorAll('.checklist-item');
        
        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const isCompleted = this.checkProgressItem(checkbox.id);
            
            checkbox.checked = isCompleted;
            item.classList.toggle('completed', isCompleted);
        });
    }
    
    checkProgressItem(itemId) {
        switch (itemId) {
            case 'choose-major':
                return this.userData.savedMajors.length > 0;
            case 'research-colleges':
                return this.userData.savedColleges.length >= 3;
            case 'apply-internship':
                return this.userData.savedJobs.length > 0;
            case 'set-scholarship-reminders':
                return false; // This would need external integration
            default:
                return false;
        }
    }
    
    removeSavedMajor(majorId) {
        this.userData.savedMajors = this.userData.savedMajors.filter(m => m.id !== majorId);
        this.loadSavedMajors();
        this.saveUserData();
    }
    
    removeSavedCollege(collegeId) {
        this.userData.savedColleges = this.userData.savedColleges.filter(c => c.id !== collegeId);
        this.loadSavedColleges();
        this.saveUserData();
    }
    
    removeSavedJob(jobId) {
        this.userData.savedJobs = this.userData.savedJobs.filter(j => j.id !== jobId);
        this.loadSavedJobs();
        this.saveUserData();
    }
    
    // College Explorer Methods
    loadColleges() {
        const container = document.querySelector('.colleges-list');
        container.innerHTML = '';
        
        this.collegesData.forEach(college => {
            const card = document.createElement('div');
            card.className = 'college-card';
            card.innerHTML = `
                <h3>${college.name}</h3>
                <div class="college-details">
                    <div class="college-detail"><strong>Location:</strong> ${college.location}</div>
                    <div class="college-detail"><strong>Tuition:</strong> ${college.tuition}</div>
                    <div class="college-detail"><strong>Size:</strong> ${college.size}</div>
                    <div class="college-detail"><strong>Admit Rate:</strong> ${college.admitRate}</div>
                    <div class="college-detail"><strong>Programs:</strong> ${college.programs.join(', ')}</div>
                </div>
                <div class="card-actions">
                    <button class="btn-primary btn-small" onclick="app.saveCollege('${college.id}')">
                        Save to Dashboard
                    </button>
                    <a href="${college.website}" target="_blank" class="btn-secondary btn-small">
                        Visit Website
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    saveCollege(collegeId) {
        const college = this.collegesData.find(c => c.id === collegeId);
        if (college && !this.userData.savedColleges.find(c => c.id === collegeId)) {
            this.userData.savedColleges.push(college);
            this.saveUserData();
            alert('College saved to dashboard!');
        }
    }
    
    // Jobs Explorer Methods
    loadJobs() {
        const container = document.querySelector('.jobs-list');
        container.innerHTML = '';
        
        this.jobsData.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <h3>${job.title}</h3>
                <div class="job-details">
                    <div class="job-detail"><strong>Company:</strong> ${job.company}</div>
                    <div class="job-detail"><strong>Schedule:</strong> ${job.schedule}</div>
                    <div class="job-detail"><strong>Location:</strong> ${job.location}</div>
                    <div class="job-detail"><strong>Pay:</strong> ${job.pay}</div>
                    <div class="job-detail"><strong>Skills:</strong> ${job.skills.join(', ')}</div>
                </div>
                <div class="card-actions">
                    <button class="btn-primary btn-small" onclick="app.saveJob('${job.id}')">
                        Save to Dashboard
                    </button>
                    <a href="${job.link}" target="_blank" class="btn-secondary btn-small">
                        Apply Now
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    saveJob(jobId) {
        const job = this.jobsData.find(j => j.id === jobId);
        if (job && !this.userData.savedJobs.find(j => j.id === jobId)) {
            this.userData.savedJobs.push(job);
            this.saveUserData();
            alert('Job saved to dashboard!');
        }
    }
    
    // Export Methods
    exportPlan() {
        const planData = {
            savedMajors: this.userData.savedMajors,
            savedColleges: this.userData.savedColleges,
            savedJobs: this.userData.savedJobs,
            goals: this.userData.goals,
            generatedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'career-plan.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    printPlan() {
        const printWindow = window.open('', '_blank');
        const planContent = this.generatePlanContent();
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Career Plan</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1, h2 { color: #2563eb; }
                        .section { margin-bottom: 30px; }
                        .item { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
                    </style>
                </head>
                <body>
                    ${planContent}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }
    
    generatePlanContent() {
        let content = '<h1>Career Plan</h1>';
        
        if (this.userData.savedMajors.length > 0) {
            content += '<div class="section"><h2>Interested Majors</h2>';
            this.userData.savedMajors.forEach(major => {
                content += `<div class="item"><strong>${major.name}</strong><br>${major.salaryRange} • ${major.jobGrowth}</div>`;
            });
            content += '</div>';
        }
        
        if (this.userData.savedColleges.length > 0) {
            content += '<div class="section"><h2>Target Colleges</h2>';
            this.userData.savedColleges.forEach(college => {
                content += `<div class="item"><strong>${college.name}</strong><br>${college.location} • ${college.tuition}</div>`;
            });
            content += '</div>';
        }
        
        if (this.userData.savedJobs.length > 0) {
            content += '<div class="section"><h2>Opportunities</h2>';
            this.userData.savedJobs.forEach(job => {
                content += `<div class="item"><strong>${job.title}</strong><br>${job.company} • ${job.schedule}</div>`;
            });
            content += '</div>';
        }
        
        if (this.userData.goals.priorities) {
            content += '<div class="section"><h2>Goals & Priorities</h2>';
            content += '<div class="item">';
            this.userData.goals.priorities.forEach((priority, index) => {
                content += `${index + 1}. ${priority.priority.replace('-', ' ')}<br>`;
            });
            content += '</div></div>';
        }
        
        return content;
    }
    
    // Data Management
    saveUserData() {
        localStorage.setItem('careerPathPlanner', JSON.stringify(this.userData));
    }
    
    loadUserData() {
        const saved = localStorage.getItem('careerPathPlanner');
        if (saved) {
            this.userData = { ...this.userData, ...JSON.parse(saved) };
        }
    }
    
    // Data Initialization
    initializeMajorsData() {
        return {
            'computer-science': {
                id: 'computer-science',
                name: 'Computer Science',
                relatedCourses: ['computer-science', 'mathematics', 'calculus', 'physics'],
                requiredSkills: { 'problem-solving': 4, 'mathematics': 4, 'creativity': 3 },
                preferences: { 'theory-applied': 60, 'people-technical': 80, 'structured-flexible': 40 },
                relatedActivities: ['programming', 'robotics', 'gaming', 'technology'],
                salaryRange: '$70,000 - $120,000',
                jobGrowth: '+22%',
                entryRoles: ['Software Developer', 'Web Developer', 'Data Analyst']
            },
            'engineering': {
                id: 'engineering',
                name: 'Engineering',
                relatedCourses: ['mathematics', 'physics', 'chemistry', 'calculus'],
                requiredSkills: { 'problem-solving': 5, 'mathematics': 5, 'communication': 3 },
                preferences: { 'theory-applied': 70, 'people-technical': 90, 'structured-flexible': 30 },
                relatedActivities: ['robotics', 'building', 'science', 'math'],
                salaryRange: '$65,000 - $110,000',
                jobGrowth: '+8%',
                entryRoles: ['Engineer', 'Project Manager', 'Consultant']
            },
            'business': {
                id: 'business',
                name: 'Business Administration',
                relatedCourses: ['mathematics', 'english', 'history', 'government'],
                requiredSkills: { 'communication': 4, 'leadership': 4, 'problem-solving': 3 },
                preferences: { 'theory-applied': 40, 'people-technical': 30, 'structured-flexible': 50 },
                relatedActivities: ['leadership', 'debate', 'sports', 'volunteer'],
                salaryRange: '$50,000 - $90,000',
                jobGrowth: '+5%',
                entryRoles: ['Manager', 'Analyst', 'Consultant']
            },
            'psychology': {
                id: 'psychology',
                name: 'Psychology',
                relatedCourses: ['psychology', 'biology', 'english', 'mathematics'],
                requiredSkills: { 'communication': 5, 'problem-solving': 4, 'creativity': 3 },
                preferences: { 'theory-applied': 50, 'people-technical': 20, 'structured-flexible': 60 },
                relatedActivities: ['volunteer', 'counseling', 'helping', 'research'],
                salaryRange: '$40,000 - $80,000',
                jobGrowth: '+8%',
                entryRoles: ['Counselor', 'Researcher', 'Social Worker']
            },
            'medicine': {
                id: 'medicine',
                name: 'Pre-Medicine',
                relatedCourses: ['biology', 'chemistry', 'physics', 'mathematics'],
                requiredSkills: { 'problem-solving': 5, 'communication': 4, 'mathematics': 4 },
                preferences: { 'theory-applied': 60, 'people-technical': 30, 'structured-flexible': 20 },
                relatedActivities: ['volunteer', 'healthcare', 'science', 'helping'],
                salaryRange: '$200,000 - $400,000',
                jobGrowth: '+4%',
                entryRoles: ['Doctor', 'Researcher', 'Specialist']
            },
            'education': {
                id: 'education',
                name: 'Education',
                relatedCourses: ['english', 'history', 'mathematics', 'psychology'],
                requiredSkills: { 'communication': 5, 'leadership': 4, 'creativity': 4 },
                preferences: { 'theory-applied': 30, 'people-technical': 10, 'structured-flexible': 40 },
                relatedActivities: ['teaching', 'volunteer', 'tutoring', 'mentoring'],
                salaryRange: '$40,000 - $70,000',
                jobGrowth: '+4%',
                entryRoles: ['Teacher', 'Administrator', 'Curriculum Developer']
            },
            'arts': {
                id: 'arts',
                name: 'Fine Arts',
                relatedCourses: ['art', 'music', 'english', 'history'],
                requiredSkills: { 'creativity': 5, 'communication': 3, 'problem-solving': 3 },
                preferences: { 'theory-applied': 20, 'people-technical': 40, 'structured-flexible': 80 },
                relatedActivities: ['art', 'music', 'creative', 'performance'],
                salaryRange: '$30,000 - $60,000',
                jobGrowth: '+2%',
                entryRoles: ['Artist', 'Designer', 'Performer']
            },
            'communications': {
                id: 'communications',
                name: 'Communications',
                relatedCourses: ['english', 'history', 'government', 'psychology'],
                requiredSkills: { 'communication': 5, 'creativity': 4, 'leadership': 3 },
                preferences: { 'theory-applied': 30, 'people-technical': 20, 'structured-flexible': 60 },
                relatedActivities: ['writing', 'media', 'journalism', 'public-speaking'],
                salaryRange: '$35,000 - $70,000',
                jobGrowth: '+4%',
                entryRoles: ['Journalist', 'PR Specialist', 'Content Creator']
            }
        };
    }
    
    initializeCollegesData() {
        return [
            {
                id: 'stanford',
                name: 'Stanford University',
                location: 'Stanford, CA',
                tuition: '$56,169/year',
                size: 'Large (17,000+)',
                admitRate: '4%',
                programs: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
                website: 'https://stanford.edu'
            },
            {
                id: 'mit',
                name: 'MIT',
                location: 'Cambridge, MA',
                tuition: '$53,790/year',
                size: 'Medium (11,000+)',
                admitRate: '7%',
                programs: ['Engineering', 'Computer Science', 'Mathematics', 'Physics'],
                website: 'https://mit.edu'
            },
            {
                id: 'uc-berkeley',
                name: 'UC Berkeley',
                location: 'Berkeley, CA',
                tuition: '$14,226/year (in-state)',
                size: 'Large (45,000+)',
                admitRate: '17%',
                programs: ['Engineering', 'Business', 'Psychology', 'Communications'],
                website: 'https://berkeley.edu'
            },
            {
                id: 'harvard',
                name: 'Harvard University',
                location: 'Cambridge, MA',
                tuition: '$54,269/year',
                size: 'Large (23,000+)',
                admitRate: '5%',
                programs: ['Medicine', 'Business', 'Psychology', 'Education'],
                website: 'https://harvard.edu'
            },
            {
                id: 'state-university',
                name: 'State University',
                location: 'Various Locations',
                tuition: '$8,000-$15,000/year',
                size: 'Large (20,000+)',
                admitRate: '60-80%',
                programs: ['All Majors Available'],
                website: 'https://stateuniversity.edu'
            }
        ];
    }
    
    initializeJobsData() {
        return [
            {
                id: 'software-intern',
                title: 'Software Development Intern',
                company: 'Tech Corp',
                schedule: 'Summer',
                location: 'Remote',
                pay: '$20-25/hour',
                skills: ['Programming', 'Problem Solving', 'Communication'],
                link: 'https://example.com/apply'
            },
            {
                id: 'research-assistant',
                title: 'Research Assistant',
                company: 'University Lab',
                schedule: 'Part-time',
                location: 'Local',
                pay: '$15-18/hour',
                skills: ['Research', 'Analysis', 'Writing'],
                link: 'https://example.com/apply'
            },
            {
                id: 'retail-sales',
                title: 'Retail Sales Associate',
                company: 'Local Store',
                schedule: 'Weekends',
                location: 'Local',
                pay: '$12-15/hour',
                skills: ['Communication', 'Customer Service', 'Sales'],
                link: 'https://example.com/apply'
            },
            {
                id: 'tutor',
                title: 'Tutor',
                company: 'Learning Center',
                schedule: 'After School',
                location: 'Local',
                pay: '$15-20/hour',
                skills: ['Teaching', 'Communication', 'Subject Knowledge'],
                link: 'https://example.com/apply'
            },
            {
                id: 'camp-counselor',
                title: 'Summer Camp Counselor',
                company: 'Youth Camp',
                schedule: 'Summer',
                location: 'Local',
                pay: '$10-15/hour',
                skills: ['Leadership', 'Communication', 'Childcare'],
                link: 'https://example.com/apply'
            }
        ];
    }
}

// Initialize the application
const app = new CareerPathPlanner();
