"""Cloudinary image upload utility"""
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from typing import Optional
import io

from .config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

async def upload_image_to_cloudinary(
    file: UploadFile,
    folder: str = "pets_paws"
) -> str:
    """
    Upload an image file to Cloudinary
    
    Args:
        file: The image file to upload
        folder: The folder name in Cloudinary (default: "pets_paws")
    
    Returns:
        The secure URL of the uploaded image
    
    Raises:
        HTTPException: If upload fails or file type is invalid
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024  # 10MB in bytes
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 10MB limit"
        )
    
    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            resource_type="image",
            transformation=[
                {'width': 1000, 'height': 1000, 'crop': 'limit'},  # Limit max dimensions
                {'quality': 'auto:good'}  # Auto quality optimization
            ]
        )
        
        return result["secure_url"]
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload image to Cloudinary: {str(e)}"
        )
    finally:
        # Reset file pointer
        await file.seek(0)


def delete_image_from_cloudinary(image_url: str) -> bool:
    """
    Delete an image from Cloudinary using its URL
    
    Args:
        image_url: The secure URL of the image to delete
    
    Returns:
        True if deletion was successful, False otherwise
    """
    try:
        # Extract public_id from URL
        # URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
        parts = image_url.split("/")
        
        # Find the index of "upload" in the URL
        upload_index = parts.index("upload")
        
        # The public_id includes folder and filename (without extension)
        public_id_with_ext = "/".join(parts[upload_index + 2:])  # Skip version number
        public_id = public_id_with_ext.rsplit(".", 1)[0]  # Remove file extension
        
        # Delete from Cloudinary
        result = cloudinary.uploader.destroy(public_id)
        
        return result.get("result") == "ok"
    
    except Exception as e:
        print(f"Error deleting image from Cloudinary: {str(e)}")
        return False
