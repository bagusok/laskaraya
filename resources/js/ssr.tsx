import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import ReactDOMServer from "react-dom/server";
import { type RouteName, route } from "ziggy-js";
import ThemeWrapper from "./layouts/theme-wrapper";
import { Toaster } from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
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
    setup: ({ App, props }) => {
      /* eslint-disable */
      // @ts-expect-error
      global.route<RouteName> = (name, params, absolute) =>
        route(name, params as any, absolute, {
          // @ts-expect-error
          ...page.props.ziggy,
          // @ts-expect-error
          location: new URL(page.props.ziggy.location),
        });
      /* eslint-enable */

      return (
        <ThemeWrapper>
          <App {...props} />
          <Toaster position="top-right" />
        </ThemeWrapper>
      );
    },
  })
);
