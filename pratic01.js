const http= require('http')
const axios= require('axios')
const { describe } = require('node:test')

//lista de tarefas
let tasks= []

//Atualiza o clima a cada 30 minutos
const updateWeatherInterval= setInterval(() => {
    fetchWeather()
},30*60*1000) //30 minutos em milisegundos

//Função para buscar dados do clima de uma api (exemplo: OpenWeatherMap)
async function fetchWeather(){
    try{
        const apiKey= 'sua_api_key'
        const city= 'São José dos Campos'
        const url= `https://www.metaweather.com/api/`

        const response= await axios.get(url)
        const weatherData= response.data

        console.log(`Clima em ${city}: ${weatherData.main.temp}*C, ${weatherData.weather[0].description}`)
    } catch(error){
        console.error('Erro ao buscar dados do clima:', error.message)

    }
}

//cria uma tarefa
function createTask(description) {
    if (!description){
        console.error('Descrição da tarefa não fornecida.')
        return
    }

    const task= {id: tasks.lenght + 1, description, done: false }
    tasks.push(task);
    console.log(`Tarefa "${description}" criada com sucesso!`)
} 

//Lista todas as tarefas
function listTasks(){
    console.log('Lista de tarefas:')
    tasks.forEach(task => {
        console.log(`${task.id}. [${task.done ? 'x' : ' '}] ${task.description}`)
    })
}

//marca uma tarefa como concluída
function completeTask(id){
    const task= tasks.find(task => task.id === id)
    if (!task){
        console.error('Tarefa não encontrada.')
        return
    }
    task.done= true
    console.log(`Tarefa "${task.description}" marcada como concluída"`)
}

//exclui uma tarefa
function deleteTask(id){
    const taskIndex = tasks.findIndex(task => task.id === id)
    if (taskIndex === -1){
       console.error('Tarefa não encontrada')
       return
    } 
    const deletedTask = tasks.splice(taskIndex, 1)[0]
    console.log(`Tarefa "${deleteTask.description} excluída!`)
}


//Cria um servidor HTTP para interagir com o programa
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.end('Bem vindo ao Sistema de Gerenciamenteo de Tarefas\n')
    } else if (req.method === 'GET' && req.url === '/tasks'){
        res.writeHead(200, {'Content-Type': 'text/plain'})
        listTasks();
        res.end();
    } else if (req.method === 'GET'  && req.url === '/tasks'){
        res.writeHead(200, {'Content-Type' : 'text/plain'})
        listTasks()
        res.end()
    } else if (req.method === 'POST' && req.url === '/tasks'){
        let data = ''
        req.on('data', chunck => {
            data += chunck
        })
        req.on('end', () => {
            const taskData= JSON.parse(data)
            createTask(taskData.description)
            res.writeHead(201, {'Content-Type' : 'text/plain'})
            res.end('Tarefa criada com sucesso! \n')
        })
        try{
            const taskData = JSON.parse(data)
            createTask(taskData.description)
            res.writeHead(201,{'Content-Type':'text/plain'})
            res.end('Tarefa criada com sucesso! \n')
        } catch (error){
            console.error('Erro ao criar a tarefa:', error.message)
            res.writeHead(400, {'Content-Type':'text/plain'})
            res.end('Erro ao criar tarefa. \n')
        }}else if (req.method==='PUT' && req.url.startsWith('/tasks')){
            const taskId= parseInt(req.url.split('/')[2])
            if (isNaN(taskId)){
                console.error('ID da tarefa inválido')
                res.writeHead(400, {'Content-Type':'text/plain'})
                res.end('ID da tarefa inválido. \n')
                return
            }
        completeTask(taskId)
        res.writeHead(200, {'Content-Type':'text/plain'})
        res.end('Tarefa marcada como concluída \n')
    } else if (req.method === 'DELETE' && req.url.startsWith('/tasks/')){
        const taskId= parseInt(req.url.split('/')[2]);
        if(isNaN(taskId)){
            console.error('ID da tarefa inválido.')
            res.writeHead(400, {'Content-Type':'text/plain'})
            res.end('ID da tarefa inválido.\n')
            return
        }
        deleteTask(taskId)
        res.writeHead(200, {'Content-Type':'text/plain'})
        res.end('Tarefa excluída!. \n')
    } else{
        res.writeHead(404, { 'Content-Type':'texy/plain'})
        res.end('Rota não encontrada. \n')
    }
})

server.listen(3000, ()=> {
    console.log('Servidor rodando na porta 3000')
})

//Finaliza a aplicação ao pressionar CTRL+C
process.on('SIGINT', () => {
    clearInterval(updateWeatherIntercal)
    console.log('\nAplicação encerrada.')
    process.exit()
})