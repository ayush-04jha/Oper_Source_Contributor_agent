import processRepo from "../processes/processRepo.js"



export const urlprocessor = async (req, res) => {
    const gitHubLink = req.body.link;
    try {
        await processRepo(gitHubLink)
        return res.status(200).json({message:"all files processed"})
    }
    catch (e) {
        return res.status(500).json({ message: e.message })
    }
}