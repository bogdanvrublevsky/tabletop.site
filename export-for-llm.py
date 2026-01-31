import os, sys, re
from datetime import datetime

IGNORE_PATTERNS = [
    '.git',
    '__pycache__',
    '.gitignore',
    'export-for-llm.py',
    'log',
]

def should_ignore(file_path, base_path):
    """Check if file or directory should be ignored."""
    basename = os.path.basename(file_path)
    relative_path = os.path.relpath(file_path, base_path)
    
    for pattern in IGNORE_PATTERNS:
        if pattern in relative_path or basename == pattern:
            return True
    
    return False

def get_file_tree(directory, base_path, prefix=''):
    """Generate a visual tree structure of the directory."""
    items = sorted(os.listdir(directory))
    result = ''
    
    for index, item in enumerate(items):
        item_path = os.path.join(directory, item)
        
        if should_ignore(item_path, base_path):
            continue
        
        is_last = index == len(items) - 1
        current_prefix = '└── ' if is_last else '├── '
        next_prefix = '    ' if is_last else '│   '
        
        if os.path.isdir(item_path):
            result += f"{prefix}{current_prefix}{item}/\n"
            result += get_file_tree(item_path, base_path, prefix + next_prefix)
        else:
            result += f"{prefix}{current_prefix}{item}\n"
    
    return result

def get_file_contents(directory, base_path, relative_base=''):
    """Get contents of all files in directory."""
    items = sorted(os.listdir(directory))
    result = ''
    
    for item in items:
        item_path = os.path.join(directory, item)
        relative_path = os.path.join(relative_base, item)
        
        if should_ignore(item_path, base_path):
            continue
        
        if os.path.isdir(item_path):
            result += get_file_contents(item_path, base_path, relative_path)
        else:
            try:
                with open(item_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                result += f"\n--- {relative_path} ---\n"
                result += content
                result += '\n'
            except:
                result += f"\n--- {relative_path} (READ ERROR) ---\n"
    
    return result

def export_project():
    """Export the current directory to a text file."""
    current_dir = os.getcwd()
    
    output = 'STRUCTURE:\n'
    output += get_file_tree(current_dir, current_dir)
    output += '\n'
    
    output += 'FILES:\n'
    output += get_file_contents(current_dir, current_dir)
    
    # Create log directory
    log_dir = os.path.join(current_dir, 'log')
    os.makedirs(log_dir, exist_ok=True)
    
    # Write to file
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f"project-export-{timestamp}.log"
    output_path = os.path.join(log_dir, output_file)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)
    
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Export complete: {output_path}")
    print(f"File size: {file_size_mb:.2f} MB")

if __name__ == '__main__':
    export_project()