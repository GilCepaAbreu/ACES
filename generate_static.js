const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./aces.db', (err) => {
    if (err) {
        console.error("Error opening db:", err.message);
        return;
    }
});

db.serialize(() => {
    db.all("SELECT * FROM blog_posts ORDER BY id DESC", (err, posts) => {
        if (err) console.error("Error fetching blog posts:", err);
        posts = posts || [];
        const blogHTML = posts.map(post => `
                <article class="blog-card reveal-elem">
                    <div class="blog-img"><img src="${post.img}" alt="${post.title}"></div>
                    <div class="blog-content">
                        <span class="blog-date">${post.date}</span>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt}</p>
                        <a href="#" class="blog-link" data-cursor="hover">Ler Mais <i class="ph ph-arrow-right"></i></a>
                        <div class="full-content" style="display:none;">${post.content}</div>
                    </div>
                </article>
            `).join('');

        db.all("SELECT * FROM faqs ORDER BY id ASC", (err, faqs) => {
            if (err) console.error("Error fetching faqs:", err);
            faqs = faqs || [];
            const faqHTML = faqs.map(faq => `
                <div class="faq-item reveal-elem">
                    <button class="faq-question" aria-expanded="false">
                        <span>${faq.question}</span>
                        <i class="ph ph-plus faq-icon"></i>
                    </button>
                    <div class="faq-answer"><p>${faq.answer}</p></div>
                </div>
            `).join('');

            let indexContent = fs.readFileSync('index.html', 'utf8');
            
            // Replace blog
            indexContent = indexContent.replace('<!-- Dynamic Blog Posts -->', blogHTML);
            // Replace FAQ
            indexContent = indexContent.replace('<!-- Dynamic FAQ Items -->', faqHTML);
            
            let scriptContent = fs.readFileSync('script.js', 'utf8');
            
            // Replace fetchContent invocation with init functions
            let newScriptContent = scriptContent.replace('fetchContent();', 'initAnimations();\\n    initFaqLogic();\\n    initBlogModal();');
            
            // Remove the fetchContent definition entirely to clean it up
            newScriptContent = newScriptContent.replace(/async function fetchContent\(\) \{[\s\S]*?\}\n/g, '');
            
            // Make form submission not throw unhandled promise rejection if API fails
            newScriptContent = newScriptContent.replace(
                'const res = await fetch(`${API_BASE}/messages`, {',
                'try {\\n                const res = await fetch(`${API_BASE}/messages`, {'
            ).replace(
                /contactForm\.reset\(\);\n\s*\}/g,
                'contactForm.reset();\n            } } catch (error) { alert("O envio de mensagens não está disponível na versão estática."); }'
            );

            // Actually, an easier way is just changing the whole block if needed, but it's fine. We can also just ignore the fetch fail.

            indexContent = indexContent.replace('<script src="script.js"></script>', `<script>\n${newScriptContent}\n</script>`);
            
            fs.writeFileSync('teste.html', indexContent);
            console.log('teste.html created successfully!');
        });
    });
});
