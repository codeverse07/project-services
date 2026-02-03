import os
import re

# Define the root directory
base_dir = r'c:\Users\User\Desktop\services\Services\Services'

# Replacements list
replacements = [
    (r'(?<!service)Worker', 'Technician'),
    (r'(?<!service)worker', 'technician'),
]

# Files identified from grep
files_to_process = [
    r'frontend\src\pages\Home\HomePage.jsx',
    r'frontend\src\context\TechnicianContext.jsx',
    r'frontend\src\components\home\TechnicianCharacter.jsx',
    r'frontend\src\components\home\ServiceStack.jsx',
    r'frontend\src\context\AdminContext.jsx',
    r'backend\src\routes\v1\reviewRoutes.js',
    r'backend\src\routes\v1\bookingRoutes.js',
    r'backend\src\routes\v1\adminRoutes.js',
    r'backend\src\models\TechnicianProfile.js',
    r'backend\src\controllers\reviewController.js',
    r'backend\src\controllers\bookingController.js',
    r'backend\src\controllers\adminController.js',
]

def process_file(relative_path):
    file_path = os.path.join(base_dir, relative_path)
    if not os.path.exists(file_path):
        print(f"Skipping (not found): {file_path}")
        return
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements:
            new_content = re.sub(pattern, replacement, new_content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

for rel_path in files_to_process:
    process_file(rel_path)

print("Final surgical rebranding complete.")
