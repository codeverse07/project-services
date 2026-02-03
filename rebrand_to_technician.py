import os
import re

# Define the root directory
base_dir = r'c:\Users\User\Desktop\services\Services\Services'

# Replacements list (order matters: more specific first)
replacements = [
    # Components & Classes
    (r'TechnicianDashboard', 'TechnicianDashboard'),
    (r'TechnicianOnboarding', 'TechnicianOnboarding'),
    (r'TechnicianRegister', 'TechnicianRegister'),
    (r'TechnicianContext', 'TechnicianContext'),
    (r'TechnicianProvider', 'TechnicianProvider'),
    (r'TechnicianProfile', 'TechnicianProfile'),
    (r'TechnicianCharacter', 'TechnicianCharacter'),
    (r'SupermanTechnician', 'SupermanTechnician'),
    
    # Hooks & Context
    (r'useTechnician', 'useTechnician'),
    
    # Variables & Properties
    (r'technicianProfile', 'technicianProfile'),
    (r'technicianController', 'technicianController'),
    (r'technicianRoutes', 'technicianRoutes'),
    (r'technicianService', 'technicianService'),
    (r'technicianValidation', 'technicianValidation'),
    
    # Paths & Routes
    (r'pages/Technician', 'pages/Technician'),
    (r'/pages/Technician', 'pages/Technician'),
    (r'/technician/', '/technician/'),
    (r'/api/v1/technicians', '/api/v1/technicians'),
    
    # UI Text
    (r'Technician Dashboard', 'Technician Dashboard'),
    (r'Technician onboarding', 'Technician onboarding'),
    (r'Technician registration', 'Technician registration'),
    (r'Technician Profile', 'Technician Profile'),
]

# Files to skip (mostly non-text or unrelated)
skip_folders = {'.git', 'node_modules', '.antigravity', 'public', 'assets', 'dist'}
skip_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf', '.docx'}

def process_file(file_path):
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

for root, dirs, files in os.walk(base_dir):
    # Skip unwanted folders
    dirs[:] = [d for d in dirs if d not in skip_folders]
    
    for file in files:
        if any(file.endswith(ext) for ext in skip_extensions):
            continue
            
        file_path = os.path.join(root, file)
        process_file(file_path)

print("Global rebranding complete.")
