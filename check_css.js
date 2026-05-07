const fs = require('fs');
const css = require('css');

const cssContent = fs.readFileSync('style.css', 'utf8');
try {
    const obj = css.parse(cssContent, { silent: false });
    console.log("CSS parsed successfully!");
    
    // Check if .faq-question exists
    const faqRules = obj.stylesheet.rules.filter(r => r.type === 'rule' && r.selectors.includes('.faq-question'));
    console.log(".faq-question rule count:", faqRules.length);
} catch(e) {
    console.error("CSS Parse Error:", e);
}
