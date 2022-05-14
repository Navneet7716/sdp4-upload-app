const multer = require("multer");

const multerStorage = multer.memoryStorage();
const document = require("file-convert");

const { exec } = require("child_process");


const aws = require("aws-sdk");
const fs = require("fs");


const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

const multerFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserFile = upload.single("file");

exports.fileUploader = async (req, res) => {
  try {
    if (!req.file) return next();

    const ConversionType = req.body.ConversionType;
    req.body.file = `original-${Date.now()}-file.${
      req.file.originalname.split(".")[1]
    }`;
    let params = {
      Bucket: "sdp4-upload",
      Key: req.body.file,
      Body: req.file.buffer,
    };

    console.log(req.file);

    console.log("STARTING UPLOAD FIRST FILE");

    s3.upload(params, (error, data) => {
      if (error) {
        console.log(error);
        return res.json({
          message: "error while uploading!",
        });
      }

      let options = {};
      if (ConversionType === "WORD-PDF") {
        options = {
          libreofficeBin: "/usr/bin/soffice",
          sourceFile: `${data.Location}`, // .ppt, .pptx, .odp, .key and .pdf
          outputDir: `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}`,
          img: false,
          // imgExt: "jpg", // Optional and default value png
          // reSize: 800, //  Optional and default Resize is 1200
          // density: 120, //  Optional and default density value is 120
          disableExtensionCheck: true,
        };
      } else if (ConversionType === "WORD-TXT") {
        options = {
          libreofficeBin: "/usr/bin/soffice",
          sourceFile: `${data.Location}`, // .ppt, .pptx, .odp, .key and .pdf
          outputDir: `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}`,
          img: false,
          // imgExt: "jpg", // Optional and default value png
          // reSize: 800, //  Optional and default Resize is 1200
          // density: 120, //  Optional and default density value is 120
          disableExtensionCheck: true,
        };
      } else if (ConversionType === "PPT-PDF") {
        options = {
          libreofficeBin: "/usr/bin/soffice",
          sourceFile: `${data.Location}`, // .ppt, .pptx, .odp, .key and .pdf
          outputDir: `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}`,
          img: false,
          // imgExt: "jpg", // Optional and default value png
          // reSize: 800, //  Optional and default Resize is 1200
          // density: 120, //  Optional and default density value is 120
          disableExtensionCheck: true,
        };
      } else if (ConversionType === "JPG-PDF") {
        options = {
          libreofficeBin: "/usr/bin/soffice",
          sourceFile: `${data.Location}`, // .ppt, .pptx, .odp, .key and .pdf
          outputDir: `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}`,
          img: false,
          // imgExt: "jpg", // Optional and default value png
          // reSize: 800, //  Optional and default Resize is 1200
          // density: 120, //  Optional and default density value is 120
          disableExtensionCheck: true,
        };
      } else if (ConversionType === "PDF-JPG") {
        options = {
          libreofficeBin: "/usr/bin/soffice",
          sourceFile: `${data.Location}`, // .ppt, .pptx, .odp, .key and .pdf
          outputDir: `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}`,
          img: false,
          // imgExt: "jpg", // Optional and default value png
          // reSize: 800, //  Optional and default Resize is 1200
          // density: 120, //  Optional and default density value is 120
          disableExtensionCheck: true,
        };
      } else if (ConversionType === "PNG-PDF") {
        options = {
          libreofficeBin: "/usr/bin/soffice",
          sourceFile: `${data.Location}`, // .ppt, .pptx, .odp, .key and .pdf
          outputDir: `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}`,
          img: false,
          //    imgExt: "png", // Optional and default value png
          //    reSize: 800, //  Optional and default Resize is 1200
          //    density: 120, //  Optional and default density value is 120
          disableExtensionCheck: true,
        };
      }
       else if (ConversionType === "PDF-PNG") {
        options = {
          libreofficeBin: "/usr/bin/soffice",
          sourceFile: `${data.Location}`, // .ppt, .pptx, .odp, .key and .pdf
          outputDir: `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}`,
          img: false,
             imgExt: "png", // Optional and default value png
             reSize: 800, //  Optional and default Resize is 1200
             density: 120, //  Optional and default density value is 120
          disableExtensionCheck: true,
        };
      }

      console.log("UPLOAD DONE ✅");

      console.log("STARTING CONVERSION 🟢");

      let conversionExtension;

      if (ConversionType === "PNG-PDF") conversionExtension = "pdf";
      else if (ConversionType === "PDF-JPG")
        conversionExtension = "jpg";
      else if (ConversionType === "JPG-PDF")
        conversionExtension = "pdf";
      else if (ConversionType === "PDF-PNG")
        conversionExtension = "png";
      else if (ConversionType === "PPT-PDF")
        conversionExtension = "pdf";
      else if (ConversionType === "WORD-PDF")
        conversionExtension = "pdf";
      else if (ConversionType === "WORD-TXT")
        conversionExtension = "txt";


      if (ConversionType != "PDF-PNG" && ConversionType != "PDF-JPG") {
          
    console.log("RUNNING")

      document
        .convert(options)
        .then((result) => {
          console.log("CONVERSION DONE 🟢");
          console.log("res", result);
       

          fs.readFile(
            `/home/navneet/NodeProjects/converter/converted-files-${ConversionType}/${
              data.Key.split(".")[0]
            }.${conversionExtension}`,
            (err, Filedata) => {
              if (err) {
                console.log(err);
                return;
              }

            
              let ConvertedFileName = `converted-${
                req.body.file.split("-")[1]
              }-file.${conversionExtension}`;

              let params2 = {
                Bucket: "sdp4-upload",
                Key: ConvertedFileName,
                Body: Filedata,
              };

              console.log("STARTING UPLOADING SECOND FILE 🟢");
              s3.upload(params2, (error2, data2) => {
                if (error2) {
                  console.log(
                    "Some error while uploading the converted File",
                    error2
                  );
                  return res.json({
                    message: "Error while uploading the converted File",
                  });
                }
                console.log("UPLOAD DONE 🟢");
                return res.json({
                  status: 200,
                  message: "Success",
                  publicUrlConvertedFile: data2.Location,
                  filenameConvertedFile: data2.Key,
                  publicUrl: data.Location,
                  filename: data.key,
                });
              });
            }
          );
          // Success or Error
        })
        .catch((e) => {
          console.log("e", e);
          res.json({
            message: "error while conversion",
          });
        });

    }
    else {

        let coFileName = `converted-${
            req.body.file.split("-")[1]
          }-file.${conversionExtension}`

        exec(`convert -density 150 "${data.Location}" -quality 100 "/home/navneet/NodeProjects/converter/image-pdf-converted/${coFileName}"`, (stderr, stdout, stderror) => {

            if (stderr) {
                console.error(`exec error: ${stderr}`);
                return res.json({
                    message: "error while converting to image!"
                })
            }

            fs.readFile(
                `/home/navneet/NodeProjects/converter/image-pdf-converted/${coFileName}`,
                (err, Filedata) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
    
                
                  let ConvertedFileName = coFileName;
    
                  let params2 = {
                    Bucket: "sdp4-upload",
                    Key: ConvertedFileName,
                    Body: Filedata,
                  };
    
                  console.log("STARTING UPLOADING SECOND FILE 🟢");
                  s3.upload(params2, (error2, data2) => {
                    if (error2) {
                      console.log(
                        "Some error while uploading the converted File",
                        error2
                      );
                      return res.json({
                        message: "Error while uploading the converted File",
                      });
                    }
                    console.log("UPLOAD DONE 🟢");
                    return res.json({
                      status: 200,
                      message: "Success",
                      publicUrlConvertedFile: data2.Location,
                      filenameConvertedFile: data2.Key,
                      publicUrl: data.Location,
                      filename: data.key,
                    });
                  });
                }
              );
        })
    }
    });
  } catch (e) {
    console.log(e);

    return res.json({
      message: "Some internal error occurred!!",
    });
  }
};

