"""
Image preprocessing pipeline — improves OCR accuracy before Tesseract runs.
Steps: grayscale -> adaptive threshold -> denoise -> deskew.
"""
import cv2
import numpy as np


def preprocess_image(image: np.ndarray) -> np.ndarray:
    """Takes a BGR image array, returns a cleaned-up grayscale array ready for OCR."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Adaptive threshold handles uneven lighting better than a global one
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 11
    )

    denoised = cv2.fastNlMeansDenoising(thresh, h=15)

    # Check background color and invert if mostly black so Tesseract gets black text on white
    n_black = np.sum(denoised == 0)
    n_white = np.sum(denoised == 255)
    if n_black > n_white:
        denoised = cv2.bitwise_not(denoised)

    return _deskew(denoised)


def _deskew(image: np.ndarray) -> np.ndarray:
    # After potential inversion above, the background should be white (255) and text black (0)
    # We find coordinates of dark pixels (text)
    n_black = np.sum(image == 0)
    n_white = np.sum(image == 255)
    
    if n_black > n_white:
        coords = np.column_stack(np.where(image > 0))
    else:
        coords = np.column_stack(np.where(image < 255))
        
    if coords.size == 0:
        return image

    rect = cv2.minAreaRect(coords)
    angle = rect[-1]
    
    # Normalize angle
    if angle < -45:
        angle = 90 + angle
    elif angle > 45:
        angle = angle - 90

    # Ignore extremely small rotations to prevent bilinear interpolation artifacts
    if abs(angle) < 0.5 or abs(angle) > 89.5:
        return image

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(
        image, matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
    )

