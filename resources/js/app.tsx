import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import ThemeWrapper from "./layouts/theme-wrapper";
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob("./pages/**/*.{tsx,jsx}")
    ).catch(() =>
      resolvePageComponent(
        `./pages/${name}.jsx`,
        import.meta.glob("./pages/**/*.{tsx,jsx}")
      )
    );
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <ThemeWrapper>
        <App {...props} />
      </ThemeWrapper>
    );
  },
  progress: {
    color: "#4B5563",
  },
});
