const request = require("supertest")
const { faker } = require("@faker-js/faker")
const server = require("../index")

// Get a number > 4 since originally there are 4 regs in cafes.json
const idOptions = { min: 5, max: 100 }

describe("Operaciones CRUD de cafes", () => {
  /* 
  1. Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto. (3 Puntos)
  */

  describe("Probando ruta GET /cafes", () => {
    let response

    beforeAll(async () => {
      response = await request(server).get("/cafes")
    })

    it("Obteniendo un 200", () => {
      expect(response.statusCode).toBe(200)
    })

    it("Obteniendo un array", () => {
      expect(response.body).toBeInstanceOf(Array)
    })

    it("Obteniendo 1+ elementos", () => {
      expect(response.body.length).toBeGreaterThanOrEqual(1)
    })
  })

  /* 
  2. Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe. (2 Puntos)
  */
  describe("Probando ruta DELETE /cafes", () => {
    const id = faker.number.int(idOptions)

    it("Obteniendo 400 al eliminar un café sin logearse", async () => {
      const response = await request(server).delete(`/cafes/${id}`)
      expect(response.statusCode).toBe(400)
    })

    it("Obteniendo 404 al eliminar un café inexistente", async () => {
      const jwt = faker.internet.jwt()
      const response = await request(server) //
        .delete(`/cafes/${id}`)
        .set("Authorization", `Bearer ${jwt}`)
      expect(response.statusCode).toBe(404)
    })
  })

  /*
  3. Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201. (2 Puntos)
  */
  describe("Probando ruta POST /cafes", () => {
    const newCafe = {
      id: faker.number.int(idOptions),
      nombre: faker.food.ethnicCategory(),
    }
    let response

    beforeAll(async () => {
      response = await request(server).post("/cafes").send(newCafe)
    })

    afterAll(async () => {
      // Deleting newCafe from database after all tests on POST /cafes are done
      const jwt = faker.internet.jwt()
      await request(server) //
        .delete(`/cafes/${newCafe.id}`)
        .set("Authorization", `Bearer ${jwt}`)
    })

    it("Obteniendo un 201 al agregar un café", () => {
      expect(response.statusCode).toBe(201)
    })

    it("Verificando que el café se agregó", () => {
      expect(response.body).toContainEqual(newCafe)
    })
  })

  /* 
  4. Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload. (3 Puntos)
  */
  describe("Probando ruta PUT /cafes/:id", () => {
    it("Obteniendo un 400 si el id de params no es igual al id del payload", async () => {
      const id = faker.number.int(idOptions)
      const payload = {
        id: faker.number.int(idOptions),
        nombre: faker.food.ethnicCategory(),
      }
      const response = await request(server).put(`/cafes/${id}`).send(payload)
      expect(response.statusCode).toBe(400)
    })
  })
})
