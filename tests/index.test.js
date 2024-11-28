const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:8080"
const axios = {
    post: async (...args) => {
        try {
            const res = await axios2.post(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    get: async (...args) => {
        try {
            const res = await axios2.get(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    put: async (...args) => {
        try {
            const res = await axios2.put(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    delete: async (...args) => {
        try {
            const res = await axios2.delete(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
}


describe("Authentication", () => {
    test('User is able to sign up only once', async () => {
        const username = "pawan" + Math.random(); // pawan-0.12331313
        const password = "123456";
        const email = `abc${Math.floor(Math.random()*100)}@example.com`
        const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
            email,
            username,
            password,
        })

        expect(response.status).toBe(201)
    });

    test('Signup request fails if the email is empty', async () => {
        const username = `pawan-${Math.random()}` 
        const password = "123456"
        const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
            username,
            password
        })

        expect(response.status).toBe(400)
    })

    test('Signup fails if the email already exists', async() => {
        const username = `pawan-${Math.random()}`
        const password = "123456"
        const email = `abc${Math.floor(Math.random()*100)}@example.com`

        await axios.post(`${BACKEND_URL}/api/auth/signup`, {
            username,
            password,
            email
        });

        const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
            username,
            password,
            email
        });

        expect(response.status).toBe(409)
        
    })

    test('Signin succeeds if the username and password are correct', async() => {
        const username = `pawan-${Math.random()}`
        const password = "123456"
        const email = `abc${Math.floor(Math.random()*100)}@example.com`

        await axios.post(`${BACKEND_URL}/api/auth/signup`, {
            email,
            password
        });

        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email,
            password
        }); 

        expect(response.status).toBe(200)
        // expect(response.headers['set-cookie']).to.include('Authentication');

    })

})

// describe('Video feed EndPoints', () => { 
//     let token = ""
//     beforeAll(async () => {
//         const username = `pawan-${Math.random()}`
//         const password = "123456"
//         const email = `abc${Math.floor(Math.random()*100)}@example.com`
//         await axios.post(`${BACKEND_URL}/api/auth/signup`, {
//          username,
//          password,
//          email
//         });
 
//         const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
//          email,
//          password
//         })
 
//         token = response.data.access_token
 
//      })
//     test('Get video feed', async () => {
//         const response = await axios.get(`${BACKEND_URL}/api/videos/feed`)

//         expect(response.status).toBe(200)
//     });

//     test('user able to create channel', async () => {
//         const slug = `unique_channel_slug ${Math.random()*2}`
//         const name = `My Awesome Channel ${Math.random()*2}`

//         const response = await axios.post(`${BACKEND_URL}/api/channels`,
//             {
//                 name,
//                 "description": "Channel description",
//                 slug
//             },{
//             headers:{
//                  "authorization": `Bearer ${token}`
//             }
//         })
//         expect(response.status).toBe(201)
//     })

//     test("User validation error", async () => {

//         const response = await axios.post(`${BACKEND_URL}/api/channels`, {
//             "name": "My Awesome Channel",
//             "description": "Channel description",
//             "slug": "unique_channel_slug"
//         })

//         expect(response.status).toBe(400)
//     })

//     test("slug already exists", async()=>{

//         const slug = `unique_channel_slug ${Math.random()*2}`
//         const name = `My Awesome Channel ${Math.random()*2}` 

//         await axios.post(`${BACKEND_URL}/api/channels`, {
//             name,
//             "description": "Channel description",
//             slug
//         },{
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//         const response = await axios.post(`${BACKEND_URL}/api/channels`, {
//             "name":`My ${Math.random()*2}`,
//             "description": "Channel description",
//             slug
//         }, {
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//         expect(response.status).toBe(409)
//     })
//     test("user already as a channel", async()=>{
//         const name =`My Awesome Channel ${Math.random()*2}`
//         const slug = `unique_channel_slug ${Math.random()*2}`

//         await axios.post(`${BACKEND_URL}/api/channels`, {
//             name,
//             "description": "Channel description",
//             slug
//         },{
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//         const response = await axios.post(`${BACKEND_URL}/api/channels`, {
//             name,
//             "description": "Channel description",
//             slug
//         }, {
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//         expect(response.status).toBe(411)

//     })

//     test('Get api channels',async ()=>{
//         const name =`My Awesome Channel ${Math.random()*2}`
//         const slug = `unique_channel_slug ${Math.random()*2}`

//         await axios.post(`${BACKEND_URL}/api/channels`, {
//             name,
//             "description": "Channel description",
//             slug
//         },{
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//         const response = await axios.get(`${BACKEND_URL}/api/channels/${slug}`)
//         expect(response.status).toBe(200)
//     })
    
// })

// describe('Video upload', ()=>{
//     let token = ""
//     beforeAll(async () => {
//         const username = `pawan-${Math.random()}`
//         const password = "123456"
//         const email = `abc${Math.floor(Math.random()*100)}@example.com`
//         await axios.post(`${BACKEND_URL}/api/auth/signup`, {
//         username,
//         password,
//         email
//         });

//         await axios.post(`${BACKEND_URL}/api/auth/login`, {
//         email,
//         password
//         })

//         token = response.data.access_token
//         const slug = `unique_channel_slug ${Math.random()*2}`
//         const name = `My Awesome Channel ${Math.random()*2}`

//         await axios.post(`${BACKEND_URL}/api/channels`,
//             {
//                 name,
//                 "description": "Channel description",
//                 slug
//             },{
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//     })
//     test('upload vide', async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/videos/upload`, {

//         })
//     })
    
// })