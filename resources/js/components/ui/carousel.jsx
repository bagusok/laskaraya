import { useState, useEffect } from "react";

export default function Carousel() {
    const [images, setImages] = useState([
        { id: 1, url: "/menang.jpg", alt: "Image 1" },
        { id: 2, url: "/mika.avif", alt: "Image 2" },
        { id: 3, url: "/ver.jpeg", alt: "Image 3" },
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);

    // Automatic sliding every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
                setNextIndex(newIndex === images.length - 1 ? 0 : newIndex + 1);
                return newIndex;
            });
        }, 3000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [images.length]);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <img
                        key={image.id}
                        src={image.url}
                        alt={image.alt}
                        className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
