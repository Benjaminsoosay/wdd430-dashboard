const bcrypt = require('bcryptjs');

// The hash from your database
const storedHash = '$2b$10$1VwoCLXN75ZioJWxq9nvQefDoQVMLBpmKAuCCvmnDPQkI.4MLB0X.';
const password = '123456';

console.log('Testing password comparison...');
console.log('Stored hash:', storedHash);
console.log('Password:', password);

// Test 1: Compare directly
bcrypt.compare(password, storedHash, (err, result) => {
    if (err) console.error('Error:', err);
    console.log('Test 1 - Direct compare result:', result);
    
    // Test 2: Generate a new hash for the same password
    bcrypt.hash('123456', 10, (err, newHash) => {
        if (err) console.error('Error:', err);
        console.log('New hash for 123456:', newHash);
        
        bcrypt.compare('123456', newHash, (err, result2) => {
            console.log('Test 2 - New hash compare result:', result2);
        });
    });
});