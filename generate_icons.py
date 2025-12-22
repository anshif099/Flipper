from PIL import Image
import os

def generate_icons_with_padding():
    source_logo = 'public/Logo.png'
    output_sizes = {
        'public/pwa-icon-192.png': 192,
        'public/pwa-icon-512.png': 512
    }

    if not os.path.exists(source_logo):
        print(f"Error: {source_logo} not found.")
        return

    try:
        img = Image.open(source_logo)
        # Ensure image is RGBA (handle transparency)
        img = img.convert("RGBA")
        
        print(f"Original logo size: {img.size}")
        
        for output_path, size in output_sizes.items():
            print(f"Generating {output_path} ({size}x{size})...")
            
            # Create a square canvas with transparent background
            square_img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
            
            # Calculate scaling to fit within the square while maintaining aspect ratio
            # Leave 10% padding on each side
            max_dimension = int(size * 0.8)
            
            # Calculate the scaling factor
            scale = min(max_dimension / img.width, max_dimension / img.height)
            new_width = int(img.width * scale)
            new_height = int(img.height * scale)
            
            # Resize the logo
            resized_logo = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Calculate position to center the logo
            x = (size - new_width) // 2
            y = (size - new_height) // 2
            
            # Paste the logo onto the square canvas
            square_img.paste(resized_logo, (x, y), resized_logo)
            
            # Save the result
            square_img.save(output_path, "PNG")
            print(f"Saved {output_path} (logo centered at {new_width}x{new_height})")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_icons_with_padding()
