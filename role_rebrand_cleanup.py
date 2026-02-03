import os
import re

# Define the root directory
base_dir = r'c:\Users\User\Desktop\services\Services\Services'

# Replacements list
replacements = [
    (r'\bWORKER\b', 'TECHNICIAN'),
]

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
        # Silently skip encoding errors for non-UTF8 files
        pass

for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if d not in skip_folders]
    for file in files:
        if any(file.endswith(ext) for ext in skip_extensions):
            continue
        process_file(os.path.join(root, file))

print("Role identifier rebranding complete.")
