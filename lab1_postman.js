import express from 'express'

const app = express()
app.use(express.json())

let runners = [
    { id: 1, name: "Amit Sharma", event: "Pune MahaMarathon", category: "10km" },
    { id: 2, name: "Priya Patel", event: "Mumbai Marathon", category: "Half Marathon" }
]

app.get('/api/runners', (req, res)=>{
    res.status(200).json(runners)
})

app.get('/api/runners/:id', (req, res)=>{
    const runnerId = parseInt(req.params.id)
    const runner = runners.find((r) => {
        return r.id === runnerId
    })

    if(!runner){
        return res.status(404).json({error:'Runner not found'})
    }
    if(runner){
        return res.status(200).json(runner)
    }
})


//add new runner to runners
app.post('/api/runners', (req, res)=>{
    const {name, event, category} =req.body

    if(!name || !event || !category){
        return res.status(400).json({ error: "Please provide name, event, and category." });
    }

    const newRunner = {
        id: runners.length+1,
        name: name,
        event: event,
        category: category
    }

    runners.push(newRunner)
    res.status(200).json({message :"Added new runner", data : newRunner})
})

//update existing runner
app.put('/api/runners/:id',(req,res)=>{
    const runnerId = parseInt(req.params.id)
    const runnerIndex = runners.findIndex((r)=>{
        return r.id === runnerId
    })//findIndex returns -1 if the runner not found

    if(runnerIndex===-1){
        return res.status(404).json({error:"Runner not found"})
    }

    runners[runnerIndex] = {...runners[runnerIndex], ...req.body}
    //spread operator shall give new key value pair if we enter a key that is not already there in 
    //runners[runnerIndex] for example -> age : 10

    //spread operator shall update existing key value pair if we enter already existing key
    //ex) name : "Ramesh"

    res.status(200).json({message : "Updated runner info in runners", data : runners[runnerIndex]})
})


//splice syntax -> .splice(startIndex, deleteCount, item1, item2...)
//item1, item2 => the iems to be added to the array

app.delete('/api/runners/:id', (req, res)=>{
    const runnerId = parseInt(req.params.id)
    const runnerIndex = runners.findIndex((r)=>{
        return r.id === runnerId
    })

    if(runnerIndex === -1){
        return res.status(404).json({error : "Runner not found"})
    }

    runners.splice(runnerIndex, 1)
    res.status(200).json({message:"Runner deleted"})
})

app.listen(3000, () => {
    console.log(`API running on http://localhost:3000`);
});


