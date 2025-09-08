import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ profileImage,
    galleryImages,
    onProfileImageChange,
    onGalleryImagesChange }) => {


    const [profilePreview, setProfilePreview] = useState(null)
    const [galleryPreviews, setGalleryPreviews] = useState([])

    const onProfileDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            setProfilePreview(URL.createObjectURL(file))
            onProfileImageChange(file)
        }
    }, [onProfileImageChange])

    const onGalleryDrop = useCallback((acceptedFiles) => {
        const newFiles = [...galleryImages, ...acceptedFiles]
        onGalleryImagesChange(newFiles)

        const newPreviews = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setGalleryPreviews(prev => [...prev, ...newPreviews])
    }, [galleryImages, onGalleryImagesChange])

    const removeGalleryImage = (index) => {
        const newFiles = galleryImages.filter((_, i) => i !== index);
        const newPreviews = galleryPreviews.filter((_, i) => i !== index);
        onGalleryImagesChange(newFiles);
        setGalleryPreviews(newPreviews);
    };

    const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps, isDragActive: isProfileDragActive } = useDropzone({
        onDrop: onProfileDrop,
        accept: { 'image/*': [] },
        multiple: false,
        maxSize: 5 * 1024 * 1024 // 5MB
    })

    const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
        onDrop: onGalleryDrop,
        accept: { 'image/*': [] },
        multiple: false,
        maxSize: 5 * 1024 * 1024 // 5MB
    })



    return (
        <>
            <section className="space-y-4 mt-3">
                <h2 className="text-lg  text-gray-700">Photos</h2>

                {/*Profile */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo (Required)  </label>
                    <div {...getProfileRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors 
                    ${isProfileDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 '}`}
                    >
                        <input {...getProfileInputProps()} />
                        {profilePreview ? (
                            <div className="space-y-2">
                                <img
                                    src={profilePreview}
                                    alt="Cover Preview"
                                    className="mx-auto h-32 w-48 object-cover rounded-lg" />
                                <p className="text-sm text-gray-600">Click or drag to replace</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="mx-auto h-12 w-12 text-gray-400">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {isProfileDragActive
                                        ? "Drop your cover image here"
                                        : "Drag & drop cover image or click to browse"
                                    }
                                </p>
                                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gallery Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Required)  </label>
                    <div {...getGalleryRootProps()} className={`
                        border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                        ${isGalleryDragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }
                    `} >
                        <input {...getGalleryInputProps()} />
                        <div className="space-y-2">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600">
                                {isGalleryDragActive
                                    ? "Drop your images here"
                                    : "Drag & drop images or click to browse"
                                }
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB each</p>
                        </div>
                    </div>

                    {/* Gallery Preview Grid  */}
                    {galleryPreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {galleryPreviews.map((item, index) => (
                                <div key={index} className="relative group" >
                                    <img
                                        src={item.preview}
                                        alt={`Gallery ${index + 1}`}
                                        className="h-24 w-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-1 right-1  text-white rounded-full p-1 cursor-pointer"
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </section>
        </>
    );
};

export default ImageUploader;