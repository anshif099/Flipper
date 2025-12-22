from PIL import Image
import os

def generate_icons():
    source_logo = 'public/Logo.png'
    output_sizes = {
        'public/icon-192.png': (192, 192),
        'public/icon-512.png': (512, 512)
    }

    if not os.path.exists(source_logo):
        print(f"Error: {source_logo} not found.")
        return

    try:
        img = Image.open(source_logo)
        # Ensure image is RGBA (handle transparency)
        img = img.convert("RGBA")
        
        for output_path, size in output_sizes.items():
            print(f"Generating {output_path} ({size[0]}x{size[1]})...")
            # Resize with LANCZOS for high quality
            resized_img = img.resize(size, Image.Resampling.LANCZOS)
            resized_img.save(output_path, "PNG")
            print(f"Saved {output_path}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_icons()
