from PIL import Image

icons = ['public/icon-192.png', 'public/icon-512.png']
for icon in icons:
    try:
        img = Image.open(icon)
        print(f"{icon}: Width: {img.width}, Height: {img.height}")
    except Exception as e:
        print(f"Error with {icon}: {e}")
