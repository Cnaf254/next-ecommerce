import multiparty from "multiparty";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handle(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new multiparty.Form();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  
  const uploadedFiles = [];
  for (const file of files.file) {
    const tempPath = file.path;
    const fileExtension = path.extname(file.originalFilename);
    const date = new Date();
    const fileName = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}${fileExtension}`;
   
    const newPath = path.join(uploadDir, fileName);


    fs.renameSync(tempPath, newPath);

    
    uploadedFiles.push(`/uploads/${fileName}`);
  }

  return res.json({uploadedFiles});
}
