import db_Connection from "../DB/db_Connection.js";
import { globalResponse } from "./middlewares/global-response.middleware.js";
import * as routers from "./modules/index.routes.js";

export const initiateApp = (app, express) => {
  const port = process.env.PORT || 4000;

  app.use(express.json());

  app.use("/users", routers.userRouter);
  app.use("/categories", routers.categoryRouter);
  app.use("/tasks", routers.taskRouter);

  app.use("*", (req, res, next) => {
    res.status(404).json({ message: "Not Found" });
  });

  app.use(globalResponse);

  db_Connection();
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};
