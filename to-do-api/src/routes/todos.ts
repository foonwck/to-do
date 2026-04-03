import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";

export const todoRoutes = new Elysia({ prefix: "/todos" })

  // TODO: Step 1 - GET /todos — ดึง todos ทั้งหมด
  // query params (ทั้งหมด optional):
  //   filter:    "all" | "active" | "completed"  (default "all")
  //   sortBy:    "createdAt" | "title"            (default "createdAt")
  //   sortOrder: "asc" | "desc"                   (default "desc")
  // Logic: ถ้า filter === "all" → where = {} ไม่งั้น where = { completed: filter === "completed" }
  // ใช้ t.Object + t.Optional + t.Union + t.Literal สำหรับ query validation
  .get("/", async ({ query }) => {
    const filter = query.filter ?? "all";
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const where = filter === "all" ? {} : {
      completed: filter === "completed"
    };

    return prisma.todo.findMany({
      where,
      orderBy: {[sortBy]: sortOrder}
    })
  }, {
    query: t.Object({
      filter: t.Optional(
        t.Union([t.Literal("all"), t.Literal("active"), t.Literal("completed")])
      ),
      sortBy: t.Optional(
        t.Union([t.Literal("createdAt"), t.Literal("title")]),
      ),
      sortOrder: t.Optional(
        t.Union([t.Literal("asc"), t.Literal("desc")])
      )
    }),
  })

  // TODO: Step 2 - GET /todos/:id — ดึง todo เดี่ยว
  // params: id (t.Numeric)
  // ถ้าไม่เจอ: set.status = 404, return { message: "Todo not found" }
  .get("/:id", async ({ params, set }) => {
    // TODO: implement
    const todo = await prisma.todo.findUnique({
      where: {id: Number(params.id)}
    });

    if(!todo){
      set.status = 404;
      return { message: "Todo not found"}
    }

    return todo;

  }, { params: t.Object({ id: t.Numeric() }) })

  // TODO: Step 3 - POST /todos — สร้าง todo ใหม่
  // body: { title: string (minLength: 1) }
  .post("/", async ({ body }) => {
    // TODO: implement
    return prisma.todo.create({
      data: {
        title: body.title
      }
    })
  }, {
    body: t.Object({
      // TODO: กำหนด schema สำหรับ title
      title: t.String({ minLength: 1 })
    }),
  })

  // TODO: Step 4 - PATCH /todos/:id — อัปเดต todo
  // params: id (t.Numeric), body: { title?: string, completed?: boolean }
  // ตรวจสอบว่า todo มีอยู่ก่อน ถ้าไม่เจอ return 404
  .patch("/:id", async ({ params, body, set }) => {
    // TODO: implement
    const exists = await prisma.todo.findUnique({
      where: {
        id: Number(params.id)
      }
    });

    if(!exists){
      set.status = 404;
      return { message: "Todo not found" }
    }

    return prisma.todo.update({
      where: { id: Number(params.id) },
      data: body,
    })
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Object({
      // TODO: กำหนด schema สำหรับ title (optional) และ completed (optional)
      title: t.Optional(t.String({ minLength: 1 })),
      completed: t.Optional(t.Boolean()),
    }),
  })

  // TODO: Step 5 - DELETE /todos/:id — ลบ todo
  // params: id (t.Numeric)
  // ตรวจสอบว่า todo มีอยู่ก่อน ถ้าไม่เจอ return 404
  // return { message: "Deleted successfully" }
  .delete("/:id", async ({ params, set }) => {
    const todo = await prisma.todo.findUnique({
      where: {id: Number(params.id)}
    });

    if(!todo){
      set.status = 404;
      return { message: "Todo not found"}
    }

    await prisma.todo.delete({
      where: {id: Number(params.id)}
    });

    return { message: "Deleted successfully" };
  }, { params: t.Object({ id: t.Numeric() }) });