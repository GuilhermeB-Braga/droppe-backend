export async function runJob(name: string, fn: ()=> Promise<any>): Promise<void>{
    try {
        console.log(`Job iniciado: ${name}`)
        await fn()
        console.log(`Job finalizado: ${name}`)
    } catch (error) {
        if(error instanceof Error){
            console.log(`Erro no job ${name}: `, error.message)
        }
    }
}