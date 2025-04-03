const request = require("supertest")
const server = require("../index")

// Get a number > 4 since originally there are 4 regs in cafes.json
const randomId = () => 4 + Math.ceil(Math.random() * 100)

describe("Operaciones CRUD de cafes", () => {
  /* 
  1. Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto. (3 Puntos)
  */
  describe("Probando ruta GET", () => {
    it("Obteniendo un 200", async () => {
      const { statusCode: status } = await request(server) //
        .get("/cafes")
        .send()
      expect(status).toBe(200)
    })

    it("Obteniendo un array", async () => {
      const { body: cafes } = await request(server) //
        .get("/cafes")
        .send()
      expect(cafes).toBeInstanceOf(Array)
    })

    it("Obteniendo 1+ elementos", async () => {
      const { body: cafes } = await request(server) //
        .get("/cafes")
        .send()
      expect(cafes.length).toBeGreaterThan(0)
    })
  })

  /* 
  2. Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe. (2 Puntos)
  */
  describe("Probando ruta DELETE", () => {
    it("Obteniendo 404 al eliminar un café inexistente", async () => {
      const { statusCode: status } = await request(server) //
        .delete("/cafes")
        .send("non-existent-id")
      expect(status).toBe(404)
    })
  })

  /*
  3. Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201. (2 Puntos)
  */
  describe("Probando ruta POST", () => {
    const newCafe = {}
    const response = {}

    beforeAll(async () => {
      const id = randomId()
      const nombre = "lorem ipsum"
      Object.assign(newCafe, { id, nombre })
      // Send request
      const { statusCode: status, body: cafes } = await request(server) //
        .post("/cafes")
        .send(newCafe)
      Object.assign(response, { status, cafes })
    })

    it("Obteniendo un 201 al agregar un café", async () => {
      const { status } = response
      expect(status).toBe(201)
    })

    it("Verificando que el café se agregó", async () => {
      const { cafes } = response
      expect(cafes).toContainEqual(newCafe)
    })
  })

  /* 
  4. Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload. (3 Puntos)
  */
  describe("Probando ruta PUT", () => {
    it("Obteniendo un 400 si el id de params no es igual al id del payload", async () => {
      const id = randomId()
      const payloadId = randomId()
      const payload = { id: payloadId, nombre: "lorem ipsum" }
      const { statusCode: status } = await request(server) //
        .put("/cafes/" + id)
        .send(payload)
      expect(status).toBe(400)
    })
  })
})
