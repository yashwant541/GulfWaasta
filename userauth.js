<script>
        // Initialize Supabase
        const supabaseUrl = 'https://durwnscjcgprhlegjhrv.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cnduc2NqY2dwcmhsZWdqaHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTk3NzgsImV4cCI6MjA2MTk5NTc3OH0.b3lGJ8VWrE0zdh6HNpz5eVzQDuwSJwo9QgetjTTqH68';
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        
        // DOM Elements
        const signInTab = document.getElementById('signInTab');
        const registerTab = document.getElementById('registerTab');
        const signInForm = document.getElementById('signInForm');
        const registerForm = document.getElementById('registerForm');
        const applicationForm = document.getElementById('applicationForm');
        
        // Tab switching
        signInTab.addEventListener('click', () => {
            signInTab.classList.add('active');
            registerTab.classList.remove('active');
            signInForm.classList.add('active');
            registerForm.classList.remove('active');
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            signInTab.classList.remove('active');
            registerForm.classList.add('active');
            signInForm.classList.remove('active');
        });
        
        // Sign In Form Submission
        document.getElementById('signIn').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('signInEmail').value;
            const password = document.getElementById('signInPassword').value;
            const messageEl = document.getElementById('signInMessage');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                
                if (error) throw error;
                
                messageEl.textContent = 'Signed in successfully!';
                messageEl.className = 'form-message success';
                messageEl.style.display = 'block';
                
                signInForm.style.display = 'none';
                registerForm.style.display = 'none';
                applicationForm.style.display = 'block';
                
                // Pre-fill application form
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();
                
                if (profile) {
                    document.getElementById('appName').value = profile.name || '';
                    document.getElementById('appPhone').value = profile.mobile_number || '';
                }
                
            } catch (error) {
                messageEl.textContent = error.message;
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });
        
        // Register Form Submission
        document.getElementById('register').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const phone = document.getElementById('registerPhone').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageEl = document.getElementById('registerMessage');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
            
            if (password !== confirmPassword) {
                messageEl.textContent = 'Passwords do not match!';
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
                return;
            }
            
            try {
                // Get the current URL without any hash or query parameters
                const redirectTo = `${window.location.origin}${window.location.pathname}`;
                
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name,
                            mobile_number: phone
                        },
                        emailRedirectTo: redirectTo
                    }
                });
                
                if (error) throw error;
                
                messageEl.textContent = 'Registration successful! Please check your email to verify your account.';
                messageEl.className = 'form-message success';
                messageEl.style.display = 'block';
                
                // Clear form
                e.target.reset();
                
                // Switch to sign in after delay
                setTimeout(() => {
                    signInTab.click();
                }, 2000);
                
            } catch (error) {
                messageEl.textContent = error.message;
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
            }
        });
        
        // Job Application Form Submission
        document.getElementById('jobApplication').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('appName').value;
            const phone = document.getElementById('appPhone').value;
            const messageEl = document.getElementById('applicationMessage');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) throw new Error('Not authenticated');
                
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        name,
                        mobile_number: phone,
                        updated_at: new Date()
                    })
                    .eq('id', user.id);
                
                if (error) throw error;
                
                messageEl.textContent = 'Application submitted successfully!';
                messageEl.className = 'form-message success';
                messageEl.style.display = 'block';
                
            } catch (error) {
                messageEl.textContent = error.message;
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            }
        });
        
        // Check if user is already signed in
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                signInForm.style.display = 'none';
                registerForm.style.display = 'none';
                applicationForm.style.display = 'block';
                
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    document.getElementById('appName').value = profile.name || '';
                    document.getElementById('appPhone').value = profile.mobile_number || '';
                }
            }
        }
        
        // Handle auth redirect after email confirmation
        async function handleAuthRedirect() {
            const { data, error } = await supabase.auth.getSessionFromUrl({
                url: window.location.href
            });
            
            if (data?.session) {
                // User just confirmed their email
                signInForm.style.display = 'none';
                registerForm.style.display = 'none';
                applicationForm.style.display = 'block';
                
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.session.user.id)
                    .single();
                
                if (profile) {
                    document.getElementById('appName').value = profile.name || '';
                    document.getElementById('appPhone').value = profile.mobile_number || '';
                }
            }
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            checkAuth();
            handleAuthRedirect();
        });
    </script>
