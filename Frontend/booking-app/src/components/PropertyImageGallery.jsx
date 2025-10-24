
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';



const PropertyImageGallery = ({ images, profileImage, title }) => {



    return (
        <>
            <div className="grid grid-cols-4 grid-rows-2  w-180 h-96 gap-2 relative   ">
                {/* first large photo */}
                <div className='col-span-2 row-span-2 group'>
                    <img src={profileImage} alt={title} className='w-full h-full object-cover cursor-pointer rounded-xl group-hover:brightness-90 transition-all ' />
                </div>
                {/* smaller images */}
                {images?.slice(0, 4).map((img, index) => (
                    <div
                        key={index}
                        className='cursor-pointer relative group overflow-hidden'
                    >
                        <img src={img} className='w-full h-full object-cover group-hover:brightness-90 transition-all rounded-xl' />

                        {/* Show more overlay on last image */}
                        {index === 3 && images?.length > 4 && (
                            <div className="absolute inset-0 bg-black rounded-xl bg-opacity-50 flex items-center justify-center text-white font-semibold">
                                <Grid3X3 className="mr-2 h-5 w-5 " />
                                +{images.length - 4} photos
                            </div>
                        )}
                    </div>
                ))}

                


            </div>
        </>
    )
}

export default PropertyImageGallery