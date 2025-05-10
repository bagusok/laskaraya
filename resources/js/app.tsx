import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import ThemeWrapper from "./layouts/theme-wrapper";
import { Toaster } from "react-hot-toast";
import QueryClientWrapper from "./layouts/query-client-wrapper";

const appName = import.meta.env.VITE_APP_NAME || "LASKARAYA";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    // resolve: (name) => {
    //   return resolvePageComponent(
    //     `./pages/${name}.tsx`,
    //     import.meta.glob("./pages/**/*.{tsx,jsx}")
    //   ).catch(() =>
    //     resolvePageComponent(
    //       `./pages/${name}.jsx`,
    //       import.meta.glob("./pages/**/*.{tsx,jsx}")
    //     )
    //   );
    // },
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <QueryClientWrapper>
                <ThemeWrapper>
                    <App {...props} />
                    <Toaster position="top-right" />
                </ThemeWrapper>
            </QueryClientWrapper>
        );
    },
    progress: {
        color: "#4B5563"
    }
});
