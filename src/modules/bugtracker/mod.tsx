import Module from "../../classes/module.ts";
import Route from "../../classes/route.ts";
import App from "./frontend/App.tsx";
import { Context } from "../../types/mod.ts";
import { render } from "../../frontend/app/index.tsx";
import { React } from "../../../deps.ts";

export default class BugTracker extends Module {
  load() {
    console.log("I AM LOADED BUG");
    console.log(this.config.name);

    this.router.get("/test", (context) => {
      return render(context, <App />);
    });

    //database.connect();
  }
  unload() {
    console.log("I AM UNLODAED BUG");
    //database.close();
  }
}
