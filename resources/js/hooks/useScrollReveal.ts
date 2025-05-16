import { useEffect } from "react";

export default function useScrollReveal(selector = ".reveal-element") {
    useEffect(() => {
        const revealElements = document.querySelectorAll(selector);

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            revealElements.forEach((el) => {
                const top = (el as HTMLElement).getBoundingClientRect().top;
                if (top < windowHeight - 60) {
                    el.classList.add("revealed");
                }
            });
        };

        revealOnScroll();
        window.addEventListener("scroll", revealOnScroll);
        return () => window.removeEventListener("scroll", revealOnScroll);
    }, [selector]);
}
