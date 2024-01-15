const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config()


app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5001;

const {MongoClient,ServerApiVersion, ObjectId}=require('mongodb')
const uri=`mongodb+srv://sowad1999:${process.env.PASS}@cluster0.1kwmu9j.mongodb.net/?retryWrites=true&w=majority`
const client=new MongoClient(uri,{
    serverApi:{
       version: ServerApiVersion.v1,
    strict:true,
    deprecationErrors:true
    }
})
async function run(){
    try{
    // client.connect()
       const database=  client.db("Job_task")
       const contactCollections=database.collection("contact")

       app.post('/add',async(req,res)=>{
        const contact=req.body
        console.log('new products',contact)
        const result=await contactCollections.insertOne(contact)
        console.log(result)
        res.send(result)
       })

       app.get("/all", async (req, res) => {
        const result = await contactCollections.find().toArray();
       // console.log(result);
        res.send(result);
      });
      //delete contact info
       app.delete("/delete/:id", async (req, res) => {
        const id=req.params.id
        const filter = {
            _id: new ObjectId(id),
          };
       
         const result = await contactCollections.deleteOne(filter)
  
         res.send(result);
      });

          // Update favourite status
    app.patch('/fav/:id', async (req, res) => {
      const id = req.params.id
      const sta = req.body.status
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          fav: sta,
        },
      }
   
      const result = await contactCollections.updateOne(query, updateDoc)
      res.send(result)
    })
// update contact info
      app.put("/update/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;

        const filter = {
          _id: new ObjectId(id),
        };
        const options = { upsert: true };
        const updatedData = {
          $set: {
            Name: data.Name,
            Phone:data.Phone,
            Address:data.Address,
            Email:data.Email,
            ProfilePicture:data.image
            
          },
        };
        const result = await contactCollections.updateOne(
          filter,
          updatedData,
          options
        );
        res.send(result);
      });

        console.log("succesfully connected to mongo database")
        
    }finally{
     //   await client.close()
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Crud is running .....");
  });
app.listen(port, () => {
    console.log(`app is running in http://localhost:${port}/`)
  });