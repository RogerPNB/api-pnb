import express, {Request, Response} from "express"
import Sender from "./sender"

const sender = new Sender()

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get("/status", (req: Request, res: Response) =>{
    return res.send({
        qr_code: sender.qrCode
        // connected: sender.isConnected,
    })

})

app.post("/send", async (req: Request, res: Response) =>{
const dados = req.query

    let number:string = dados.number as string
    let message:string = dados.message as string
   console.log(req)
    console.log(req.query)
    try{
        await sender.sendText(number , message)

        return res.status(200).json()
    }catch(error){
        console.error("error", error)
        res.status(500).json({status: "error",message:error})
    }
   
})

// app.listen(5000, ()=>{
//     console.log('server start')
// })  


app.listen(port, () =>{
    console.log("SERVIDOR ESTA RODANDO....")
})
