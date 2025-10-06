import os
import sys

if len(sys.argv) > 1:
    name_from = sys.argv[1].lower()
    name_to = sys.argv[2].lower()

directory_path = "./"

filenames = [
    "docker-commands.md",
    "terraform/deployment.yaml",
    "terraform/variables.tf",
]

try:
    for filename in filenames:
        file_path = os.path.join(directory_path, filename)

        with open(file_path, "r") as f:
            content = f.read()

        protected = "__DEPLOYMENT_YAML__"
        content = content.replace("deployment.yaml", protected)

        new_content = content.replace(name_from, name_to)

        new_content = new_content.replace(protected, "deployment.yaml")

        with open(file_path, "w") as f:
            f.write(new_content)

            if content != new_content:
                print(f"{file_path} updated")
            else:
                print(f"{file_path} unchanged")


except FileNotFoundError:
    print(f"Error: Directory not found at {directory_path}")
except Exception as e:
    print(f"An error occurred: {e}")
