const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'content.json');

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'dpc-solutions-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Helper to read data
function getContent() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading content file:", err);
        return {};
    }
}

// Helper to save data
function saveContent(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4), 'utf8');
        return true;
    } catch (err) {
        console.error("Error saving content file:", err);
        return false;
    }
}

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.loggedIn) {
        return next();
    }
    res.redirect('/admin/login');
}

// Routes
app.get('/', (req, res) => {
    const content = getContent();
    res.render('index', { content });
});

// Admin Login
app.get('/admin/login', (req, res) => {
    res.render('admin-login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Simple hardcoded credentials for demo - change these!
    if (username === 'admin' && password === 'dpc2026') {
        req.session.loggedIn = true;
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin-login', { error: 'Invalid credentials' });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Admin Dashboard
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
    const content = getContent();
    res.render('admin-dashboard', { content, success: req.query.success });
});

app.post('/admin/save', isAuthenticated, (req, res) => {
    // The body will contain the updated content structure
    // We need to be careful to merge it or replace specific sections
    const currentContent = getContent();
    // For simplicity in this demo, we'll assume the form posts the entire structure or specific parts
    // But HTML forms usually post flattened keys. A JSON payload is better.
    // If using the WYSIWYG editor, we'll likely send a JSON body.

    // Assuming the client sends the full JSON object back
    const newContent = req.body;

    if (saveContent(newContent)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
