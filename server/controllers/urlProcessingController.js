import processRepo from "../processes/processRepo.js"



export const urlprocessor =  async  (req,res)=>{
    console.log(req.body);
    
    const gitHubLink = req.body.link;
    processRepo(gitHubLink)
   
   console.log(req.body);
   
   return res.json({ data: req.body });
}