import { React, ReactDOMServer, ReactDOM, Router, Application } from "./deps.ts";

const app = new Application();

const router = new Router();
router.get("/", handlePage);

app.use(router.routes());
app.use(router.allowedMethods());

console.log("server is running on http://localhost:8000/");
await app.listen({ port: 8000 });

function App() {
    return <h1>Hello SSR</h1>;
}
function handlePage(ctx: any) {
    try {
        const body = ReactDOMServer.renderToString(<App />);
        ctx.response.body = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body >
                <div id="root">${body}</div>
            </body>
            </html>`;
    } catch (error) {
        console.error(error);
    }
}