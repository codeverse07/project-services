import os
import re

files_to_clean = [
    r'c:\Users\User\Desktop\services\Services\Services\frontend\src\pages\Worker\TechnicianDashboard.jsx',
    r'c:\Users\User\Desktop\services\Services\Services\frontend\src\pages\BeAPartner\TechnicianOnboardingPage.jsx',
    r'c:\Users\User\Desktop\services\Services\Services\frontend\src\pages\BeAPartner\TechnicianRegisterPage.jsx'
]

pattern = re.compile(r'dark:[^\s"\'`{}<>]*')

for file_path in files_to_clean:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = pattern.sub('', content)
        
        # Clean up double spaces that might result from removal
        new_content = re.sub(r'\s{2,}', ' ', new_content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned {file_path}")
    else:
        print(f"File not found: {file_path}")
