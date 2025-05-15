import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999
            }}
        >
            <motion.img
                src="/logol.svg"
                alt="Laskaraya Logo"
                style={{
                    width: 500,
                    marginBottom: 32,
                    filter: "drop-shadow(0 2px 8px #ede9fe)"
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
            />
        </div>
    );
}
