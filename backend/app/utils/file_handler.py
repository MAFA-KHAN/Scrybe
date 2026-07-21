"""
Handles reading uploaded files into OpenCV-ready image arrays,
including multi-page PDF conversion via pdf2image.
"""
from pathlib import Path
import numpy as np
import cv2
from pdf2image import convert_from_bytes

from app.utils.validators import CorruptFileError


def load_image_from_bytes(data: bytes, filename: str) -> np.ndarray:
    """Returns a single BGR numpy array. For multi-page PDFs, converts all pages
    and stacks them vertically to allow full-document OCR and preview."""
    ext = Path(filename).suffix.lower()

    try:
        if ext == ".pdf":
            pages = convert_from_bytes(data, dpi=150)  # Use 150 DPI for performance
            if not pages:
                raise CorruptFileError("Couldn't read any pages from this PDF.")
            
            cv_images = []
            target_width = None
            
            for page in pages:
                pil_image = page.convert("RGB")
                arr = np.array(pil_image)
                img = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
                
                if target_width is None:
                    target_width = img.shape[1]
                elif img.shape[1] != target_width:
                    # Resize to match first page's width
                    h = int(img.shape[0] * (target_width / img.shape[1]))
                    img = cv2.resize(img, (target_width, h), interpolation=cv2.INTER_AREA)
                
                cv_images.append(img)
                
            return np.vstack(cv_images)
        else:
            arr = np.frombuffer(data, dtype=np.uint8)
            image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            if image is None:
                raise CorruptFileError("This file couldn't be read as an image.")
            return image
    except CorruptFileError:
        raise
    except Exception as exc:
        raise CorruptFileError(f"Couldn't process this file: {exc}") from exc

