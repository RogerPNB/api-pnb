import  parsePhoneNumber,{isValidPhoneNumber } from "libphonenumber-js"
import {create, Whatsapp, Message, SocketState} from "venom-bot"
import { ScrapQrcode } from "venom-bot/dist/api/model/qrcode";

export type QRCode = {
    base64Qr: string
    asciiQR: string
    attempts: number
    urlCode?: string

}
class Sender{
    private client: Whatsapp
    private connected: boolean;
    private qr: QRCode;


     get isConnected() : boolean {
        return this.connected

    }

    get qrCode(): QRCode{
        return this.qr
    }

    constructor() {
        this.initialize()

    }

    async sendText(to: string, body:string){

        if(!isValidPhoneNumber(to, "BR")){
            throw new Error("Este numero não é valido")
        }
        let phoneNumber = parsePhoneNumber(to,"BR")
        ?.format("E.164")
        .replace("+","") as string

        phoneNumber = phoneNumber.includes("@c.us")
        ? phoneNumber
        : `${phoneNumber}@c.us`

        console.log(phoneNumber)

       await this.client.sendText(phoneNumber, body)
    }

    private initialize() {
        const qr = (base64Qr: string, asciiQR:string, attempts:number) => {
            this.qr = {base64Qr, asciiQR,attempts}
         }

        const status =    (statusSession:string) => {
          
            this.connected = ["isLogged","qrReadSuccess","chatAvalilable"].includes(
                statusSession
            )
          }

        const start = (client: Whatsapp)=>{
            this.client = client

            // client.onStateChange((state) =>{
            //     this.connected = state === SocketState.CONNECTED

            // })

            // this.sendText("5512991506853@c.us", "Ola este é um teste")
        }


        create('session', qr)
        .then((client) => start(client))
        .catch((error) => console.error(error)) 
    }
}

export default Sender