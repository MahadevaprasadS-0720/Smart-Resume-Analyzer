import os
import glob
import shutil

freed = 0
patterns = [
    r"C:\Users\madev\AppData\Local\Temp\*",
    r"C:\Users\madev\.gemini\antigravity-ide\brain\**\*.webp",
    r"C:\Users\madev\.gemini\antigravity-ide\brain\**\*.png",
    r"C:\Users\madev\.gemini\antigravity-ide\brain\**\click_feedback\*",
    r"C:\Users\madev\AppData\Local\npm-cache\_logs\*",
]

for pat in patterns:
    for f in glob.glob(pat, recursive=True):
        try:
            if os.path.isfile(f):
                sz = os.path.getsize(f)
                os.remove(f)
                freed += sz
            elif os.path.isdir(f):
                shutil.rmtree(f, ignore_errors=True)
        except Exception:
            pass

print(f"Total freed: {freed // (1024 * 1024)} MB")
