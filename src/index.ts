import 'dotenv/config'
import httpserver from './http/server'

switch (process.argv[2]) {
    case "servidor":
        httpserver()
        break
    case "Archivo 2":
        break
    case "Archivo 3":
        break
    case "Archivo 4":
        break
    case "Archivo 5":
        break
    default:
        console.log('Atencion, se debe enviar un parametro con la accion a seguir')
}