document.addEventListener('DOMContentLoaded', function() {
    
    // Tab switching functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                
                // Update button states
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.borderBottom = 'none';
                    b.style.color = '#888';
                });
                this.classList.add('active');
                this.style.borderBottom = '2px solid #667eea';
                this.style.color = '#333';
                
                // Update tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(tab + '-tab').style.display = 'block';
            });
        });
});