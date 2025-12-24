from PIL import Image

img = Image.open('public/Logo.png')
print(f"Width: {img.width}, Height: {img.height}")
